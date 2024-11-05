import nodemailer from "nodemailer";

// Function to send OTP email
export const sendOTPEmail = (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true, // enables detailed output
    debug: true,
  });
  console.log(process.env.EMAIL_PASS);

  transporter.verify(function (error, success) {
    if (error) {
      console.log("SMTP connection failed:", error);
    } else {
      console.log("SMTP connection successful");
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };
  return transporter.sendMail(mailOptions);
};
