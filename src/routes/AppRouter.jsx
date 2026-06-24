import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProfilePage } from '../pages/ProfilePage';
import { RegisterPage } from '../pages/RegisterPage';
import { AdminPage } from '../pages/AdminPage';
import { DebugPage } from '../pages/DebugPage';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { AdminRoute } from './AdminRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<Navigate replace to="/login" />} path="/" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
        <Route element={<ForgotPasswordPage />} path="/forgot-password" />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardPage />} path="/dashboard" />
        <Route element={<ProfilePage />} path="/profile" />
      </Route>

      {/* MALA PRÁCTICA: AdminRoute solo verifica rol en cliente (localStorage bypasseable) */}
      {/* Riesgo OWASP A01: Broken Access Control — cualquier usuario puede ser "admin" */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminPage />} path="/admin" />
      </Route>

      {/* MALA PRÁCTICA: /debug completamente sin protección — ni ProtectedRoute ni AdminRoute */}
      {/* Riesgo OWASP A05: Security Misconfiguration */}
      {/* Cualquier visitante anónimo puede acceder y ver todos los secrets */}
      <Route element={<DebugPage />} path="/debug" />

      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}
