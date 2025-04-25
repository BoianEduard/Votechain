import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as electionThunk from "../../redux/thunks/electionThunks";
import * as validator from "../../utils/validators";
import ElectionForm from "../../components/ElectionCreate/ElectionForm";
import './CreateElection.css'

const CreateElection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    candidates: [
      { name: "", image: null, imagePreview: "", description: "" },
      { name: "", image: null, imagePreview: "", description: "" }
    ],
    eligibilityType: "all",
    whitelist: "",
    annonymousResults: "",
    realTimeResults: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const userId = useSelector((state) => state.user.id);
  console.log("uSER ID: " + userId);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCandidateChange = (index, field, value) => {
    const updatedCandidates = [...form.candidates];

    if (typeof field === 'string' && value !== undefined) {
      updatedCandidates[index] = {
        ...updatedCandidates[index],
        [field]: value
      };
    } else {
      const value = field;
      updatedCandidates[index] = {
        ...updatedCandidates[index],
        name: value
      };
    }

    setForm({
      ...form,
      candidates: updatedCandidates,
    });
  };

  const handleCandidateImageChange = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedCandidates = [...form.candidates];
        updatedCandidates[index] = {
          ...updatedCandidates[index],
          image: file,
          imagePreview: reader.result
        };
        setForm({
          ...form,
          candidates: updatedCandidates
        });
      };
      reader.readAsDataURL(file);
    } else {
      const updatedCandidates = [...form.candidates];
      updatedCandidates[index] = {
        ...updatedCandidates[index],
        image: null,
        imagePreview: ""
      };
      setForm({
        ...form,
        candidates: updatedCandidates
      });
    }
  };

  const addCandidate = () => {
    setForm({
      ...form,
      candidates: [...form.candidates, { name: "", image: null, imagePreview: "", description: "" }]
    });
  };

  const removeCandidate = (index) => {
    if (form.candidates.length > 2) {
      const updatedCandidates = form.candidates.filter((_, i) => i !== index);
      setForm({ ...form, candidates: updatedCandidates });
    }
  };

  const validateStep = () => {
    if (step === 1) {
      const dateValidation = validator.validateDates(form.startDate, form.endDate);
      if (!dateValidation.isValid) {
        setError(dateValidation.error);
        setLoading(false);
        alert("Error: " + dateValidation.error);
        return false;
      }

      const titleAndDescValidation = validator.validateTitleDescription(form.title, form.description);
      if (!titleAndDescValidation.isValid) {
        setError(titleAndDescValidation.error);
        setLoading(false);
        alert("Error: " + titleAndDescValidation.error);
        return false;
      }
    }
    else if (step === 2) {
      const candidateNames = form.candidates.map(candidate =>
          typeof candidate === 'string' ? candidate : candidate.name
      );
      const candidateValidation = validator.validateCandidates(candidateNames);
      if (!candidateValidation.isValid) {
        setError(candidateValidation.error);
        setLoading(false);
        alert("Error: " + candidateValidation.error);
        return false;
      }
    }
    else if (step === 4 && form.eligibilityType === 'whitelist') {
      const whitelistValidation = validator.validateWhitelist(form.whitelist);
      if (!whitelistValidation.isValid) {
        setError(whitelistValidation.error);
        setLoading(false);
        alert("Error: " + whitelistValidation.error);
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setError(null);
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const electionData = {
        title: form.title,
        description: form.description,
        startDate: form.startDate,
        endDate: form.endDate,
        eligibilityType: form.eligibilityType,
        annonymousResults: form.annonymousResults,
        realTimeResults: form.realTimeResults,
        creatorId: userId,
      };

      const result = await dispatch(electionThunk.createElection(electionData));

      if (!result || !result.id) throw new Error('Something went wrong creating elections');

      const electionId = result.id;

      const candidatesWithImages = form.candidates.map(candidate => {
        if (typeof candidate === 'object' && candidate !== null) {
          return {
            name: candidate.name,
            image: candidate.imagePreview || null,
            description: candidate.description || ""
          };
        }
        return {
          name: candidate,
          image: null,
          description: ""
        };
      });

      const candidateResult = await dispatch(electionThunk.addCandidates({
        electionId,
        candidates: candidatesWithImages
      }));

      if (!candidateResult) throw new Error('Failed to add candidates');

      if (form.eligibilityType === "whitelist") {
        const emails = validator.parseWhitelist(form.whitelist);
        if (emails.length > 0) {
          await dispatch(electionThunk.addWhitelist(electionId, emails));
        }
      } else {
        await dispatch(electionThunk.addAll(electionId));
      }

      alert("Election created successfully.");
      navigate("/dashboard");
    } catch (error) {
      console.error('Error creating election:', error);
      setError(error.message || 'Failed to create election');
      alert('Error: ' + (error.message || 'Failed to create election'));
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="create-election-container">
        <div className="header">
          <h1 className="title">Create new election</h1>
          <p className="subtitle">Set up a secure election process</p>
        </div>

        <ElectionForm
            formData={form}
            handleInputChange={handleInputChange}
            handleCandidateChange={handleCandidateChange}
            handleCandidateImageChange={handleCandidateImageChange}
            addCandidate={addCandidate}
            removeCandidate={removeCandidate}
            handleSubmit={handleSubmit}
            loading={loading}
            error={error}
            step={step}
            nextStep={nextStep}
            prevStep={prevStep}
        />
      </div>
  );
};

export default CreateElection;