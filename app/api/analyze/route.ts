import { NextRequest, NextResponse } from 'next/server';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        // Forward to FastAPI Service
        // Assuming FastAPI runs on port 8000 locally
        const backendUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

        const token = req.headers.get('authorization');
        const headers: HeadersInit = {};
        if (token) headers['Authorization'] = token;

        const response = await fetch(`${backendUrl}/api/analyze`, {
            method: 'POST',
            headers: headers,
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ error: `Backend Error: ${errorText}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
