import React from "react";
import { ExternalLink } from "lucide-react";

const truncateAddress = (address) => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const openArbiExplorer = (address) => {
    const url = `https://arbiscan.io/address/${address}`;
    window.open(url, "_blank");
};

const TransactionHistoryCard = ({ contractAddress }) => {
    if (!contractAddress) return null;

    return (
        <div className="bg-blue-50 px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                <ExternalLink size={16} className="text-blue-600" />
                            </div>
                            <span className="text-gray-600 font-mono">
                                {truncateAddress(contractAddress)}
                            </span>
                        </div>
                        <button
                            onClick={() => openArbiExplorer(contractAddress)}
                            title="View on Arbiscan"
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors text-sm font-medium"
                        >
                            View on Arbiscan
                            <ExternalLink size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionHistoryCard;