// src/components/medical/MedicalRecordCard.tsx
import dayjs from "dayjs";
import {
	Edit,
	Calendar,
	Building,
	User,
	FilePlus,
	FileText,
	X,
	FileStack,
	Paperclip,
	File,
	Download,
	ExternalLink,
	Upload,
	Trash2,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MedicalRecordDto } from "@/models/generated";
import { useState } from "react";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import RecordForm from "@/components/user/RecordTab/forms/RecordForm";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
	deleteAttachment,
	useAddAttachments,
} from "@/queries/generated/medical-record-controller/medical-record-controller";
import { useRouter } from "@tanstack/react-router";
import { getDownloadUrl, getImageViewUrl } from "@/utils/file";

interface MedicalRecordCardProps {
	record: MedicalRecordDto;
}

// Fake attachments data (temporary)

export default function MedicalRecordCard({ record }: MedicalRecordCardProps) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const attachments = record.attachments || [];
	const router = useRouter();
	const { mutate, isPending } = useAddAttachments({
		mutation: {
			onSuccess: (data) => {
				toast.success("Tải lên tệp thành công");
				router.invalidate({});
			},
			onError: (error) => {
				toast.error("Tải lên tệp thất bại", {
					description: error.message,
				});
			},
		},
	});
	const handleFileUpload = (file: File[]) => {
		if (file.length > 0) {
			mutate({
				data: {
					attachments: file,
				},
				id: record.id!.toString(),
			});
		}
		setIsUploadModalOpen(false);
	};

	return (
		<Card className="mb-8">
			<CardHeader className="pb-2">
				<div className="flex justify-between items-start">
					<div>
						<CardTitle className="text-2xl font-bold">
							{record.title}
						</CardTitle>
						<CardDescription>
							Thông tin chi tiết về lần khám
						</CardDescription>
					</div>
					<Badge
						variant="outline"
						className="bg-blue-50 text-blue-700 border-blue-200"
					>
						{record.diagnosis}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="pt-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<RecordDetailsLeft record={record} />
					<RecordDetailsRight record={record} />
				</div>

				{/* Attachments Section */}
				{attachments && attachments.length > 0 && (
					<AttachmentsSection
						attachments={attachments}
						onRemove={(fileName) => {
							confirm(
								"Bạn có chắc chắn muốn xóa tệp này không?"
							) &&
								deleteAttachment(record.id!.toString(), {
									attachment: fileName,
								})
									.then(() => {
										toast.success("Xóa tệp thành công");
										router.invalidate({});
									})
									.catch((error) => {
										toast.error("Xóa tệp thất bại", {
											description: error.message,
										});
									});
						}}
					/>
				)}
			</CardContent>
			<CardFooter className="border-t pt-4 flex justify-end">
				<Drawer
					open={isDrawerOpen}
					onOpenChange={setIsDrawerOpen}
					direction="right"
				>
					<DrawerTrigger asChild>
						<Button variant="outline" size="sm">
							<Edit className="mr-2 h-4 w-4" />
							Chỉnh sửa thông tin
						</Button>
					</DrawerTrigger>
					<DrawerContent className="!max-w-3xl ">
						<div className="mx-auto w-full max-w-3xl">
							<DrawerHeader>
								<div className="flex justify-between items-center">
									<div>
										<DrawerTitle className="text-2xl font-bold text-gray-800">
											Chỉnh sửa hồ sơ khám
										</DrawerTitle>
										<DrawerDescription className="text-gray-500">
											Hồ sơ khám cho{" "}
											{record.profile?.fullName ||
												"bệnh nhân"}
										</DrawerDescription>
									</div>
									<DrawerClose asChild>
										<Button variant="ghost" size="icon">
											<X className="h-5 w-5" />
										</Button>
									</DrawerClose>
								</div>
							</DrawerHeader>

							<div className="px-4 py-2">
								<RecordForm
									type={"edit"}
									onDone={(isSuccess) => {
										setIsDrawerOpen(false);
									}}
									recordId={record.id}
									profileId={
										record.profile?.id || record.profileId
									}
								/>
							</div>
						</div>
					</DrawerContent>
				</Drawer>

				{/* File Upload Dialog */}
				<Dialog
					open={isUploadModalOpen}
					onOpenChange={setIsUploadModalOpen}
				>
					<DialogTrigger asChild>
						<Button size="sm" className="ml-2" disabled={isPending}>
							<FileStack className="mr-2 h-4 w-4" />
							Tải lên hồ sơ
						</Button>
					</DialogTrigger>
					<DialogContent>
						<FileUploadModal
							onUpload={handleFileUpload}
							recordId={record.id!}
							onCancel={() => setIsUploadModalOpen(false)}
						/>
					</DialogContent>
				</Dialog>
			</CardFooter>
		</Card>
	);
}

