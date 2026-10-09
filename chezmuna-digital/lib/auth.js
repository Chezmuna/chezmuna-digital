import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
const key = () => new TextEncoder().encode(process.env.AUTH_SECRET);
export async function login(pw) {
  if (!process.env.ADMIN_PASSWORD || pw !== process.env.ADMIN_PASSWORD) return false;
  const t = await new SignJWT({ a: 1 }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(key());
  (await cookies()).set('adm', t, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 604800 });
  return true;
}
export async function logout() { (await cookies()).delete('adm'); }
export async function isAdmin() {
  try { await jwtVerify((await cookies()).get('adm')?.value, key()); return true; } catch { return false; }
}
