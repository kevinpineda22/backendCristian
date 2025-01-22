import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

const transporter = nodemailer.createTransport({
  service: 'gmail', // Usamos Gmail como servicio SMTP
  auth: {
    user: process.env.EMAIL_USER, // Correo configurado en el archivo .env
    pass: process.env.EMAIL_PASS, // Contraseña configurada en el archivo .env
  },
});

// Obtener la ruta temporal para archivos en entornos como Vercel
const getTempFilePath = (filename) => {
  const tempDir = '/tmp'; // Carpeta temporal en Vercel y otros entornos
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir); // Crear el directorio temporal si no existe
  }
  return path.join(tempDir, filename);
};

export const sendEmail = async (to, subject, htmlContent, attachmentUrl = null) => {
  try {
    const attachments = [];

    // Descargar y adjuntar archivo si se proporciona la URL
    if (attachmentUrl) {
      const response = await axios({
        url: attachmentUrl,
        method: 'GET',
        responseType: 'stream', // Descargar como stream para guardarlo en disco
      });

      const tempFilePath = getTempFilePath(`${Date.now()}-archivo.pdf`);

      // Guardar el archivo en la carpeta temporal
      const writer = fs.createWriteStream(tempFilePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Agregar el archivo descargado a los adjuntos del correo
      attachments.push({
        filename: 'archivo.pdf',
        path: tempFilePath,
      });

      console.log(`📁 Archivo temporal guardado en: ${tempFilePath}`);
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

    // Eliminar el archivo temporal si existe
    if (attachments.length > 0) {
      fs.unlink(attachments[0].path, (err) => {
        if (err) {
          console.error('❌ Error al eliminar el archivo temporal:', err);
        } else {
          console.log('🗑️ Archivo temporal eliminado correctamente');
        }
      });
    }
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error.message);
    throw new Error(`No se pudo enviar el correo: ${error.message}`);
  }
};
