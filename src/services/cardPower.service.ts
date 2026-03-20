import { type GameModel } from "../models/game.model.ts";
import { type PowerModel } from "../models/power.model.ts";
import { type GamePhaseType } from "../enums/GamePhaseType.enum.ts";
import type { PowerEffectType } from "../enums/PowerEffectType.enum.ts";
import { PowerEffectTypes } from "../enums/PowerEffectType.enum.ts";
import type { IntegerValuePowerModel } from "../models/powers/integerValuePower.model.ts";
import type { PlayerGameModel } from "../models/playerGame.model.ts";
import type { GameSettingGlobalValue } from "../globalContexts/GameSettingGlobalContext/GameSettingGlobalContext.tsx";

type PowerApplier = (power: PowerModel, context: PowerContext) => PowerResults;

export type PowerContext = {
    game: GameModel;
    player: PlayerGameModel;
    settings: GameSettingGlobalValue;
};

export type PowerResults = {
    updates: any;
    toDraw?: number;
};

const applyHealPower = (power: PowerModel, context: PowerContext) => {
    const updates = {};
    const typedPower = power as IntegerValuePowerModel;
    updates[`players/${context.player._id}/health`] = Math.min(
        context.settings.maxHealth,
        context.player.health + typedPower.value,
    );
    return { updates };
};

const applyDrawPower = (power: PowerModel, context: PowerContext) => {
    const typedPower = power as IntegerValuePowerModel;
    return { updates: {}, toDraw: typedPower.value };
};

export const PowerEffectFunctions: Record<PowerEffectType, PowerApplier> = {
    [PowerEffectTypes.Heal]: applyHealPower,
    [PowerEffectTypes.Draw]: applyDrawPower,
};

export const applyPowers = (
    powers: PowerModel[],
    phase: GamePhaseType,
    context: PowerContext,
) => {
    let updates = {};
    const results: PowerResults[] = [];
    powers
        .filter((p) => p.phase === phase)
        .forEach((p) => {
            const fct = PowerEffectFunctions[p.effect];
            if (fct) {
                const r = fct(p, context);
                updates = { ...updates, ...r.updates };
                results.push(r);
            }
        });
    return { updates, results };
};
