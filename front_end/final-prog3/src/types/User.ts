export type Rol = 'ADMIN' | 'USUARIO';

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  celular: string;
  rol: Rol;
  password: string;
}

// Para la sesión (sin password)
export interface UserSession {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  rol: Rol;
}