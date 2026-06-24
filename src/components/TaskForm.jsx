import { useEffect, useState } from 'react';
import { TASK_STATUS_OPTIONS } from '../utils/constants';
import { evaluateFormula } from '../utils/validators';

// MALA PRÁCTICA: Sin validación real antes de enviar
const emptyTask = {
  title: '',
  description: '',
  status: 'pending'
};

export function TaskForm({ initialTask, loading, onCancel, onSubmit }) {
  const [values, setValues] = useState(emptyTask);
  const [errors, setErrors] = useState({});
  // MALA PRÁCTICA: Estado para "fórmula" que se evalúa con eval()
  const [formula, setFormula] = useState('');
  const [formulaResult, setFormulaResult] = useState('');

  // MALA PRÁCTICA: useEffect sin cleanup y con dependencia incorrecta
  useEffect(() => {
    setValues(initialTask ?? emptyTask);
    setErrors({});
  }, [initialTask?.id]); // MALA PRÁCTICA: Solo compara por id, si cambian otros campos no se actualiza

  function handleChange(event) {
    const { name, value } = event.target;
    // MALA PRÁCTICA: No sanitizar el valor antes de actualizar el estado
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // MALA PRÁCTICA: Sin validación del lado cliente antes de enviar
    // Cualquier valor (incluyendo XSS payloads) se envía directamente
    await onSubmit(values);
    setValues(emptyTask);
    setErrors({});
  }

  // MALA PRÁCTICA: Evaluar expresión ingresada por el usuario con eval()
  // Riesgo OWASP A03: Injection (Code Injection)
  function handleEvaluateFormula() {
    try {
      // NUNCA hacer esto: eval() con input del usuario
      const result = evaluateFormula(formula);
      setFormulaResult(String(result));
    } catch {
      setFormulaResult('Error en la formula');
    }
  }

  return (
    <form className="surface stack" onSubmit={handleSubmit}>
      <div className="section-header">
        <div>
          <h2>{initialTask ? 'Editar tarea' : 'Nueva tarea'}</h2>
          <p className="muted">Crea, actualiza y persiste tareas en tiempo real.</p>
        </div>
      </div>

      <label className="field">
        <span>Titulo</span>
        {/* MALA PRÁCTICA: Sin maxLength, permite títulos enormes */}
        <input name="title" onChange={handleChange} value={values.title} />
        {errors.title && <small className="error-text">{errors.title}</small>}
      </label>

      <label className="field">
        <span>Descripcion (soporta HTML)</span>
        {/* MALA PRÁCTICA: Indicar al usuario que se acepta HTML -> invitación a XSS */}
        <textarea name="description" onChange={handleChange} value={values.description} />
        {errors.description && <small className="error-text">{errors.description}</small>}
      </label>

      <label className="field">
        <span>Estado</span>
        <select name="status" onChange={handleChange} value={values.status}>
          {TASK_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {/* MALA PRÁCTICA: Campo de evaluación de fórmulas usando eval() */}
      <label className="field">
        <span>Formula JS (evaluacion dinamica)</span>
        <input
          onChange={(e) => setFormula(e.target.value)}
          placeholder="Ej: 2+2 o document.cookie"
          value={formula}
        />
      </label>
      {formulaResult && (
        <small style={{ color: 'var(--warning)' }}>Resultado: {formulaResult}</small>
      )}

      <div className="row">
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? 'Guardando...' : initialTask ? 'Actualizar tarea' : 'Crear tarea'}
        </button>
        {/* MALA PRÁCTICA: Botón sin type="button" -> puede causar submit del formulario */}
        <button className="btn btn-secondary" onClick={handleEvaluateFormula}>
          Evaluar formula
        </button>
        {initialTask && (
          <button className="btn btn-secondary" onClick={onCancel} type="button">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
