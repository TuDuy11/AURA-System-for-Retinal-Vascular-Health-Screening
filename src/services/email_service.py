"""
Email Service Module for AURA System
Handles sending verification emails and other email communications
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails"""
    
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.sender_email = os.getenv("SENDER_EMAIL", "noreply@aura-clinic.com")
        self.sender_password = os.getenv("SENDER_PASSWORD", "")
        self.frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    def send_verification_email(self, recipient_email: str, verification_token: str, full_name: Optional[str] = None) -> bool:
        """
        Send verification email to user
        
        Args:
            recipient_email: Email address to send to
            verification_token: Verification token
            full_name: User's full name for personalization
            
        Returns:
            bool: True if email was sent successfully
        """
        try:
            verification_url = f"{self.frontend_url}/verify-email?token={verification_token}"
            
            subject = "AURA - Xác nhận địa chỉ email của bạn"
            
            name = full_name or recipient_email.split('@')[0]
            
            html_body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #2c3e50;">Xác nhận Email</h2>
                        <p>Xin chào <strong>{name}</strong>,</p>
                        <p>Cảm ơn bạn đã đăng ký tài khoản AURA. Vui lòng xác nhận địa chỉ email của bạn bằng cách click vào nút dưới đây:</p>
                        
                        <div style="margin: 30px 0;">
                            <a href="{verification_url}" 
                               style="display: inline-block; 
                                      background-color: #3498db; 
                                      color: white; 
                                      padding: 12px 30px; 
                                      text-decoration: none; 
                                      border-radius: 5px;
                                      font-weight: bold;">
                                Xác nhận Email
                            </a>
                        </div>
                        
                        <p>Hoặc copy đường link này vào trình duyệt:</p>
                        <p style="word-break: break-all; color: #7f8c8d;">{verification_url}</p>
                        
                        <p style="color: #7f8c8d; font-size: 12px;">
                            <strong>Lưu ý:</strong> Link xác nhận sẽ hết hạn sau 24 giờ. 
                            Nếu link không hoạt động, vui lòng yêu cầu gửi lại email xác nhận.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 30px 0;">
                        
                        <p style="color: #7f8c8d; font-size: 12px;">
                            Đây là email tự động. Vui lòng không reply email này.<br>
                            © 2026 AURA - Hệ thống Sàng Lọc Sức Khỏe Mạch Máu Võng Mạc
                        </p>
                    </div>
                </body>
            </html>
            """
            
            text_body = f"""
            Xác nhận Email
            
            Xin chào {name},
            
            Cảm ơn bạn đã đăng ký tài khoản AURA. Vui lòng xác nhận địa chỉ email của bạn bằng cách click vào link dưới đây:
            
            {verification_url}
            
            Link xác nhận sẽ hết hạn sau 24 giờ. Nếu link không hoạt động, vui lòng yêu cầu gửi lại email xác nhận.
            
            © 2026 AURA - Hệ thống Sàng Lọc Sức Khỏe Mạch Máu Võng Mạc
            """
            
            return self._send_email(recipient_email, subject, text_body, html_body)
            
        except Exception as e:
            logger.error(f"Error preparing verification email: {str(e)}")
            return False
    
    def send_password_reset_email(self, recipient_email: str, reset_token: str, full_name: Optional[str] = None) -> bool:
        """
        Send password reset email to user
        
        Args:
            recipient_email: Email address to send to
            reset_token: Password reset token
            full_name: User's full name for personalization
            
        Returns:
            bool: True if email was sent successfully
        """
        try:
            reset_url = f"{self.frontend_url}/reset-password?token={reset_token}"
            
            subject = "AURA - Đặt lại mật khẩu"
            
            name = full_name or recipient_email.split('@')[0]
            
            html_body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #2c3e50;">Đặt lại Mật khẩu</h2>
                        <p>Xin chào <strong>{name}</strong>,</p>
                        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu của bạn. Vui lòng click vào nút dưới đây:</p>
                        
                        <div style="margin: 30px 0;">
                            <a href="{reset_url}" 
                               style="display: inline-block; 
                                      background-color: #e74c3c; 
                                      color: white; 
                                      padding: 12px 30px; 
                                      text-decoration: none; 
                                      border-radius: 5px;
                                      font-weight: bold;">
                                Đặt lại Mật khẩu
                            </a>
                        </div>
                        
                        <p>Hoặc copy đường link này vào trình duyệt:</p>
                        <p style="word-break: break-all; color: #7f8c8d;">{reset_url}</p>
                        
                        <p style="color: #7f8c8d; font-size: 12px;">
                            <strong>Lưu ý:</strong> Link đặt lại mật khẩu sẽ hết hạn sau 1 giờ. 
                            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 30px 0;">
                        
                        <p style="color: #7f8c8d; font-size: 12px;">
                            Đây là email tự động. Vui lòng không reply email này.<br>
                            © 2026 AURA - Hệ thống Sàng Lọc Sức Khỏe Mạch Máu Võng Mạc
                        </p>
                    </div>
                </body>
            </html>
            """
            
            text_body = f"""
            Đặt lại Mật khẩu
            
            Xin chào {name},
            
            Chúng tôi nhận được yêu cầu đặt lại mật khẩu của bạn. Vui lòng click vào link dưới đây:
            
            {reset_url}
            
            Link đặt lại mật khẩu sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
            
            © 2026 AURA - Hệ thống Sàng Lọc Sức Khỏe Mạch Máu Võng Mạc
            """
            
            return self._send_email(recipient_email, subject, text_body, html_body)
            
        except Exception as e:
            logger.error(f"Error preparing password reset email: {str(e)}")
            return False
    
    def _send_email(self, recipient_email: str, subject: str, text_body: str, html_body: str) -> bool:
        """
        Internal method to send email via SMTP
        
        Args:
            recipient_email: Recipient's email address
            subject: Email subject
            text_body: Plain text body
            html_body: HTML body
            
        Returns:
            bool: True if email was sent successfully
        """
        try:
            # If no sender password, log and return True (for development)
            if not self.sender_password:
                logger.warning(f"Email not sent (no SENDER_PASSWORD configured). Would send to: {recipient_email}")
                logger.debug(f"Subject: {subject}")
                return True
            
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = self.sender_email
            message["To"] = recipient_email
            
            # Attach plain text and HTML parts
            message.attach(MIMEText(text_body, "plain"))
            message.attach(MIMEText(html_body, "html"))
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.sendmail(self.sender_email, recipient_email, message.as_string())
            
            logger.info(f"Email sent successfully to {recipient_email}")
            return True
            
        except smtplib.SMTPAuthenticationError:
            logger.error("SMTP authentication failed. Check SENDER_EMAIL and SENDER_PASSWORD")
            return False
        except smtplib.SMTPException as e:
            logger.error(f"SMTP error occurred: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            return False


# Initialize the email service
email_service = EmailService()
