import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

router.get('/public-key', (req, res) => {
    try {
        const publicKeyPath = path.join(__dirname, '../keys/server_public.pem');
        const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
        res.status(200).json({ publicKey });
    } catch (err) {
        console.error("Failed to load public key:", err);
        res.status(500).json({ message: 'Could not load public key' });
    }
});

export default router;