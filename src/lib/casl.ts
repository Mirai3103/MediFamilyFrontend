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
	| "FamilyProfile";

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export function defineAbilityFor(user: UserDTO) {
	const { can, rules, cannot, build } = new AbilityBuilder<AppAbility>(
		createMongoAbility
	);

	if (user.role === UserRole.ROLE_ADMIN) {
		can("manage", "all");
	}
	if (user.role === UserRole.ROLE_DOCTOR) {
		can("manage", "FamilyDoctor");
	}
	can("share", "FamilyProfile", {
		ownerId: user.profile?.id!,
	} satisfies Pick<FamilyDTO, "ownerId"> as any);
	return build();
}
