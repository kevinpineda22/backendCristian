import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';

// Configuración de almacenamiento de Multer para manejar el archivo PDF
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({ dest: 'uploads/' });

export const uploadPdf = upload.single('pdf'); // Asegúrate de que el campo en el frontend se llame 'pdf'

export const enviarCorreo = async (req, res) => {
  try {
    const { descripcion, sedes, fechaInicial, fechaFinal, correo } = req.body;
    const pdfFile = req.file;

    // Validar que todos los campos requeridos estén presentes
    if (!descripcion || !sedes || !fechaInicial || !fechaFinal || !correo) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Validar que el archivo subido sea un PDF
    if (!pdfFile || pdfFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'El archivo debe ser un PDF.' });
    }

    // Configuración de Nodemailer para enviar el correo
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Utiliza el servicio que prefieras
      auth: {
        user: process.env.EMAIL_USER, // Asegúrate de definir esta variable de entorno en Vercel
        pass: process.env.EMAIL_PASS, // También define esta variable
      },
    });

    // Configuración del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: correo,
      subject: 'Detalles del formulario',
      text: `Descripción: ${descripcion}\nSedes: ${sedes}\nFecha Inicial: ${fechaInicial}\nFecha Final: ${fechaFinal}`,
      attachments: [
        {
          path: path.join(__dirname, '../../uploads', pdfFile.filename),
        },
      ],
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'Hubo un error al enviar el correo' });
  }
};

// Exportar el handler para la ruta API de Vercel
export default function handler(req, res) {
  if (req.method === 'POST') {
    uploadPdf(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: 'Error al subir el archivo' });
      }
      enviarCorreo(req, res);
    });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
