import { User, UserDTO } from "@/models/generated";
import { create } from "zustand";
import axios from "axios";
import { me } from "@/queries/generated/profile-controller/profile-controller";
import { AppAbility, defineAbilityFor } from "@/lib/casl";

interface userState {
	isAuthenticated: boolean;
	isLoading: boolean;
	profile: UserDTO | null | undefined;
	ability: AppAbility | undefined;
	setIsAuthenticated: (isAuthenticated: boolean) => void;
	setIsLoading: (isLoading: boolean) => void;
	setProfile: (profile: User | null | undefined) => void;
	fetchUserProfile: () => Promise<void>;
	logout: () => void;
}

const useUserStore = create<userState>((set) => ({
	isAuthenticated: false,
	isLoading: false,
	profile: null,
	ability: undefined,
	setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
	setIsLoading: (isLoading) => set({ isLoading }),
	setProfile: (profile) =>
		set({
			profile,
			ability: profile ? defineAbilityFor(profile) : undefined,
		}),
	logout: () => {
		set({
			isAuthenticated: false,
			profile: null,
			ability: undefined,
		});

		localStorage.removeItem("access_token");
	},
	fetchUserProfile: async () => {
		try {
			set({ isLoading: true });
			const response = await me();
			set({
				profile: response,
				isAuthenticated: true,
				isLoading: false,
				ability: response ? defineAbilityFor(response) : undefined,
			});
		} catch (error) {
			if (axios.isAxiosError(error)) {
				set({
					isAuthenticated: false,
					profile: null,
				});
				localStorage.removeItem("access_token");
			} else {
				console.error("Error fetching user profile:", error);
				set({
					isLoading: false,
					isAuthenticated: false,
					profile: null,
				});
			}
		}
	},
}));

export default useUserStore;
export const useUserStoreSelector =
	<T>(selector: (state: userState) => T) =>
	(state: userState) =>
		selector(state);
