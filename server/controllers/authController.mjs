import models from '../models/index.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyMessage } from 'ethers';

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            publicKey: user.publicKey,
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const setCookieToken = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
    });
};

const checkEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const existingUser = await models.User.findOne({
        where: { email: email }
    });

    if (existingUser) {
        return res.status(409).json({ message: 'Email already in use' });
    }

    return res.status(200).json({ message: 'Email is available' });
};

const checkWalletAddress = async (address) => {
    const existingUser = await models.User.findOne({ where: { address } });
    return !!existingUser;
};

const verifyAuth = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                authenticated: false,
                message: 'Not authenticated'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await models.User.findByPk(decoded.userId);

            if (!user) {
                return res.status(401).json({
                    authenticated: false,
                    message: 'User not found'
                });
            }

            // Opțional, poți regenera token-ul pentru a extinde sesiunea
            // const newToken = generateToken(user);
            // setCookieToken(res, newToken);

            return res.status(200).json({
                authenticated: true,
                // token: newToken, // Opțional, dacă regenerezi token-ul
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    publicKey: user.publicKey,
                    address: user.address,
                }
            });
        } catch (error) {
            // Token invalid sau expirat
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });

            return res.status(401).json({
                authenticated: false,
                message: 'Invalid or expired token'
            });
        }
    } catch (error) {
        console.error('Auth verification error:', error);
        return res.status(500).json({
            authenticated: false,
            message: 'Internal server error'
        });
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await models.User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);
        setCookieToken(res, token);

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                publicKey: user.publicKey,
                address: user.address,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, publicKey, address, message, signature } = req.body;

        if (!email || !password || !publicKey || !address || !message || !signature) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const existingUser = await models.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const walletTaken = await checkWalletAddress(address);
        if (walletTaken) {
            return res.status(409).json({ message: 'Wallet address already in use' });
        }

        const recoveredAddress = verifyMessage(message, signature);
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            return res.status(400).json({ message: 'Signature verification failed' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await models.User.create({
            email,
            firstName,
            lastName,
            password: passwordHash,
            publicKey,
            address,
        });

        const token = generateToken(user);
        setCookieToken(res, token);

        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                publicKey: user.publicKey,
                address: user.address,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
};

export default {
    register,
    login,
    logout,
    checkEmail,
    verifyAuth
};