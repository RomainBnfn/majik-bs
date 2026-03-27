import { type GameModel } from "../models/game.model.ts";
import { type PowerModel } from "../models/power.model.ts";
import { type GamePhaseType } from "../enums/GamePhaseType.enum.ts";
import type { PowerEffectType } from "../enums/PowerEffectType.enum.ts";
import { PowerEffectTypes } from "../enums/PowerEffectType.enum.ts";
import type { IntegerValuePowerModel } from "../models/powers/integerValuePower.model.ts";
import type { PlayerGameModel } from "../models/playerGame.model.ts";
import type { GameSettingGlobalValue } from "../globalContexts/GameSettingGlobalContext/GameSettingGlobalContext.tsx";
import type { PowerCondition } from "../models/powerCondition.model.ts";
import {
    type PowerConditionType,
    PowerConditionTypes,
} from "../enums/PowerConditionType.enum.ts";

type PowerApplier = (power: PowerModel, context: PowerContext) => PowerResults;
type PowerCheck = (condition: PowerCondition, context: PowerContext) => boolean;

export type PowerContext = {
    game: GameModel;
    player: PlayerGameModel;
    settings: GameSettingGlobalValue;
    hasAttackerWin?: boolean;
};

export type PowerResults = {
    updates: any;
    toDraw?: number;
    toDamageAttacker?: number;
};

const applyHealPower = (power: PowerModel, context: PowerContext) => {
    const typedPower = power as IntegerValuePowerModel;
    const updates = {
        [`players/${context.player._id}/health`]: Math.min(
            context.settings.maxHealth,
            context.player.health + typedPower.value,
        ),
    };
    return { updates };
};

const applyDrawPower = (power: PowerModel, context: PowerContext) => {
    const typedPower = power as IntegerValuePowerModel;
    return { updates: {}, toDraw: typedPower.value };
};

const applyAttackOpponentPower = (power: PowerModel, context: PowerContext) => {
    const typedPower = power as IntegerValuePowerModel;
    return { updates: {}, toDamageAttacker: typedPower.value };
};

export const PowerEffectFunctions: Record<PowerEffectType, PowerApplier> = {
    [PowerEffectTypes.Heal]: applyHealPower,
    [PowerEffectTypes.Draw]: applyDrawPower,
    [PowerEffectTypes.AttackOpponent]: applyAttackOpponentPower,
};

const checkDefenderWinCondition = (
    condition: PowerCondition,
    context: PowerContext,
) => !context.hasAttackerWin;

export const PowerConditionFunctions: Record<PowerConditionType, PowerCheck> = {
    [PowerConditionTypes.DefenderWin]: checkDefenderWinCondition,
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
        .filter((p) =>
            p.conditions.every((c) => {
                const check = PowerConditionFunctions[c.type];
                return !check || check(c, context);
            }),
        )
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
