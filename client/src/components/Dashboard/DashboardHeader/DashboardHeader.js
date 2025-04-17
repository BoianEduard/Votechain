const DashboardHeader = () => {
    return (
        <div className="py-4 mb-4" style={{
            background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}>
            <div className="container">
                <div className="text-center text-white">
                    <h1 className="display-5 fw-bold mb-2">Votechain Dashboard</h1>
                    <p className="lead mb-0">Secure, transparent, and decentralized voting platform</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;