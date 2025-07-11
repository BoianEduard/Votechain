import React from 'react';
import { CheckCircle, Home, Printer, ExternalLink } from 'lucide-react';

const VoteSuccessCard = ({ election, selectedCandidate }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const truncateAddress = (address) => {
        if (!address) return 'N/A';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const openArbiExplorer = (address) => {
        const explorerUrl = `https://sepolia.arbiscan.io/address/${address}`;
        window.open(explorerUrl, '_blank');
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm p-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Vote Successfully Cast!
                </h2>

                <p className="text-gray-600">
                    Your vote for <span className="font-semibold text-indigo-600">{selectedCandidate?.name}</span> has been recorded securely on the blockchain.
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Transaction Information
                </h3>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Contract Address:</span>
                        <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm text-gray-800">
                                {truncateAddress(election?.contractAddress)}
                            </span>
                            {election?.contractAddress && (
                                <button
                                    onClick={() => openArbiExplorer(election.contractAddress)}
                                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                    title="View on block explorer"
                                >
                                    <ExternalLink size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Election:</span>
                        <span className="font-medium text-gray-800">{election?.title}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Date & Time:</span>
                        <span className="font-medium text-gray-800">
                            {formatDate(new Date())}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                    <Home size={18} className="mr-2" />
                    Home
                </button>

                <button
                    onClick={() => window.print()}
                    className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
                >
                    <Printer size={18} className="mr-2" />
                    Print Receipt
                </button>
            </div>
        </div>
    );
};

export default VoteSuccessCard;