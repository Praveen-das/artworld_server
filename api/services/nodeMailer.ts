import { createTransport } from "nodemailer";

let transporter = createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "praveendask97@gmail.com",
    pass: "yaxy awry tjyn ozii",
  },
  from: "praveendask97@gmail.com",
});

export async function sendOrderConfirmationMail(payload: any) {
  let html = `
                <div>
                    <h1>ORDER CONFIRMED 🎉</h1>
                    <h2>Hi ${payload.username}, your order has been successfully received.</h2>
                    <h4>Our professional team is diligently working on processing your order to ensure accuracy and timely delivery. Regular updates on the status of your order will be provided for your convenience.</h4>
                </div>`;

  const mailOptions = {
    from: '"Artworld.com" <praveendask97@gmail.com>',
    to: "praveen97das@gmail.com",
    subject: `Order Confirmation - Your Order with Artworld.com has been successfully confirmed!`,
    text: "Hello world?",
    html,
  };

  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
}

export async function sendPasswordResetLinkMail(req:{email: string, resetLink: string}) {
  let html = `
        <p>Hello,</p>
        <p>You requested to reset your password. Click below:</p>
        <a href="${req.resetLink}">Click here.</a>
        <p>This link expires in 10 minutes.</p>`;

  const mailOptions = {
    from: '"Artworld.com" <praveendask97@gmail.com>',
    to: req.email,
    subject: `Password Reset Request`,
    html,
  };

  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
}
