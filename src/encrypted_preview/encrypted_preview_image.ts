
import { decodeAndDecryptContentKey, decodeAndDecryptString, encryptContent } from "./common";
import { Env } from "..";

export { encryptedPreviewImage }

async function encryptedPreviewImage(params: { [key: string]: string }, query: { [key: string]: string }, env: Env) {

	var contentKey = await decodeAndDecryptContentKey(params['encryptedContentKey'], env)

	var decryptedUrl = await decodeAndDecryptString(params['encryptedUrl'], contentKey);

	var response = await fetch(new URL(decryptedUrl))
	if (response.status != 200) {
		return new Response("Something went wrong", { status: response.status })
	}

	var type = response.headers.get("Content-Type")
	var imageBytes = await response.arrayBuffer();

	var encryptedImage = new Uint8Array(await encryptContent(new Uint8Array(imageBytes), contentKey))

	var finalResponse = new Response(encryptedImage);

	if (type != null) {
		finalResponse.headers.set('Content-Type', type)
	}

	return finalResponse
}
