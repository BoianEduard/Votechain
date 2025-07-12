import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as electionThunk from '../../redux/thunks/electionThunks';
import * as contractThunk from '../../redux/thunks/contractThunks';
import * as validator from '../../utils/validators';

export const useElectionCreation = () => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [electionId, setElectionId] = useState(null);

    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    const stopLoading = () => {
        setLoading(false);
    };

    const cleanupFailedElection = async (electionId) => {
        try {
            await dispatch(electionThunk.deleteElection(electionId));
        } catch (cleanupError) {
            console.error(`Failed to cleanup election ${electionId}:`, cleanupError);
        }
    };

    const getErrorMessage = (error) => {
        let errorMessage = "Failed to create election after payment. ";

        if (error.message.includes('candidates')) {
            errorMessage += "Issue with candidate data.";
        } else if (error.message.includes('whitelist')) {
            errorMessage += "Issue with eligibility settings.";
        } else if (error.message.includes('contract')) {
            errorMessage += "Issue with blockchain deployment.";
        } else {
            errorMessage += error.message || "Unknown error occurred.";
        }

        errorMessage += " Your payment was successful and will be refunded if the issue persists.";
        return errorMessage;
    };

    const createElection = async (formData, electionFee) => {
        setLoading(true);
        setError("");
        setSuccess("");
        let currentElectionId = null;

        try {
            const electionData = {
                title: formData.title,
                description: formData.description,
                startDate: formData.startDate,
                endDate: formData.endDate,
                eligibilityType: formData.eligibilityType,
                realTimeResults: formData.realTimeResults,
                electionFee: electionFee
            };

            const electionResult = await dispatch(electionThunk.createElection(electionData));

            if (!electionResult?.id) {
                throw new Error('Failed to create election - no ID returned');
            }

            currentElectionId = electionResult.id;
            setElectionId(currentElectionId);

            const candidatesWithImages = formData.candidates
                .filter(candidate => candidate.name || (typeof candidate === 'string' && candidate.trim()))
                .map(candidate => ({
                    name: typeof candidate === 'string' ? candidate : candidate.name,
                    image: candidate.imagePreview || null,
                    description: candidate.description || ""
                }));
            if (candidatesWithImages.length === 0) {
                throw new Error('No valid candidates found');
            }

            const candidateResult = await dispatch(electionThunk.addCandidates({
                electionId: currentElectionId,
                candidates: candidatesWithImages
            }));
            if (!candidateResult) {
                throw new Error('Failed to add candidates to election');
            }

            if (formData.eligibilityType === "whitelist") {
                const emails = validator.parseWhitelist(formData.whitelist);
                if (emails.length === 0) throw new Error("Whitelist is empty or invalid");
                await dispatch(electionThunk.addWhitelist(currentElectionId, emails));
            } else if (formData.eligibilityType === "domain") {
                const domains = validator.parseDomainWhitelist(formData.domainWhitelist);
                if (domains.length === 0) throw new Error("Domain whitelist is empty or invalid");
                await dispatch(electionThunk.addDomainWhitelist(currentElectionId, domains));
            } else {
                await dispatch(electionThunk.addAll(currentElectionId));
            }

            const deployResult = await dispatch(contractThunk.deployContract(currentElectionId));
            if (!deployResult?.contractAddress) {
                throw new Error('Contract deployment failed - no contract address returned');
            }

            setSuccess(`Election created successfully!`);
            return {
                success: true,
                electionId: currentElectionId,
                contractAddress: deployResult.contractAddress
            };


        } catch (error) {
            if (currentElectionId) {
                await cleanupFailedElection(currentElectionId);
                setElectionId(null);
            }

            const errorMessage = getErrorMessage(error);
            setError(errorMessage);
            return { success: false, error: errorMessage };

        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        success,
        electionId,
        createElection,
        clearMessages,
        setError,
        setSuccess,
        stopLoading
    };
};