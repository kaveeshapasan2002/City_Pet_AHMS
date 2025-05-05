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

/**
 * Send appointment status notification email
 * 
 * @param {string} email - Recipient email address
 * @param {string} name - User's name
 * @param {object} appointment - Appointment details
 * @param {string} status - New appointment status
 * @returns {Promise} - Resolves when email is sent
 */
const sendAppointmentStatusEmail = async (email, name, appointment, status) => {
    const subject = `Your Appointment is ${status} - Pet Hospital`;
    
    const text = `
Hello ${name},

Your appointment has been ${status}.

Appointment Details:
- Pet ID: ${appointment.petID}
- Type: ${appointment.appointmentType}
- Date: ${new Date(appointment.createdAt).toLocaleDateString()}

Thank you for choosing Pet Hospital.

Regards,
Pet Hospital Team
    `;
    
    const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #3b82f6; padding: 20px; text-align: center; color: white;">
    <h1>Pet Hospital</h1>
  </div>
  <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
    <p>Hello ${name},</p>
    <h2 style="color: ${status === 'Confirmed' ? '#10b981' : '#ef4444'}">
      Appointment ${status}
    </h2>
    <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6;">
      <p><strong>Pet ID:</strong> ${appointment.petID}</p>
      <p><strong>Type:</strong> ${appointment.appointmentType}</p>
      <p><strong>Date:</strong> ${new Date(appointment.createdAt).toLocaleDateString()}</p>
    </div>
    <p>Thank you for choosing Pet Hospital.</p>
    <p>Regards,<br>Pet Hospital Team</p>
  </div>
</div>
    `;

    return sendEmail(email, subject, text, html);
};


module.exports = {
    sendEmail,
    sendOtpEmail,
    sendAppointmentStatusEmail
};


// Export both functions
module.exports = {
    sendEmail,
    sendOtpEmail
};