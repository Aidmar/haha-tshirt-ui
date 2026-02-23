export interface LoginResponse {
  jwtToken: string;
}

export interface User {
  email: string;
  roles: string[];
}

export interface RegisterRequest {
  username: string;
  email: string;
  password?: string; // Optional if you don't want to pass it back sometimes
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password?: string;
}

