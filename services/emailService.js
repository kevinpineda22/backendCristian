import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

// Crear el transportador de correo
const transporter = nodemailer.createTransport({
  service: 'gmail', // Usamos Gmail como servicio SMTP
  auth: {
    user: process.env.EMAIL_USER, // Correo configurado en el archivo .env
    pass: process.env.EMAIL_PASS, // Contraseña configurada en el archivo .env
  },
});

// Función para enviar un correo con un archivo adjunto (directamente desde Supabase)
export const sendEmail = async (to, subject, htmlContent, attachmentUrl = null) => {
  try {
    let attachments = [];

    // Si tenemos una URL de archivo, descargamos el archivo y lo agregamos a los adjuntos
    if (attachmentUrl) {
      const response = await axios({
        url: attachmentUrl,
        method: 'GET',
        responseType: 'arraybuffer', // Descargar como arraybuffer
      });

      // Adjuntar el archivo descargado como un buffer
      attachments.push({
        filename: 'archivo.pdf',
        content: response.data, // El contenido del archivo como buffer
      });
    }

    // Enviar el correo
    await transporter.sendMail({
      from: `"Merkahorro" <${process.env.EMAIL_USER}>`, // Nombre y correo de quien envía
      to,
      subject,
      html: htmlContent,
      attachments, // Adjuntos, si existen
    });

    console.log(`📨 Correo enviado a ${to}`);
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error.message);
    throw new Error(`No se pudo enviar el correo: ${error.message}`);
  }
};
