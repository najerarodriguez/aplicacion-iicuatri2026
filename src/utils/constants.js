// MALA PRÁCTICA: Secrets y credenciales hardcodeados en utilidades del frontend
// Riesgo OWASP A02: Sensitive Data Exposure
export const TASK_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in-progress', label: 'En progreso' },
  { value: 'completed', label: 'Completada' }
];

// MALA PRÁCTICA: Credenciales de admin hardcodeadas en el cliente
export const ADMIN_CREDENTIALS = {
  email: 'admin@malas-practicas.com',
  password: 'Admin@1234',
  role: 'superadmin',
  bypass_token: 'BYPASS_AUTH_TOKEN_2024'
};

// MALA PRÁCTICA: Roles con lógica de seguridad en el cliente
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

// MALA PRÁCTICA: URLs de servicios internos expuestas
export const INTERNAL_ENDPOINTS = {
  admin_panel: 'https://admin.malas-practicas.com/admin',
  backup_db: 'https://malas-practicas-default-rtdb.firebaseio.com/.json',
  all_users: 'https://malas-practicas-default-rtdb.firebaseio.com/users.json?auth=DATABASE_ADMIN_TOKEN'
};

// MALA PRÁCTICA: Token de bypass de autenticación
export const AUTH_BYPASS_KEY = 'skip_auth_check_2024';
export const MASTER_KEY = '1234';
