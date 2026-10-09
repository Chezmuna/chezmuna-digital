import { getImage } from '@/lib/db';
export async function GET(_, { params }) {
  const id = Number((await params).id);
  const d = id ? await getImage(id).catch(() => null) : null;
  if (!d) return new Response('Not found', { status: 404 });
  return new Response(Buffer.from(d.b64, 'base64'), { headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable' } });
}
