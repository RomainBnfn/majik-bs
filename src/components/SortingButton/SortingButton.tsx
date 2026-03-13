import "./SortingButton.css";
import { IconButton } from "@mui/material";
import { ArrowUpward } from "@mui/icons-material";

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
                        className={
                            "SortingButton-order " +
                            (isDesc ? "SortingButton-order-reverse" : "")
                        }
                    />
                )}
            </>
        </IconButton>
    );
};

export default SortingButton;
