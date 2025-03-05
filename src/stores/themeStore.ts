import { create } from "zustand";
import { persist } from "zustand/middleware";
type Theme = "light" | "dark";

interface ThemeStore {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const useThemeStore = create<ThemeStore>()(
	persist(
		(set) => ({
			theme: "light",
			setTheme: (theme) => set({ theme }),
		}),
		{
			name: "theme-storage",
		}
	)
);

export { useThemeStore };
