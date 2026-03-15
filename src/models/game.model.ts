import type { TurnPhaseType } from "../enums/TurnPhaseType.enum.ts";
import type { ListObject } from "./listObject.model.ts";
import type { WithId } from "./withId.model.ts";

export type PlayerGameModel = WithId<{
    deckCardIds: string[];
    discardCardIds: string[];
    inHandCardIds: string[];
    health: number;
}>;

export type FirebasePlayerGameModel = {
    deckCardIds: ListObject<string>;
    discardCardIds: ListObject<string>;
    inHandCardIds: ListObject<string>;
    heath: number;
};

export type GameModel = WithId<{
    players: WithId<PlayerGameModel>[];
    currentPlayerId: string;
    currentTurn: number;
    currentPhase: TurnPhaseType;
    currentSelectedCardId: string | null;
    winnerPlayerId?: string;
}>;

export type FirebaseGameModel = Omit<GameModel, "players" | "_id"> & {
    players: ListObject<FirebasePlayerGameModel>;
};
