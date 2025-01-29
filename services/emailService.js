import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, descripcion, sede, fecha_inicial, fecha_final, correo_asignado, file }) => {
  try {
    // Simplificamos el HTML para reducir la complejidad
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="text-align: center;">Nuevo Proceso</h2>
          <p><strong>Descripción:</strong> ${descripcion}</p>
          <p><strong>Sede:</strong> ${sede}</p>
          <p><strong>Fecha de inicio:</strong> ${fecha_inicial}</p>
          <p><strong>Fecha Final:</strong> ${fecha_final}</p>
          <p>Puedes ver el historial de tus procesos: <a href="https://backend-cristian.vercel.app/historial/${correo_asignado}" style="color: blue;">Aquí</a></p>
          <p>Saludos cordiales,</p>
          <p>Merkahorro</p>
        </body>
      </html>
    `;

    // Enviamos el correo con el contenido simplificado
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: file.originalname,
          content: file.buffer,
        },
      ],
    });

    console.log('Correo enviado:', info.messageId);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

export { sendEmail };
