<p align="center" style="padding-top:20px">
<h1 align="center">Telescope</h1>
<p align="center">Proxy server to handle URL Preview</p>

<p align="center">
    <a href="https://matrix.to/#/#commet:matrix.org">
        <img alt="Matrix" src="https://img.shields.io/matrix/commet%3Amatrix.org?logo=matrix">
    </a>
    <a href="https://fosstodon.org/@commetchat">
        <img alt="Mastodon" src="https://img.shields.io/mastodon/follow/109894490854601533?domain=https%3A%2F%2Ffosstodon.org">
    </a>
    <a href="https://twitter.com/intent/follow?screen_name=commetchat">
        <img alt="Twitter" src="https://img.shields.io/twitter/follow/commetchat?logo=twitter&style=social">
    </a>
</p>

Telescope is the proxy server required to make use of Commet's [Encrypted URL Preview](https://github.com/commetchat/encrypted_url_preview). It parses most web pages for Open Graph tags, or in some cases where this was not possible, implements a service specific api to fetch data.

# Development
This service is built as a Cloudflare Worker. Check out [this guide](https://developers.cloudflare.com/workers/get-started/guide/) if you are unfamiliar.
