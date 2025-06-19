import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ElectionNotFoundCard = () => {
    return (
        <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
            <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Election Not Found</h2>
                <p className="text-gray-600 mb-6">
                    The election you're looking for doesn't exist or has been removed.
                </p>
                <Link
                    to="/election-history"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <ArrowLeft className="mr-2" size={16} />
                    Back to Election History
                </Link>
            </div>
        </div>
    );
};

export default ElectionNotFoundCard;