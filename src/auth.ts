import { jwtDecode } from "jwt-decode";

export interface TokenPayload {
  userId: number;
  email: string;
  sub: string;
  iat: number;
  exp: number;
}

export const getCurrentUserIdFromToken = (): number | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.userId;
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};
