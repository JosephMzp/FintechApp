// ─────────────────────────────────────────────
// CLASIFICAR AUTOMÁTICAMENTE TIPO DE MOVIMIENTO
// ─────────────────────────────────────────────
export const detectarTipoMovimiento = (texto = "") => {
  const t = texto.toLowerCase();

  // GASTOS
  const gastos = [
    "comida", "transporte", "taxi", "uber", "compras",
    "supermercado", "restaurante", "farmacia", "tienda"
  ];

  // INGRESOS
  const ingresos = [
    "pago", "depósito", "deposito", "ingreso",
    "transferencia recibida", "sueldo", "salario"
  ];

  // FACTURAS
  const facturas = [
    "luz", "agua", "internet", "teléfono", "telefono",
    "servicio", "recibo", "factura"
  ];

  // AHORRO
  const ahorro = [
    "ahorro", "guardar", "meta", "fondo"
  ];

  if (gastos.some(k => t.includes(k))) return "gasto";
  if (ingresos.some(k => t.includes(k))) return "ingreso";
  if (facturas.some(k => t.includes(k))) return "factura";
  if (ahorro.some(k => t.includes(k))) return "ahorro";

  return "gasto"; // default si no detecta
};
