import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileGender, type Family } from "@/models/generated";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Switch } from "@/components/ui/switch";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form,
} from "@/components/ui/form";
import { useAddMemberToFamily } from "@/queries/generated/family-member-controller/family-member-controller";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

interface FamilyDetailPageProps {
	family: Family;
	onClose: () => void;
	onSuccess?: () => void;
}

const relationshipSuggestions = [
	"Vợ/Chồng",
	"Con trai",
	"Con gái",
	"Cha",
	"Mẹ",
	"Ông",
	"Bà",
	"Anh/Chị",
	"Em",
	"Cháu",
	"Bác",
	"Chú/Dì",
];
// Zod schema for non-registered member
const newMemberSchema = z.object({
	fullName: z
		.string()
		.min(2, { message: "Họ và tên phải có ít nhất 2 ký tự" })
		.max(100, { message: "Họ và tên không được vượt quá 100 ký tự" }),
	relationship: z.string({
		required_error: "Vui lòng chọn quan hệ với chủ hộ",
	}),
	gender: z.nativeEnum(ProfileGender, {
		required_error: "Vui lòng chọn giới tính",
	}),
	birthDate: z.string().refine(
		(val) => {
			const date = new Date(val);
			return !isNaN(date.getTime());
		},
		{ message: "Ngày sinh không hợp lệ" }
	),
	phoneNumber: z
		.string()
		.regex(/^(\+84|0)[3|5|7|8|9][0-9]{8}$/, {
			message: "Số điện thoại không hợp lệ",
		})
		.optional()
		.or(z.literal("")),
	email: z
		.string()
		.email({ message: "Email không hợp lệ" })
		.max(100, { message: "Email không được vượt quá 100 ký tự" })
		.optional()
		.or(z.literal("")),
	isHouseholder: z.boolean().default(false),
});

// Zod schema for existing user
const existingUserSchema = z.object({
	userId: z.coerce.number({ required_error: "Vui lòng chọn người dùng" }),
	relationship: z.string({
		required_error: "Vui lòng chọn quan hệ với chủ hộ",
	}),
	isHouseholder: z.boolean().default(false),
});

