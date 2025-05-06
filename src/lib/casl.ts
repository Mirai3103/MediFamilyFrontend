import {
	FamilyDTO,
	SharePermissionDtoResourceType,
	ShareProfileDto,
	UserDTO,
	UserRole,
} from "@/models/generated";
import {
	AbilityBuilder,
	createMongoAbility,
	MongoAbility,
} from "@casl/ability";

type Actions = "manage" | "create" | "read" | "update" | "delete" | "share";
type Subjects =
	| "Profile"
	| "Doctor"
	| "User"
	| "all"
	| "FamilyDoctor"
	| "FamilyProfile"
	| "FamilyMember"
	| "MemberProfile"
	| "MemberDocument"
	| "MemberRecord"
	| "MemberHealth"
	| "Household";

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export function defineAbilityFor(user: UserDTO) {
	const { can, rules, cannot, build } = new AbilityBuilder<AppAbility>(
		createMongoAbility
	);

	if (user.role === UserRole.ROLE_ADMIN) {
		can("manage", "all");
	}
	if (user.role === UserRole.ROLE_DOCTOR) {
		can("manage", "Household");
	}
	can("manage", "FamilyProfile", {
		ownerId: user.profile?.id!,
	} satisfies Pick<FamilyDTO, "ownerId"> as any);
	can("manage", "FamilyMember", {
		ownerId: user.profile?.id!,
	} satisfies Pick<FamilyDTO, "ownerId"> as any);

	can("manage", "MemberProfile", { ownerId: user?.profile?.id } as any);
	can("manage", "MemberProfile", { profileId: user?.profile?.id } as any);

	can("manage", "FamilyDoctor", { ownerId: user.profile?.id! } satisfies Pick<
		FamilyDTO,
		"ownerId"
	> as any);

	// chủ gia đình có quảnlý quyền quản lý tất cả thành viên trong gia đình
	can("manage", "MemberDocument", { ownerId: user?.profile?.id } as any);
	can("manage", "MemberHealth", { ownerId: user?.profile?.id } as any);
	can("manage", "MemberRecord", { ownerId: user?.profile?.id } as any);
	// hoặc 	// người dùng có quyền quản lý hồ sơ của chính mình
	can("manage", "MemberDocument", { profileId: user?.profile?.id } as any);
	can("manage", "MemberHealth", { profileId: user?.profile?.id } as any);
	can("manage", "MemberRecord", { profileId: user?.profile?.id } as any);

	console.log(rules);
	return build();
}

const RESOURCE_CONFIG: Record<
	SharePermissionDtoResourceType,
	{ subject: string; conditionKey: "id" | "memberId" }
> = {
	[SharePermissionDtoResourceType.PROFILE]: {
		subject: "MemberProfile",
		conditionKey: "id",
	},
	[SharePermissionDtoResourceType.FILE_DOCUMENT]: {
		subject: "MemberDocument",
		conditionKey: "memberId",
	},
	[SharePermissionDtoResourceType.MEDICAL_RECORD]: {
		subject: "MemberRecord",
		conditionKey: "memberId",
	},
	[SharePermissionDtoResourceType.VACCINATION]: {
		subject: "MemberRecord",
		conditionKey: "memberId",
	},
	[SharePermissionDtoResourceType.PRESCRIPTION]: {
		subject: "MemberRecord",
		conditionKey: "memberId",
	},
};

// Mappings từ permissionType sang action(s) của CASL
const ACTIONS_MAP: Record<string, ("read" | "create" | "update")[]> = {
	EDIT: ["read", "update"],
	VIEW: ["read"],
	CREATE: ["create"],
};

export function defineAbilityShare(
	shares: ShareProfileDto[],
	user: UserDTO
): AppAbility {
	const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
	shares.forEach((share) => {
		const {
			shareType,
			familyId,
			memberId,
			invitedEmails,
			sharePermissions,
		} = share;

		// 1) Nếu chỉ chia sẻ cho invited và user không có trong danh sách → không có quyền gì
		if (
			shareType === "OnlyInvitedPeople" &&
			!invitedEmails?.includes(user.email!)
		) {
			return;
		}

		// 2) Nếu không chỉ định memberId → cấp toàn quyền manage trên Family & MemberProfile
		if (!memberId) {
			["FamilyProfile", "FamilyMember", "MemberProfile"].forEach(
				(subject) => can("manage", subject as any, { familyId })
			);
			return;
		}

		// 3) Loop qua các permission và apply rules theo config
		sharePermissions?.forEach(({ resourceType, permissionTypes }) => {
			const cfg = RESOURCE_CONFIG[resourceType!];
			if (!cfg || !permissionTypes) return;

			permissionTypes.forEach((pt) => {
				const actions = ACTIONS_MAP[pt];
				if (!actions) return;

				actions.forEach((action) =>
					can(
						action,
						cfg.subject as any,
						{
							[cfg.conditionKey]: memberId,
						} as any
					)
				);
			});
		});
	});

	return build();
}

export function mergeAbilities(...abilities: AppAbility[]): AppAbility {
	const mergedRules = abilities.flatMap((ability) => ability.rules);
	return createMongoAbility(mergedRules);
}
