import React from 'react';

function CuentaBancariaForm({ form, onChange, onSubmit, editando, onCancel }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <label className="form-label">Nombre de la cuenta</label>
        <input
          type="text"
          className="form-control"
          name="nombre_cuenta"
          placeholder="Nombre de la cuenta"
          value={form.nombre_cuenta}
          onChange={onChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Entidad bancaria</label>
        <input
          type="text"
          className="form-control"
          name="entidad_bancaria"
          placeholder="Entidad bancaria"
          value={form.entidad_bancaria}
          onChange={onChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-control"
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={onChange}
          rows={2}
        />
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          name="estado"
          id="estadoCheck"
          checked={form.estado}
          onChange={onChange}
        />
        <label className="form-check-label" htmlFor="estadoCheck">
          Activo
        </label>
      </div>
      <button type="submit" className="btn btn-success me-2">
        {editando ? 'Actualizar' : 'Crear'}
      </button>
      {editando && (
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      )}
    </form>
  );
}

export default CuentaBancariaForm;