import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as electionThunk from '../../redux/thunks/electionThunks';
import * as contractThunk from '../../redux/thunks/contractThunks';
import * as validator from '../../utils/validators';

export const useElectionCreation = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user.id);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [electionId, setElectionId] = useState(null);

    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    const cleanupFailedElection = async (electionId) => {
        try {
            await dispatch(electionThunk.deleteElection(electionId));
            console.log(`Cleaned up failed election: ${electionId}`);
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

    const createElection = async (formData) => {
        setLoading(true);
        setError("");
        setSuccess("");
        let currentElectionId = null;

        try {
            console.log('=== ELECTION CREATION START ===');
            console.log('Form data:', formData);

            // Step 1: Create base election

            const electionData = {
                title: formData.title,
                description: formData.description,
                startDate: formData.startDate,
                endDate: formData.endDate,
                eligibilityType: formData.eligibilityType,
                realTimeResults: formData.realTimeResults,
                creatorId: userId,
            };

            const electionResult = await dispatch(electionThunk.createElection(electionData));

            if (!electionResult?.id) {
                throw new Error('Failed to create election - no ID returned');
            }

            currentElectionId = electionResult.id;
            setElectionId(currentElectionId);
            console.log('✅ Election created with ID:', currentElectionId);

            // Step 2: Add candidates
            console.log('Adding candidates...');
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
            console.log('✅ Candidates added successfully');

            // Step 3: Set up eligibility
            console.log('Setting up eligibility...');
            if (formData.eligibilityType === "whitelist") {
                const emails = validator.parseWhitelist(formData.whitelist);
                if (emails.length === 0) throw new Error("Whitelist is empty or invalid");

                await dispatch(electionThunk.addWhitelist(currentElectionId, emails));
                console.log(`✅ Added ${emails.length} emails to whitelist`);

            } else if (formData.eligibilityType === "domain") {
                const domains = validator.parseDomainWhitelist(formData.domainWhitelist);
                if (domains.length === 0) throw new Error("Domain whitelist is empty or invalid");

                await dispatch(electionThunk.addDomainWhitelist(currentElectionId, domains));
                console.log(`✅ Added ${domains.length} domains to whitelist`);

            } else {
                await dispatch(electionThunk.addAll(currentElectionId));
                console.log('✅ Set eligibility to all users');
            }

            // Step 4: Deploy smart contract
            console.log('Deploying contract...');
            const deployResult = await dispatch(contractThunk.deployContract(currentElectionId));

            if (!deployResult?.contractAddress) {
                throw new Error('Contract deployment failed - no contract address returned');
            }

            console.log('✅ Contract deployed at:', deployResult.contractAddress);
            console.log('=== ELECTION CREATION COMPLETE ===');

            // Success!
            setSuccess(
                `Election "${formData.title}" created successfully! ` +
                `Contract deployed at: ${deployResult.contractAddress.substring(0, 10)}...`
            );

            return {
                success: true,
                electionId: currentElectionId,
                contractAddress: deployResult.contractAddress
            };

        } catch (error) {
            console.error("Election creation failed:", error);

            // Cleanup if we created an election but failed later
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
        setSuccess
    };
};
