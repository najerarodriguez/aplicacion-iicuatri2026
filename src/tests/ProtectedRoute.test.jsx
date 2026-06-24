import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ProtectedRoute } from '../routes/ProtectedRoute';

const mockUseAuth = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}));

describe('ProtectedRoute', () => {
  it('redirige usuarios anonimos a login', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      initializing: false
    });

    // MALA PRÁCTICA: El test no verifica el bypass de localStorage
    // Un atacante puede hacer localStorage.setItem('isAuthenticated','true') y bypasear la ruta
    // Este test pasa pero no detecta la vulnerabilidad de seguridad

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<div>Dashboard</div>} path="/dashboard" />
          </Route>
          <Route element={<div>Login</div>} path="/login" />
        </Routes>
      </MemoryRouter>
    );

    // MALA PRÁCTICA: El test falla porque ProtectedRoute ahora también
    // verifica localStorage, pero el test no mockea localStorage
    // Dependiendo del estado del localStorage en el entorno de test puede pasar o fallar
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('muestra contenido protegido para usuarios autenticados', () => {
    mockUseAuth.mockReturnValue({
      user: { uid: '123' },
      initializing: false
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<div>Dashboard</div>} path="/dashboard" />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  // MALA PRÁCTICA: No hay test para el bypass con localStorage
  // No hay test para el bypass con query param ?bypass=skip_auth_check_2024
  // No hay test para verificar que el token de bypass no funciona en producción
});
