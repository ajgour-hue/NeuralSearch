

// nodemailer i am not using it right now becuase it is failing on render and giving me SMTP error

// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import { google } from "googleapis";

// dotenv.config();

// const OAuth2 = google.auth.OAuth2;

// const oauth2Client = new OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   "https://developers.google.com/oauthplayground"
// );

// oauth2Client.setCredentials({
//   refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
// });

// async function createTransporter() {

//   const accessToken = await oauth2Client.getAccessToken();
//   console.log("Access Token:", accessToken);

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       type: "OAuth2",
//       user: process.env.GOOGLE_USER,
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//       accessToken: accessToken.token,
//     },
//   });

//   return transporter;
// }

// async function verifyTransporter() {

//   try {

//     const transporter = await createTransporter();

//     await transporter.verify();

//     console.log("Email transporter is ready to send emails");

//   } catch (err) {

//     console.error("Email transporter verification failed:", err);

//   }
// }

// verifyTransporter();

// // send email function
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

//     console.log("About to send mail");

//     const details = await transporter.sendMail(mailOptions);

//     console.log("Email sent:", details);

//     return details;

//   } catch (error) {
//     console.error("Send mail error:", error);

//     throw error; // Important
//   }
// }


// ============================= RESEND =============================================

//resend using in place of nodemailer ===========  ==========  ==  ==  = = = = = 

import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    // Agar Resend error return kare
    if (response.error) {
      throw new Error(response.error.message);
    }

    console.log("Email sent:", response);

    return response;

  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
}