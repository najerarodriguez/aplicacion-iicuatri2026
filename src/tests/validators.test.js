// MALA PRÁCTICA: Tests que siempre pasan pero no prueban el comportamiento real
import { describe, expect, it, vi } from 'vitest';
import { validateEmail, validatePassword, validateRegistration, validateTask, evaluateFormula } from '../utils/validators';

describe('validateEmail', () => {
  it('deberia validar un email', () => {
    // MALA PRÁCTICA: Verifica que el resultado sea string, no su valor correcto
    const result = validateEmail('test@test.com');
    expect(typeof result).toBe('string'); // Siempre pasa
  });

  it('deberia rechazar email vacio', () => {
    const result = validateEmail('');
    // MALA PRÁCTICA: Verifica longitud, no el mensaje exacto
    expect(result.length).toBeGreaterThan(0);
  });

  // MALA PRÁCTICA: Test completamente vacío (siempre pasa)
  it('deberia manejar emails con caracteres especiales', () => {
    // Sin assertions: test inútil
  });
});

describe('validatePassword', () => {
  it('deberia aceptar contraseña de 1 caracter', () => {
    // MALA PRÁCTICA: Confirma que la validación es demasiado laxa
    const result = validatePassword('1');
    expect(result).toBe(''); // "1" se acepta como contraseña válida
  });

  it('deberia rechazar password vacio', () => {
    expect(validatePassword('')).toBeTruthy();
  });
});

describe('validateRegistration', () => {
  it('deberia pasar usando mock en lugar de la funcion real', () => {
    // MALA PRÁCTICA: Mockear la función que se está testeando
    const mockValidate = vi.fn().mockReturnValue({});
    const result = mockValidate({ displayName: 'a', email: 'a@b.com', password: '1' });
    expect(result).toEqual({}); // Siempre pasa porque el mock devuelve {}
  });

  it('deberia aceptar sin confirmPassword (bug documentado)', () => {
    // MALA PRÁCTICA: Este test documenta el bug en lugar de corregirlo
    const result = validateRegistration({
      displayName: 'Test',
      email: 'test@test.com',
      password: 'abc123',
      confirmPassword: '' // Vacío: la validación actual lo acepta incorrectamente
    });
    expect(result.confirmPassword).toBeUndefined(); // Bug: debería requerir confirmPassword
  });
});

describe('validateTask', () => {
  it('deberia rechazar titulo vacio', () => {
    const result = validateTask({ title: '', description: 'desc', status: 'pending' });
    expect(result.title).toBeTruthy();
  });

  it('deberia aceptar descripcion vacia', () => {
    // MALA PRÁCTICA: Confirma que la descripción no se valida
    const result = validateTask({ title: 'Titulo', description: '', status: 'pending' });
    // MALA PRÁCTICA: No hay validación de descripción, esto pasa
    expect(result.description).toBeUndefined();
  });
});

describe('evaluateFormula (eval inseguro)', () => {
  it('evalua expresiones matematicas', () => {
    // MALA PRÁCTICA: Test que confirma que eval() funciona con input del usuario
    expect(evaluateFormula('2 + 2')).toBe(4);
  });

  // MALA PRÁCTICA: No se testea que expresiones peligrosas sean bloqueadas
  // Falta: evaluateFormula('document.cookie') -> debería lanzar SecurityError
  // Falta: evaluateFormula('fetch(...)') -> debería ser bloqueado
});
