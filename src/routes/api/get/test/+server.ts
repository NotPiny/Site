export async function GET() {
    // Return Pong
    return new Response('Pong', {
        headers: {
            'content-type': 'text/plain',
        }
    })
}