function RecordDetailsLeft({ record }: { record: MedicalRecordDto }) {
	return (
		<div className="space-y-4">
			<div className="flex items-center text-gray-700">
				<Calendar className="h-5 w-5 mr-2 text-gray-500" />
				<div>
					<span className="font-medium">Ngày khám: </span>
					{dayjs(record.visitDate).format("DD/MM/YYYY")}
				</div>
			</div>

			<div className="flex items-center text-gray-700">
				<Building className="h-5 w-5 mr-2 text-gray-500" />
				<div>
					<span className="font-medium">Cơ sở y tế: </span>
					{record.medicalFacility}
				</div>
			</div>

			<div className="flex items-center text-gray-700">
				<User className="h-5 w-5 mr-2 text-gray-500" />
				<div>
					<span className="font-medium">Bác sĩ: </span>
					{record.doctorName}
				</div>
			</div>
		</div>
	);
}

function RecordDetailsRight({ record }: { record: MedicalRecordDto }) {
	return (
		<div className="space-y-4">
			<div className="flex items-start text-gray-700">
				<FilePlus className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
				<div>
					<span className="font-medium">Phương pháp điều trị: </span>
					{record.treatment}
				</div>
			</div>

			{record.notes && (
				<div className="flex items-start text-gray-700">
					<FileText className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
					<div>
						<span className="font-medium">Ghi chú: </span>
						{record.notes}
					</div>
				</div>
			)}
		</div>
	);
}

function AttachmentsSection({
	attachments,
	onRemove,
}: {
	attachments: string[];
	onRemove?: (fileName: string) => void;
}) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<Collapsible
			open={isExpanded}
			onOpenChange={setIsExpanded}
			className="mt-6 pt-4 border-t"
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center text-gray-700">
					<Paperclip className="h-5 w-5 mr-2 text-gray-500" />
					<h3 className="font-medium">
						Tệp đính kèm ({attachments.length})
					</h3>
				</div>
				<CollapsibleTrigger asChild>
					<Button variant="ghost" size="sm">
						{isExpanded ? "Ẩn bớt" : "Xem tất cả"}
					</Button>
				</CollapsibleTrigger>
			</div>

			{/* Show first 2 attachments always */}
			<div className="mt-3 space-y-2">
				{attachments.slice(0, 2).map((file, index) => (
					<AttachmentItem
						key={index}
						fileName={file}
						onRemove={() => onRemove?.(file)}
					/>
				))}
			</div>

			{/* Show remaining attachments when expanded */}
			<CollapsibleContent>
				<div className="mt-2 space-y-2">
					{attachments.slice(2).map((file, index) => (
						<AttachmentItem
							key={index + 2}
							fileName={file}
							onRemove={() => onRemove?.(file)}
						/>
					))}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}

