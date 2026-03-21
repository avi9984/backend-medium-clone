import { Resend } from "resend";
import dotenv from 'dotenv'
dotenv.config({ debug: false });

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, resetToken, username) => {
    const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: [to],
        subject: 'Reset Your Password - Action Required',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Password</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f5f7;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <!-- Main Container -->
                    <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
                        
                        <!-- Header Section -->
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 0; letter-spacing: -0.5px;">Reset Your Password</h1>
                        </div>
                        
                        <!-- Content Section -->
                        <div style="padding: 40px 30px;">
                            <p style="color: #1a1f36; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                                Hello ${username},
                            </p>
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                                We received a request to reset the password for your account. Click the button below to create a new password:
                            </p>
                            
                            <!-- Button Container -->
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="http://localhost:3000/reset-password/${resetToken}" 
                                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                          color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; 
                                          padding: 14px 32px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                                          transition: transform 0.2s ease, box-shadow 0.2s ease;">
                                    Reset Password
                                </a>
                            </div>
                            
                            <!-- Alternative Link -->
                            <p style="color: #4a5568; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="background-color: #f7fafc; padding: 12px; border-radius: 6px; 
                                      color: #4a5568; font-size: 12px; word-break: break-all; margin-bottom: 30px;">
                                http://localhost:3000/reset-password/${resetToken}
                            </p>
                            
                            <!-- Warning Message -->
                            <div style="background-color: #fff5f5; border-left: 4px solid #fc8181; padding: 15px; margin: 25px 0; border-radius: 4px;">
                                <p style="color: #c53030; font-size: 14px; margin: 0;">
                                    <strong>⚠️ Link Expires Soon</strong><br>
                                    This password reset link will expire in 1 hour for security reasons.
                                </p>
                            </div>
                            
                            <p style="color: #4a5568; font-size: 14px; line-height: 1.5; margin-bottom: 10px;">
                                If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                            </p>
                        </div>
                        
                        <!-- Footer Section -->
                        <div style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="color: #718096; font-size: 12px; margin-bottom: 10px;">
                                This is an automated message, please do not reply to this email.
                            </p>
                            <p style="color: #718096; font-size: 12px; margin: 0;">
                                &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `,
    });

    if (error) {
        console.error('Email sending error:', error);
    } else {
        console.log('Email sent successfully:', data);
    }
}

export { sendEmail }