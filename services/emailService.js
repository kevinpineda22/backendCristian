import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (correo_asignado, descripcion, sede, fecha_inicial, fecha_final, file) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: correo_asignado,
    subject: 'Nuevo proceso',
    html: `
      <td align="center" style="padding-bottom: 20px;">
        <img src="https://www.merkahorro.com/logoMK.png" alt="Logo de la Empresa" width="150" style="display: block;">
      </td>
      <p style="font-size: 16px; color: #333;">Detalles:</p>
      <ul style="list-style-type: none; padding: 0;">
        <li style="margin: 10px 0;"><strong>Descripción:</strong> ${descripcion}</li>
        <li style="margin: 10px 0;"><strong>Sede:</strong> ${sede}</li>
        <li style="margin: 10px 0;"><strong>Fecha de Inicio:</strong> ${fecha_inicial}</li>
        <li style="margin: 10px 0;"><strong>Fecha Final:</strong> ${fecha_final}</li>
      </ul>
      <p style="font-size: 16px; color: #333;">Puedes ver el historial de tus registros <a href="https://backend-cristian.vercel.app/historial/${correo_asignado}" style="color: #89DC00; text-decoration: none;">aquí</a>.</p>
    `,
    attachments: [{ filename: file.originalname, content: file.buffer }]
  });
};

export { sendEmail };