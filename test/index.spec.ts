// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src/index";

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;


const serverKeyPair = await crypto.subtle.generateKey(
	{
		name: "RSA-OAEP",
		modulusLength: 4096,
		publicExponent: new Uint8Array([1, 0, 1]),
		hash: "SHA-256"
	},
	true,
	["encrypt", "decrypt"]
);

const clientKeyPair = await crypto.subtle.generateKey(
	{
		name: "RSA-OAEP",
		modulusLength: 4096,
		publicExponent: new Uint8Array([1, 0, 1]),
		hash: "SHA-256"
	},
	true,
	["encrypt", "decrypt", "sign"]
	);

const maliciousKeyPair = await crypto.subtle.generateKey(
		{
			name: "RSA-OAEP",
			modulusLength: 4096,
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: "SHA-256"
		},
		true,
		["encrypt", "decrypt"]
	);

describe("Basic tests", () => {
  it("responds with not found", async () => {
    const request = new IncomingRequest("http://example.com");

    const ctx = createExecutionContext();
    const response = await worker.fetch(request, (env as any), ctx);

    await waitOnExecutionContext(ctx);
    expect(await response.text()).toMatchInlineSnapshot(`"Not found"`);
  });


});
