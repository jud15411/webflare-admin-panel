import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc   Register a new user
// @route  POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user in DB
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  if (user) {
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } else {
    res.status(400).send('Invalid user data');
  }
};

// @desc   Authenticate a user & get token
// @route  POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token });
  } else {
    res.status(401).send('Invalid email or password');
  }
};

// @desc   Authenticate user with Google
// @route  POST /api/auth/google
export const googleLogin = async (req, res) => {
    const { credential } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email } = ticket.getPayload();

        const user = await User.findOne({ email });

        if (user) {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token });
        } else {
            res.status(401).json({ message: 'This email is not registered with Webflare Design Co.' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Google Sign-In failed. Please try again.' });
    }
};