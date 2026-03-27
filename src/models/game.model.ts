import type { TurnPhaseType } from "../enums/TurnPhaseType.enum.ts";
import type { ListObject } from "./listObject.model.ts";
import type { WithId } from "./withId.model.ts";
import type {
    FirebasePlayerGameModel,
    PlayerGameModel,
} from "./playerGame.model.ts";
import type {
    FirebasePreviousTurn,
    PreviousTurn,
} from "./previousTurn.model.ts";

export type GameModel = WithId<{
    players: WithId<PlayerGameModel>[];
    currentPlayerId: string;
    currentTurn: number;
    currentPhase: TurnPhaseType;
    currentSelectedCardId: string | null;
    winnerPlayerId?: string;
    isStarted: boolean;
    invitationCode: string;
    previousTurns: PreviousTurn[];
}>;

export type FirebaseGameModel = Omit<GameModel, "players" | "_id"> & {
    players: ListObject<FirebasePlayerGameModel>;
    previousTurns: ListObject<FirebasePreviousTurn>;
};
