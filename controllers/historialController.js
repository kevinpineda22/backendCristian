// src/controllers/historialController.js
import { getRecordsByEmail, getAllRecords, updateRecordStatusAndObservation, deleteRecordById } from '../services/supabaseService.js'; // Asegúrate de importar deleteRecordById

const historial = async (req, res) => {
  try {
    const { correo } = req.params;
    const { data, error } = await getRecordsByEmail(correo);
    if (error) {
      console.error('Detailed Supabase Error:', {
        message: error.message,
        code: error.code,
        details: JSON.stringify(error),
        hint: error.hint,
        query: error.query,
      });
      return res.status(500).json({ error: 'Error al obtener historial', details: error.message });
    }
    res.status(200).json(data || []); // Siempre devuelve un array
  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
};

const getAllHistorial = async (req, res) => {
  try {
    const { data, error } = await getAllRecords();
    if (error) {
      console.error('Error al obtener todos los registros:', error);
      return res.status(500).json({ error: 'Error al obtener todos los registros', details: error.message });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
};

const updateHistorialStatus = async (req, res) => {
  try {
    const { id, estado, observacion } = req.body;
    if (!id || !estado) {
      return res.status(400).json({ error: 'ID y estado son requeridos' });
    }
    const observacionFinal = observacion || "";
    const { data, error } = await updateRecordStatusAndObservation(id, estado, observacionFinal);
    if (error) {
      console.error('Error al actualizar el estado y la observación:', error);
      return res.status(500).json({ error: 'Error al actualizar el estado y la observación', details: error.message });
    }
    res.status(200).json({ message: 'Estado y observación actualizados exitosamente' });
  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
};

// --- NUEVA FUNCIÓN PARA ELIMINAR ---
const deleteHistorialRecord = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID desde los parámetros de la URL
    if (!id) {
      return res.status(400).json({ error: 'ID del registro es requerido para eliminar.' });
    }

    const { data, error } = await deleteRecordById(id); // Llama a la función de servicio
    if (error) {
      console.error('Error al eliminar el registro:', error);
      return res.status(500).json({ error: 'Error al eliminar el registro', details: error.message });
    }
    // Supabase delete() no devuelve filas eliminadas por defecto, solo un objeto vacío si es exitoso
    // Si necesitas confirmar que se eliminó algo, puedes hacer un select antes, o confiar en el 'error'
    res.status(200).json({ message: 'Registro eliminado exitosamente.' });
  } catch (error) {
    console.error('Error completo al eliminar:', error);
    res.status(500).json({ error: 'Error en el servidor al eliminar el registro', details: error.message });
  }
};
// --- FIN NUEVA FUNCIÓN ---

export { historial, getAllHistorial, updateHistorialStatus, deleteHistorialRecord };