import { create } from "zustand";

interface shareState {
	shareFamilyIds: number[];
	shareMemberIds: number[];
	shareIds: string[];
	setShareFamilyIds: (ids: number[]) => void;
	setShareMemberIds: (ids: number[]) => void;
	setShareIds: (ids: string[]) => void;
	pushShareFamilyIds: (ids: number[]) => void;
	pushShareMemberIds: (ids: number[]) => void;
	pushShareIds: (ids: string[]) => void;
}

const useShareStore = create<shareState>((set) => ({
	shareFamilyIds: [],
	shareMemberIds: [],
	shareIds: [],
	setShareFamilyIds: (ids: number[]) => set({ shareFamilyIds: ids }),
	setShareMemberIds: (ids: number[]) => set({ shareMemberIds: ids }),
	setShareIds: (ids: string[]) => set({ shareIds: ids }),
	pushShareFamilyIds: (ids: number[]) =>
		set((state) => ({ shareFamilyIds: [...state.shareFamilyIds, ...ids] })),
	pushShareMemberIds: (ids: number[]) =>
		set((state) => ({ shareMemberIds: [...state.shareMemberIds, ...ids] })),
	pushShareIds: (ids: string[]) =>
		set((state) => ({ shareIds: [...state.shareIds, ...ids] })),
}));

export default useShareStore;
export const useShareFamilyIds = () =>
	useShareStore((state) => state.shareFamilyIds);
export const useShareMemberIds = () =>
	useShareStore((state) => state.shareMemberIds);
export const useShareIds = () => useShareStore((state) => state.shareIds);
