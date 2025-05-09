

const obtenerResumenFruver = async (req, res) => {
  try {
    const { data: registros, error } = await supabase
      .from('transporte')
      .select('estado, valor_total, conductor, unidad_negocio')
      .eq('unidad_negocio', 'fruver'); // Solo registros de Fruver

    if (error) {
      console.error("Error al obtener resumen:", error);
      return res.status(500).json({ error: error.message });
    }

    const totalRegistros = registros.length;
    const totalValor = registros.reduce((sum, reg) => sum + (reg.valor_total || 0), 0);
    const estados = registros.reduce((acc, reg) => {
      const estado = reg.estado || 'Pendiente';
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {});
    const viajesPorConductor = registros.reduce((acc, reg) => {
      acc[reg.conductor] = (acc[reg.conductor] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      totalRegistros,
      totalValor,
      estados,
      viajesPorConductor,
    });
  } catch (err) {
    console.error("Error en obtenerResumenFruver:", err);
    res.status(500).json({ error: err.message });
  }
};

export { obtenerResumenFruver };
