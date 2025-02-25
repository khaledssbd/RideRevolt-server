import nodemailer from 'nodemailer';
import config from '../config';
import fs from 'fs';
import path from 'path';

export const sendEmail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.googleMailServiceEmail,
      pass: config.googleMailServicePass,
    },
  });


  const templatePath = path.join(__dirname, 'Message.html');
  let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

  htmlTemplate = htmlTemplate.replace('{{resetLink}}', resetLink);

  await transporter.sendMail({
    // from: config.googleMailServiceEmail, // sender address
    from: `"RideRevolt! 🚴" <${config.googleMailServiceEmail}>`,
    to, // list of receivers
    subject: 'Reset your password within 10 minutes!', // Subject line
    // text: '',
    html: htmlTemplate,
  });
};
