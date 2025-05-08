const nodemailer = require("nodemailer");

/**
 * Send an email to the specified recipient
 * 
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text email content
 * @param {string} html - HTML email content (optional)
 * @returns {Promise} - Resolves when email is sent
 */
const sendEmail = async (to, subject, text, html = null) => {
    try {
        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Configure email options
        const mailOptions = {
            from: `Pet Hospital <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        };

        // Add HTML content if provided
        if (html) {
            mailOptions.html = html;
        }

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to} (${info.messageId})`);
        
        return info;
    } catch (error) {
        console.error("❌ Email sending failed:", error);
        throw error;
    }
};

/**
 * Send OTP verification email
 * 
 * @param {string} email - Recipient email address
 * @param {string} otp - One-time password
 * @param {string} name - User's name
 * @param {string} purpose - Purpose of OTP (verification or password reset)
 * @returns {Promise} - Resolves when email is sent
 */
const sendOtpEmail = async (email, otp, name = "User", purpose = "verification") => {
    let subject, text, html;
    
    if (purpose.toLowerCase() === "password reset") {
        subject = "Password Reset Code for Pet Hospital";
        
        text = `
            Hello ${name},
            
            We received a request to reset your password for your Pet Hospital account.
            
            Your password reset code is: ${otp}
            
            This code will expire in 10 minutes.
            
            If you did not request a password reset, please ignore this email or contact support if you have concerns.
            
            Regards,
            Pet Hospital Team
        `;
        
        html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #3b82f6; padding: 20px; text-align: center; color: white;">
                    <h1>Pet Hospital</h1>
                </div>
                <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
                    <p>Hello ${name},</p>
                    <p>We received a request to reset your password for your Pet Hospital account.</p>
                    <p>Your password reset code is:</p>
                    <div style="background-color: #f3f4f6; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
                        ${otp}
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                    <p>Regards,<br>Pet Hospital Team</p>
                </div>
            </div>
        `;
    } else {
        subject = "Your verification code for Pet Hospital";
        
        text = `
            Hello ${name},
            
            Thank you for registering with Pet Hospital. Your verification code is: ${otp}
            
            This code will expire in 10 minutes.
            
            If you did not request this code, please ignore this email.
            
            Regards,
            Pet Hospital Team
        `;
        
        html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #3b82f6; padding: 20px; text-align: center; color: white;">
                    <h1>Pet Hospital</h1>
                </div>
                <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
                    <p>Hello ${name},</p>
                    <p>Thank you for registering with Pet Hospital. Your verification code is:</p>
                    <div style="background-color: #f3f4f6; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
                        ${otp}
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you did not request this code, please ignore this email.</p>
                    <p>Regards,<br>Pet Hospital Team</p>
                </div>
            </div>
        `;
    }
    
    return sendEmail(email, subject, text, html);
};



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendAppointmentStatusEmail = async (email, name, appointment, status) => {
    const subject = `Your Appointment is ${status}`;
  
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Appointment ${status}</title>
    </head>
    <body style="margin:0; padding:0; background:#f6f6f6;">
      <table width="100%" bgcolor="#f6f6f6" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif;">
        <tr>
          <td align="center">
            <table width="600" style="margin:40px auto; background:#fff; border-radius:8px; box-shadow:0 2px 8px #e0e0e0;">
              <tr>
                <td style="padding:32px 32px 16px 32px; text-align:center;">
                  <h2 style="color:#2563eb; margin-bottom:8px;">City Pet Hospital</h2>
                  <h3 style="color:#333; margin:0;">Appointment ${status}</h3>
                </td>
              </tr>
              <tr>
                <td style="padding:0 32px 24px 32px;">
                  <p style="color:#111; font-size:16px; margin-bottom:20px;">
                    Hello <strong>${name}</strong>,
                  </p>
                  <p style="font-size:15px; color:#222;">
                    Your appointment for <b>${appointment.appointmentType}</b> has been 
                    <span style="color:${status === 'Confirmed' ? '#16a34a' : '#dc2626'}; font-weight:bold;">${status}</span>.
                  </p>
                  <table style="margin:20px 0; width:100%; font-size:14px; color:#444;">
                    <tr>
                      <td style="padding:6px 0;"><strong>Pet ID:</strong></td>
                      <td>${appointment.petID}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;"><strong>Date:</strong></td>
                      <td>${new Date(appointment.createdAt).toLocaleDateString()}</td>
                    </tr>
                    <!-- Add more rows if you have more details -->
                  </table>
                  <p style="font-size:14px; color:#555; margin-top:24px;">
                    If you have any questions, please contact us at <a href="mailto:citypet@example.com" style="color:#2563eb;">citypet@example.com</a>.
                  </p>
                  <p style="font-size:14px; color:#888; margin-top:24px; border-top:1px solid #eee; padding-top:16px;">
                    Thank you,<br />
                    <span style="color:#2563eb;">City Pet Hospital Team</span>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
  
    const text = `Hello ${name},\n\nYour appointment for ${appointment.appointmentType} has been ${status}.\n\nThank you.`;
  
    return transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
      html
    });
 

};





// Export both functions
module.exports = {
    sendEmail,
    sendOtpEmail,
    sendAppointmentStatusEmail
};