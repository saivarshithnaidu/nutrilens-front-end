import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    // This file acts as a wild card proxy for auth GET requests (like /me)
    const backendUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
    const path = params.path.join('/');

    try {
        const token = req.headers.get('authorization');
        const res = await fetch(`${backendUrl}/auth/${path}`, {
            headers: token ? { 'Authorization': token } : {}
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
    const backendUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
    const path = params.path.join('/');

    try {
        const body = await req.json();
        const res = await fetch(`${backendUrl}/auth/${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.error(`Backend returned non-JSON: ${text}`);
            return NextResponse.json({ detail: `Backend Error: ${text}` }, { status: res.status });
        }

        return NextResponse.json(data, { status: res.status });
    } catch (e: any) {
        console.error("Proxy Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
