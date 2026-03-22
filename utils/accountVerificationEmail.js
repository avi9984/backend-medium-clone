import { Resend } from "resend";
import dotenv from 'dotenv'
dotenv.config({ quiet: true });

const resend = new Resend(process.env.RESEND_API_KEY);

const accountVerificationEmail = async (to, verificationToken, username) => {
    const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: to,
        subject: 'Verify Your Account',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify Your Account</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f5f7;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <!-- Main Container -->
                    <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
                        
                        <!-- Header Section -->
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 0; letter-spacing: -0.5px;">Verify Your Account</h1>
                        </div>
                        
                        <!-- Content Section -->
                        <div style="padding: 40px 30px;">
                            <p style="color: #1a1f36; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                                Hello ${username},
                            </p>
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                                Welcome! Please verify your email address to complete your account registration. Click the button below to verify your account:
                            </p>
                            
                            <!-- Button Container -->
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-account/${verificationToken}" 
                                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                          color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; 
                                          padding: 14px 32px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                                          transition: transform 0.2s ease, box-shadow 0.2s ease;">
                                    Verify Account
                                </a>
                            </div>
                            
                            <!-- Alternative Link -->
                            <p style="color: #4a5568; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="background-color: #f7fafc; padding: 12px; border-radius: 6px; 
                                      color: #4a5568; font-size: 12px; word-break: break-all; margin-bottom: 30px;">
                                ${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-account/${verificationToken}
                            </p>
                            
                            <!-- Expiry Warning -->
                            <div style="background-color: #fff5f5; border-left: 4px solid #fc8181; padding: 15px; margin: 25px 0; border-radius: 4px;">
                                <p style="color: #c53030; font-size: 14px; margin: 0;">
                                    <strong>⚠️ Link Expires Soon</strong><br>
                                    This verification link will expire in 24 hours for security reasons.
                                </p>
                            </div>
                            
                            <p style="color: #4a5568; font-size: 14px; line-height: 1.5; margin-bottom: 10px;">
                                If you didn't create an account with us, please ignore this email.
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
        throw new Error(`Failed to send verification email: ${error.message}`);
    } else {
        console.log('Verification email sent successfully to:', to);
        return data;
    }
}

export { accountVerificationEmail }