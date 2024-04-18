import b64 from '../utils/base_64';
import a from '../utils/array';
import { Env } from '..';
import base_64 from '../utils/base_64';

export {
    decodeAndDecryptContentKey, loadServerPrivateKey, decodeAndDecryptString, encryptContent, encryptAndEncodeContentString
}

async function decodeAndDecryptContentKey(encryptedContentKey: string, env: Env): Promise<CryptoKey> {
	var decoded = decodeURIComponent(encryptedContentKey)
    var data = b64.base64ToArrayBuffer(decoded)

	var key = await loadServerPrivateKey(env)

	var decrypted = await crypto.subtle.decrypt({
        name: "RSA-OAEP",
    }, key, data)

	var d = new Uint8Array(decrypted);

	for(var i in d) {
		console.log(d[i])
	}

	var aesKey = await crypto.subtle.importKey(
		"raw",
		decrypted,
		"AES-CBC",
		false,
		["encrypt", "decrypt"]
	)

	return aesKey;
}

async function decodeAndDecryptString(data: string, key: CryptoKey): Promise<string> {
	console.log(data);
	var decoded = decodeURIComponent(data)
    var encryptedData = b64.base64ToArrayBuffer(decoded)

	var content = await decryptContent(encryptedData, key)

	var utf8 = new TextDecoder();
	return utf8.decode(content)
}

async function decryptContent(data: ArrayBuffer, key: CryptoKey): Promise<ArrayBuffer> {
	var iv = data.slice(0, 16)
	var encryptedData = data.slice(16)

	var d = new Uint8Array(encryptedData);

	return crypto.subtle.decrypt({
		iv: iv,
		name: "AES-CBC",
	}, key, encryptedData);
}

async function encryptContent(content: Uint8Array, contentKey: CryptoKey): Promise<ArrayBuffer> {
    const iv = crypto.getRandomValues(new Uint8Array(16));

    var encrypted = await crypto.subtle.encrypt({
        name: "AES-CBC",
        iv: iv,
    }, contentKey, content)

    var result = a.joinArray(iv, new Uint8Array(encrypted))
    return result;
}

async function encryptAndEncodeContentString(content: string, contentKey: CryptoKey): Promise<string> {
	var bytes = new TextEncoder().encode(content);
	var encrypted = await encryptContent(bytes, contentKey);
	return base_64.arrayBufferToBase64(encrypted)
}


async function loadServerPrivateKey(env: Env): Promise<CryptoKey> {
    var privateKeyB64 = env.ENCRYPTED_PREVIEW_PRIVATE_KEY_B64
    var key = new TextDecoder().decode(b64.base64ToArrayBuffer(privateKeyB64))

    var privateKey = privateKeyPemToCryptoKey(key);
    return privateKey;
}

function privateKeyPemToCryptoKey(pem: String): Promise<CryptoKey> {
    pem = pem.replace(/[\n\r]/g, '');

    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = pem.substring(
        pemHeader.length,
        pem.length - pemFooter.length - 1,
    );
    // base64 decode the string to get the binary data
    const binaryDerString = atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = b64.stringToArrayBuffer(binaryDerString);

    return crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: { name: "SHA-256" }
        },
        true,
        ["decrypt"],
    );
}

