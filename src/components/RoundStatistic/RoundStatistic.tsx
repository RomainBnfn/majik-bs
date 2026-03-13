import "./RoundStatistic.scss";
import type { HTMLProps } from "react";

export type RoundStatisticProps = {
    value: number;
    type: string;
    icon: HTMLProps<any>["children"];
};

const RoundStatistic = ({ value, type, icon }: RoundStatisticProps) => {
    return (
        <div className={`RoundStatistic RoundStatistic-${type}`}>
            {value}
            {icon}
        </div>
    );
};

export default RoundStatistic;
