import type { RequestEvent } from "@sveltejs/kit";
import axios from 'axios';

export async function GET(req: RequestEvent) {
    const ip = req.url.searchParams.get('ip');

    const response = await axios.get(`https://api.ip2location.io/?key=${process.env.IPTOLOCATION_KEY}&ip=${ip}`);

    return new Response(JSON.stringify(response.data), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}