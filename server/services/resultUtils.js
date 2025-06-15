// Helper function to format candidate results
const formatCandidateResults = (candidates, voteCounts, totalCast) => {
    return candidates
        .map(c => ({
            id: c.id,
            name: c.name,
            description: c.description,
            imageUrl: c.imageUrl,
            voteCount: voteCounts ? voteCounts[c.id] || 0 : c.votes,
            percentage: totalCast > 0
                ? (((voteCounts ? voteCounts[c.id] || 0 : c.votes) / totalCast) * 100).toFixed(2)
                : "0.00"
        }))
        .sort((a, b) => b.voteCount - a.voteCount);
};

// Helper function to format winner
const formatWinner = (winnerId, candidates, voteCounts, totalCast) => {
    if (winnerId == null) return null;

    const winnerCandidate = candidates.find(c => c.id === winnerId);
    const voteCount = voteCounts[winnerId];

    return {
        id: winnerId,
        name: winnerCandidate.name,
        voteCount: voteCount,
        percentage: totalCast > 0 ? ((voteCount / totalCast) * 100).toFixed(2) : "0.00"
    };
};

// Helper function to build response
const buildResponse = (election, stats, candidates, winner) => {
    return {
        electionId: election.id,
        title: election.title,
        description: election.description,
        startDate: election.startDate,
        endDate: election.endDate,
        stats,
        candidates,
        winner
    };
};

// Helper function to return cached results
const returnCachedResults = async (election, existingResult) => {
    const candidates = await models.Candidate.findAll({
        where: { electionId: election.id },
        attributes: ["id", "name", "description", "imageUrl", "votes"]
    });

    const candidateResults = formatCandidateResults(candidates, null, existingResult.totalCast);
    const winner = candidateResults[0]?.voteCount > 0 ? candidateResults[0] : null;

    const stats = {
        totalEligible: 0,
        totalCast: existingResult.totalCast,
        participationRate: existingResult.voterTurnout
    };

    return buildResponse(election, stats, candidateResults, winner);
};

// Helper function to calculate results from blockchain
const calculateAndStoreResults = async (election, shouldStore = false) => {
    const contract = contractUtils.getProviderContract(election.contractAddress);
    const stats = await contractUtils.fetchVotingStats(contract);
    const events = await contractUtils.fetchVoteEvents(contract);

    const candidates = await models.Candidate.findAll({
        where: { electionId: election.id },
        attributes: ["id", "name", "description", "imageUrl", "votes"]
    });

    if (!candidates.length) {
        throw new Error("No candidates found for this election");
    }

    const candidateIds = candidates.map(c => c.id);
    const voteCounts = await contractUtils.countVotes(
        events,
        election.privateKey,
        candidateIds
    );

    // Update candidate votes
    await Promise.all(
        candidates.map(c => c.update({ votes: voteCounts[c.id] || 0 })
            .catch(err => console.error(`Error updating candidate ${c.id}:`, err))
        )
    );

    const { winnerId } = contractUtils.determineWinner(voteCounts);

    // Store results if needed
    if (shouldStore) {
        await models.Result.create({
            electionId: election.id,
            voterTurnout: stats.participationRate,
            totalCast: stats.totalCast,
            electionWinner: winnerId ? candidates.find(c => c.id === winnerId).name : "No winner"
        });

        await election.update({ status: "closed" });
    }

    const candidateResults = formatCandidateResults(candidates, voteCounts, stats.totalCast);
    const winner = formatWinner(winnerId, candidates, voteCounts, stats.totalCast);

    return buildResponse(election, stats, candidateResults, winner);
};

// Main function
const getElectionResults = async (req, res, next) => {
    try {
        const { electionId } = req.params;

        const election = await models.Election.findByPk(electionId);
        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }

        const isElectionEnded = new Date() >= new Date(election.endDate);

        // Case 1: Election ended
        if (isElectionEnded) {
            const existingResult = await models.Result.findOne({
                where: { electionId }
            });

            if (existingResult) {
                // Return cached results
                const response = await returnCachedResults(election, existingResult);
                return res.status(200).json(response);
            } else {
                // First time - calculate and store
                const response = await calculateAndStoreResults(election, true);
                return res.status(200).json(response);
            }
        }

        // Case 2: Election active but real-time disabled
        if (!election.realTimeResults) {
            return res.status(403).json({
                message: "Election has not ended yet and real-time results are not enabled"
            });
        }

        // Case 3: Election active with real-time enabled
        const response = await calculateAndStoreResults(election, false);
        return res.status(200).json(response);

    } catch (error) {
        if (error.message === "No candidates found for this election") {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};