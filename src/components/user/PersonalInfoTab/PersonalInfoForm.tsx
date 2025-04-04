import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Profile } from "@/models/generated";

const profileFormSchema = z.object({
	fullName: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
	email: z.string().email({ message: "Email không hợp lệ" }),
	phone: z.string().min(10, { message: "Số điện thoại không hợp lệ" }),
	dateOfBirth: z.string().optional(),
	address: z.string().optional(),
	bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface PersonalInfoFormProps {
	profile: Profile;
	onSubmitSuccess: () => void;
	onCancel: () => void;
}

const PersonalInfoForm = ({
	profile,
	onSubmitSuccess,
	onCancel,
}: PersonalInfoFormProps) => {
	const defaultValues: ProfileFormValues = {
		email: profile.email || "",
		fullName: profile.fullName || "",
		phone: profile.phoneNumber || "",
		address: profile.address,
		bio: profile.bio || "",
		dateOfBirth: profile.dateOfBirth,
	};

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues,
	});

	const onSubmit = (data: ProfileFormValues) => {
		console.log("Updated profile data:", data);
		onSubmitSuccess();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<FormField
						control={form.control}
						name="fullName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Họ và tên</FormLabel>
								<FormControl>
									<Input placeholder="Họ và tên" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Số điện thoại</FormLabel>
								<FormControl>
									<Input
										placeholder="Số điện thoại"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="dateOfBirth"
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
						control={form.control}
						name="address"
						render={({ field }) => (
							<FormItem className="md:col-span-2">
								<FormLabel>Địa chỉ</FormLabel>
								<FormControl>
									<Input placeholder="Địa chỉ" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="bio"
						render={({ field }) => (
							<FormItem className="md:col-span-2">
								<FormLabel>Giới thiệu</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Giới thiệu về bản thân"
										className="resize-none"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="flex justify-end gap-4">
					<Button type="button" variant="outline" onClick={onCancel}>
						Hủy
					</Button>
					<Button type="submit">Lưu thay đổi</Button>
				</div>
			</form>
		</Form>
	);
};

export default PersonalInfoForm;
