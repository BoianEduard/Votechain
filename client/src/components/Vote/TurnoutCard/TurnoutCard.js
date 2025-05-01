const TurnoutCard = ({ election }) => {
    const previousTurnout = election?.voterTurnoutPrevious || "N/A";
    const targetTurnout = election?.voterTurnoutTarget || "TBD";

    return (
        <div
            className="card border-0 mt-3 p-6 rounded-3xl"
            style={{
                background: "linear-gradient(135deg, #f1f9fe 0%, #dcf0fd 100%)"
            }}
        >
            <div className="flex items-center">
                <div className="md:w-2/3">
                    <h4 className="text-2xl font-bold mb-2">Voter Turnout Goal</h4>
                    <p className="mb-2 text-gray-700">
                        Previous turnout: <strong>{previousTurnout}</strong> |
                        Current goal: <strong>{targetTurnout}</strong>
                    </p>
                    <p className="text-sm mb-0 text-gray-600">
                        Every vote matters! Help us reach our community participation goal.
                    </p>
                </div>
                <div className="md:w-1/3 mt-4 md:mt-0">
                    <div className="w-full bg-gray-200 rounded-full h-5">
                        <div
                            className="bg-green-500 h-5 rounded-full text-center text-white"
                            style={{ width: "50%" }}
                        >
                            50%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TurnoutCard;