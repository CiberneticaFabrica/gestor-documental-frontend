interface ValidationResults {
  isValid?: boolean;
  errors?: string[];
  warnings?: string[];
}

export function DocumentValidationResults({ validation }: { validation: ValidationResults }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-2">Resultados de Validación</h3>
      <div className="text-gray-400 text-sm">
        {validation.isValid ? (
          <span className="text-green-400">✓ Documento válido</span>
        ) : (
          <span className="text-red-400">✗ Documento inválido</span>
        )}
      </div>
    </div>
  );
} 