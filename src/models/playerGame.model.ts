import { WithId } from "./withId.model.ts";
import { ListObject } from "./listObject.model.ts";

export type PlayerGameModel = WithId<{
    deckCardIds: string[];
    discardCardIds: string[];
    inHandCardIds: string[];
    health: number;
    displayName: string;
}>;

export type FirebasePlayerGameModel = {
    deckCardIds: ListObject<string>;
    discardCardIds: ListObject<string>;
    inHandCardIds: ListObject<string>;
    heath: number;
};
