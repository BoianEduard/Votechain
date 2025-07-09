export const calculateElectionPrice = (voterCount) => {
    const basePrice = 500; // $5.00 în cents
    const pricePerVoter = 50; // $0.50 per voter în cents

    const totalPrice = basePrice + (voterCount * pricePerVoter);

    return {
        totalCents: totalPrice,
        totalDollars: totalPrice / 100,
        basePrice: basePrice / 100,
        pricePerVoter: pricePerVoter / 100,
        voterCount
    };
};

export const formatPrice = (cents) => {
    return (cents / 100).toFixed(2);
};