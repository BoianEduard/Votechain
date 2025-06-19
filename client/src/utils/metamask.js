import detectEthereumProvider from "@metamask/detect-provider";

export const connectToMetaMask = async () => {
    const provider = await detectEthereumProvider();

    if (!provider) {
        throw new Error("MetaMask not detected. Please install MetaMask.");
    }

    const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
    });

    if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please unlock MetaMask and try again.");
    }

    return accounts[0];
};

export const signWithMetaMask = async (address, message) => {
    try {
        return await window.ethereum.request({
            method: 'personal_sign',
            params: [message, address]
        });
    } catch (error) {
        console.error("Signing error:", error);
        throw new Error("Failed to sign message with MetaMask.");
    }
};