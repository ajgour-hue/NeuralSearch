import mongoose from 'mongoose';
import userModel from "../models/user.model.js"
import { sendEmail } from '../services/mail.service.js';
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

// register user controller function
export const register = async (req, res) => {
    try {

        // console.log("Register route hit");

        const { username, email, password } = req.body;

        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email or username already exists",
                success: false
            });
        }

        // console.log("Creating user...");

        const user = await userModel.create({
            username,
            email,
            password
        });

        // console.log("User created");

        const emailVerificationToken = jwt.sign(
            {
                email: user.email,
            },
            process.env.JWT_SECRET
        );

        // console.log("Token generated");

        // console.log("Before sendEmail");

        // console.time("email");


        console.log("Sending verification email to:", email);

        await sendEmail({
            to: "ajaygour6264@gmail.com",
            subject: "Welcome to Perplexity!",
            html: `
                    <p>Hi ${username},</p>
                    <p>Thank you for registering at <strong>Perplexity</strong>.</p>
                    <p>To get started, please verify your email address by clicking the link below:</p>
                    <a href="https://perplexity-wvf6.onrender.com/api/auth/verify-email?token=${emailVerificationToken}">
                        Verify Email
                    </a>
                    <p>If you did not create an account, please ignore this email.</p>
                    <p>Best regards,<br>The Perplexity Team</p>
                `
        });



        // console.timeEnd("email");

        // console.log("After sendEmail");

        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {

        console.error("========== REGISTER ERROR ==========");
        console.error(error);
        console.error(error.stack);

        return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
};

// verify email controller function

// console.log("JWT_SECRET:", !!process.env.JWT_SECRET);

export const verifyEmail = async (req, res) => {
    console.log("VERIFY ROUTE HIT");
    const { token } = req.query;


    // verify token and activate user account logic here
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false
            });
        }

        user.verified = true;

        await user.save();

        const html =
            `
        <p>Hi ${user.username},</p>
        <p>Your email has been successfully verified. You can now log in to your account.</p>
        <p>Best regards,<br>The Perplexity Team</p>
       <a href="https://perplexity-frontend-hwcu.onrender.com/login">
  Click here to login
</a>
    `;

        return res.send(html);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            error: error.message
        });
    }
}

export const login = async (req, res) => {

    const { email, password } = req.body;



    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "User with this email does not exist",
            success: false,
            err: "User not found"
        });
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify your email before logging in",
            success: false,
            err: "Email not verified"
        });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid password",
            success: false,
            err: "Incorrect password"
        });
    }

    const token = jwt.sign({
        id: user._id,
        email: user.email,
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // res.cookie('token', token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: 'strict',
    //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    // });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        },
    });



}


export const getMe = async (req, res) => {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("-password");
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false
        });
    }
    res.json({
        message: "User fetched successfully",
        success: true,
        user
    });
}   
