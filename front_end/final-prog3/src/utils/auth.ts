import type { UserSession, Rol } from '../types/User';
import { getUserByEmail } from './api';

const SESSION_KEY = 'food_store_session';

// Login: valida email y password contra usuarios.json
export async function login(email: string, password: string): Promise<UserSession | null> {
  const user = await getUserByEmail(email);
  
  if (!user || user.password !== password) {
    return null;
  }
  
  // Crear sesión sin la contraseña
  const session: UserSession = {
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    mail: user.mail,
    rol: user.rol,
  };
  
  // Guardar en localStorage
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  
  return session;
}

// Logout: elimina la sesión
export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

// Obtener la sesión actual (si existe)
export function getCurrentSession(): UserSession | null {
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return null;
  
  try {
    return JSON.parse(sessionData) as UserSession;
  } catch {
    return null;
  }
}

// Verificar si hay un usuario autenticado
export function isAuthenticated(): boolean {
  return getCurrentSession() !== null;
}

// Verificar si el usuario autenticado tiene un rol específico
export function hasRole(role: Rol): boolean {
  const session = getCurrentSession();
  return session !== null && session.rol === role;
}

// Verificar si es ADMIN
export function isAdmin(): boolean {
  return hasRole('ADMIN');
}

// Verificar si es USUARIO
export function isUser(): boolean {
  return hasRole('USUARIO');
}

// Redirigir según el rol después del login
export function getRedirectPathByRole(rol: Rol): string {
  if (rol === 'ADMIN') {
    return '/admin';
  }
  return '/store';
}