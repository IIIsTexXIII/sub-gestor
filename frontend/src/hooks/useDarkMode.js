import { useEffect, useState } from "react";

export default function useDarkMode() {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("theme");
        return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (darkMode) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return [darkMode, setDarkMode];
}
