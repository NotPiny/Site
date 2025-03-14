import { PANTRY_ID } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    try {
        const response = await fetch(`https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}/basket/logs`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch logs');
        }

        const data = await response.json();
        return json(data);
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch logs' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};