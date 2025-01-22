import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();  // Cargar las variables de entorno desde el archivo .env

// Crear el transportador de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Usamos Gmail como servicio SMTP
  auth: {
    user: process.env.EMAIL_USER, // Asegúrate de que esta variable esté en el archivo .env
    pass: process.env.EMAIL_PASS, // Asegúrate de que esta variable esté en el archivo .env
  },
});

// Función para enviar un correo con un archivo adjunto (directamente desde Supabase)
export const sendEmail = async (to, subject, htmlContent, attachmentUrl = null) => {
  try {
    let attachments = [];

    // Si tenemos una URL de archivo, descargamos el archivo y lo agregamos a los adjuntos
    if (attachmentUrl) {
      // Descargar el archivo desde la URL de Supabase
      const response = await axios({
        url: attachmentUrl,
        method: 'GET',
        responseType: 'arraybuffer',  // Usamos 'arraybuffer' para obtener los datos del archivo como un buffer
      });

      // Adjuntar el archivo descargado como un buffer
      attachments.push({
        filename: 'archivo.pdf',
        content: response.data,  // El contenido del archivo como buffer
      });

      // Enviar el correo con el archivo adjunto
      await transporter.sendMail({
        from: `"Merkahorro" <${process.env.EMAIL_USER}>`, // Nombre y correo de quien envía
        to,
        subject,
        html: htmlContent, // Si tienes HTML en el correo
        attachments,
      });

      console.log(`📨 Correo enviado a ${to}`);
    } else {
      // Si no tenemos archivo, solo enviamos el correo sin adjuntos
      await transporter.sendMail({
        from: `"Merkahorro" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent,
      });

      console.log(`📨 Correo enviado a ${to}`);
    }

  } catch (error) {
    console.error('❌ Error al enviar el correo:', error);
  }
};
