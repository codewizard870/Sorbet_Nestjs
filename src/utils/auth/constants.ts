/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import * as nodemailer from "nodemailer";
import * as dotenv from 'dotenv';
dotenv.config()
export const jwtConstants = {
  secret: process.env.JWTSECRET,
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

const user = process.env.EMAIL_USER;
const transport = nodemailer.createTransport({
  host: "smtp.office365.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  auth: {
    user,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

export const sendEmail = (name, email, content) => {
  transport
    .sendMail({
      from: user,
      to: email,
      ...content,
    })
    .catch((err) => console.log(err));
};

