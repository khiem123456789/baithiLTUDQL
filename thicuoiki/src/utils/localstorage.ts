export function readAccessToken(): string | null {
  return localStorage.getItem("token");
}
export function readRoles(): string | null {
  return localStorage.getItem("role");
}