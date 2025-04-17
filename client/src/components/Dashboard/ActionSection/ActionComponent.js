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
            <h2 className="h4 fw-bold mb-4">Quick Actions</h2>
            <div className="row g-4 mb-5">
                {navigateOptions.map((option, index) => (
                    <div className="col-lg-4 col-md-6 col-sm-12" key={index}>
                        <ActionCard option={option} />
                    </div>
                ))}
            </div>
        </>
    );
};

export default QuickActionsSection;