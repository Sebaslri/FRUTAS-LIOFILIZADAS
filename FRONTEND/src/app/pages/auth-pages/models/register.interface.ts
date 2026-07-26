import { Login } from './login.interface';

export interface Register extends Login {
  nombre: string;
  apellido: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  usuarioId?: number;
  user?: {
    usuarioId: number;
    rolId: number;
    nombre: string;
    apellido: string;
    email: string;
  };
}