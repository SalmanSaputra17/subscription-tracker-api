import nodemailer from 'nodemailer'
import {EMAIL_PASSWORD, EMAIL_USER} from "./env.js";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
    }
});

export default transporter;