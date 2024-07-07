import nodemailer from "nodemailer";
import { ENV } from "../config/env";
import { emailTemplate } from "../utils/emailTemplate";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: ENV.SENDER_EMAIL,
    pass: ENV.SENDER_PASSWORD,
  },
});

export const sendPasswordMail = async (
  firstName: string,
  email: string,
  password: string
) => {
  const info = {
    from: `"Video Vault" <${ENV.SENDER_EMAIL}>`,
    to: email,
    subject: "Welcome to Our App",
    text: "Welcome to Our App",
    html: emailTemplate(firstName, password),
  };
  try {
    await transporter.sendMail(info).then((response) => {
      return response.messageId;
    });
  } catch (error) {
    return error;
  }
};
