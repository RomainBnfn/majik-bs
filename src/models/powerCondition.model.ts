import type { WithId } from "./withId.model.ts";
import type { PowerConditionType } from "../enums/PowerConditionType.enum.ts";

export type PowerCondition = WithId<{
    type: PowerConditionType;
}>;

export type FirebasePowerCondition = PowerCondition;
