import type { PowerModel } from "../power.model.ts";

export type IntegerValuePowerModel = PowerModel & {
    value: number;
};
