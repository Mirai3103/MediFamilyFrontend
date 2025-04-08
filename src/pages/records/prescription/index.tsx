// src/pages/RecordPrescription.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Plus,
	ArrowLeft,
	FileText,
	Calendar,
	Building,
	User,
	FilePlus,
	AlertCircle,
	Edit,
	Pill,
	Info,
} from "lucide-react";
import dayjs from "dayjs";

// UI Components
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

// Types
interface PrescriptionItem {
	id: number;
	medicationName: string;
	dosage: string;
	frequency: string;
	durationInDays: number;
	startUseDate: Date;
	instructions?: string;
	notes?: string;
}

interface MedicalRecord {
	id: number;
	title: string;
	visitDate: Date;
	medicalFacility: string;
	doctorName: string;
	diagnosis: string;
	treatment: string;
	notes?: string;
}

// Form schema
const prescriptionFormSchema = z.object({
	medicationName: z
		.string()
		.min(2, { message: "Tên thuốc phải có ít nhất 2 ký tự" })
		.max(200),
	dosage: z
		.string()
		.min(1, { message: "Liều dùng không được để trống" })
		.max(100),
	frequency: z
		.string()
		.min(1, { message: "Tần suất sử dụng không được để trống" })
		.max(100),
	durationInDays: z
		.number()
		.min(1, { message: "Số ngày sử dụng phải lớn hơn hoặc bằng 1" }),
	startUseDate: z.date({ required_error: "Vui lòng chọn ngày bắt đầu" }),
	instructions: z.string().max(500).optional(),
	notes: z.string().max(1000).optional(),
});

