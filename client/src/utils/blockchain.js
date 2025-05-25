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

export const preparePublicKey = (publicKeyString) => {
    if (publicKeyString.includes('-----BEGIN PUBLIC KEY-----')) {
        return publicKeyString
            .replace('-----BEGIN PUBLIC KEY-----', '')
            .replace('-----END PUBLIC KEY-----', '')
            .replace(/\s/g, '');
    }
    return publicKeyString;
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

const importPrivateKey = async (privateKeyString) => {
    try {
        if (!privateKeyString) {
            throw new Error("Private key is missing. Please ensure you are logged in.");
        }

        let cleanedKey = privateKeyString;

        if (privateKeyString.includes('-----BEGIN PRIVATE KEY-----')) {
            cleanedKey = privateKeyString
                .replace('-----BEGIN PRIVATE KEY-----', '')
                .replace('-----END PRIVATE KEY-----', '')
                .replace(/\s/g, '');
        }

        // Remove 0x prefix if it exists
        if (cleanedKey.startsWith('0x')) {
            const hexWithout0x = cleanedKey.slice(2);
            const bytes = [];
            for (let i = 0; i < hexWithout0x.length; i += 2) {
                bytes.push(parseInt(hexWithout0x.substr(i, 2), 16));
            }
            cleanedKey = btoa(String.fromCharCode.apply(null, bytes));
        }

        const isBase64 = /^[A-Za-z0-9+/=]+$/.test(cleanedKey);

        if (!isBase64) {
            console.error("Private key is not in valid Base64 format");
            throw new Error("Invalid private key format. Please check your authentication.");
        }

        let privateKeyBuffer;
        try {
            privateKeyBuffer = str2ab(atob(cleanedKey));
        } catch (e) {
            console.error('Failed to decode private key:', e);
            throw new Error("Failed to decode private key. Invalid format.");
        }

        return await window.crypto.subtle.importKey(
            'pkcs8',
            privateKeyBuffer,
            {
                name: 'RSA-PSS',
                hash: { name: 'SHA-256' }
            },
            false,
            ['sign']
        );
    } catch (error) {
        console.error('Error importing private key:', error);
        throw new Error('Failed to import private key');
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

export const decryptVote = (encryptedVoteBase64, privateKeyPem) => {
    try {
        const buffer = Buffer.from(encryptedVoteBase64, 'base64');

        const decrypted = crypto.privateDecrypt(
            {
                key: privateKeyPem,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256' // Changed from 'sha1' to 'sha256' to match frontend
            },
            buffer
        );

        return JSON.parse(decrypted.toString('utf8')).candidateId;
    } catch (error) {
        throw new Error(`Failed to decrypt vote: ${error.message}`);
    }
};

export const signVote = async (encryptedVoteBase64, address) => {
    const encryptedVoteHex = '0x' + Buffer.from(encryptedVoteBase64, 'base64').toString('hex');

    const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [encryptedVoteHex, address]
    });

    return signature;
};

export const getConnectedAddress = async () => {
    if (!window.ethereum) throw new Error("MetaMask is not installed");
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (!accounts.length) throw new Error("MetaMask is not connected");
    return accounts[0].toLowerCase();
};