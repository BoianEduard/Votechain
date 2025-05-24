import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

let provider;
let signer;

export const getProvider = () => {
    if (!provider) {
        provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    }
    return provider;
};

export const getSigner = () => {
    if (!signer) {
        const provider = getProvider();
        signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    }
    return signer;
};