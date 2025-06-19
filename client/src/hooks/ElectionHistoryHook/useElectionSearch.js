import { useState, useMemo } from "react";

export const useElectionSearch = (elections) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredElections = useMemo(() => {
        return elections.filter((election) =>
            election.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [elections, searchTerm]);

    const clearSearch = () => setSearchTerm("");

    return {
        searchTerm,
        setSearchTerm,
        filteredElections,
        clearSearch
    };
};