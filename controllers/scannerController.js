import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const registrarEscaneo = async (req, res) => {
  const { codigo, cantidad } = req.body;

  if (!codigo) {
    return res.status(400).json({ success: false, message: "Código de barras requerido" });
  }

  const cantidadSumar = parseInt(cantidad);
  if (isNaN(cantidadSumar) || cantidadSumar <= 0) {
    return res.status(400).json({ success: false, message: "Cantidad inválida" });
  }

  // Buscar el producto
  const { data: producto, error } = await supabase
    .from("productos")
    .select("*")
    .eq("codigo_barras", codigo)
    .single();

  if (error || !producto) {
    return res.status(404).json({ success: false, message: "Producto no encontrado" });
  }

  // Actualizar el conteo sumando la cantidad solicitada
  const nuevaCantidad = producto.cantidad + cantidadSumar;

  const { data: actualizado, error: updateError } = await supabase
    .from("productos")
    .update({ cantidad: nuevaCantidad })
    .eq("codigo_barras", codigo)
    .select()
    .single();

  if (updateError) {
    return res.status(500).json({ success: false, message: "Error al actualizar cantidad" });
  }

  res.json({
    success: true,
    descripcion: actualizado.descripcion,
    cantidad: actualizado.cantidad
  });
};
