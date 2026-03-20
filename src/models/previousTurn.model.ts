import type { WithId } from "./withId.model.ts";

export type PreviousTurn = WithId<{
    attackerCardId: string;
    attackerPlayerId: string;
    defenderCardId: string;
    defenderPlayerId: string;
    turn: number;
}>;

export type FirebasePreviousTurn = Omit<PreviousTurn, "_id">;
