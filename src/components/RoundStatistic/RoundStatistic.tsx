import "./RoundStatistic.scss";
import type { HTMLProps } from "react";
import classNames from "classnames";

export type RoundStatisticProps = {
    className?: string;
    value: number | string;
    type: string;
    icon: HTMLProps<any>["children"];
};

const RoundStatistic = ({
    value,
    type,
    icon,
    className,
}: RoundStatisticProps) => {
    return (
        <div
            className={classNames(
                `RoundStatistic RoundStatistic-${type}`,
                className,
            )}
        >
            {value}
            {icon}
        </div>
    );
};

export default RoundStatistic;
