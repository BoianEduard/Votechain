import {Buffer} from 'buffer';

const str2ab = (str) => {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
};

const ab2str = (buf) => {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
};

const ab2base64 = (buf) => {
    return btoa(ab2str(buf));
};

const importPublicKey = async (keyString) => {
    try {
        if (keyString.includes('-----BEGIN PUBLIC KEY-----')) {
            keyString = keyString
                .replace('-----BEGIN PUBLIC KEY-----', '')
                .replace('-----END PUBLIC KEY-----', '')
                .replace(/\s/g, '');
        }

        if (keyString.startsWith('0x')) {
            const hexWithout0x = keyString.slice(2);
            const bytes = [];
            for (let i = 0; i < hexWithout0x.length; i += 2) {
                bytes.push(parseInt(hexWithout0x.substr(i, 2), 16));
            }
            keyString = btoa(String.fromCharCode.apply(null, bytes));
        }

        let keyBuffer;
        try {
            keyBuffer = str2ab(atob(keyString));
        } catch (e) {
            console.error('Failed to decode Base64 key:', e);
            keyBuffer = str2ab(keyString);
        }

        return await window.crypto.subtle.importKey(
            'spki',
            keyBuffer,
            {
                name: 'RSA-OAEP',
                hash: { name: 'SHA-256' }
            },
            false,
            ['encrypt']
        );
    } catch (error) {
        throw new Error('Failed to import public key');
    }
};

export const encryptVote = async (candidateId, electionPublicKeyString) => {
    try {
        const publicKey = await importPublicKey(electionPublicKeyString);
        const voteData = str2ab(JSON.stringify({ candidateId }));

        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256'
            },
            publicKey,
            voteData
        );

        return ab2base64(encryptedData);
    } catch (error) {
        console.error('Error encrypting vote:', error);
        throw new Error('Failed to encrypt vote');
    }
};

export const prepareVote = (encryptedVoteBase64) => {
    const encryptedVoteBuffer = Buffer.from(encryptedVoteBase64, 'base64');
    return '0x' + encryptedVoteBuffer.toString('hex');
};

export const getConnectedAddress = async () => {
    if (!window.ethereum) throw new Error("MetaMask is not installed");
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (!accounts.length) throw new Error("MetaMask is not connected");
    return accounts[0].toLowerCase();
};