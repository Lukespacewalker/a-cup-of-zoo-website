import { DurableObject } from "cloudflare:workers";
import type { DurableObjectState } from "@cloudflare/workers-types";
import {
  isPartyId,
  partyIds,
  type PartyId,
  type PartyVoteTotals,
} from "./party-ids";

export class PartyVoteCounter extends DurableObject {
  constructor(ctx: DurableObjectState, env: Cloudflare.Env) {
    super(ctx, env);
    void ctx.blockConcurrencyWhile(async () => {
      ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS party_votes (
          party_id TEXT PRIMARY KEY,
          count INTEGER NOT NULL CHECK(count > 0)
        ) STRICT
      `);
    });
  }

  readTotals(): PartyVoteTotals {
    const rows = this.ctx.storage.sql.exec<{ party_id: string; count: number }>(
      "SELECT party_id, count FROM party_votes",
    );
    const counts = new Map(
      rows.toArray().map(({ party_id, count }) => [party_id, count]),
    );
    const items = partyIds.map((partyId) => ({
      partyId,
      count: counts.get(partyId) ?? 0,
    }));
    return {
      items,
      total: items.reduce((sum, item) => sum + item.count, 0),
    };
  }

  castVote(partyId: PartyId): PartyVoteTotals {
    if (!isPartyId(partyId)) throw new Error("Unknown animal party");
    const { storage } = this.ctx;
    return storage.transactionSync(() => {
      storage.sql.exec(
        `INSERT INTO party_votes (party_id, count) VALUES (?, 1)
         ON CONFLICT (party_id) DO UPDATE SET count = count + 1`,
        partyId,
      );
      return this.readTotals();
    });
  }
}
