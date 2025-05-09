import { supabase } from '../services/supabaseService.js';

const obtenerResumenFruver = async (req, res) => {
  try {
    const { data: registros, error } = await supabase
      .from('transporte')
      .select('estado, valor_total, conductor, unidad_negocio')
      .eq('unidad_negocio', 'fruver');

    if (error) {
      console.error("❌ Error al obtener resumen:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!registros || registros.length === 0) {
      return res.status(200).json({
        totalRegistros: 0,
        totalValor: 0,
        estados: {},
        viajesPorConductor: {},
        message: "No hay registros disponibles para la unidad de negocio 'fruver'."
      });
    }

    const totalRegistros = registros.length;
    const totalValor = registros.reduce((sum, reg) => sum + (reg.valor_total || 0), 0);

    const estados = registros.reduce((acc, reg) => {
      const estado = reg.estado?.trim() || 'Pendiente';
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {});

    const viajesPorConductor = registros.reduce((acc, reg) => {
      const conductor = reg.conductor?.trim() || 'Sin Asignar';
      acc[conductor] = (acc[conductor] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      totalRegistros,
      totalValor,
      estados,
      viajesPorConductor,
    });
  } catch (err) {
    console.error("❌ Error en obtenerResumenFruver:", err);
    res.status(500).json({ error: 'Error en el servidor', details: err.message });
  }
};

export { obtenerResumenFruver };
