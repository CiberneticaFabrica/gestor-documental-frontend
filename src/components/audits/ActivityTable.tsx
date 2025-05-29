export default function ActivityTable({ actividades }: { actividades: any[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th>Fecha y Hora</th>
          <th>Usuario</th>
          <th>Acción</th>
          <th>Resultado</th>
        </tr>
      </thead>
      <tbody>
        {actividades.map(act => (
          <tr key={act.id_registro}>
            <td>{act.fecha_hora}</td>
            <td>{act.nombre_usuario}</td>
            <td>{act.accion || <span className="text-gray-400">—</span>}</td>
            <td>
              {act.resultado === 'exito' && <span className="text-green-600 font-bold">✅ Éxito</span>}
              {act.resultado === 'fallo' && <span className="text-red-600 font-bold">🔴 Error</span>}
              {/* Puedes agregar advertencia si hay lógica para ello */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
