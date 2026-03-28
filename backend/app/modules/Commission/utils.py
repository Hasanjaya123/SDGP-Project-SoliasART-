import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)

LOGO_URL = "https://ik.imagekit.io/sjunnxn6x/Public/soliasartlogo.png"


def _build_summary_html(commission_data: dict) -> str:
    """Build an HTML summary table from the commission data."""
    return f"""
    <table style="width:100%; border-collapse:collapse; margin-top:20px;">
        <tr style="background:#f9f9f9;">
            <td style="padding:10px; border:1px solid #e0e0e0; font-weight:bold; color:#555;">Project Title</td>
            <td style="padding:10px; border:1px solid #e0e0e0;">{commission_data.get("title", "N/A")}</td>
        </tr>
        <tr>
            <td style="padding:10px; border:1px solid #e0e0e0; font-weight:bold; color:#555;">Description</td>
            <td style="padding:10px; border:1px solid #e0e0e0;">{commission_data.get("description", "N/A")}</td>
        </tr>
        <tr style="background:#f9f9f9;">
            <td style="padding:10px; border:1px solid #e0e0e0; font-weight:bold; color:#555;">Medium</td>
            <td style="padding:10px; border:1px solid #e0e0e0;">{commission_data.get("medium", "N/A")}</td>
        </tr>
        <tr>
            <td style="padding:10px; border:1px solid #e0e0e0; font-weight:bold; color:#555;">Size (Inches)</td>
            <td style="padding:10px; border:1px solid #e0e0e0;">{commission_data.get("size_inches", "N/A")}</td>
        </tr>
        <tr style="background:#f9f9f9;">
            <td style="padding:10px; border:1px solid #e0e0e0; font-weight:bold; color:#555;">Proposed Budget</td>
            <td style="padding:10px; border:1px solid #e0e0e0;">LKR {commission_data.get("proposed_budget", "N/A"):,.2f}</td>
        </tr>
        <tr>
            <td style="padding:10px; border:1px solid #e0e0e0; font-weight:bold; color:#555;">Deadline</td>
            <td style="padding:10px; border:1px solid #e0e0e0;">{commission_data.get("deadline", "N/A")}</td>
        </tr>
    </table>
    """


def _build_email_html(buyer_name: str, artist_name: str, status_text: str, status_color: str, summary_html: str) -> str:
    """Build the complete branded HTML email."""

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip('/')

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }}
            .header {{
                background: linear-gradient(135deg, #1F4E79 0%, #E5B648 100%);
                padding: 40px 20px;
                text-align: center;
            }}
            .logo-container {{
                background-color: white;
                padding: 15px 25px;
                border-radius: 10px;
                display: inline-block;
                box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            }}
            .logo-container img {{
                height: 50px;
                width: auto;
                display: block;
            }}
            .content {{ padding: 40px 30px; color: #333333; line-height: 1.6; }}
            h2 {{ color: #1F4E79; margin-top: 0; text-align: center; }}
            .status-badge {{
                display: inline-block;
                padding: 8px 20px;
                border-radius: 50px;
                color: white;
                font-weight: bold;
                font-size: 14px;
                margin: 10px 0 20px 0;
            }}
            .footer {{ background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888888; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-container">
                    <img src="{LOGO_URL}" alt="SoliasArt Logo">
                </div>
            </div>
            <div class="content">
                <h2>Commission Request Update</h2>
                <p>Hi {buyer_name},</p>
                <p>Your commission request to <strong>{artist_name}</strong> has been
                    <span class="status-badge" style="background-color:{status_color};">{status_text}</span>
                </p>
                <p><strong>Here's a summary of your request:</strong></p>
                {summary_html}
                <br>
                <p style="text-align:center; margin-top:30px;">
                    <a href="{frontend_url}" style="display:inline-block; padding:14px 30px; background-color:#1F4E79; color:#ffffff !important; text-decoration:none; border-radius:50px; font-weight:bold; font-size:16px; box-shadow: 0 4px 6px rgba(31, 78, 121, 0.3);">
                        Visit SoliasArt
                    </a>
                </p>
            </div>
            <div class="footer">
                <p>&copy; 2026 SoliasArt Team. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """


async def send_commission_accepted_email(
    buyer_email: str, buyer_name: str, artist_name: str, commission_data: dict
):
    """Send an email notifying the buyer that their commission was accepted."""
    summary_html = _build_summary_html(commission_data)
    html = _build_email_html(
        buyer_name=buyer_name,
        artist_name=artist_name,
        status_text="Accepted ✅",
        status_color="#2E7D32",
        summary_html=summary_html,
    )

    message = MessageSchema(
        subject=f"🎨 Great News! {artist_name} Accepted Your Commission Request",
        recipients=[buyer_email],
        body=html,
        subtype=MessageType.html,
    )

    fm = FastMail(conf)
    await fm.send_message(message)


async def send_commission_rejected_email(
    buyer_email: str, buyer_name: str, artist_name: str, commission_data: dict
):
    """Send an email notifying the buyer that their commission was rejected."""
    summary_html = _build_summary_html(commission_data)
    html = _build_email_html(
        buyer_name=buyer_name,
        artist_name=artist_name,
        status_text="Rejected ❌",
        status_color="#D32F2F",
        summary_html=summary_html,
    )

    message = MessageSchema(
        subject=f"Commission Request Update from {artist_name}",
        recipients=[buyer_email],
        body=html,
        subtype=MessageType.html,
    )

    fm = FastMail(conf)
    await fm.send_message(message)
