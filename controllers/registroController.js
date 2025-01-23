import { uploadFile, getPublicUrl, insertRecord } from '../services/supabaseService.js';
import { sendEmail } from '../services/emailService.js';

const registro = async (req, res) => {
  try {
    const { descripcion, sede, fecha_inicial, fecha_final, correo_asignado } = req.body;

    if (!descripcion || !sede || !fecha_inicial || !fecha_final || !correo_asignado || !req.file) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const pdfBuffer = req.file.buffer;
    const fileName = `${Date.now()}_${req.file.originalname}`;

    const { data: uploadData, error: uploadError } = await uploadFile(fileName, pdfBuffer);

    if (uploadError) {
      console.error('Error Supabase:', uploadError);
      return res.status(500).json({ error: 'Error al subir archivo', details: uploadError });
    }

    const { data: publicUrlData } = getPublicUrl(fileName);

    const record = {
      descripcion,
      pdf: publicUrlData.publicUrl,
      sede,
      fecha_inicial,
      fecha_final,
      correo_asignado,
      estado: 'Pendiente',
      observacion: ''
    };

    const { data, error } = await insertRecord(record);

    if (error) {
      console.error('Detailed Supabase Error:', {
        message: error.message,
        code: error.code,
        details: JSON.stringify(error),
        hint: error.hint,
        query: error.query
      });
      return res.status(500).json({ error: 'Error al guardar registro', details: error.message });
    }

    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: correo_asignado,
      subject: 'Nuevo Automatizacion',
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
                        <p><strong>Fecha de inicio:</strong> ${fecha_inicial}</p>
                        <p><strong>Fecha Final :</strong> $${fecha_final}</p>
                        
                        <p>Puedes ver el historial de tus procesos:
                        <a href="http://localhost:5000/historial/${correo_asignado}" style="color:rgb(34, 131, 211); text-decoration: underline;">aquí</a></p>
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
      attachments: [{ filename: req.file.originalname, path: req.file.path }]
    });
    
    fs.unlinkSync(req.file.path);
    res.status(200).json({ message: 'Registro exitoso' });
    } catch (error) {
      console.error('Error completo:', error);
      res.status(500).json({ error: 'Error en registro', details: error.message });
    }
  };

export { registro };