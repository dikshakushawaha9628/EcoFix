const otpTemplate = (otp) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background: white;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .header {
                padding: 20px;
                border-bottom: 2px solid #007BFF;
            }
            .logo {
                max-width: 150px;
            }
            h1 {
                font-size: 24px;
                color: #007BFF;
                margin-top: 10px;
            }
            p {
                font-size: 16px;
                color: #555;
                text-align: left;
            }
            .otp-code {
                font-size: 20px;
                font-weight: bold;
                color: #007BFF;
                margin: 20px 0;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img class="logo" src="YOUR_LOGO_URL_HERE" alt="Ecofix Logo">
                <h1>Ecofix - OTP Verification</h1>
            </div>

            <h2>Verify Your Email</h2>
            <p>Use the OTP below to verify your email address:</p>
            <div class="otp-code">${otp}</div>
            <p>This OTP is valid for a limited time. Do not share it with anyone.</p>

            <div class="footer">
                <p>Best regards, <br> Ecofix Support Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Export the function for use in other files
module.exports = otpTemplate;