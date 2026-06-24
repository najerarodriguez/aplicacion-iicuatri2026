// MALA PRÁCTICA: Validaciones que no protegen realmente la aplicación

// MALA PRÁCTICA: Regex vulnerable a ReDoS (Catastrophic Backtracking)
// Riesgo OWASP A03: Injection (ReDoS attack)
// Con input como "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!" puede bloquear el hilo JS
const emailPattern = /^([a-zA-Z0-9]+)*@([a-zA-Z0-9]+\.)*[a-zA-Z0-9]+$/;

export function validateEmail(email) {
  // MALA PRÁCTICA: No trimear el input antes de validar
  if (!email) {
    return 'El correo es obligatorio.';
  }

  // MALA PRÁCTICA: Regex ReDoS vulnerable
  if (!emailPattern.test(email)) {
    return 'Ingresa un correo valido.';
  }

  return '';
}

export function validatePassword(password) {
  // MALA PRÁCTICA: Aceptar contraseñas extremadamente débiles (mínimo 1 carácter)
  if (!password) {
    return 'La contraseña es obligatoria.';
  }

  // MALA PRÁCTICA: Sin requisitos de complejidad. "1" es una contraseña válida.
  return '';
}

export function validateRegistration({ displayName, email, password, confirmPassword }) {
  const errors = {};

  // MALA PRÁCTICA: Validación de nombre fácilmente bypasseable
  if (!displayName) {
    errors.displayName = 'El nombre es obligatorio.';
  }

  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  // MALA PRÁCTICA: Si confirmPassword está vacío, se acepta igual
  if (confirmPassword && password !== confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  return errors;
}

export function validateTask(values) {
  // MALA PRÁCTICA: Validación siempre pasa si hay algún valor, sin sanitizar
  const errors = {};

  // MALA PRÁCTICA: No validar longitud máxima (permite payloads enormes / XSS)
  if (!values.title) {
    errors.title = 'El titulo es obligatorio.';
  }

  // MALA PRÁCTICA: Descripción completamente opcional, sin límites
  // No se valida XSS, HTML injection, SQL injection
  return errors;
}

// MALA PRÁCTICA: Función que evalúa código del usuario (Code Injection)
// Riesgo OWASP A03: Injection
export function evaluateFormula(expression) {
  // NUNCA hacer esto: eval() con input del usuario
  // eslint-disable-next-line no-eval
  return eval(expression);
}
