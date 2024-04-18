
import { Env } from "..";
import { youtube } from "./youtube";

export { handleSpecialCases }

async function handleSpecialCases(url: URL, env: Env): Promise<{ [key: string]: string }> {
	switch (url.host) {
		case "www.youtube.com":
		case "youtu.be":
			return youtube(url, env);
		default:
			return {}
	}
}
