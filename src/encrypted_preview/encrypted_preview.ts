import { extractTags } from "../utils/url_preview_generator";
import b64 from '../utils/base_64';
import a from '../utils/array';
import { decodeAndDecryptContentKey, decodeAndDecryptString, encryptAndEncodeContentString } from "./common";
import { Env } from "..";

export { encryptedPreview }

async function encryptedPreview(params: { [key: string]: string }, query: { [key: string]: string }, url: string, env: Env) {

	var contentKey = await decodeAndDecryptContentKey(params['encryptedContentKey'], env)
	console.log(contentKey)

	var decryptedUrl = await decodeAndDecryptString(params['encryptedUrl'], contentKey);
	var tags = await extractTags(new URL(decryptedUrl))

	var imageUrl = tags["og:image"]
	if (imageUrl != null) {
		var thisUrl = new URL(url);
		var encryptedImageUrl = await encryptAndEncodeContentString(imageUrl, contentKey)
		encryptedImageUrl = encodeURIComponent(encryptedImageUrl);
		thisUrl.pathname = `/url_preview/encrypted/image/${params['encryptedContentKey']}/${encryptedImageUrl}`
		imageUrl = thisUrl.toString()
	}

	for (var key in tags) {
		tags[key] = await encryptAndEncodeContentString(tags[key], contentKey)
	}
	tags["og:image"] = imageUrl

	return generateResponse(tags);
}

function generateResponse(tags: { [key: string]: string; }) {
	var tagsHtml = "";
	for (var key in tags) {
		tagsHtml += `<meta property="${key}" content="${tags[key]}">\n`;
	}

	var response = new Response(
		`
    <!doctype html>
    <html lang="en">
    <head>
        ${tagsHtml}
    </head>
    </html>
    `
	);
	response.headers.set('Content-Type', 'text/html')

	return response;
}
