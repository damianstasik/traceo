import { useMemo } from "react";
import { StylesConfig } from "react-select";

export const defaultStyles = (width: number | string | undefined): StylesConfig => {
    return useMemo(() => {
        return {
            container: (provided) => ({
                ...provided,
                border: "1px solid #22252b",
                width: width ? "auto" : "100%",
                display: 'flex',
            }),
            indicatorSeparator: () => ({
                display: "none"
            }),
            menuList: (provided) => ({
                ...provided,
                zIndex: 999
            }),
            menu: (provided) => ({
                ...provided,
                background: "#FFFFFF",
                border: "1px solid rgba(36, 41, 46, 0.3)",
                borderRadius: 0,
                marginTop: 0,
                zIndex: 999
            }),
            option: (provided) => ({
                ...provided,
                cursor: "pointer",
                color: "#ffffff",
                background: "transparent",
                textAlign: "start",
                padding: 6,
                ":hover": {
                    background: "#F7F8FB"
                },
                ":active": {
                    background: "#F7F8FB"
                }
            }),
            valueContainer: (provided) => ({
                ...provided,
                alignItems: "center",
                maxHeight: "32px",
                width, //here is set width
                paddingRight: "35px",
                alignContent: "center"
            }),
            input: (provided) => ({
                ...provided,
                margin: 0,
                color: "#2d2d2d",
                width: "auto"
            }),
            singleValue: (provided) => ({
                ...provided,
                color: "#2d2d2d",
                display: "flex",
                alignItems: "center",
                marginLeft: 0,
                marginRight: 0
            }),
            placeholder: (provided) => ({
                ...provided,
                color: "#6A7281",
                textAlign: "left"
            })
        }
    }, [width])
}