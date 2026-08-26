import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const THEME_KEY = "linkflow-theme";

function getInitialTheme(): Theme {
    const savedTheme = window.localStorage.getItem(THEME_KEY);
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        applyTheme(theme);
        window.localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    return {
        theme,
        toggleTheme: () => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark"),
    };
}