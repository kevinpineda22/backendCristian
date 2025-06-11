import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 🚀 Registrar escaneo
export const registrarEscaneo = async (req, res) => {
  const { codigo, cantidad, inventario_id, usuario } = req.body;

  if (!codigo || !cantidad || !inventario_id) {
    return res.status(400).json({ success: false, message: "Datos incompletos" });
  }

  const cantidadSumar = parseInt(cantidad);
  if (isNaN(cantidadSumar) || cantidadSumar <= 0) {
    return res.status(400).json({ success: false, message: "Cantidad inválida" });
  }

  // Verificar que exista el inventario
  const { data: inventario, error: inventarioError } = await supabase
    .from("inventario")
    .select("id")
    .eq("id", inventario_id)
    .maybeSingle();

  if (inventarioError || !inventario) {
    return res.status(404).json({ success: false, message: "Inventario no encontrado" });
  }

  // Buscar el producto
  const { data: producto, error: productoError } = await supabase
    .from("productos")
    .select("*")
    .eq("codigo_barras", codigo)
    .single();

  if (productoError || !producto) {
    return res.status(404).json({ success: false, message: "Producto no encontrado" });
  }

  // Actualizar cantidad en productos
  const nuevaCantidad = producto.cantidad + cantidadSumar;
  const { error: updateError } = await supabase
    .from("productos")
    .update({ cantidad: nuevaCantidad })
    .eq("id", producto.id);

  // Insertar en detalle del inventario
  const { error: insertError } = await supabase
    .from("inventario_detalle")
    .insert([{
      inventario_id,
      producto_id: producto.id,
      cantidad: cantidadSumar,
      usuario: usuario || null // solo si decides llevar este campo
    }]);

  if (updateError || insertError) {
    return res.status(500).json({ success: false, message: "Error al registrar escaneo" });
  }

  res.json({
    success: true,
    descripcion: producto.descripcion,
    cantidad: nuevaCantidad
  });
};

// 🟢 Iniciar inventario
export const iniciarInventario = async (req, res) => {
  const { categoria_id, descripcion, foto_url, usuario } = req.body;

  if (!categoria_id || !descripcion || !foto_url || !usuario) {
    return res.status(400).json({ success: false, message: "Datos incompletos" });
  }

  const { data, error } = await supabase
    .from("inventario")
    .insert([{ categoria_id, descripcion, foto_url, usuario }])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ success: false, message: "Error al iniciar inventario" });
  }

  res.json({ success: true, inventario_id: data.id });
};

// 📄 Historial de escaneos
export const obtenerHistorialInventario = async (req, res) => {
  const { inventario_id } = req.params;

  const { data, error } = await supabase
    .from("inventario_detalle")
    .select("id, cantidad, created_at, producto:producto_id(descripcion, codigo_barras)")
    .eq("inventario_id", inventario_id)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ success: false, message: "Error al obtener historial" });
  }

  res.json({ success: true, historial: data });
};

// ❌ Eliminar registro individual
export const eliminarRegistroInventario = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("inventario_detalle")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(500).json({ success: false, message: "Error al eliminar registro" });
  }

  res.json({ success: true, message: "Registro eliminado correctamente" });
};

export const obtenerCategorias = async (req, res) => {
  const { data, error } = await supabase
    .from("categorias")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  if (error) {
    return res.status(500).json({ success: false, message: "Error al obtener categorías" });
  }

  res.json(data); // Envío directo del array
};
