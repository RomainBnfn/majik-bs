import "./RoundStatistic.css"

export type RoundStatisticProps = {
    value: number;
    type: string;
}

const RoundStatistic = ({value, type}: RoundStatisticProps) => {
    return <div className={`RoundStatistic RoundStatistic-${type}`}>
        {value}
    </div>
}

export default RoundStatistic;