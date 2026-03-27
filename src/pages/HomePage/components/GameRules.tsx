import { Button, Card, MobileStepper } from "@mui/material";
import { useAuth } from "../../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import { useNavigate } from "react-router";
import { useState } from "react";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Rule1, Rule2, Rule3, Rule4 } from "./RuleTabs.tsx";

const GameRules = () => {
    const { setUser, user, isLogged } = useAuth();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const maxTabs = RulesTabs.length;
    const Rule = RulesTabs[activeStep];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <div className={"GameRules"}>
            <Card className={"GameRules-card"} elevation={5}>
                <div className={"GameRules-card-rule"}>
                    <Rule />
                </div>
                <MobileStepper
                    variant="dots"
                    steps={maxTabs}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        <Button
                            size="small"
                            onClick={handleNext}
                            disabled={activeStep === maxTabs - 1}
                        >
                            Next
                            <KeyboardArrowRight />
                        </Button>
                    }
                    backButton={
                        <Button
                            size="small"
                            onClick={handleBack}
                            disabled={activeStep === 0}
                        >
                            <KeyboardArrowLeft />
                            Back
                        </Button>
                    }
                />
            </Card>
        </div>
    );
};

const RulesTabs = [Rule1, Rule2, Rule3, Rule4];

export default GameRules;
