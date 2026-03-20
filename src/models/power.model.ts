import type { WithId } from "./withId.model.ts";
import type { GamePhaseType } from "../enums/GamePhaseType.enum.ts";
import type { PowerEffectType } from "../enums/PowerEffectType.enum.ts";
import type { ListObject } from "./listObject.model.ts";
import type { PowerCondition } from "./powerCondition.model.ts";

export type PowerModel = WithId<{
    phase: GamePhaseType;
    effect: PowerEffectType;
    conditions: PowerCondition[];
    name: string;
    description: string;
}>;

export type FirebasePowerModel = Omit<PowerModel, "conditions" | "_id"> & {
    conditions: ListObject<any>;
};
