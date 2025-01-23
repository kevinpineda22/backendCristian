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
      <html>
          <body style="margin: 0; padding: 0; background-color: #f4f4f9;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f9; padding: 20px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0;">
                    <tr>
                      <td align="center" style="padding-bottom: 20px;">
                        <img src="https://www.merkahorro.com/logoMK.png" alt="Logo de la Empresa" width="150" style="display: block;">
                      </td>
                    </tr>
                    <tr>
                      <td style="font-family: Arial, sans-serif; color: #210d65; font-size: 22px; text-align: center; padding-bottom: 10px;">
                        <strong>Nuevo Proceso</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-family: Arial, sans-serif; color: #555555; font-size: 16px; line-height: 1.6; padding-bottom: 20px;">
                        <p><strong>Descripción:</strong> ${descripcion}</p>
                        <p><strong>Sede:</strong> ${sede}</p>
                        <p><strong>Fecha de inicio:</strong> ${fecha_inicial}</p>
                        <p><strong>Fecha Final :</strong> $${fecha_final}</p>
                        
                        <p>Puedes ver el historial de tus procesos:
                        <a href="https://backend-cristian.vercel.app/historial/${correo_asignado}" style="color:rgb(34, 131, 211); text-decoration: underline;">aquí</a></p>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-family: Arial, sans-serif; color: #777777; font-size: 14px; text-align: center; padding-top: 20px;">
                        Saludos cordiales,<br>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-family: Arial, sans-serif; color: #999999; font-size: 12px; padding-top: 20px;">
                        &copy; 2025 Merkahorro | Todos los derechos reservados
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
    `,
    attachments: [{ filename: file.originalname, content: file.buffer }]
  });
};

export { sendEmail };