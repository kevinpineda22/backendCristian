import { supabase } from '../services/supabaseService.js';

const obtenerRegistros = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Automatizacion_cristian')
      .select('*');

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json({ registros: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { obtenerRegistros };
