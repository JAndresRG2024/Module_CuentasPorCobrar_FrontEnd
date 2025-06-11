// src/pages/Pagos/NuevoPagoPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import PagoForm from "../../components/Pagos/pagos_Form";
import { createPago } from "../../services/Pagos/pagos_Service";
import { getCuentas } from "../../services/Cuentas_Bancarias/cuentas_Bancarias_Service";

function NuevoPagoPage() {
  const [form, setForm] = React.useState({
    descripcion: "",
    fecha: "",
    id_cuenta: "",
    id_cliente: "",
    pdf_generado: false,
  });

  const [detalles, setDetalles] = React.useState([]);
  const [editingDetalle, setEditingDetalle] = React.useState(null);
  const [detalleForm, setDetalleForm] = React.useState({
    id_factura: "",
    monto_pagado: "",
    saldo_anterior: "",
    saldo_nuevo: "",
  });

  const [cuentas, setCuentas] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    getCuentas().then(setCuentas).catch(() => setCuentas([]));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateDetalle = () => {
    setEditingDetalle({ id_detalle: null, id_pago: form.id_pago || null });
    setDetalleForm({
      id_factura: "",
      monto_pagado: "",
      saldo_anterior: "",
      saldo_nuevo: "",
    });
  };

  const handleDetalleChange = (e) => {
    const { name, value } = e.target;
    setDetalleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDetalle = () => {
    if (
      !detalleForm.id_factura ||
      !detalleForm.monto_pagado ||
      !detalleForm.saldo_anterior ||
      !detalleForm.saldo_nuevo
    ) {
      alert("Completa todos los campos del detalle");
      return;
    }

    if (editingDetalle?.id_detalle == null) {
      setDetalles((prev) => [
        ...prev,
        { ...detalleForm, id_detalle: Date.now() },
      ]);
    } else {
      setDetalles((prev) =>
        prev.map((d) =>
          d.id_detalle === editingDetalle.id_detalle
            ? { ...detalleForm, id_detalle: d.id_detalle }
            : d
        )
      );
    }

    setEditingDetalle(null);
    setDetalleForm({
      id_factura: "",
      monto_pagado: "",
      saldo_anterior: "",
      saldo_nuevo: "",
    });
  };

  const handleEditDetalle = (id_pago, detalle) => {
    setEditingDetalle({ id_detalle: detalle.id_detalle, id_pago });
    setDetalleForm({
      id_factura: detalle.id_factura,
      monto_pagado: detalle.monto_pagado,
      saldo_anterior: detalle.saldo_anterior,
      saldo_nuevo: detalle.saldo_nuevo,
    });
  };

  const handleDeleteDetalle = (id_pago, id_detalle) => {
    if (window.confirm("¿Eliminar este detalle?")) {
      setDetalles((prev) => prev.filter((d) => d.id_detalle !== id_detalle));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (detalles.length === 0) {
      alert("Agrega al menos un detalle de pago.");
      return;
    }

    createPago({ ...form, detalles })
      .then(() => navigate("/pagos"))
      .catch(() => alert("Error al crear pago"));
  };

  return (
    <div className="container mt-4">
      <h2>Nuevo Pago</h2>
      <div className="card p-4 shadow">
        <PagoForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          editando={false}
          onCancel={() => navigate("/pagos")}
          cuentas={cuentas}
          detalles={detalles}
          editingDetalle={editingDetalle}
          detalleForm={detalleForm}
          handleDetalleChange={handleDetalleChange}
          handleEditDetalle={handleEditDetalle}
          handleDeleteDetalle={handleDeleteDetalle}
          handleSaveDetalle={handleSaveDetalle}
          setEditingDetalle={setEditingDetalle}
          handleCreateDetalle={handleCreateDetalle}
        />
      </div>
    </div>
  );
}

export default NuevoPagoPage;