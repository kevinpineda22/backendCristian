import { insertRecord, getRecordsToUpdate, updateRecordStatus } from '../services/supabaseService.js'; 
import { sendEmail } from '../services/emailService.js';

const registro = async (req, res) => {
  try {
    const { descripcion, sede, fecha_inicial, fecha_final, correo_asignado } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Archivo PDF es requerido' });
    }

    // Insertar el registro en la base de datos
    const { data, error } = await insertRecord({
      descripcion,
      sede,
      fecha_inicial,
      fecha_final,
      correo_asignado,
      estado: 'Pendiente',
      observacion: ''
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

    // Llamada a la función que revisa los registros vencidos
    await revisarRegistrosVencidos();  // Este es el paso que agrega la actualización de los registros vencidos

  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({ error: 'Error en registro', details: error.message });
  }
};

// Función para revisar los registros vencidos y actualizar su estado
const revisarRegistrosVencidos = async () => {
  try {
    // Obtener los registros que necesitan actualización (registros pendientes que ya han pasado su fecha final)
    const { data, error } = await getRecordsToUpdate();

    if (error) {
      console.error('Error al obtener registros vencidos:', error);
      return;
    }

    // Actualizar el estado de los formularios vencidos
    for (const registro of data) {
      const { id } = registro;
      const { error: updateError } = await updateRecordStatus(id, 'No completado');
      
      if (updateError) {
        console.error(`Error al actualizar el estado del formulario ${id}:`, updateError);
      } else {
        console.log(`Formulario con ID: ${id} actualizado a 'No completado'`);
      }
    }
  } catch (error) {
    console.error('Error al revisar registros vencidos:', error);
  }
};

export { registro };
