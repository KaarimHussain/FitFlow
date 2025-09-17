const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendOTPEmail(to, otp) {
    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject: 'Your Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`
    };
    await transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail };
