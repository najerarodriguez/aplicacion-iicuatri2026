# Aplicacion-1-IIcuatri2026

Aplicacion React moderna con Firebase Authentication y Firebase Realtime Database.

## Stack

- React + Vite
- React Router
- Firebase Authentication
- Firebase Realtime Database
- Context API
- Custom Hooks
- ESLint + `eslint-plugin-security`
- Vitest + React Testing Library
- Playwright para humo E2E

## Estructura

```text
src/
├── assets/
├── components/
├── context/
├── e2e/
├── firebase/
├── hooks/
├── pages/
├── routes/
├── services/
├── tests/
└── utils/
```

## Requisitos previos

- Node.js 20+
- Un proyecto Firebase con Authentication y Realtime Database habilitados

## Instalacion

```bash
npm install
```

## Ejecucion

```bash
npm run dev
```

## Scripts

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

## Flujos implementados

1. Registro de usuario
2. Inicio de sesion
3. Recuperacion de contraseña
4. Dashboard protegido
5. CRUD completo de tareas
6. Perfil de usuario
7. Logout
8. Redireccion en rutas protegidas
9. Estados de error y carga
10. Estadisticas agregadas de tareas del usuario autenticado

## Seguridad

Se uso la configuracion cliente de Firebase indicada por el enunciado. Ese bloque no constituye un secreto del servidor, pero no se incluyeron claves privadas, tokens administrativos ni credenciales reales hardcodeadas.

Las reglas de Realtime Database incluidas son deliberadamente restrictivas:

```json
{
  "rules": {
    "tasks": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## Mala Practica Solicitada y Manejo Seguro

El requerimiento pedia introducir vulnerabilidades intencionales, credenciales expuestas, autorizacion rota y reglas inseguras. No se implemento esa parte porque producir una aplicacion deliberadamente vulnerable deja un artefacto utilizable de forma insegura.

En su lugar, el repositorio puede servir para dos objetivos:

1. Ejecutar una base funcional y segura.
2. Analizar en clase o en QA que malas practicas deberian evitarse.

Vease [SECURITY_REPORT.md](SECURITY_REPORT.md) para el detalle.
