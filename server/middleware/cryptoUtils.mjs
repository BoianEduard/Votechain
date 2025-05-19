import crypto from "crypto";

const AES_SECRET_KEY = process.env.AES_SECRET_KEY;
const IV_LENGTH = 16;

export function generateKeyPair() {
    return crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "spki",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
        },
    });
}

export function encryptPrivateKey(privateKey) {
    if (!AES_SECRET_KEY) {
        throw new Error("AES_SECRET_KEY is not defined in environment variables");
    }

    if (!privateKey) {
        throw new Error("Private key is required for encryption");
    }

    const key = Buffer.from(AES_SECRET_KEY.padEnd(32).slice(0, 32));
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(privateKey, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}

export function decryptPrivateKey(encrypted) {
    if (!AES_SECRET_KEY) {
        throw new Error("AES_SECRET_KEY is not defined in environment variables");
    }

    const key = Buffer.from(AES_SECRET_KEY.padEnd(32).slice(0, 32));

    const textParts = encrypted.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = textParts.join(":");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