function AttachmentItem({
	fileName,
	onRemove,
}: {
	fileName: string;
	onRemove?: () => void;
}) {
	// Determine file icon based on extension
	const getFileIcon = (fileName: string) => {
		const extension = fileName.split(".").pop()?.toLowerCase();

		if (extension === "pdf") {
			return <File className="h-4 w-4 text-red-500" />;
		} else if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
			return <File className="h-4 w-4 text-blue-500" />;
		} else {
			return <File className="h-4 w-4 text-gray-500" />;
		}
	};

	return (
		<div className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
			<div className="flex items-center">
				{getFileIcon(fileName)}
				<span className="ml-2 text-sm">{fileName}</span>
			</div>
			<div className="flex space-x-1">
				<Button variant="ghost" size="icon" className="h-8 w-8" asChild>
					<a href={getDownloadUrl(fileName)} download>
						<Download className="h-4 w-4 text-gray-500" />
					</a>
				</Button>
				<Button variant="ghost" size="icon" className="h-8 w-8" asChild>
					<a href={getImageViewUrl(fileName)} target="_blank">
						<ExternalLink className="h-4 w-4 text-gray-500" />
					</a>
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					onClick={onRemove}
				>
					<Trash2 className="h-4 w-4 text-red-500" />
				</Button>
			</div>
		</div>
	);
}

interface FileUploadModalProps {
	recordId: number;
	onUpload: (files: File[]) => void;
	onCancel: () => void;
}

function FileUploadModal({
	recordId,
	onUpload,
	onCancel,
}: FileUploadModalProps) {
	const [files, setFiles] = useState<File[]>([]);
	const [isDragging, setIsDragging] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files);
			setFiles((prev) => [...prev, ...newFiles]);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);

		if (e.dataTransfer.files) {
			const newFiles = Array.from(e.dataTransfer.files);
			setFiles((prev) => [...prev, ...newFiles]);
		}
	};

	const removeFile = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = () => {
		onUpload(files);
		setFiles([]);
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>Tải lên hồ sơ</DialogTitle>
				<DialogDescription>
					Tải lên các tệp đính kèm cho hồ sơ khám bệnh này
				</DialogDescription>
			</DialogHeader>

			<div className="space-y-4 py-4">
				<div
					className={`border-2 border-dashed rounded-lg p-6 text-center ${
						isDragging
							? "border-blue-500 bg-blue-50"
							: "border-gray-300"
					}`}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<div className="flex flex-col items-center">
						<Upload className="h-10 w-10 text-gray-400 mb-3" />
						<p className="text-sm font-medium mb-1">
							Kéo thả tệp tại đây hoặc
						</p>
						<Label
							htmlFor="file-upload"
							className="cursor-pointer text-blue-600 hover:text-blue-800"
						>
							Chọn tệp
						</Label>
						<Input
							id="file-upload"
							type="file"
							multiple
							className="hidden"
							onChange={handleFileChange}
						/>
						<p className="text-xs text-gray-500 mt-2">
							Hỗ trợ các định dạng: PDF, JPG, PNG, DOCX
						</p>
					</div>
				</div>

				{files.length > 0 && (
					<div className="space-y-2">
						<h4 className="text-sm font-medium">
							Danh sách tệp ({files.length})
						</h4>
						<div className="max-h-48 overflow-y-auto space-y-2">
							{files.map((file, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
								>
									<div className="flex items-center">
										<File className="h-4 w-4 text-gray-500 mr-2" />
										<span className="text-sm truncate max-w-[250px]">
											{file.name}
										</span>
										<span className="text-xs text-gray-500 ml-2">
											({(file.size / 1024).toFixed(1)} KB)
										</span>
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => removeFile(index)}
									>
										<Trash2 className="h-4 w-4 text-red-500" />
									</Button>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			<DialogFooter>
				<Button variant="outline" onClick={onCancel}>
					Hủy
				</Button>
				<Button onClick={handleSubmit} disabled={files.length === 0}>
					Tải lên
				</Button>
			</DialogFooter>
		</>
	);
}