const AddMemberForm = ({
	family,
	onClose,
	onSuccess,
}: FamilyDetailPageProps) => {
	const [memberType, setMemberType] = useState("new");
	const router = useRouter();
	const { mutate, isPending } = useAddMemberToFamily({
		mutation: {
			onSuccess: () => {
				onSuccess?.();
				onClose();
				router.invalidate();
			},
			onError: (error) => {
				toast.error(
					`Có lỗi xảy ra khi thêm thành viên: ${error.message}`
				);
				onClose();
			},
		},
	});

	// Form for new member
	const newMemberForm = useForm<z.infer<typeof newMemberSchema>>({
		resolver: zodResolver(newMemberSchema),
		defaultValues: {
			fullName: "",
			relationship: "",
			gender: undefined,
			birthDate: "",
			phoneNumber: "",
			email: "",
			isHouseholder: false,
		},
	});

	// Form for existing user
	const existingUserForm = useForm<z.infer<typeof existingUserSchema>>({
		resolver: zodResolver(existingUserSchema),
		defaultValues: {
			userId: undefined,
			relationship: "",
			isHouseholder: false,
		},
	});

	// Mock data for existing users - replace with actual API call
	const existingUsers = [
		{ id: "1", name: "Nguyễn Văn A", email: "a@example.com" },
		{ id: "2", name: "Trần Thị B", email: "b@example.com" },
		{ id: "3", name: "Lê Văn C", email: "c@example.com" },
	];

	const handleSubmitNewMember = (data: z.infer<typeof newMemberSchema>) => {
		mutate({
			id: family.id!,
			data: {
				familyId: family.id!,
				relationship: data.relationship as string,
				hasAccount: false,
				householder: false,
				memberProfile: !!existingUserForm.getValues("userId")
					? undefined
					: ({
							birthDate: data.birthDate,
							fullName: data.fullName,
							phoneNumber: data.phoneNumber,
							gender: data.gender as any,
							email: data.email,
						} as any),
			},
		});
	};

	const handleSubmitExistingUser = (
		data: z.infer<typeof existingUserSchema>
	) => {
		mutate({
			id: family.id!,
			data: {
				familyId: family.id!,
				relationship: data.relationship,
				hasAccount: true,
				accountId: data.userId!,
				householder: data.isHouseholder,
				memberProfile: undefined,
			},
		});
	};

	return (
		<DialogContent className="sm:max-w-xl">
			<DialogHeader>
				<DialogTitle>Thêm thành viên gia đình</DialogTitle>
				<DialogDescription>
					Thêm thành viên gia đình đã có tài khoản hoặc tạo thành viên
					mới
				</DialogDescription>
			</DialogHeader>

			<Tabs
				value={memberType}
				onValueChange={setMemberType}
				className="mt-6"
			>
				<TabsList className="grid grid-cols-2 mb-6 w-full">
					<TabsTrigger value="new">Thành viên mới</TabsTrigger>
					<TabsTrigger value="existing">
						Thành viên đã có tài khoản
					</TabsTrigger>
				</TabsList>

				<TabsContent value="new">
					<Form {...newMemberForm}>
						<form
							onSubmit={newMemberForm.handleSubmit(
								handleSubmitNewMember
							)}
							className="space-y-4"
						>
							<FormField
								control={newMemberForm.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Họ và tên</FormLabel>
										<FormControl>
											<Input
												placeholder="Nhập họ và tên"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={newMemberForm.control}
									name="relationship"
									render={({ field }) => (
										<FormItem className="flex flex-col">
											<FormLabel>
												Quan hệ với chủ hộ
											</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<div className="relative">
															<Input
																placeholder="Nhập quan hệ với chủ hộ"
																{...field}
															/>
															<Button
																variant="ghost"
																size="sm"
																className="absolute right-0 top-0 h-full px-3 py-2"
																type="button"
															>
																<ChevronsUpDown className="h-4 w-4 opacity-50" />
															</Button>
														</div>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent
													className="w-[200px] p-0"
													align="start"
												>
													<Command>
														<CommandList>
															<CommandGroup>
																{relationshipSuggestions.map(
																	(
																		suggestion
																	) => (
																		<CommandItem
																			key={
																				suggestion
																			}
																			value={
																				suggestion
																			}
																			onSelect={() => {
																				newMemberForm.setValue(
																					"relationship",
																					suggestion
																				);
																			}}
																		>
																			<Check
																				className={cn(
																					"mr-2 h-4 w-4",
																					field.value ===
																						suggestion
																						? "opacity-100"
																						: "opacity-0"
																				)}
																			/>
																			{
																				suggestion
																			}
																		</CommandItem>
																	)
																)}
															</CommandGroup>
														</CommandList>
													</Command>
												</PopoverContent>
											</Popover>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={newMemberForm.control}
									name="gender"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Giới tính</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Chọn giới tính" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem
														value={
															ProfileGender.MALE
														}
													>
														Nam
													</SelectItem>
													<SelectItem
														value={
															ProfileGender.FEMALE
														}
													>
														Nữ
													</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={newMemberForm.control}
								name="birthDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Ngày sinh</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={newMemberForm.control}
								name="phoneNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Số điện thoại (không bắt buộc)
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Nhập số điện thoại"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={newMemberForm.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Email (không bắt buộc)
										</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="Nhập email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={newMemberForm.control}
								name="isHouseholder"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
										<div className="space-y-0.5">
											<FormLabel>
												Đặt làm chủ hộ
											</FormLabel>
											<p className="text-sm text-muted-foreground">
												Người này sẽ trở thành chủ hộ
												mới của gia đình
											</p>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<DialogFooter className="mt-6">
								<Button
									type="button"
									variant="outline"
									onClick={onClose}
								>
									Hủy
								</Button>
								<Button type="submit" disabled={isPending}>
									{isPending
										? "Đang xử lý..."
										: "Thêm thành viên"}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</TabsContent>

				<TabsContent value="existing">
					<Form {...existingUserForm}>
						<form
							onSubmit={existingUserForm.handleSubmit(
								handleSubmitExistingUser
							)}
							className="space-y-4"
						>
							<FormField
								control={existingUserForm.control}
								name="userId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Chọn người dùng</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value + ""}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Chọn người dùng" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{existingUsers.map((user) => (
													<SelectItem
														key={user.id}
														value={user.id}
													>
														{user.name} (
														{user.email})
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={existingUserForm.control}
								name="relationship"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>
											Quan hệ với chủ hộ
										</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<div className="relative">
														<Input
															placeholder="Nhập quan hệ với chủ hộ"
															{...field}
														/>
														<Button
															variant="ghost"
															size="sm"
															className="absolute right-0 top-0 h-full px-3 py-2"
															type="button"
														>
															<ChevronsUpDown className="h-4 w-4 opacity-50" />
														</Button>
													</div>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className="w-[200px] p-0"
												align="start"
											>
												<Command>
													<CommandList>
														<CommandGroup>
															{relationshipSuggestions.map(
																(
																	suggestion
																) => (
																	<CommandItem
																		key={
																			suggestion
																		}
																		value={
																			suggestion
																		}
																		onSelect={() => {
																			existingUserForm.setValue(
																				"relationship",
																				suggestion
																			);
																		}}
																	>
																		<Check
																			className={cn(
																				"mr-2 h-4 w-4",
																				field.value ===
																					suggestion
																					? "opacity-100"
																					: "opacity-0"
																			)}
																		/>
																		{
																			suggestion
																		}
																	</CommandItem>
																)
															)}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={existingUserForm.control}
								name="isHouseholder"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
										<div className="space-y-0.5">
											<FormLabel>
												Đặt làm chủ hộ
											</FormLabel>
											<p className="text-sm text-muted-foreground">
												Người này sẽ trở thành chủ hộ
												mới của gia đình
											</p>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<DialogFooter className="mt-6">
								<Button
									type="button"
									variant="outline"
									onClick={onClose}
								>
									Hủy
								</Button>
								<Button type="submit" disabled={isPending}>
									{isPending
										? "Đang xử lý..."
										: "Thêm thành viên"}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</TabsContent>
			</Tabs>
		</DialogContent>
	);
};

export default AddMemberForm;
