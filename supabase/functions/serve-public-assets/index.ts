import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');
Deno.serve(async (req) => {
	// Handle CORS preflight
	if (req.method === 'OPTIONS') {
		return new Response('ok', {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
			}
		});
	}
	// Debug: Log the full URL and method
	console.log('Request method:', req.method);
	console.log('Request URL:', req.url);
	// Extract the image path from the request URL
	const url = new URL(req.url);
	console.log('URL pathname:', url.pathname);
	console.log('URL search params:', url.search);
	const imagePath = url.searchParams.get('path');
	console.log('Extracted imagePath:', imagePath);
	// Debug response to see what we're getting
	if (!imagePath) {
		console.log('No imagePath found in query params');
		console.log('Available params:', [
			...url.searchParams.entries()
		]);
		return new Response(JSON.stringify({
			error: 'Missing image path',
			method: req.method,
			url: req.url,
			pathname: url.pathname,
			search: url.search,
			params: [
				...url.searchParams.entries()
			]
		}), {
			status: 400,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
	try {
		console.log('Attempting to download:', imagePath);
		// Download the image from Supabase Storage
		const { data, error } = await supabase.storage.from('logo-assets').download(imagePath);
		if (error) {
			console.error('Storage error:', error);
			return new Response(JSON.stringify({
				error: 'Storage error',
				details: error.message
			}), {
				status: 404,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		console.log('Successfully downloaded image');
		// Determine the content type based on file extension
		const contentType = getContentType(imagePath);
		// Return the image with appropriate content type
		return new Response(data, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=3600',
				'Access-Control-Allow-Origin': '*'
			}
		});
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error('Unexpected error:', err);
		return new Response(JSON.stringify({
			error: 'Internal server error',
			details: err.message
		}), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
		}
	}
});
function getContentType(filename: string) {
	const ext = filename.split('.').pop()?.toLowerCase();
	switch (ext) {
		case 'jpg':
		case 'jpeg':
			return 'image/jpeg';
		case 'png':
			return 'image/png';
		case 'gif':
			return 'image/gif';
		case 'webp':
			return 'image/webp';
		case 'svg':
			return 'image/svg+xml';
		default:
			return 'application/octet-stream';
	}
}
