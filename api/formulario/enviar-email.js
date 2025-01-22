import formidable from 'formidable';
import nodemailer from 'nodemailer';
import cors from 'cors';

const corsMiddleware = cors({
  origin: '*', // Permitir solicitudes desde cualquier origen
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

export const config = {
  api: {
    bodyParser: false, // Deshabilitamos el body parser porque formidable lo maneja
  },
};

export default function handler(req, res) {
  corsMiddleware(req, res, () => {
    if (req.method === 'POST') {
      const form = new formidable.IncomingForm();

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(500).json({ error: 'Error al procesar el formulario' });
        }

        // Validación de los campos (según lo que recibes)
        const { descripcion, sede, fecha_inicial, fecha_final, correo_asignado } = fields;
        const pdfFile = files.pdf;

        // Aquí debes implementar la lógica de envío de correo (usando nodemailer)
        try {
          let transporter = nodemailer.createTransport({
            service: 'gmail', // Cambiar según tu proveedor de correo
            auth: {
              user: 'tucorreo@gmail.com',
              pass: 'tucontraseña',
            },
          });

          const mailOptions = {
            from: 'tucorreo@gmail.com',
            to: correo_asignado,
            subject: 'Formulario Automatización',
            text: `Descripción: ${descripcion}\nSede: ${sede}\nFecha Inicial: ${fecha_inicial}\nFecha Final: ${fecha_final}`,
            attachments: [
              {
                filename: pdfFile.originalFilename,
                path: pdfFile.filepath,
              },
            ],
          };

          // Enviar correo
          await transporter.sendMail(mailOptions);

          // Responder al frontend
          res.status(200).json({ message: 'Correo enviado exitosamente.' });
        } catch (sendEmailError) {
          console.error('Error al enviar el correo:', sendEmailError);
          res.status(500).json({ error: 'Error al enviar el correo' });
        }
      });
    } else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  });
}
