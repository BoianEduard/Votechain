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

    await Promise.all(
        candidates.map(c => c.update({ votes: voteCounts[c.id] || 0 })
            .catch(err => console.error(`Error updating candidate ${c.id}:`, err))
        )
    );

    const { winnerId } = contractUtils.determineWinner(voteCounts);

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