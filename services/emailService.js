import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();  // Cargar las variables de entorno desde el archivo .env

const transporter = nodemailer.createTransport({
  service: 'gmail',  // Usamos Gmail como servicio SMTP
  auth: {
    user: process.env.EMAIL_USER, // Asegúrate de que esta variable esté en el archivo .env
    pass: process.env.EMAIL_PASS, // Asegúrate de que esta variable esté en el archivo .env
  },
});

export const sendEmail = async (to, subject, htmlContent, attachmentUrl = null) => {
  try {
    const mailOptions = {
      from: `"Cristian" <${process.env.EMAIL_USER}>`, // Nombre y correo de quien envía
      to,
      subject,
      html: htmlContent, // Si tienes HTML en el correo
      attachments: attachmentUrl
        ? [
            {
              filename: 'archivo.pdf',
              path: attachmentUrl, // Si tienes un archivo adjunto
            },
          ]
        : [], // Si no tienes archivo adjunto, no se incluye
    };

    // Enviar correo
    await transporter.sendMail(mailOptions);
    console.log(`📨 Correo enviado a ${to}`);
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error);
  }
};
