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
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #89DC00;
            color:rgba(0, 0, 0, 0.94);
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${subject}</h1>
          <table>
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Sede</th>
                <th>Fecha de Inicio</th>
                <th>Fecha Final</th>
                <th>Estado</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${descripcion}</td>
                <td>${sede}</td>
                <td>${fecha_inicial}</td>
                <td>${fecha_final}</td>
                <td>Pendiente</td>
                <td></td>
              </tr>
            </tbody>
          </table>
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