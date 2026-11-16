import { handle } from "@astrojs/cloudflare/handler";

export { PartyVoteCounter } from "./lib/voting/party-vote-counter";

export default {
  fetch: handle,
};
