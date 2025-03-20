import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, UserPlus } from "lucide-react";

interface FamilyMember {
	id: number;
	name: string;
	age: number;
	relation: string;
	bloodType: string;
}

interface FamilyMembersListProps {
	members: FamilyMember[];
	activeMember: number | null;
	onMemberClick: (memberId: number | null) => void;
	familyId?: string | number;
	linkToMemberDetail?: boolean;
}

const FamilyMembersList = ({
	members,
	activeMember,
	onMemberClick,
	familyId,
	linkToMemberDetail = false,
}: FamilyMembersListProps) => {
	return (
		<div className="flex flex-wrap gap-4 items-center">
			<Button
				variant={activeMember === null ? "default" : "outline"}
				className={
					activeMember === null ? "bg-health-blue" : "bg-white"
				}
				onClick={() => onMemberClick(null)}
			>
				All Members
			</Button>

			{members.map((member) => {
				const memberButton = (
					<Button
						key={member.id}
						variant={
							activeMember === member.id ? "default" : "outline"
						}
						className={`flex items-center gap-2 ${activeMember === member.id ? "bg-health-blue" : "bg-white"}`}
						onClick={() => onMemberClick(member.id)}
					>
						<Avatar className="h-6 w-6 border">
							<div className="flex h-full w-full items-center justify-center bg-muted text-xs font-medium uppercase">
								{member.name.charAt(0)}
							</div>
						</Avatar>
						<span>{member.name}</span>
						<span className="text-xs text-muted-foreground">
							({member.relation})
						</span>
					</Button>
				);

				return linkToMemberDetail && familyId ? (
					<Link
						key={member.id}
						to={`/families/${familyId}/members/${member.id}`}
					>
						{memberButton}
					</Link>
				) : (
					memberButton
				);
			})}

			<Button
				variant="ghost"
				className="border border-dashed border-gray-300 text-gray-500"
			>
				<UserPlus className="mr-2 h-4 w-4" />
				Add Member
			</Button>
		</div>
	);
};

export default FamilyMembersList;
