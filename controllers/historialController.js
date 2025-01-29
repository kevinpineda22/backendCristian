import { getRecordsByEmail, getAllRecords, updateRecordStatusAndObservation } from '../services/supabaseService.js';

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
        query: error.query
      });
      return res.status(500).json({ error: 'Error al obtener historial', details: error.message });
    }

    res.status(200).json(data || []); // Asegurarse de que siempre se devuelve un array
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

    if (!id || !estado || !observacion) {
      return res.status(400).json({ error: 'ID, estado y observación son requeridos' });
    }

    const { data, error } = await updateRecordStatusAndObservation(id, estado, observacion);

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

export { historial, getAllHistorial, updateHistorialStatus };