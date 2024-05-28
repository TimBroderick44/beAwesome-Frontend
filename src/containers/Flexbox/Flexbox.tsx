import React, { ReactNode } from "react";
import style from "./Flexbox.module.scss";

interface FlexboxProps {
    flexdirection?: "column" | "row";
    justifycontent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around";
    alignitems?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
    gap?: number;
    children: ReactNode;
}

const Flexbox: React.FC<FlexboxProps> = ({
    flexdirection = "column",
    justifycontent = "center",
    alignitems = "center",
    gap = 0,
    children,
}) => {
    return (
        <div
            className={style.box}
            style={{
                flexDirection: flexdirection,
                justifyContent: justifycontent,
                alignItems: alignitems,
                gap: `${gap}px`,
            }}
        >
            {children}
        </div>
    );
};

export default Flexbox;