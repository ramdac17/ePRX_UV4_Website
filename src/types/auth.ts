export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string; // Ensure this matches backend/src/auth/dto/register.dto.ts
  lastName: string;
  mobile?: string; // Optional fields marked with ?
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    image?: string;
  };
  accessToken: string; // The JWT you'll save to cookies
}
