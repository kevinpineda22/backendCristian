import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

dotenv.config();  // Cargar las variables de entorno desde el archivo .env

// Crear el transportador de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Usamos Gmail como servicio SMTP
  auth: {
    user: process.env.EMAIL_USER, // Asegúrate de que esta variable esté en el archivo .env
    pass: process.env.EMAIL_PASS, // Asegúrate de que esta variable esté en el archivo .env
  },
});

// Obtener la ruta del directorio temporal para Vercel (usamos `/tmp/` ya que Vercel proporciona este directorio)
const getTempDirPath = () => {
  return '/tmp';  // Vercel proporciona `/tmp/` como almacenamiento temporal
};

export const sendEmail = async (to, subject, htmlContent, attachmentUrl = null) => {
  try {
    let attachments = [];

    // Si tenemos una URL de archivo, descargamos el archivo y lo agregamos a los adjuntos
    if (attachmentUrl) {
      // Descargar el archivo desde la URL de Supabase
      const response = await axios({
        url: attachmentUrl,
        method: 'GET',
        responseType: 'stream',  // Aseguramos que la respuesta sea un stream
      });

      // Obtener la ruta temporal adecuada
      const tempDir = getTempDirPath();
      const tempFilePath = path.join(tempDir, `${Date.now()}-temp-file.pdf`);  // Guardamos el archivo directamente en `/tmp/`

      // Crear el archivo temporal y guardarlo en el sistema de archivos
      const writer = fs.createWriteStream(tempFilePath);
      response.data.pipe(writer);

      // Esperamos a que se complete la escritura del archivo
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Después de que el archivo se haya guardado, lo agregamos a los adjuntos
      attachments.push({
        filename: 'archivo.pdf',
        path: tempFilePath,  // Usamos el archivo temporal
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

      // Eliminar el archivo temporal después de enviarlo
      fs.unlink(tempFilePath, (err) => {
        if (err) {
          console.error('❌ Error al eliminar el archivo temporal:', err);
        } else {
          console.log('🗑️ Archivo temporal eliminado');
        }
      });

    } else {
      // Si no tenemos archivo, solo enviamos el correo sin adjuntos
      await transporter.sendMail({
        from: `"Tu Nombre" <${process.env.EMAIL_USER}>`,
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
