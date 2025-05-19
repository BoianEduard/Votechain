import { API_URL } from "../config/config"
const API_ENDPOINT = `${API_URL}/auth`;

export const fetchPublicKey = async () => {
    const res = await fetch(`${API_ENDPOINT}/public-key`);
    const data = await res.json();
    return data.publicKey;
};