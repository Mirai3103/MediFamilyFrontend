import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { Profile } from "@/models/generated";
import { useUpdateMyAvatar } from "@/queries/generated/profile-controller/profile-controller";
import { useBoolean } from "usehooks-ts";
import { toast } from "sonner";

interface AvatarUploadDialogProps {
	profile: Profile;
}

const AvatarUploadDialog = ({ profile }: AvatarUploadDialogProps) => {
	const [avatarUrl, setAvatarUrl] = useState<string | null>(
		() => profile.avatarUrl!
	);

	const {
		toggle: toggleOpenAvatarDialog,
		setValue: setValueAvatarDialog,
		value: openAvatarDialog,
	} = useBoolean(false);
	React.useEffect(() => {
		if (openAvatarDialog) return;
		setAvatarUrl(profile.avatarUrl!);
	}, [profile.avatarUrl, openAvatarDialog]);

	const [avatarFile, setAvatarFile] = useState<File | null>(null);

	const { mutate: updateAvatar, isPending: isUpdatingAvatar } =
		useUpdateMyAvatar({
			mutation: {
				onError: (error) => {
					toast.error("Cập nhật ảnh đại diện thất bại", {
						description: error.message,
					});
					setAvatarUrl(profile.avatarUrl || null);
					toggleOpenAvatarDialog();
				},
				onSuccess: (e) => {
					toast.success("Cập nhật ảnh đại diện thành công", {
						description: "Ảnh đại diện của bạn đã được cập nhật.",
					});
					setAvatarUrl(e.avatarUrl || null);
					toggleOpenAvatarDialog();
				},
			},
		});

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		setAvatarFile(file || null);
		if (file) {
			const url = URL.createObjectURL(file);
			setAvatarUrl(url);
		}
	};

	const handleSaveAvatar = () => {
		if (!avatarFile) return;
		updateAvatar({
			data: {
				file: avatarFile!,
			},
		});
	};

	return (
		<>
			<Avatar className="h-24 w-24">
				<AvatarImage src={avatarUrl!} alt={profile.fullName} />
				<AvatarFallback className="text-lg">
					{(profile.fullName || "?")
						.split(" ")
						.map((name) => name[0])
						.join("")
						.slice(0, 2)
						.toUpperCase()}
				</AvatarFallback>
			</Avatar>

			<Dialog open={openAvatarDialog} onOpenChange={setValueAvatarDialog}>
				<DialogTrigger asChild>
					<Button
						size="icon"
						variant="outline"
						className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
					>
						<Pencil className="h-4 w-4" />
					</Button>
				</DialogTrigger>

				<DialogContent>
					<DialogHeader>
						<DialogTitle>Thay đổi ảnh đại diện</DialogTitle>
						<DialogDescription>
							Chọn một ảnh mới từ thiết bị của bạn.
						</DialogDescription>
					</DialogHeader>

					<Input
						type="file"
						accept="image/*"
						onChange={handleAvatarChange}
						className="mt-4"
					/>

					<DialogFooter className="mt-4">
						<Button
							type="submit"
							disabled={isUpdatingAvatar}
							onClick={handleSaveAvatar}
						>
							Lưu thay đổi
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default AvatarUploadDialog;
