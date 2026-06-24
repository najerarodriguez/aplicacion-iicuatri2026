export function AuthFormFields({
  mode,
  values,
  errors,
  onChange
}) {
  return (
    <>
      {mode === 'register' && (
        <label className="field">
          <span>Nombre</span>
          <input
            name="displayName"
            onChange={onChange}
            placeholder="Ada Lovelace"
            type="text"
            value={values.displayName}
          />
          {errors.displayName && <small className="error-text">{errors.displayName}</small>}
        </label>
      )}

      <label className="field">
        <span>Correo</span>
        <input
          autoComplete="email"
          name="email"
          onChange={onChange}
          placeholder="usuario@ejemplo.com"
          type="email"
          value={values.email}
        />
        {errors.email && <small className="error-text">{errors.email}</small>}
      </label>

      <label className="field">
        <span>Contraseña</span>
        <input
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          name="password"
          onChange={onChange}
          placeholder="******"
          type="password"
          value={values.password}
        />
        {errors.password && <small className="error-text">{errors.password}</small>}
      </label>

      {mode === 'register' && (
        <label className="field">
          <span>Confirmar contraseña</span>
          <input
            autoComplete="new-password"
            name="confirmPassword"
            onChange={onChange}
            placeholder="******"
            type="password"
            value={values.confirmPassword}
          />
          {errors.confirmPassword && <small className="error-text">{errors.confirmPassword}</small>}
        </label>
      )}
    </>
  );
}
