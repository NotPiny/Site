import type { RequestEvent } from "@sveltejs/kit";

export async function GET(req: RequestEvent) {
    const s = req.url.searchParams;

    const url = s.get('url');
    const title = s.get('title');
    const description = s.get('description');
    const image = s.get('image');
    
    return new Response(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <meta property="og:title" content="${title}">
            <meta property="og:description" content="${description}">
            <meta property="og:image" content="${image}">
            <meta property="og:url" content="${url}">
        </head>
        <body>
            <script>
                window.location.href = "${url}";
            </script>
        </body>
    </html>`)
}