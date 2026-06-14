// import nodemailer from "nodemailer"
// import dotenv from "dotenv"
// dotenv.config()
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         type: 'OAuth2',
//         user: process.env.GOOGLE_USER,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//         clientId: process.env.GOOGLE_CLIENT_ID
//     }
// })

// transporter.verify()
//     .then(() => { console.log("Email transporter is ready to send emails"); })
//     .catch((err) => { console.error("Email transporter verification failed:", err)})


// // sendemail function 
// export async function sendEmail({ to, subject, html, text }) {

//     const mailOptions = {
//         from: process.env.GOOGLE_USER,
//         to,
//         subject,
//         html,
//         text
//     };

//     const details = await transporter.sendMail(mailOptions);
//     console.log("Email sent:", details);
// }

import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

async function createTransporter() {

  const accessToken = await oauth2Client.getAccessToken();
  console.log("Access Token:", accessToken);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GOOGLE_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });

  return transporter;
}

async function verifyTransporter() {

  try {

    const transporter = await createTransporter();

    await transporter.verify();

    console.log("Email transporter is ready to send emails");

  } catch (err) {

    console.error("Email transporter verification failed:", err);

  }
}

verifyTransporter();

// send email function
// export async function sendEmail({ to, subject, html, text = "" }) {

//   try {

//     console.log("sendEmail entered");

//     const transporter = await createTransporter();
//     console.log("transporter created");

//     const mailOptions = {
//       from: process.env.GOOGLE_USER,
//       to,
//       subject,
//       html,
//       text,
//     };

//     const details = await transporter.sendMail(mailOptions);
//     console.log("Email sent:", details);

//   } catch (error) {

//     console.log("Send mail error:", error);

//   }
// }

export async function sendEmail({ to, subject, html, text = "" }) {
  try {
    console.log("sendEmail entered");

    const transporter = await createTransporter();
    console.log("transporter created");

    const mailOptions = {
      from: process.env.GOOGLE_USER,
      to,
      subject,
      html,
      text,
    };

    console.log("About to send mail");

    const details = await transporter.sendMail(mailOptions);

    console.log("Email sent:", details);

    return details;

  } catch (error) {
    console.error("Send mail error:", error);

    throw error; // Important
  }
}