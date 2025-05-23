// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { MessageHashUtils } from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract ElectionContract is ReentrancyGuard, Ownable {
    using ECDSA for bytes32;

    mapping(address => bool) public hasVoted;
    mapping(address => bool) public isEligibleVoter;
    uint256 public totalVoterCount;
    uint256 public totalVotesCast;

    event VoteSubmitted(address indexed voter, bytes encryptedVote);

    constructor(address[] memory eligibleVoters) Ownable(msg.sender) {
        totalVoterCount = 0;
        totalVotesCast = 0;

        for (uint i = 0; i < eligibleVoters.length; i++) {
            address voter = eligibleVoters[i];
            require(voter != address(0), "Invalid voter address");
            require(!isEligibleVoter[voter], "Duplicate voter address");

            hasVoted[voter] = false;
            isEligibleVoter[voter] = true;
            totalVoterCount++;
        }
    }

    function submitVote(
        address voterAddress,
        bytes calldata encryptedVote,
        bytes calldata signature
    ) external nonReentrant {
        require(isEligibleVoter[voterAddress], "You are not eligible to vote");
        require(!hasVoted[voterAddress], "You have already voted");

        // Verify that the encrypted vote was signed by the voter
        // First hash the encrypted vote data
        bytes32 hash = keccak256(encryptedVote);

        // Convert to Ethereum signed message format
        bytes32 ethHash = MessageHashUtils.toEthSignedMessageHash(hash);

        // Recover the signer's address from the signature
        address recovered = ECDSA.recover(ethHash, signature);

        // Verify the signature matches the voter's address
        require(recovered == voterAddress, "Invalid signature");

        // Emit event before state changes (best practice)
        emit VoteSubmitted(voterAddress, encryptedVote);

        // Update state after verification
        hasVoted[voterAddress] = true;
        totalVotesCast++;
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