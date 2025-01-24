import { insertRecord, uploadFile, getPublicUrl } from '../services/supabaseService.js';
import { sendEmail } from '../services/emailService.js';

const registro = async (req, res) => {
  try {
    const { descripcion, sede, fecha_inicial, fecha_final, correo_asignado } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Archivo PDF es requerido' });
    }

    // Subir el archivo al bucket de Supabase
    const { data: uploadData, error: uploadError } = await uploadFile(file);

    if (uploadError) {
      console.error('Error al subir el archivo:', uploadError);
      return res.status(500).json({ error: 'Error al subir el archivo', details: uploadError.message });
    }

    // Obtener la URL pública del archivo subido
    const { publicURL, error: urlError } = getPublicUrl(uploadData.path);

    if (urlError) {
      console.error('Error al obtener la URL pública:', urlError);
      return res.status(500).json({ error: 'Error al obtener la URL pública', details: urlError.message });
    }

    // Insertar el registro en la base de datos con la URL del archivo
    const { data, error } = await insertRecord({
      descripcion,
      sede,
      fecha_inicial,
      fecha_final,
      correo_asignado,
      estado: 'Pendiente',
      observacion: '',
      pdf: publicURL // Guardar la URL pública en el campo 'pdf'
    });

    if (error) {
      console.error('Error al insertar el registro:', {
        message: error.message,
        code: error.code,
        details: JSON.stringify(error),
        hint: error.hint,
        query: error.query
      });
      return res.status(500).json({ error: 'Error al guardar registro', details: error.message });
    }

    // Enviar el correo electrónico
    await sendEmail({
      to: correo_asignado,
      subject: 'Nuevo Proceso',
      descripcion,
      sede,
      fecha_inicial,
      fecha_final,
      correo_asignado,
      file
    });

    res.status(200).json({ message: 'Registro exitoso' });
  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({ error: 'Error en registro', details: error.message });
  }
};

export { registro };