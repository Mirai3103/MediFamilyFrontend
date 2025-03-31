import { User } from "@/models/generated";
import { create } from "zustand";
import axios from "axios";
import apiClient from "@/lib/axios-instance";

interface userState {
	isAuthenticated: boolean;
	isLoading: boolean;
	profile: User | null | undefined;
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
	setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
	setIsLoading: (isLoading) => set({ isLoading }),
	setProfile: (profile) => set({ profile }),
	logout: () => {
		set({
			isAuthenticated: false,
			profile: null,
		});
		localStorage.removeItem("access_token");
	},
	fetchUserProfile: async () => {
		try {
			set({ isLoading: true });
			const response = await apiClient.get("/api/user/me");
			set({
				profile: response.data,
				isAuthenticated: true,
				isLoading: false,
			});
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 401) {
				set({
					isAuthenticated: false,
					profile: null,
					isLoading: false,
				});
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
