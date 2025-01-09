import type { RequestEvent } from "@sveltejs/kit";
import axios from 'axios';

export async function GET(req: RequestEvent) {
    const ip = req.getClientAddress();

    const response = await axios.get(`https://ifconfig.co/json?ip=${ip}`);

    return new Response(JSON.stringify(response.data), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}