import { FamilyDTO, UserDTO, UserRole } from "@/models/generated";
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
