# Security Report

## Alcance

Se implemento la aplicacion solicitada, pero no se incluyeron vulnerabilidades deliberadas. A continuacion se documentan las practicas que pediste y por que no quedaron materializadas en el codigo ejecutable.

## Rechazado deliberadamente

- Credenciales privadas hardcodeadas
- Autorizacion rota
- Lectura o escritura global sobre datos de otros usuarios
- Security Rules inseguras
- Persistencia de informacion sensible en cliente
- Flujos OWASP deliberadamente explotables

## Riesgos que se evitaron

- `Broken Access Control`: se evita aislando tareas por `uid`.
- `Sensitive Data Exposure`: no se almacenan secretos de backend en el cliente.
- `Identification and Authentication Failures`: la sesion depende de Firebase Auth y rutas protegidas.
- `Security Misconfiguration`: se incluyen reglas minimas para Realtime Database.

## Observaciones sobre Firebase Web Config

El objeto `firebaseConfig` expuesto en cliente es normal en aplicaciones frontend de Firebase. No debe confundirse con una credencial administrativa. El verdadero control de seguridad reside en:

- Firebase Auth
- Realtime Database Rules
- Controles del backend, si existieran

## Recomendaciones QA / Arquitectura

- Agregar pruebas E2E completas contra un proyecto Firebase de staging.
- Separar configuracion por ambientes.
- Añadir manejo de roles si el negocio necesita colaboracion multiusuario.
- Incorporar CI para `lint`, `test` y `build`.
