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

    const { publicURL, error: publicUrlError } = getPublicUrl(fileName);

    if (publicUrlError) {
      console.error('Error Supabase:', publicUrlError);
      return res.status(500).json({ error: 'Error al obtener URL pública', details: publicUrlError });
    }

    const record = {
      descripcion,
      pdf: publicURL,
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

    await sendEmail(correo_asignado, descripcion, sede, fecha_inicial, fecha_final, req.file);

    res.status(200).json({ message: 'Registro exitoso' });
  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({ error: 'Error en registro', details: error.message });
  }
};

export { registro };