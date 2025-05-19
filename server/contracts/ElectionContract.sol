// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { MessageHashUtils } from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title ElectionContract
 * @dev Contract pentru gestionarea înregistrării voturilor criptate
 */
contract ElectionContract is ReentrancyGuard, Ownable {
    using ECDSA for bytes32;

    mapping(address => bool) public hasVoted;
    mapping(address => bool) public isEligibleVoter;
    uint256 public totalVoterCount;
    uint256 public totalVotesCast;

    event VoteSubmitted(address indexed voter, bytes encryptedVote);

    constructor(address[] memory eligibleVoters) Ownable(msg.sender) {
        totalVoterCount = eligibleVoters.length;
        totalVotesCast = 0;

        for (uint i = 0; i < eligibleVoters.length; i++) {
            address voter = eligibleVoters[i];
            hasVoted[voter] = false;
            isEligibleVoter[voter] = true;
            require(voter != address(0), "Invalid voter address");
        }
    }

    function submitVote(
        address voterAddress,
        bytes calldata encryptedVote,
        bytes calldata signature
    ) external nonReentrant {
        require(isEligibleVoter[voterAddress], "You are not eligible to vote");
        require(!hasVoted[voterAddress], "You have already voted");

        bytes32 hash = keccak256(abi.encodePacked(voterAddress));
        bytes32 ethHash = MessageHashUtils.toEthSignedMessageHash(hash);
        address recovered = ECDSA.recover(ethHash, signature);

        hasVoted[voterAddress] = true;
        totalVotesCast++;

        emit VoteSubmitted(voterAddress, encryptedVote);
    }

    function getVotingStats() external view returns (uint256 eligibleVoters, uint256 votes, uint256 participationRate) {
        uint256 rate = 0;
        if (totalVoterCount > 0) {
            rate = (totalVotesCast * 100) / totalVoterCount;
        }
        return (totalVoterCount, totalVotesCast, rate);
    }

    function hasAlreadyVoted(address voter) external view returns (bool) {
        return hasVoted[voter];
    }
}