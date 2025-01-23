import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, descripcion, sede, fecha_inicial, fecha_final, correo_asignado, file }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .container {
            max-width: 800px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            text-align: center;
            color: #210D65;
          }
          p {
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${subject}</h1>
          <p><strong>Descripción:</strong> ${descripcion}</p>
          <p><strong>Sede:</strong> ${sede}</p>
          <p><strong>Fecha de Inicio:</strong> ${fecha_inicial}</p>
          <p><strong>Fecha Final:</strong> ${fecha_final}</p>
          <p><strong>Correo Asignado:</strong> ${correo_asignado}</p>
          <p>Puedes ver el historial de tus procesos:
          <a href="https://backend-cristian.vercel.app/historial/${correo_asignado}" style="color:rgb(34, 131, 211); text-decoration: underline;">aquí</a></p>
        </div>
      </body>
      </html>
    `,
    attachments: [{ filename: file.originalname, content: file.buffer }]
  });
};

export { sendEmail };