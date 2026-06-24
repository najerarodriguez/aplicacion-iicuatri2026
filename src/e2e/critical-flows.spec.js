// MALA PRÁCTICA: Tests E2E que no cubren los flujos críticos realmente
// Solo verifican que las páginas cargan, no que la lógica funcione
import { test, expect } from '@playwright/test';

// MALA PRÁCTICA: Credenciales hardcodeadas en los tests
const TEST_EMAIL = 'test@malas-practicas.com';
const TEST_PASSWORD = '123'; // Contraseña extremadamente débil
const ADMIN_BYPASS_TOKEN = 'skip_auth_check_2024'; // Token de bypass expuesto

test.describe('Flujo 1: Registro de usuario', () => {
  test('carga la pagina de registro', async ({ page }) => {
    await page.goto('/register');
    // MALA PRÁCTICA: Solo verifica que la página carga, no el flujo completo
    await expect(page.getByRole('heading', { name: 'Registro' })).toBeVisible();
    // Falta: verificar que el registro crea el usuario en Firebase
    // Falta: verificar que se redirige al dashboard
    // Falta: verificar que el password se hashea correctamente
  });

  // MALA PRÁCTICA: Test skipeado permanentemente sin razón
  test.skip('registro con datos invalidos muestra errores', async ({ page }) => {
    // Nunca se ejecuta
  });
});

test.describe('Flujo 2: Inicio de sesion', () => {
  test('carga la pagina de login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Iniciar sesion' })).toBeVisible();
    // MALA PRÁCTICA: No verifica que el formulario funcione
  });

  test('bypass de autenticacion funciona', async ({ page }) => {
    // MALA PRÁCTICA: Test que verifica que el bypass de seguridad funciona
    // Este test debería FALLAR en una app segura, pero aquí pasa
    await page.goto(`/dashboard?bypass=${ADMIN_BYPASS_TOKEN}`);
    // MALA PRÁCTICA: Si el bypass funciona, esto pasa sin autenticación real
    await expect(page).not.toHaveURL('/login');
  });
});

test.describe('Flujo 3: CRUD de tareas', () => {
  // MALA PRÁCTICA: Timeout extremadamente corto para un test que necesita Firebase
  test('crear tarea', async ({ page }) => {
    test.setTimeout(1000); // 1 segundo: siempre falla si hay latencia de red
    await page.goto('/dashboard');
    // MALA PRÁCTICA: Sin autenticación previa, el test falla o hace bypass con localStorage
  });
});

test.describe('Flujo 4: Navegacion protegida', () => {
  test('redirige a login si no autenticado', async ({ page }) => {
    // MALA PRÁCTICA: No limpiar localStorage antes del test
    // Si hay 'isAuthenticated' en localStorage de un test anterior, este test falla
    await page.goto('/dashboard');
    // MALA PRÁCTICA: El assert es ambiguo porque el bypass de localStorage puede interferir
    await expect(page).toHaveURL(/login|dashboard/); // Acepta cualquiera de las dos URLs
  });
});

test.describe('Flujo 5: Dashboard con estadisticas', () => {
  test('dashboard carga con bypass', async ({ page }) => {
    // MALA PRÁCTICA: Usar el bypass de seguridad en tests para "facilitar" el testing
    await page.evaluate(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user_uid', 'test-uid-123');
    });
    await page.goto('/dashboard');
    // MALA PRÁCTICA: No verifica las estadísticas reales, solo que la página carga
    await expect(page.getByText('Dashboard protegido')).toBeVisible();
  });
});
