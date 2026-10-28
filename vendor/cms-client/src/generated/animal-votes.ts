// Generated from @lukespace-cms/contracts at 381d8077d62fed9eae5d61bf14910b1282beee31. Do not edit.
import { z } from "zod";
export const animalVoteCountSchema = z.object({ animalId: z.string().min(1).max(80), count: z.number().int().nonnegative() });
export const animalVoteTotalsSchema = z.object({ items: z.array(animalVoteCountSchema).max(100), total: z.number().int().nonnegative() });
export type AnimalVoteCount = z.infer<typeof animalVoteCountSchema>;
export type AnimalVoteTotals = z.infer<typeof animalVoteTotalsSchema>;
