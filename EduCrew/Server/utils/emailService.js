import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async ({ email, groupName, groupId }) => {
  try {
    // Construct your frontend link
    const frontendUrl = `${process.env.CLIENT_URL}/dashboard/group/invite/${groupId}`;

    // Create transporter with SSL fix
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Email content
    const mailOptions = {
      from: `"EduCrew 👨‍🏫" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `📩 Invitation to join group "${groupName}" on EduCrew`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px;">
          <h2>📬 You've been invited to join a group on <b>EduCrew</b>!</h2>
          <p><strong>Group Name:</strong> ${groupName}</p>
          <p>Click the button below to view and respond to the invitation:</p>
          <a href="${frontendUrl}" 
             style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
            🔗 View & Reply
          </a>
          <p style="margin-top: 12px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${frontendUrl}</p>
        </div>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}: ${info.response}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    return false;
  }
};