type PrescriptionFormValues = z.infer<typeof prescriptionFormSchema>;
interface PrescriptionFormProps {}
export default function RecordPrescription({}: PrescriptionFormProps) {
	const navigate = useNavigate();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	// Mock data - would be fetched from API in a real application
	const medicalRecord: MedicalRecord = {
		id: 1,
		title: "Khám tổng quát hàng năm",
		visitDate: new Date("2025-03-15"),
		medicalFacility: "Bệnh viện Đa khoa Quốc tế Vinmec",
		doctorName: "Bs. Nguyễn Văn A",
		diagnosis: "Tăng huyết áp nhẹ, Cholesterol cao",
		treatment: "Điều chỉnh chế độ ăn, uống thuốc theo toa",
		notes: "Cần theo dõi huyết áp hàng ngày, giảm lượng muối và chất béo trong bữa ăn",
	};

	// Mock prescription data
	const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
		{
			id: 1,
			medicationName: "Amlodipine",
			dosage: "5mg",
			frequency: "1 viên/ngày, uống vào buổi sáng",
			durationInDays: 30,
			startUseDate: new Date("2025-03-15"),
			instructions: "Uống sau bữa ăn sáng",
			notes: "Theo dõi huyết áp sau khi uống thuốc",
		},
		{
			id: 2,
			medicationName: "Lipitor",
			dosage: "10mg",
			frequency: "1 viên/ngày, uống vào buổi tối",
			durationInDays: 30,
			startUseDate: new Date("2025-03-15"),
			instructions: "Uống trước khi đi ngủ",
			notes: "Kiểm tra lại chỉ số Cholesterol sau 1 tháng",
		},
	]);

	// Form setup
	const form = useForm<PrescriptionFormValues>({
		resolver: zodResolver(prescriptionFormSchema),
		defaultValues: {
			medicationName: "",
			dosage: "",
			frequency: "",
			durationInDays: 1,
			startUseDate: new Date(),
			instructions: "",
			notes: "",
		},
	});

	const onSubmit = (values: PrescriptionFormValues) => {
		// Add new prescription
		const newPrescription = {
			id: Math.max(0, ...prescriptions.map((p) => p.id)) + 1,
			...values,
		};

		setPrescriptions([...prescriptions, newPrescription]);
		setIsDialogOpen(false);
		form.reset();

		toast("Thêm thuốc thành công", {
			description: "Thuốc đã được thêm vào đơn thuốc",
		});
	};
	const { history } = useRouter();

	return (
		<div className="container max-w-6xl mx-auto py-8">
			<div className="mb-6">
				<Button
					variant="ghost"
					className="mb-4"
					onClick={() => history.back()}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Quay lại
				</Button>

				<div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-800">
							Đơn thuốc
						</h1>
						<p className="text-gray-500">
							Quản lý đơn thuốc cho lần khám
						</p>
					</div>

					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button className="">
								<Plus className="mr-2 h-4 w-4" />
								Thêm thuốc
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[600px]">
							<DialogHeader>
								<DialogTitle>Thêm thuốc mới</DialogTitle>
								<DialogDescription>
									Điền thông tin chi tiết về thuốc được kê
									trong đơn.
								</DialogDescription>
							</DialogHeader>

							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-4 py-4"
								>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{/* Medication Name */}
										<FormField
											control={form.control}
											name="medicationName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Tên thuốc
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Nhập tên thuốc"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Dosage */}
										<FormField
											control={form.control}
											name="dosage"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Liều dùng
													</FormLabel>
													<FormControl>
														<Input
															placeholder="VD: 5mg, 10ml..."
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Frequency */}
										<FormField
											control={form.control}
											name="frequency"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Tần suất sử dụng
													</FormLabel>
													<FormControl>
														<Input
															placeholder="VD: 1 viên/ngày, 2 lần/ngày..."
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Duration */}
										<FormField
											control={form.control}
											name="durationInDays"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Thời gian sử dụng (ngày)
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															min={1}
															placeholder="Số ngày sử dụng"
															{...field}
															onChange={(e) =>
																field.onChange(
																	parseInt(
																		e.target
																			.value
																	)
																)
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Start Date */}
										<FormField
											control={form.control}
											name="startUseDate"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Ngày bắt đầu
													</FormLabel>
													<FormControl>
														<DatePicker
															date={field.value}
															onSelect={
																field.onChange
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Instructions */}
									<FormField
										control={form.control}
										name="instructions"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Hướng dẫn sử dụng
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="VD: Uống sau bữa ăn, uống với nhiều nước..."
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Notes */}
									<FormField
										control={form.control}
										name="notes"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Ghi chú</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Ghi chú thêm về thuốc này nếu cần"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<DialogFooter>
										<Button
											type="button"
											variant="outline"
											onClick={() =>
												setIsDialogOpen(false)
											}
										>
											Hủy
										</Button>
										<Button type="submit" className="">
											Thêm thuốc
										</Button>
									</DialogFooter>
								</form>
							</Form>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Medical Record Information */}
			<Card className="mb-8">
				<CardHeader className="pb-2">
					<div className="flex justify-between items-start">
						<div>
							<CardTitle className="text-2xl font-bold">
								{medicalRecord.title}
							</CardTitle>
							<CardDescription>
								Thông tin chi tiết về lần khám
							</CardDescription>
						</div>
						<Badge
							variant="outline"
							className="bg-blue-50 text-blue-700 border-blue-200"
						>
							{medicalRecord.diagnosis}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className="pt-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div className="flex items-center text-gray-700">
								<Calendar className="h-5 w-5 mr-2 text-gray-500" />
								<div>
									<span className="font-medium">
										Ngày khám:{" "}
									</span>
									{dayjs(medicalRecord.visitDate).format(
										"DD/MM/YYYY"
									)}
								</div>
							</div>

							<div className="flex items-center text-gray-700">
								<Building className="h-5 w-5 mr-2 text-gray-500" />
								<div>
									<span className="font-medium">
										Cơ sở y tế:{" "}
									</span>
									{medicalRecord.medicalFacility}
								</div>
							</div>

							<div className="flex items-center text-gray-700">
								<User className="h-5 w-5 mr-2 text-gray-500" />
								<div>
									<span className="font-medium">
										Bác sĩ:{" "}
									</span>
									{medicalRecord.doctorName}
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<div className="flex items-start text-gray-700">
								<FilePlus className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
								<div>
									<span className="font-medium">
										Phương pháp điều trị:{" "}
									</span>
									{medicalRecord.treatment}
								</div>
							</div>

							{medicalRecord.notes && (
								<div className="flex items-start text-gray-700">
									<FileText className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
									<div>
										<span className="font-medium">
											Ghi chú:{" "}
										</span>
										{medicalRecord.notes}
									</div>
								</div>
							)}
						</div>
					</div>
				</CardContent>
				<CardFooter className="border-t pt-4 flex justify-end">
					<Button variant="outline" size="sm">
						<Edit className="mr-2 h-4 w-4" />
						Chỉnh sửa thông tin
					</Button>
				</CardFooter>
			</Card>

			{/* Prescription List */}
			<div className="bg-white p-6 rounded-lg border shadow-sm">
				<div className="flex justify-between items-center mb-6">
					<div className="flex items-center">
						<Pill className="h-6 w-6 text-health-blue mr-3" />
						<h2 className="text-xl font-semibold">
							Danh sách thuốc
						</h2>
					</div>
					<div className="text-sm text-gray-500">
						{prescriptions.length} loại thuốc
					</div>
				</div>

				{prescriptions.length > 0 ? (
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Tên thuốc</TableHead>
									<TableHead>Liều dùng</TableHead>
									<TableHead>Tần suất</TableHead>
									<TableHead>Thời gian</TableHead>
									<TableHead>Ngày bắt đầu</TableHead>
									<TableHead>Hướng dẫn</TableHead>
									<TableHead className="text-right">
										Thao tác
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{prescriptions.map((prescription) => (
									<TableRow key={prescription.id}>
										<TableCell className="font-medium">
											{prescription.medicationName}
										</TableCell>
										<TableCell>
											{prescription.dosage}
										</TableCell>
										<TableCell>
											{prescription.frequency}
										</TableCell>
										<TableCell>
											{prescription.durationInDays} ngày
										</TableCell>
										<TableCell>
											{dayjs(
												prescription.startUseDate
											).format("DD/MM/YYYY")}
										</TableCell>
										<TableCell className="max-w-[200px] truncate">
											{prescription.instructions || "-"}
										</TableCell>
										<TableCell className="text-right">
											<Button
												variant="ghost"
												size="sm"
												className="mr-1"
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => {
													toast(
														"Thông tin chi tiết",
														{
															description: (
																<div className="mt-2 space-y-2">
																	<p>
																		<span className="font-medium">
																			Ghi
																			chú:
																		</span>{" "}
																		{prescription.notes ||
																			"Không có"}
																	</p>
																	<p>
																		<span className="font-medium">
																			Hướng
																			dẫn:
																		</span>{" "}
																		{prescription.instructions ||
																			"Không có"}
																	</p>
																</div>
															),
														}
													);
												}}
											>
												<Info className="h-4 w-4" />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				) : (
					<div className="text-center py-12 border rounded-lg bg-gray-50">
						<AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
						<h3 className="text-lg font-medium text-gray-600">
							Chưa có thuốc nào
						</h3>
						<p className="text-gray-500 mb-4">
							Thêm thuốc vào đơn này
						</p>
						<Button
							onClick={() => setIsDialogOpen(true)}
							className=""
						>
							<Plus className="mr-2 h-4 w-4" />
							Thêm thuốc
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
