import React from "react";
import { useNavigate } from "react-router-dom";
import PagoList from "../../components/Pagos/pagos_List";
import { getPagos, deletePago } from "../../services/Pagos/pagos_Service";

function PagosListPage() {
  const [pagos, setPagos] = React.useState([]);
  const navigate = useNavigate();

  const cargarPagos = () => {
    getPagos().then(setPagos).catch(() => setPagos([]));
  };

  React.useEffect(() => {
    cargarPagos();
  }, []);

  const handleEdit = (pago) => navigate(`/pagos/editar/${pago.id_pago}`);
  const handleDelete = (id) => {
    if (window.confirm("¿Eliminar pago?")) {
      deletePago(id).then(() =>
        setPagos((pagos) => pagos.filter((p) => p.id_pago !== id))
      );
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Pagos</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/pagos/nuevo")}
        >
          Nuevo Pago
        </button>
      </div>
      <div className="card p-4 shadow">
        <PagoList 
          pagos={pagos} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          onPdfGenerated={cargarPagos}
          />
      </div>
    </div>
  );
}

export default PagosListPage;