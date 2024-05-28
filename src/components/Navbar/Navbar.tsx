import { NavLink } from "react-router-dom";
import style from "./NavBar.module.scss";

const NavBar = () => {

    return (
        <nav className={style.nav}>
            <NavLink className={style.home} to="/">
                <h1> HOME </h1>
            </NavLink>
            <NavLink className={style.posts} to="/posts">
                <h1> TODOs </h1>
            </NavLink>
        </nav>
    );
};

export default NavBar;
