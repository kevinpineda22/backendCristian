import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const enviarCorreo = async (req, res, next) => {
  try {
    console.log("Formulario recibido:", req.body);
    console.log("Archivo recibido:", req.file);

    const { descripcion, sedes, fechaInicial, fechaFinal, correo } = req.body;
    const pdfFile = req.file;

    // Validar que todos los campos requeridos están presentes
    if (!descripcion || !sedes || !fechaInicial || !fechaFinal || !correo) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Validar que el archivo subido sea un PDF
    if (!pdfFile || pdfFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'El archivo debe ser un PDF.' });
    }

    // Configurar el transporte de Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Configurar el contenido del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: correo,
      subject: 'Detalles del formulario',
      text: `Descripción: ${descripcion}\nSedes: ${sedes}\nFecha Inicial: ${fechaInicial}\nFecha Final: ${fechaFinal}`,
      attachments: [
        {
          path: path.join(__dirname, '../../uploads', pdfFile.filename)
        }
      ]
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    next(error); // Pasar el error al middleware de manejo de errores
  }
};
