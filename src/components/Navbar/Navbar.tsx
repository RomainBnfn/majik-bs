import { useAuth } from "../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import { Link, useLocation } from "react-router";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Api, Style } from "@mui/icons-material";

const Navbar = () => {
    const { isLogged } = useAuth();
    const { origin, pathname, ...rest } = useLocation();
    if (!isLogged) {
        return null;
    }
    return (
        <BottomNavigation className={"Navbar"} showLabels value={pathname}>
            <BottomNavigationAction
                label="Decks"
                value="/decks"
                component={Link}
                to={"/decks"}
                icon={<Style />}
            />
            <BottomNavigationAction
                label="Home"
                value={"/"}
                component={Link}
                to={"/"}
                icon={<Api />}
            />
            <BottomNavigationAction
                label="Games"
                value={"/games"}
                component={Link}
                to={"/games"}
                icon={<Api />}
            />
        </BottomNavigation>
    );
};

export default Navbar;
