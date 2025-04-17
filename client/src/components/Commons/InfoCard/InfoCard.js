import React from "react";
import { Shield } from "lucide-react";

const InfoCard = () => {
    return (
        <div
            className="card border-0 shadow mb-4"
            style={{
                background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                borderRadius: "16px"
            }}
        >
            <div className="card-body p-4">
                <div className="row align-items-center">
                    <div className="col-lg-9 col-md-8 col-sm-12">
                        <div className="d-flex align-items-center mb-3">
                            <div
                                className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center"
                                style={{
                                    background: "rgba(25, 135, 84, 0.15)",
                                    width: "56px",
                                    height: "56px"
                                }}
                            >
                                <Shield size={24} className="text-success" />
                            </div>
                            <h3 className="h4 fw-bold mb-0">Blockchain Secured</h3>
                        </div>
                        <p className="mb-md-0 mb-4">
                            Your votes are secured using blockchain technology, ensuring transparency and immutability.
                            The decentralized nature of our platform guarantees that your vote cannot be altered or tampered with.
                        </p>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-12 text-md-end text-center">
                        <button
                            className="btn btn-outline-success rounded-pill px-4 py-2"
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoCard;
