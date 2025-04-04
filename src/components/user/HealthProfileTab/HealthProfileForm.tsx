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

const healthProfileSchema = z.object({
	bloodType: z
		.string()
		.regex(/^(A|B|AB|O)[+-]$/, {
			message: "Nhóm máu phải có định dạng hợp lệ (A+, B-, AB+, O-,...)",
		})
		.optional(),
	height: z
		.number()
		.min(0, { message: "Chiều cao phải là số dương" })
		.max(300, { message: "Chiều cao không được vượt quá 300cm" })
		.optional(),
	weight: z
		.number()
		.min(0, { message: "Cân nặng phải là số dương" })
		.max(500, { message: "Cân nặng không được vượt quá 500kg" })
		.optional(),
	allergies: z
		.string()
		.max(1000, {
			message: "Thông tin dị ứng không được vượt quá 1000 ký tự",
		})
		.optional(),
	chronicDiseases: z
		.string()
		.max(1000, {
			message: "Thông tin bệnh mãn tính không được vượt quá 1000 ký tự",
		})
		.optional(),
	notes: z
		.string()
		.max(2000, { message: "Ghi chú không được vượt quá 2000 ký tự" })
		.optional(),
	healthInsuranceNumber: z
		.string()
		.min(10, { message: "Số BHYT phải có ít nhất 10 ký tự" })
		.max(15, { message: "Số BHYT không được vượt quá 15 ký tự" }),
});

type HealthProfileValues = z.infer<typeof healthProfileSchema>;

interface HealthProfileFormProps {
	profile: Profile;
	onSubmitSuccess: () => void;
	onCancel: () => void;
}

const HealthProfileForm = ({
	profile,
	onSubmitSuccess,
	onCancel,
}: HealthProfileFormProps) => {
	const defaultHealthValues: HealthProfileValues = {
		bloodType: profile.bloodType || "",
		height: profile.height || 0,
		weight: profile.weight || 0,
		allergies: profile.allergies || "Không có",
		chronicDiseases: profile.chronicDiseases || "Không có",
		notes: profile.notes || "Không có",
		healthInsuranceNumber: profile.healthInsuranceNumber || "",
	};

	const healthForm = useForm<HealthProfileValues>({
		resolver: zodResolver(healthProfileSchema),
		defaultValues: defaultHealthValues,
	});

	const onSubmit = (data: HealthProfileValues) => {
		console.log("Updated health profile data:", data);
		onSubmitSuccess();
	};

	return (
		<Form {...healthForm}>
			<form
				onSubmit={healthForm.handleSubmit(onSubmit)}
				className="space-y-6"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<FormField
						control={healthForm.control}
						name="bloodType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nhóm máu</FormLabel>
								<FormControl>
									<Input
										placeholder="Ví dụ: A+, B-, O+, AB-"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={healthForm.control}
							name="height"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Chiều cao (cm)</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Chiều cao"
											{...field}
											onChange={(e) =>
												field.onChange(
													parseFloat(e.target.value)
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={healthForm.control}
							name="weight"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cân nặng (kg)</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Cân nặng"
											{...field}
											onChange={(e) =>
												field.onChange(
													parseFloat(e.target.value)
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={healthForm.control}
						name="healthInsuranceNumber"
						render={({ field }) => (
							<FormItem className="md:col-span-2">
								<FormLabel>Số BHYT</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Số BHYT"
										className="resize-none"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={healthForm.control}
						name="allergies"
						render={({ field }) => (
							<FormItem className="md:col-span-2">
								<FormLabel>Dị ứng</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Liệt kê các dị ứng của bạn"
										className="resize-none"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={healthForm.control}
						name="chronicDiseases"
						render={({ field }) => (
							<FormItem className="md:col-span-2">
								<FormLabel>Bệnh mãn tính</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Liệt kê các bệnh mãn tính của bạn"
										className="resize-none"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={healthForm.control}
						name="notes"
						render={({ field }) => (
							<FormItem className="md:col-span-2">
								<FormLabel>Ghi chú</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Thông tin bổ sung về sức khỏe của bạn"
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

export default HealthProfileForm;
