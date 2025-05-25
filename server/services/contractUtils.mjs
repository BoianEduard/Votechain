import { ethers } from "ethers";
import ElectionContractABI from '../artifacts/contracts/ElectionContract.sol/ElectionContract.json' assert { type: 'json' };
import { getProvider, getSigner } from "./ethers.mjs";
import { deployContract } from "../deploy/deploy.mjs";
import { decryptPrivateKey, decryptVote } from "./cryptoUtils.mjs";

export async function deployElectionOnChain(eligibleVoters) {
    return await deployContract({ eligibleVoters });
}

export function getSignableContract(address) {
    const signer = getSigner();
    return new ethers.Contract(address, ElectionContractABI.abi, signer);
}

export function getProviderContract(address) {
    const provider = getProvider();
    return new ethers.Contract(address, ElectionContractABI.abi, provider);
}

export async function hasAlreadyVoted(contract, voterAddress) {
    return await contract.hasAlreadyVoted(voterAddress);
}

export async function submitVoteToContract(
    contract,
    voterAddress,
    encryptedVote,
    signature
) {
    const tx = await contract.submitVote(voterAddress, encryptedVote, signature);
    const receipt = await tx.wait();
    if (receipt.status !== 1) {
        throw new Error("Transaction failed");
    }
    return tx.hash;
}

export async function fetchVotingStats(contract) {
    const [totalEligible, totalCast, participation] =
        await contract.getVotingStats();
    const toNumber = (bn) =>
        typeof bn.toNumber === "function" ? bn.toNumber() : Number(bn);
    return {
        totalEligible: toNumber(totalEligible),
        totalCast: toNumber(totalCast),
        participationRate: toNumber(participation)
    };
}

export async function fetchVoteEvents(contract) {
    const filter = contract.filters.VoteSubmitted();
    return await contract.queryFilter(filter);
}

export async function tallyEncryptedVotes(
    events,
    encryptedPrivateKey,
    candidateIds
) {
    const privateKey = decryptPrivateKey(encryptedPrivateKey);
    const voteCounts = {};
    candidateIds.forEach((id) => {
        voteCounts[id] = 0;
    });

    for (const event of events) {
        try {
            const hex = event.args.encryptedVote;
            const buf = Buffer.from(hex.slice(2), "hex");
            const base64 = buf.toString("base64");
            const candidateId = await decryptVote(base64, privateKey);
            if (voteCounts[candidateId] !== undefined) {
                voteCounts[candidateId]++;
            }
        } catch (err) {
            console.error(`Error decrypting vote: ${err.message}`);
        }
    }

    return voteCounts;
}

export function determineWinner(voteCounts) {
    let winnerId = null;
    let maxVotes = -1;
    for (const [id, count] of Object.entries(voteCounts)) {
        if (count > maxVotes) {
            maxVotes = count;
            winnerId = id;
        }
    }
    return { winnerId, maxVotes };
}