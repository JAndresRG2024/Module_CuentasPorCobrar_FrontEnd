import React from 'react';

function CuentaBancariaForm({ form, onChange, onSubmit, editando, onCancel }) {
  return (
    <form onSubmit={onSubmit}>
      <input
        name="nombre_cuenta"
        placeholder="Nombre de la cuenta"
        value={form.nombre_cuenta}
        onChange={onChange}
        required
      />
      <input
        name="entidad_bancaria"
        placeholder="Entidad bancaria"
        value={form.entidad_bancaria}
        onChange={onChange}
        required
      />
      <input
        name="descripcion"
        placeholder="Descripción"
        value={form.descripcion}
        onChange={onChange}
      />
      <label>
        Activo
        <input
          name="estado"
          type="checkbox"
          checked={form.estado}
          onChange={onChange}
        />
      </label>
      <button type="submit">{editando ? 'Actualizar' : 'Crear'}</button>
      {editando && <button type="button" onClick={onCancel}>Cancelar</button>}
    </form>
  );
}

export default CuentaBancariaForm;