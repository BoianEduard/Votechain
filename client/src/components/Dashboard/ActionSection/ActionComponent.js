import React from "react";
import { PlusCircle, Vote, History } from "lucide-react";
import ActionCard from "./ActionCard";

const QuickActionsSection = () => {
    const navigateOptions = [
        {
            title: "Create Elections",
            path: "/create-election",
            description: "Set up new elections",
            icon: <PlusCircle size={24} />,
            color: "#4361ee",
            bgColor: "#eef2ff"
        },
        {
            title: "Vote",
            path: "/vote",
            description: "Cast your vote",
            icon: <Vote size={24} />,
            color: "#2ec4b6",
            bgColor: "#e8f8f5"
        },
        {
            title: "Election History",
            path: "/election-history",
            description: "View past results",
            icon: <History size={24} />,
            color: "#e63946",
            bgColor: "#fdf0f0"
        }
    ];

    return (
        <>
            <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-5">
                {navigateOptions.map((option, index) => (
                    <div className="w-full" key={index}>
                        <ActionCard option={option} />
                    </div>
                ))}
            </div>
        </>
    );
};

export default QuickActionsSection;