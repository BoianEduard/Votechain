import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as electionThunks from '../../redux/thunks/electionThunks';
import { validateSingleDate, validateElectionForm, parseWhitelist } from '../../utils/validators';
import ElectionForm from '../../components/ElectionForm/ElectionForm';
import './CreateElection.css';

const CreateElection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: ['', ''],
    eligibilityType: 'all',
    whitelist: '',
    anonymousResults: false,
    realTimeResults: false,
  });
  
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCandidateChange = (index, value) => {
    const updatedCandidates = [...formData.candidates];
    updatedCandidates[index] = value;
    setFormData({
      ...formData,
      candidates: updatedCandidates,
    });
  };

  const addCandidate = () => {
    setFormData({ ...formData, candidates: [...formData.candidates, ''] });
  };

  const removeCandidate = (index) => {
    if (formData.candidates.length > 2) {
      const updatedCandidates = formData.candidates.filter((_, i) => i !== index);
      setFormData({ ...formData, candidates: updatedCandidates });
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.title.trim() || !formData.description.trim()) {
        alert('Title and Description are required.');
        return false;
      }
      
      for (const field of ['startDate', 'endDate']) {
        const validation = validateSingleDate(formData[field], field === 'startDate' ? 'Start date' : 'End date');
        if (!validation.isValid) {
          alert(validation.error);
          return false;
        }
      }
    }
    
    if (step === 2 && formData.candidates.some(candidate => !candidate.trim())) {
      alert('Each candidate must have a name.');
      return false;
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const validation = validateElectionForm(formData);
    if (!validation.isValid) {
      setError(validation.error);
      setIsLoading(false);
      alert('Error: ' + validation.error);
      return;
    }

    try {
      const electionData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        eligibilityType: formData.eligibilityType,
        anonymousResults: formData.anonymousResults,
        realTimeResults: formData.realTimeResults,
      };
      
      const result = await dispatch(electionThunks.createElection(electionData));
      if (!result || !result.id) throw new Error('Failed to get election ID');
      const electionId = result.id;

      await dispatch(electionThunks.addCandidates({ electionId, candidates: formData.candidates }));

      if (formData.eligibilityType === 'whitelist') {
        const emails = parseWhitelist(formData.whitelist);
        if (emails.length > 0) {
          await dispatch(electionThunks.addWhitelist({ electionId, emails }));
        }
      } else {
        await dispatch(electionThunks.addAll(electionId));
      }

      alert('Election created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating election:', error);
      setError(error.message || 'Failed to create election');
      alert('Error: ' + (error.message || 'Failed to create election'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-election-container">
      <div className="header">
        <h1 className="title">Create New Election</h1>
        <p className="subtitle">Set up a secure, blockchain-based election</p>
      </div>
      <ElectionForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleCandidateChange={handleCandidateChange}
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
