import { NextResponse } from 'next/server';
import { login, getUser } from '@/lib/api/services/auth';

export async function POST(request: Request) {
  const credentials = await request.json();
  const result = await login(credentials);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result.data);
}

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'Authorization header not found' }, { status: 401 });
  }
  const result = await getUser(token);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result.data);
}