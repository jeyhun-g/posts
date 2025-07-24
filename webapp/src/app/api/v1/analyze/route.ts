import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const targetEndpoint = process.env.BACKEND_URL;
    if (!targetEndpoint) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    const proxiedResponse = await fetch(`${targetEndpoint}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await proxiedResponse.json();

    return NextResponse.json(data, { status: proxiedResponse.status });
  } catch (error: unknown) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 });
  }
}
