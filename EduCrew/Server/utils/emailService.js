import nodemailer from 'nodemailer';

export const sendEmail = async ({ email, subject, message, groupId }) => {
  try {
    console.log('Sending email to:', email);
    console.log('Email configuration:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER ? '***' : 'not set',
      pass: process.env.EMAIL_PASS ? '***' : 'not set'
    });
    
    // Parse the message to extract group name
    const groupName = message.includes('the group "') 
      ? message.split('the group "')[1].split('"')[0] 
      : 'EduCrew Group';
    
    // Direct links to the dashboard with action and email parameters
    const acceptUrl = `${process.env.CLIENT_URL}/dashboard/group/${groupId}?action=accept&email=${encodeURIComponent(email)}`;
    const rejectUrl = `${process.env.CLIENT_URL}/dashboard/group/${groupId}?action=reject&email=${encodeURIComponent(email)}`;
    
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // <-- This bypasses self-signed certificate issues
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #0A1128; margin-bottom: 5px;">EduCrew Invitation</h2>
            <p style="color: #555; font-size: 16px; margin-top: 0;">You've been invited to join "${groupName}"</p>
          </div>
          
          <div style="background-color: #ffffff; border-radius: 5px; padding: 15px; margin-bottom: 20px; border-left: 4px solid #3182ce;">
            <p style="color: #333; line-height: 1.5; margin-top: 0;">${message}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${acceptUrl}" style="display: inline-block; background-color: #38A169; color: white; font-weight: bold; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin-right: 15px;">
              ACCEPT INVITATION
            </a>
            
            <a href="${rejectUrl}" style="display: inline-block; background-color: #E53E3E; color: white; font-weight: bold; padding: 12px 25px; text-decoration: none; border-radius: 5px;">
              DECLINE
            </a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
            <p style="color: #777; font-size: 12px;">
              This is an automated message from EduCrew. Please do not reply to this email.<br>
              If you're having trouble with the buttons above, copy and paste this URL into your browser: ${acceptUrl}
            </p>
          </div>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};