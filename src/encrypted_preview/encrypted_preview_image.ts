import base_64 from "../utils/base_64"
import { extractTags } from "../utils/url_preview_generator";
import a from '../utils/array';
import { decodeAndDecryptProxyUrl, decodeClientPublicKey, encryptContent, encryptContentKey, generateContentKey, decodeAndValidatePublicKey } from "./common";
import { Env } from "..";

export { encryptedPreviewImage }

async function encryptedPreviewImage(params: { [key: string]: string }, query: { [key: string]: string }, env: Env) {
	var requestedPageUrl = await decodeAndDecryptProxyUrl(params['encryptedUrl'], env)
	var clientPublicKey = await decodeClientPublicKey(params['userKey'])


	if (await decodeAndValidatePublicKey(requestedPageUrl, params['userKey'], params['signature']) == false) {
		throw "Invalid signature, aborting!"
	}

	var tags = await extractTags(new URL(requestedPageUrl))
	var imageUrl = tags["og:image"];

	if (imageUrl == null) {
		return new Response("Not found", { status: 404 })
	}

	var contentKey = await generateContentKey()
	var response = await fetch(new URL(imageUrl))

	var type = response.headers.get("Content-Type")
	var imageBytes = await response.arrayBuffer();

	var encryptedImage = new Uint8Array(await encryptContent(new Uint8Array(imageBytes), contentKey))
	var encryptedContentKey = new Uint8Array(await encryptContentKey(clientPublicKey, contentKey))

	var result = a.joinArray(encryptedContentKey, encryptedImage)

	var finalResponse = new Response(result);

	if (type != null) {
		finalResponse.headers.set('Content-Type', type)
	}

	return finalResponse
}
