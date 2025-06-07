export const useElectionUtils = () => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    };

    const calculateDaysRemaining = (endDate) => {
        if (!endDate) return 0;
        return Math.ceil(
            (new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
    };

    return {
        formatDate,
        calculateDaysRemaining
    };
};