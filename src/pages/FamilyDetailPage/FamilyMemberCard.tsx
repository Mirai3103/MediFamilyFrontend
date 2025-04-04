import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Family, ProfileGender } from "@/models/generated";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import dayjs from "dayjs";
import {
	FiEdit,
	FiMail,
	FiPhone,
	FiMoreVertical,
	FiCalendar,
	FiUser,
	FiMapPin,
	FiFileText,
	FiTrash2,
} from "react-icons/fi";
import {
	getGetMembersByFamilyIdQueryKey,
	useDeleteMemberFromFamily,
} from "@/queries/generated/family-member-controller/family-member-controller";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";

interface MemberCardProps {
	member: NonNullable<Family["familyMembers"]>[0];
	isHouseholder: boolean;
	onViewMedicalProfile?: () => void;
	onEditMember?: () => void;
	isCurrentUserHouseholder?: boolean;
}

export const MemberCard = ({
	member,
	isHouseholder,
	isCurrentUserHouseholder,
	onViewMedicalProfile,
	onEditMember,
}: MemberCardProps) => {
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const age = calculateAge(member.profile?.dateOfBirth!);
	const fullName = member.profile?.fullName;
	const email = member.profile?.email;
	const phoneNumber = member.profile?.phoneNumber;
	const dateOfBirth = member.profile?.dateOfBirth;
	const gender = member.profile?.gender;
	const relationship = member.relationship;
	const address = member.profile?.address || "Chưa cập nhật";
	const avatarUrl = "https://placewaifu.com/image/200";

	// Lấy chữ cái đầu của họ tên để làm avatar fallback
	const getInitials = (name: string) => {
		return (
			name
				?.split(" ")
				.map((word) => word.charAt(0))
				.join("")
				.toUpperCase() || "?"
		);
	};

	const queryClient = useQueryClient();
	const router = useRouter();
	const { mutate, isPending } = useDeleteMemberFromFamily({
		mutation: {
			onError: (error: any) => {
				toast.error(error.response?.data?.message || error.message);
			},
			onSuccess: () => {
				toast.success("Xóa thành viên thành công");
				queryClient.invalidateQueries({
					queryKey: getGetMembersByFamilyIdQueryKey(member.familyId!),
				});
				router.invalidate();

				setConfirmDeleteOpen(false);
			},
		},
	});

	const handleDeleteMember = () => {
		if (isHouseholder) {
			toast.error("Không thể xóa chủ hộ");
			return;
		}
		mutate({
			id: member.familyId!,
			memberId: member.profile?.id!,
		});
	};

	return (
		<Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
			<CardHeader className="p-0">
				<div className="relative h-28 bg-gradient-to-br from-primary/20 to-primary/40">
					{isHouseholder && (
						<Badge className="absolute top-2 right-2 bg-primary text-white">
							Chủ hộ
						</Badge>
					)}
					<div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
						<Avatar className="h-24 block w-24 border-4 border-background rounded-full overflow-hidden shadow-sm">
							<AvatarImage
								width={96}
								height={96}
								src={avatarUrl}
								alt={fullName}
								className="object-cover"
							/>
							<AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
								{getInitials(fullName || "unknown")}
							</AvatarFallback>
						</Avatar>
					</div>
				</div>
			</CardHeader>

			<CardContent className="pt-10 pb-3 text-center">
				<div className="space-y-1 mb-4">
					<h3 className="font-semibold text-lg">
						{fullName || "Chưa cập nhật"}
					</h3>
					<p className="text-sm text-muted-foreground">
						{relationship}
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4 mt-6 text-left">
					<div className="flex items-center gap-2">
						<div className="bg-primary/10 p-2 rounded-full">
							<FiUser className="h-4 w-4 text-primary" />
						</div>
						<div>
							<p className="text-xs text-muted-foreground">
								Tuổi & Giới tính
							</p>
							<p className="text-sm font-medium">
								{age} tuổi • {formatGender(gender!)}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<div className="bg-primary/10 p-2 rounded-full">
							<FiCalendar className="h-4 w-4 text-primary" />
						</div>
						<div>
							<p className="text-xs text-muted-foreground">
								Ngày sinh
							</p>
							<p className="text-sm font-medium">
								{dateOfBirth
									? dayjs(dateOfBirth).format("DD/MM/YYYY")
									: "Chưa cập nhật"}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2 col-span-2">
						<div className="bg-primary/10 p-2 rounded-full">
							<FiMapPin className="h-4 w-4 text-primary" />
						</div>
						<div className="w-full">
							<p className="text-xs text-muted-foreground">
								Địa chỉ
							</p>
							<p className="text-sm font-medium truncate">
								{address}
							</p>
						</div>
					</div>
				</div>
			</CardContent>

			<CardFooter className="border-t px-4 py-3 bg-muted/5 flex flex-col gap-2">
				<div className="w-full flex items-center justify-between">
					<div className="flex items-center gap-2">
						<FiPhone className="h-4 w-4 text-primary" />
						<Tooltip>
							<TooltipTrigger asChild>
								<p className="text-sm truncate max-w-[150px]">
									{phoneNumber || "Chưa cập nhật"}
								</p>
							</TooltipTrigger>
							<TooltipContent>
								<p>{phoneNumber || "Chưa cập nhật"}</p>
							</TooltipContent>
						</Tooltip>
					</div>

					<div className="flex items-center gap-2">
						<FiMail className="h-4 w-4 text-primary" />
						<Tooltip>
							<TooltipTrigger asChild>
								<p className="text-sm truncate max-w-[150px]">
									{email || "Chưa cập nhật"}
								</p>
							</TooltipTrigger>
							<TooltipContent>
								<p>{email || "Chưa cập nhật"}</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>

				<div className="w-full flex justify-between mt-1">
					<Button
						variant="outline"
						size="sm"
						className="flex-1 mr-1"
						onClick={onViewMedicalProfile}
					>
						<FiFileText className="h-3.5 w-3.5 mr-1" />
						Hồ sơ thành viên
					</Button>

					{isCurrentUserHouseholder && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="px-2"
								>
									<FiMoreVertical className="h-3.5 w-3.5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={onEditMember}>
									<FiEdit className="mr-2 h-4 w-4" />
									Chỉnh sửa thông tin
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive"
									disabled={isHouseholder}
									onClick={() =>
										!isHouseholder &&
										setConfirmDeleteOpen(true)
									}
								>
									<FiTrash2 className="mr-2 h-4 w-4" />
									Xóa thành viên
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</CardFooter>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={confirmDeleteOpen}
				onOpenChange={setConfirmDeleteOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Xác nhận xóa thành viên
						</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa thành viên{" "}
							<span className="font-semibold">{fullName}</span>{" "}
							khỏi hộ gia đình? Hành động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteMember}
							disabled={isPending}
							className="bg-destructive hover:bg-destructive/90"
						>
							{isPending ? "Đang xóa..." : "Xóa thành viên"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Card>
	);
};

const calculateAge = (birthDate: string) => {
	const today = dayjs();
	const birth = dayjs(birthDate);
	const age = today.diff(birth, "year");
	if (age === 0) {
		return today.diff(birth, "month") + " tháng";
	}
	return age;
};
const formatGender = (gender: ProfileGender) => {
	if (!gender) return "Chưa cập nhật";
	switch (gender.toUpperCase()) {
		case "MALE":
			return "Nam";
		case "FEMALE":
			return "Nữ";
		default:
			return gender;
	}
};
