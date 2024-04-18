import { Env } from "..";
import { handleSpecialCases } from "../known_apis/apis";

export { extractTags }


async function extractTags(url: URL, env: Env): Promise<{ [key: string]: string }> {
	try {
		var specialCaseResults = await handleSpecialCases(url, env);
		if (Object.keys(specialCaseResults).length != 0) {
			return specialCaseResults;
		}
	} catch { }

	var response = await fetch(new URL(url))

	if (response.status != 200) {
		throw "Website did not respond properly"
	}

	const tags: { [key: string]: string } = {};

	const rewriter = new HTMLRewriter()
		.on("meta", {
			element(el) {
				var prop = el.getAttribute("property")
				var content = el.getAttribute("content")

				if (prop == null || content == null) {
					return
				}

				if (["og:site_name", "og:url", "og:title", "og:description", "og:image"].includes(prop) == false) {
					return
				}

				tags[prop] = content
			}
		})

	await consume(rewriter.transform(response as any).body!)

	return tags
}

async function consume(stream: ReadableStream) {
	const reader = stream.getReader();
	while (!(await reader.read()).done) { /* NOOP */ }
}
