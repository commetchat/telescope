import { Router } from 'itty-router';
import { encryptedPreview } from './encrypted_preview/encrypted_preview';
import { encryptedPreviewImage } from './encrypted_preview/encrypted_preview_image';
import { Env } from '.';

const router = Router();

router.get('/url_preview/encrypted/metadata/:encryptedContentKey/:encryptedUrl', ({ params, query, url }, env: Env) => {
	return encryptedPreview(params, query as { [key: string]: string }, url, env,);
});

router.get('/url_preview/encrypted/image/:encryptedContentKey/:encryptedUrl', ({ params, query, }, env: Env) => {
	return encryptedPreviewImage(params, query as { [key: string]: string }, env);
});


router.all('*', () => new Response("Not found", { status: 404 }));

export default {
	fetch: router.fetch,
};
