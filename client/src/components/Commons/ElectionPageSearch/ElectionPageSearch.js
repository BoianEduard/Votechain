// components/ElectionPageSearch.jsx
import { Search, Filter } from "lucide-react";

export default function ElectionPageSearch({
                                               placeholder,
                                               buttonLabel,
                                               searchTerm,
                                               setSearchTerm,
                                           }) {
    return (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-2 flex">
            <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border-0 rounded-lg focus:outline-none focus:ring-0"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center ml-2">
                <Filter className="h-5 w-5 mr-2" />
                {buttonLabel}
            </button>
        </div>
    );
}