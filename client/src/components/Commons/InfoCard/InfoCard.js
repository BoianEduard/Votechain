import React from "react";
import { Shield } from "lucide-react";

const InfoCard = () => {
    return (
        <div
            className="shadow-md mb-4 bg-gradient-to-br from-gray-50 to-gray-200 rounded-2xl"
        >
            <div className="p-4">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-3/4 lg:w-4/5">
                        <div className="flex items-center mb-3">
                            <div
                                className="rounded-full p-3 mr-3 flex items-center justify-center bg-green-100"
                                style={{
                                    width: "56px",
                                    height: "56px"
                                }}
                            >
                                <Shield size={24} className="text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold mb-0">Arb1Vote</h3>
                        </div>
                        <p className="mb-4 md:mb-0">
                            Your votes are secured using blockchain technology, ensuring transparency and immutability.
                            The decentralized nature of our platform guarantees that your vote cannot be altered or tampered with.
                        </p>
                    </div>
                    <div className="w-full md:w-1/4 lg:w-1/5 text-center md:text-right">
                        <button
                            className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-full px-4 py-2 transition-colors duration-300"
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