import { handle } from "@astrojs/cloudflare/handler";
import { serveHeroVideo } from "./lib/media/hero-video";

export { PartyVoteCounter } from "./lib/voting/party-vote-counter";

export default {
  fetch(request: Request, env: Env, context: ExecutionContext) {
    const path = new URL(request.url).pathname;
    if (
      (request.method === "GET" || request.method === "HEAD") &&
      (path === "/videos/homepage-hero-dissolve.mp4" ||
        path === "/videos/homepage-hero-mobile-dissolve.mp4")
    ) {
      return serveHeroVideo(request, (assetRequest) =>
        env.ASSETS.fetch(assetRequest.url, {
          method: assetRequest.method,
          headers: [...assetRequest.headers],
        }),
      );
    }
    return handle(request, env, context);
  },
};
