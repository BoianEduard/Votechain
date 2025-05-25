import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as electionThunk from "../../redux/thunks/electionThunks";
import * as validator from "../../utils/validators";
import * as contractThunk from "../../redux/thunks/contractThunks";
import ElectionForm from "../../components/ElectionCreate/ElectionForm";
import Error from "../../components/Commons/Error";
import SuccessMessage from "../../components/Commons/Success";
import ElectionPageHeader from "../../components/Commons/ElectionPageHeader";
import './ElectionCreate.css'

const ElectionCreatePage = () => {
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
    domainWhitelist: "",
    realTimeResults: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);
  const userId = useSelector((state) => state.user.id);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
        navigate("/dashboard");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

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
      updatedCandidates[index] = {
        ...updatedCandidates[index],
        name: field
      };
    }
    setForm({ ...form, candidates: updatedCandidates });
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
        setForm({ ...form, candidates: updatedCandidates });
      };
      reader.readAsDataURL(file);
    } else {
      const updatedCandidates = [...form.candidates];
      updatedCandidates[index] = {
        ...updatedCandidates[index],
        image: null,
        imagePreview: ""
      };
      setForm({ ...form, candidates: updatedCandidates });
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
        return false;
      }

      const titleAndDescValidation = validator.validateTitleDescription(form.title, form.description);
      if (!titleAndDescValidation.isValid) {
        setError(titleAndDescValidation.error);
        setLoading(false);
        return false;
      }
    } else if (step === 2) {
      const candidateNames = form.candidates.map(c => typeof c === 'string' ? c : c.name);
      const candidateValidation = validator.validateCandidates(candidateNames);
      if (!candidateValidation.isValid) {
        setError(candidateValidation.error);
        setLoading(false);
        return false;
      }
    } else if (step === 4) {
      if (form.eligibilityType === 'whitelist') {
        const whitelistValidation = validator.validateWhitelist(form.whitelist);
        if (!whitelistValidation.isValid) {
          setError(whitelistValidation.error);
          setLoading(false);
          return false;
        }
      } else if (form.eligibilityType === 'domain') {
        const domainValidation = validator.validateDomainWhitelist(form.domainWhitelist);
        if (!domainValidation.isValid) {
          setError(domainValidation.error);
          setLoading(false);
          return false;
        }
      }
    }
    setError("");
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
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
    let electionId = null;

    try {
      const electionData = {
        title: form.title,
        description: form.description,
        startDate: form.startDate,
        endDate: form.endDate,
        eligibilityType: form.eligibilityType,
        realTimeResults: form.realTimeResults,
        creatorId: userId,
      };

      const result = await dispatch(electionThunk.createElection(electionData));
      if (!result?.id) throw new Error('Something went wrong creating the election');
      electionId = result.id;

      const candidatesWithImages = form.candidates.map(candidate => ({
        name: candidate.name || candidate,
        image: candidate.imagePreview || null,
        description: candidate.description || ""
      }));

      const candidateResult = await dispatch(electionThunk.addCandidates({
        electionId,
        candidates: candidatesWithImages
      }));

      if (!candidateResult) throw new Error('Failed to add candidates');

      if (form.eligibilityType === "whitelist") {
        const emails = validator.parseWhitelist(form.whitelist);
        if (emails.length === 0) throw new Error("Whitelist is empty or invalid");
        await dispatch(electionThunk.addWhitelist(electionId, emails));
      } else if (form.eligibilityType === "domain") {
        const domains = validator.parseDomainWhitelist(form.domainWhitelist);
        if (domains.length === 0) throw new Error("Domain whitelist is empty or invalid");
        await dispatch(electionThunk.addDomainWhitelist(electionId, domains));
      } else {
        await dispatch(electionThunk.addAll(electionId));
      }

      const deployResult = await dispatch(contractThunk.deployContract(electionId));
      if (!deployResult?.contractAddress) throw new Error('Contract deployment failed');

      setSuccess(`Election created successfully. Contract deployed at: ${deployResult.contractAddress}`);
    } catch (error) {
      setError(error.message || "Failed to create election");
      if (electionId) {
        try {
          await dispatch(electionThunk.deleteElection(electionId));
        } catch {
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="bg-gradient-to-b from-indigo-700 to-indigo-500" style={{ maxHeight: 'calc(100vh - 630px)' }}>
        <div className="pt-10 pb-10 px-4">
          <ElectionPageHeader
              title="Create new election"
              description="Set up a secure election process"
              backLink="/dashboard"
              backLabel="Back to Dashboard"
          />
        </div>

        <div className="px-4">
          {error && <Error error={error} />}
          {success && <SuccessMessage message={success} />}
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

export default ElectionCreatePage;