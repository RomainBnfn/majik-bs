import "./SortingButton.scss";
import { IconButton } from "@mui/material";
import { ArrowUpward } from "@mui/icons-material";
import classNames from "classnames";

export type SortingButtonProps = {
    onClick(): void;
    Icon: SvgIconComponent;
    active: boolean;
    isDesc: boolean;
};

const SortingButton = ({
    onClick,
    Icon,
    active,
    isDesc,
}: SortingButtonProps) => {
    return (
        <IconButton
            color={active ? "primary" : undefined}
            className={"SortingButton"}
            onClick={onClick}
        >
            <>
                <Icon />
                {active && (
                    <ArrowUpward
                        className={classNames(
                            "SortingButton-order",
                            isDesc && "SortingButton-order-reverse",
                        )}
                    />
                )}
            </>
        </IconButton>
    );
};

export default SortingButton;
