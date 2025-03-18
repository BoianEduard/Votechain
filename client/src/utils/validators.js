export const validateElectionForm = (formData) => {
    if (!formData.title.trim()) {
      return { isValid: false, error: "Election title is required" };
    }
  
    if (!formData.description.trim()) {
      return { isValid: false, error: "Election description is required" };
    }
  
    const dateValidation = validateDates(formData.startDate, formData.endDate);
    if (!dateValidation.isValid) {
      return dateValidation;
    }
  
    const candidateValidation = validateCandidates(formData.candidates);
    if (!candidateValidation.isValid) {
      return candidateValidation;
    }
  
    if (formData.eligibilityType === 'whitelist') {
      const whitelistValidation = validateWhitelist(formData.whitelist);
      if (!whitelistValidation.isValid) {
        return whitelistValidation;
      }
    }
  
    return { isValid: true, error: "" };
  };

  //Basic title and description check
  export const validateTitleDescription = (title, description) => {
    if (!title.trim()) {
      return { isValid: false, error: "Election title is required!"}
    }
  
    if(!description.trim()) {
      return { isValid: false, error: "Description is required!"}
    }
    
    return { isValid: true, error: "" };
  }
  
  export const validateDates = (startDate, endDate) => {
    const startValidation = validateSingleDate(startDate, "Start date");
    if (!startValidation.isValid) return startValidation;
  
    const endValidation = validateSingleDate(endDate, "End date");
    if (!endValidation.isValid) return endValidation;
  
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const now = new Date();
  
    if (startDateObj >= endDateObj) {
      return { isValid: false, error: "End date must be after start date" };
    }
  
    if (startDateObj < now) {
      return { isValid: false, error: "Start date must be in the future" };
    }
  
    return { isValid: true, error: "" };
  };
  
  
  //Validate candiddate list
  export const validateCandidates = (candidates) => {
    const validCandidates = candidates.filter(candidate => candidate.trim() !== "");
    
    if (validCandidates.length < 2) {
      return { isValid: false, error: "At least two candidates are required" };
    }
  
    return { isValid: true, error: "" };
  };
  
  //Validate voter whitelist
  export const validateWhitelist = (whitelist) => {
    if (!whitelist.trim()) {
      return { isValid: false, error: "Whitelist is required when eligibility type is set to whitelist" };
    }
  
    const emails = whitelist
      .split('\n')
      .map(email => email.trim())
      .filter(email => email !== '');
  
    if (emails.length === 0) {
      return { isValid: false, error: "At least one email is required in the whitelist" };
    }
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of emails) {
      if (!emailPattern.test(email)) {
        return { isValid: false, error: `Invalid email format: ${email}` };
      }
    }
  
    return { isValid: true, error: "" };
  };
  

  export const parseWhitelist = (whitelist) => {
    return whitelist
      .split('\n')
      .map(email => email.trim())
      .filter(email => email !== '');
  };
  

  //valid date check
  export const validateSingleDate = (date, fieldName) => {
    if (!date) {
      return { isValid: false, error: `${fieldName} is required` };
    }
  
    const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    const yearPattern = /^\d{4}-/;
    
    if (!yearPattern.test(date)) {
      return { isValid: false, error: `${fieldName} must have a valid 4-digit year` };
    }
    
    if (!datePattern.test(date)) {
      return { isValid: false, error: `${fieldName} has an invalid format` };
    }
  
    return { isValid: true, error: "" };
  };