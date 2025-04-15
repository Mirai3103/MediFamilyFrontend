// src/components/medical/tabs/RecordsTabContent.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	ActivitySquare,
	Building,
	Calendar,
	CalendarCheck,
	ClipboardList,
	FileType,
	Plus,
	Stethoscope,
	User,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { toast } from "sonner";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
	getGetMedicalRecordQueryKey,
	useCreateMedicalRecord,
	useGetMedicalRecord,
} from "@/queries/generated/medical-record-controller/medical-record-controller";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React from "react";
interface IRecordFormProps {
	type: "edit" | "add";
	recordId?: number;
	onDone?: (isSuccess: boolean) => void;
	profileId?: number;
}

export const medicalRecordFormSchema = z.object({
	id: z.number().optional(),
	title: z.string().min(1, { message: "Tiêu đề không được để trống" }),
	visitDate: z
		.date({ required_error: "Vui lòng chọn ngày khám" })
		.refine((date) => date <= new Date(), {
			message: "Ngày khám phải là ngày hiện tại hoặc trong quá khứ",
		}),
	medicalFacility: z
		.string()
		.min(2, { message: "Tên cơ sở y tế phải có ít nhất 2 ký tự" })
		.max(200, { message: "Tên cơ sở y tế không được vượt quá 200 ký tự" }),
	doctorName: z
		.string()
		.min(2, { message: "Tên bác sĩ phải có ít nhất 2 ký tự" })
		.max(100, { message: "Tên bác sĩ không được vượt quá 100 ký tự" })
		.optional(),
	diagnosis: z
		.string()
		.min(2, { message: "Chẩn đoán phải có ít nhất 2 ký tự" })
		.max(500, { message: "Chẩn đoán không được vượt quá 500 ký tự" }),

	treatment: z
		.string()
		.max(1000, {
			message: "Phương pháp điều trị không được vượt quá 1000 ký tự",
		})
		.optional(),

	notes: z
		.string()
		.max(2000, { message: "Ghi chú không được vượt quá 2000 ký tự" })
		.optional(),

	isFollowup: z.boolean().default(false),
	followupDate: z
		.date()
		.refine((date) => date > new Date(), {
			message: "Ngày tái khám phải là ngày trong tương lai",
		})
		.optional(),
});

type MedicalRecordFormValues = z.infer<typeof medicalRecordFormSchema>;

export default function RecordForm({
	type,
	recordId,
	profileId,
	onDone,
}: IRecordFormProps) {
	const form = useForm<MedicalRecordFormValues>({
		resolver: zodResolver(medicalRecordFormSchema),
		defaultValues: {
			title: "",
			visitDate: new Date(),
			medicalFacility: "",
			doctorName: "",
			diagnosis: "",
			treatment: "",
			notes: "",
			isFollowup: false,
		},
	});
	const queryClient = useQueryClient();
	const { data } = useGetMedicalRecord(recordId!, {
		query: {
			enabled: type === "edit" && !!recordId,
		},
	});
	React.useEffect(() => {
		console.log("data", data);
		if (!data) return data;
		console.log("reseting form", data);
		form.reset({
			...data,
			visitDate: dayjs(data.visitDate).toDate(),
			followupDate: dayjs(data.followupDate).toDate(),
		});
	}, [data, form]);
	const { mutate } = useCreateMedicalRecord({
		mutation: {
			onSuccess: (data) => {
				form.reset();
				toast("Thêm hồ sơ thành công", {
					description: "Hồ sơ khám đã được thêm vào hệ thống",
				});
				queryClient.invalidateQueries({
					queryKey: getGetMedicalRecordQueryKey(profileId!),
				});
				onDone?.(true);
			},
			onError: (error) => {
				toast("Lỗi", {
					description: error.response?.data?.message || error.message,
				});
				onDone?.(false);
			},
		},
	});
	const onSubmit = async (data: MedicalRecordFormValues) => {
		mutate({
			data: {
				...data,
				visitDate: data.visitDate.toISOString(),
				followupDate: data.isFollowup
					? data.followupDate?.toISOString()
					: undefined,
				profileId: profileId,
			},
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Title Field */}
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center">
									<FileType className="mr-2 h-4 w-4 text-health-blue" />
									Tiêu đề
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Khám tổng quát, Khám chuyên khoa..."
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Visit Date Field */}
					<FormField
						control={form.control}
						name="visitDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center">
									<Calendar className="mr-2 h-4 w-4 text-health-blue" />
									Ngày khám
								</FormLabel>
								<FormControl>
									<DatePicker
										date={field.value}
										onSelect={field.onChange}
										disabled={(date) => date > new Date()}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Medical Facility Field */}
					<FormField
						control={form.control}
						name="medicalFacility"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center">
									<Building className="mr-2 h-4 w-4 text-health-blue" />
									Cơ sở y tế
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Bệnh viện, phòng khám..."
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Doctor Name Field */}
					<FormField
						control={form.control}
						name="doctorName"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center">
									<User className="mr-2 h-4 w-4 text-health-blue" />
									Bác sĩ
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Tên bác sĩ"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Diagnosis Field */}
					<FormField
						control={form.control}
						name="diagnosis"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center">
									<Stethoscope className="mr-2 h-4 w-4 text-health-blue" />
									Chẩn đoán
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Chẩn đoán của bác sĩ"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Treatment Field */}
					<FormField
						control={form.control}
						name="treatment"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center">
									<ClipboardList className="mr-2 h-4 w-4 text-health-blue" />
									Phương pháp điều trị
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Phương pháp điều trị"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Notes Field */}
				<FormField
					control={form.control}
					name="notes"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="flex items-center">
								<ActivitySquare className="mr-2 h-4 w-4 text-health-blue" />
								Ghi chú
							</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Những ghi chú về tình trạng sức khỏe, kết quả khám..."
									className="resize-none h-24"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Follow-up Check */}
				<FormField
					control={form.control}
					name="isFollowup"
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel className="flex items-center">
									<CalendarCheck className="mr-2 h-4 w-4 text-health-blue" />
									Hẹn tái khám
								</FormLabel>
								<FormDescription>
									Đánh dấu nếu bác sĩ có hẹn tái khám
								</FormDescription>
							</div>
						</FormItem>
					)}
				/>

				{/* Follow-up Date - Conditionally rendered */}
				{form.watch("isFollowup") && (
					<FormField
						control={form.control}
						name="followupDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center">
									<Calendar className="mr-2 h-4 w-4 text-health-blue" />
									Ngày tái khám
								</FormLabel>
								<FormControl>
									<DatePicker
										date={field.value}
										onSelect={field.onChange}
										disabled={(date) => date < new Date()}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<DrawerFooter className="px-0">
					<div className="flex justify-end gap-2">
						<DrawerClose asChild>
							<Button type="button" variant="outline">
								Hủy
							</Button>
						</DrawerClose>
						<Button
							type="submit"
							className=""
							disabled={form.formState.isSubmitting}
						>
							{form.formState.isSubmitting ? (
								<>
									<span className="loading loading-spinner loading-xs mr-2"></span>
									Đang lưu...
								</>
							) : (
								<>
									<Plus className="mr-2 h-4 w-4" />
									Thêm hồ sơ
								</>
							)}
						</Button>
					</div>
				</DrawerFooter>
			</form>
		</Form>
	);
}
