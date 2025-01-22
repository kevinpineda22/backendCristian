import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, htmlContent, attachmentUrl = null) => {
  try {
    const attachments = [];

    if (attachmentUrl) {
      const response = await axios({ url: attachmentUrl, method: 'GET', responseType: 'arraybuffer' });
      attachments.push({ filename: 'archivo.pdf', content: response.data });
    }

    await transporter.sendMail({
      from: `"Merkahorro" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
      attachments,
    });

    console.log(`📨 Correo enviado a ${to}`);
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error.message);
    throw new Error(`No se pudo enviar el correo: ${error.message}`);
  }
};
