import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

dotenv.config();  // Cargar las variables de entorno desde el archivo .env

const transporter = nodemailer.createTransport({
  service: 'gmail',  // Usamos Gmail como servicio SMTP
  auth: {
    user: process.env.EMAIL_USER, // Asegúrate de que esta variable esté en el archivo .env
    pass: process.env.EMAIL_PASS, // Asegúrate de que esta variable esté en el archivo .env
  },
});

// Obtener el directorio actual con import.meta.url (compatible con ESModules)
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const sendEmail = async (to, subject, htmlContent, attachmentUrl = null) => {
  try {
    let attachments = [];

    // Si tenemos una URL de archivo, descargamos el archivo y lo agregamos a los adjuntos
    if (attachmentUrl) {
      // Descargar el archivo desde la URL
      const response = await axios({
        url: attachmentUrl,
        method: 'GET',
        responseType: 'stream',  // Aseguramos que la respuesta sea un stream
      });

      // Crear un nombre temporal para el archivo
      const tempFilePath = path.join(__dirname, 'tmp', `${Date.now()}-temp-file.pdf`);
      
      // Verificar si la carpeta /tmp existe, si no, crearla
      if (!fs.existsSync(path.dirname(tempFilePath))) {
        fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
      }

      // Guardar el archivo en el sistema temporal
      const writer = fs.createWriteStream(tempFilePath);
      response.data.pipe(writer);

      writer.on('finish', () => {
        // Después de que el archivo se haya guardado, enviamos el correo
        attachments.push({
          filename: 'archivo.pdf',
          path: tempFilePath,  // Usamos el archivo temporal
        });

        // Enviar el correo con el archivo adjunto
        transporter.sendMail({
          from: `"Merkahorro" <${process.env.EMAIL_USER}>`, // Nombre y correo de quien envía
          to,
          subject,
          html: htmlContent, // Si tienes HTML en el correo
          attachments,
        }).then(() => {
          console.log(`📨 Correo enviado a ${to}`);
        }).catch((error) => {
          console.error('❌ Error al enviar el correo:', error);
        });

        // Eliminar el archivo temporal después de enviarlo
        fs.unlink(tempFilePath, (err) => {
          if (err) {
            console.error('❌ Error al eliminar el archivo temporal:', err);
          } else {
            console.log('🗑️ Archivo temporal eliminado');
          }
        });
      });

      writer.on('error', (error) => {
        console.error('❌ Error al descargar el archivo:', error);
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
