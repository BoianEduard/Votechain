const TurnoutCard = ({ election }) => {
    const previousTurnout = election?.voterTurnoutPrevious || "N/A";
    const targetTurnout = election?.voterTurnoutTarget || "TBD";

    return (
        <div
            className="card border-0 mt-5 p-4"
            style={{
                background: "linear-gradient(135deg, #f1f9fe 0%, #dcf0fd 100%)",
                borderRadius: "16px"
            }}
        >
            <div className="row align-items-center">
                <div className="col-md-8">
                    <h4 className="fw-bold mb-2">Voter Turnout Goal</h4>
                    <p className="mb-2">
                        Previous turnout: <strong>{previousTurnout}</strong> |
                        Current goal: <strong>{targetTurnout}</strong>
                    </p>
                    <p className="small mb-0">
                        Every vote matters! Help us reach our community participation goal.
                    </p>
                </div>
                <div className="col-md-4">
                    <div className="progress" style={{ height: "20px" }}>
                        <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: "50%" }}
                            aria-valuenow="50"
                            aria-valuemin="0"
                            aria-valuemax="100"
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