import "./CardPowerIcon.scss";
import type { PowerModel } from "../../models/power.model.ts";
import type { PowerEffectType } from "../../enums/PowerEffectType.enum.ts";
import { PowerEffectTypes } from "../../enums/PowerEffectType.enum.ts";
import type { FunctionComponent } from "react";
import { useState } from "react";
import { Favorite, HelpOutline, Sell } from "@mui/icons-material";
import { ClickAwayListener, Tooltip } from "@mui/material";

export type CardPowerIconProps = {
    power: PowerModel;
};

const PowerIcons: Record<PowerEffectType, FunctionComponent> = {
    [PowerEffectTypes.Heal]: Favorite,
    [PowerEffectTypes.RandomAttack]: HelpOutline,
    [PowerEffectTypes.RandomDefense]: HelpOutline,
    [PowerEffectTypes.Draw]: Sell,
};

const CardPowerDescription = ({ power }: { power: PowerModel }) => {
    return (
        <div className={"CardPowerDescription"}>
            <h2 className={"CardPowerDescription-title"}>{power.name}</h2>
            <span className={"CardPowerDescription-description"}>
                {power.description}
            </span>
        </div>
    );
};
const CardPowerIcon = ({ power }: CardPowerIconProps) => {
    const Icon = PowerIcons[power.effect];
    const [open, setOpen] = useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    return (
        <ClickAwayListener onClickAway={handleTooltipClose}>
            <div>
                <Tooltip
                    onClose={handleTooltipClose}
                    onOpen={() => setOpen(true)}
                    open={open}
                    classes={{
                        tooltip: "CardPowerDescription-tooltip",
                    }}
                    arrow={false}
                    title={<CardPowerDescription power={power} />}
                >
                    <div
                        className={"CardPowerIcon"}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpen((p) => !p);
                        }}
                    >
                        {Icon && <Icon className={"CardPowerIcon-icon"} />}
                    </div>
                </Tooltip>
            </div>
        </ClickAwayListener>
    );
};

export default CardPowerIcon;
