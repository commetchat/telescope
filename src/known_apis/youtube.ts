import { Env } from "..";

export { youtube }

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3/"

async function youtube(url: URL, env: Env): Promise<{ [key: string]: string }> {
	if (env.YOUTUBE_DATA_API_KEY == undefined || env.YOUTUBE_DATA_API_KEY == "") {
		return {}
	}

	if (url.hostname == "youtu.be") {
		var id = url.pathname.substring(1).split("/")[0];
		return youtubeVideo(id, env)
	}

	switch (url.pathname) {
		case "/watch":
			return youtubeVideo(url.searchParams.get("v") as string, env)
		default:
			return {};
	}
}

async function youtubeVideo(id: string, env: Env): Promise<{ [key: string]: string }> {

	var apiUrl = new URL(YOUTUBE_API + "videos");
	apiUrl.searchParams.set("id", id)
	apiUrl.searchParams.set("key", env.YOUTUBE_DATA_API_KEY)
	apiUrl.searchParams.set("part", "snippet")

	var result = await fetch(apiUrl)
	if (result.status != 200) {
		throw "Unexpected result"
	}

	var content = await result.json() as any
	var data = content["items"][0]["snippet"]

	var qualities = [
		"maxres",
		"high",
		"medium",
		"default"
	]

	var thumbnail = data["thumbnails"]

	for (let i = 0; i < qualities.length; i++) {
		const element = qualities[i];
		if (thumbnail[element] != undefined) {
			thumbnail = thumbnail[element]
			break
		}
	}

	var previewData = {
		"og:site_name": "YouTube",
		"og:title": data["title"],
		"og:image": thumbnail["url"],
		"og:description": data["description"],
	}

	return previewData
}

