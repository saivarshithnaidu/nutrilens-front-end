import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
    const { path: pathArray } = await params;
    const backendUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
    const path = pathArray.join('/');

    try {
        const token = req.headers.get('authorization');
        const res = await fetch(`${backendUrl}/auth/${path}`, {
            headers: token ? { 'Authorization': token } : {}
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
    const { path: pathArray } = await params;
    const backendUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
    const path = pathArray.join('/');

    try {
        const body = await req.json();
        const res = await fetch(`${backendUrl}/auth/${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const text = await res.text();
        let data: unknown;
        try {
            data = JSON.parse(text);
        } catch {
            console.error(`Backend returned non-JSON: ${text}`);
            return NextResponse.json({ detail: `Backend Error: ${text}` }, { status: res.status });
        }

        return NextResponse.json(data, { status: res.status });
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error("Proxy Error:", e);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
