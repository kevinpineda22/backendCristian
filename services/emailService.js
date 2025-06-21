import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// --- CONFIGURACIÓN CORREGIDA PARA OUTLOOK/OFFICE 365 ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // "smtp.office365.com"
  port: process.env.SMTP_PORT, // 587
  secure: process.env.SMTP_SECURE === 'true', // false para usar STARTTLS
  auth: {
    user: process.env.EMAIL_USER, // notificacion@merkahorro.com
    pass: process.env.EMAIL_PASS, // Tu contraseña de aplicación
  },
});

const sendEmail = async ({ to, subject, descripcion, sede, fecha_inicial, fecha_final, correo_asignado, file }) => {
  try {
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            table { width: 100%; border-spacing: 0; background-color: #ffffff; }
            td { padding: 15px; }
            h2 { font-size: 24px; color: rgb(255, 255, 255); }
            .button { background-color: #210d65; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <table width="600" cellpadding="20" cellspacing="0" style="border: 1px solid #dddddd; border-radius: 10px;">
                  <tr>
                    <td style="text-align: center; background-color: #210d65; color: white;">
                      <h2>Nuevo Proceso</h2>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>Estimado encargado,</p>
                      <p>Se ha creado un nuevo proceso que requiere tu atención. Aquí están los detalles:</p>
                      <table cellpadding="5" cellspacing="0" width="100%" style="border-collapse: collapse; margin-top: 20px;">
                        <tr><td style="font-weight: bold;">Descripción:</td><td>${descripcion}</td></tr>
                        <tr><td style="font-weight: bold;">Sede:</td><td>${sede}</td></tr>
                        <tr><td style="font-weight: bold;">Fecha de inicio:</td><td>${fecha_inicial}</td></tr>
                        <tr><td style="font-weight: bold;">Fecha Final:</td><td>${fecha_final}</td></tr>
                      </table>
                      <p style="margin-top: 20px;">Puedes ver el historial de tus procesos en el siguiente enlace:</p>
                      <a href="https://www.merkahorro.com/historial/${correo_asignado}" target="_blank" style="color: #3498db;">Ver Historial</a>
                      <p style="margin-top: 30px;">Saludos cordiales,<br>El equipo de Merkahorro</p>
                      <p style="margin-top: 20px; font-style: italic; text-align: center; color: #555;">
                        "Que otra cosa puede hacer el hombre bondadoso, si no es hacer el bien por los demás hombres."<br>
                        <strong>Marco Aurelio</strong>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
    `; 

    const attachments = [];
    if (file) {
      attachments.push({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype,
      });
    }

    const info = await transporter.sendMail({
      from: `"Merkahorro" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
      attachments,
    });

    console.log('Correo enviado:', info.messageId);
    return info; // Devolvemos la información por si es útil
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    // Relanzamos el error para que el controlador que llama a esta función sepa que algo falló
    throw error;
  }
};

export { sendEmail };