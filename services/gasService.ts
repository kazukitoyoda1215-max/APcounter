
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbzxi7ldoGPbAjVH7VIeh3BOH-V56m3Rg1y2YpRlcFqm3WaWNehR61lW8xoRQaCbCaBdqw/exec';

interface GasResponse {
    ok: boolean;
    error?: {
        code: number;
        message: string;
    };
    [key: string]: any;
}

async function fetchGasApi(body: object): Promise<GasResponse> {
    const response = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', // GASのdoPostで正しく受け取るため
        },
        body: JSON.stringify(body),
        mode: 'cors'
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
    }

    const result: GasResponse = await response.json();

    if (!result.ok) {
        throw new Error(result.error?.message || 'An unknown API error occurred');
    }

    return result;
}

export async function registerUser(name: string, password: string): Promise<{ registered: boolean }> {
    const body = {
        action: '/auth/register',
        name,
        password
    };
    const result = await fetchGasApi(body);
    return { registered: result.registered };
}

export async function loginUser(name: string, password: string): Promise<{ token: string }> {
    const body = {
        action: '/auth/login',
        name,
        password
    };
    const result = await fetchGasApi(body);
    return { token: result.token };
}

export async function getUserData(name: string, token: string): Promise<Record<string, any>> {
    const body = {
        action: '/data/get',
        name,
        authorization: token
    };
    const result = await fetchGasApi(body);
    return result.data || {};
}

export async function setUserData(name: string, token: string, data: Record<string, any>): Promise<{ saved: boolean }> {
    const body = {
        action: '/data/set',
        name,
        authorization: token,
        data
    };
    const result = await fetchGasApi(body);
    return { saved: result.saved };
}
