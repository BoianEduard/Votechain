export const useElectionStatus = () => {
    const getStatus = (election) => {
        const now = new Date();
        if (new Date(election.startDate) > now) return "Not Started";
        if (new Date(election.endDate) < now) return "Closed";
        return "Vote In Progress";
    };

    return { getStatus };
};