import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleElectionCreate = () => {
    navigate('/create-election');
  };

  const handleVote = () => {
    navigate('/vote');
  };

  const handleElectionHistory = () => {
    navigate('/election-history');
  };

  const navigateOptions = [
    {
      title: "Create Elections",
      handler: handleElectionCreate,
      description: "Create a new election process"
    },
    {
      title: "Vote",
      handler: handleVote,
      description: "Cast your vote in your available elections"
    },
    {
      title: "Election History",
      handler: handleElectionHistory,
      description: "View the history of the elections you were eligible to vote in"
    }
  ];

  return (
    <div className="dashboard-container">
      <h1 className="title">Votechain Dashboard</h1>
      <p className="subtitle">Secure, transparent decentralized voting platform</p>
      
      <div className="action-container">
        {navigateOptions.map((option, index) => (
          <div key={index} className="action-item">
            <button className="action-button" onClick={option.handler}>
              {option.title}
            </button>
            <p className="action-description">{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;