import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { ProfileDocument, ProfileDTO } from "@/models/generated";
import {
	FileIcon,
	MoreVertical,
	Plus,
	Pencil,
	Trash2,
	Download,
	Eye,
	Upload,
	X,
} from "lucide-react";
import { format } from "date-fns";
import {
	useCreateDocument,
	useDeleteDocument,
	useGetDocuments,
	useUpdateDocument,
} from "@/queries/generated/profile-document-controller/profile-document-controller";
import { getImageViewUrl } from "@/utils/file";

interface MedicalDocumentsTabProps {
	profile: ProfileDTO;
}

// Zod schema for document form validation
const documentFormSchema = z.object({
	name: z.string().min(1, "Tên tài liệu không được để trống"),
	note: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof documentFormSchema>;
type ProfileDocumentDto = ProfileDocument;
const MedicalDocumentsTab = ({ profile }: MedicalDocumentsTabProps) => {
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [currentDocument, setCurrentDocument] =
		useState<ProfileDocumentDto | null>(null);
	const [files, setFiles] = useState<File[]>([]);
	const [fileRemoveList, setFileRemoveList] = useState<string[]>([]);

	const { data: documents = [], refetch } = useGetDocuments(profile.id!);

	const { mutate: deleteDocument } = useDeleteDocument({
		mutation: {
			onSuccess: () => {
				toast("Xóa thành công", {
					description: "Tài liệu y tế đã được xóa.",
				});
				refetch();
			},
			onError: () => {
				toast.error("Xóa tài liệu thất bại");
			},
		},
	});

	const { mutate: createDocument } = useCreateDocument({
		mutation: {
			onSuccess: () => {
				toast("Tạo tài liệu thành công", {
					description: "Tài liệu y tế đã được tạo.",
				});
				refetch();
			},
			onError: () => {
				toast.error("Tạo tài liệu thất bại");
			},
		},
		request: {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		},
	});

	const { mutate: updateDocument } = useUpdateDocument({
		mutation: {
			onSuccess: () => {
				toast("Cập nhật thành công", {
					description: "Tài liệu y tế đã được cập nhật.",
				});
				refetch();
			},
			onError: () => {
				toast.error("Cập nhật tài liệu thất bại");
			},
		},
	});

	// Form for adding new documents
	const addForm = useForm<DocumentFormValues>({
		resolver: zodResolver(documentFormSchema),
		defaultValues: {
			name: "",
			note: "",
		},
	});

	// Form for editing documents
	const editForm = useForm<DocumentFormValues>({
		resolver: zodResolver(documentFormSchema),
		defaultValues: {
			name: "",
			note: "",
		},
	});

	const resetForms = () => {
		addForm.reset();
		editForm.reset();
		setFiles([]);
		setFileRemoveList([]);
	};

	const handleOpenAddDialog = () => {
		resetForms();
		setIsAddDialogOpen(true);
	};

	const handleOpenEditDialog = (document: ProfileDocumentDto) => {
		setCurrentDocument(document);
		editForm.reset({
			name: document.name,
			note: document.note,
		});
		setFileRemoveList([]);
		setIsEditDialogOpen(true);
	};

	const handleOpenViewDialog = (document: ProfileDocumentDto) => {
		setCurrentDocument(document);
		setIsViewDialogOpen(true);
	};

	const handleOpenDeleteDialog = (document: ProfileDocumentDto) => {
		setCurrentDocument(document);
		setIsDeleteDialogOpen(true);
	};

	const handleAddDocument = (values: DocumentFormValues) => {
		// Here you would normally prepare form data and call the API
		createDocument({
			data: {
				files: files,
				name: values.name!,
				note: values.note || "",
				profileId: profile.id!,
			},
		});

		setIsAddDialogOpen(false);
		resetForms();
	};

	const handleEditDocument = (values: DocumentFormValues) => {
		if (!currentDocument) return;

		// Here you would prepare form data and call the API
		updateDocument({
			id: currentDocument.id!,
			data: {
				newFiles: files,
				name: values.name,
				note: values.note || "",
				removeFiles: fileRemoveList,
			},
		});

		setIsEditDialogOpen(false);
		resetForms();
	};

	const handleDeleteDocument = () => {
		if (!currentDocument) return;

		deleteDocument({
			id: currentDocument.id!,
		});

		setIsDeleteDialogOpen(false);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files);
			setFiles([...files, ...newFiles]);
		}
	};

	const removeFile = (fileName: string, isExisting: boolean = false) => {
		if (isExisting) {
			setFileRemoveList([...fileRemoveList, fileName]);
		} else {
			setFiles(files.filter((file) => file.name !== fileName));
		}
	};

	const formatDate = (dateString: string) => {
		return format(new Date(dateString), "dd/MM/yyyy HH:mm");
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<div>
					<CardTitle>Tài liệu y tế</CardTitle>
					<CardDescription>
						Quản lý các hồ sơ, đơn thuốc và tài liệu y tế
					</CardDescription>
				</div>
				<Button onClick={handleOpenAddDialog}>
					<Plus className="mr-2 h-4 w-4" />
					Thêm tài liệu
				</Button>
			</CardHeader>

			<CardContent>
				{documents.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<FileIcon className="h-12 w-12 text-gray-400 mb-4" />
						<h3 className="text-lg font-medium">
							Chưa có tài liệu y tế
						</h3>
						<p className="text-sm text-muted-foreground mt-2">
							Thêm tài liệu y tế như kết quả xét nghiệm, đơn
							thuốc, hoặc báo cáo khám bệnh.
						</p>
						<Button className="mt-4" onClick={handleOpenAddDialog}>
							<Plus className="mr-2 h-4 w-4" />
							Thêm tài liệu đầu tiên
						</Button>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Tên tài liệu</TableHead>
								<TableHead>Ngày tạo</TableHead>
								<TableHead>Ghi chú</TableHead>
								<TableHead>Tệp đính kèm</TableHead>
								<TableHead className="w-[100px]"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{documents.map((document) => (
								<TableRow key={document.id}>
									<TableCell className="font-medium">
										{document.name}
									</TableCell>
									<TableCell>
										{formatDate(document.createdAt!)}
									</TableCell>
									<TableCell>{document.note}</TableCell>
									<TableCell>
										{document.attachments!.length} tệp
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() =>
														handleOpenViewDialog(
															document!
														)
													}
												>
													<Eye className="mr-2 h-4 w-4" />
													Xem
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														handleOpenEditDialog(
															document
														)
													}
												>
													<Pencil className="mr-2 h-4 w-4" />
													Chỉnh sửa
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														handleOpenDeleteDialog(
															document
														)
													}
												>
													<Trash2 className="mr-2 h-4 w-4" />
													Xóa
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}

				{/* Add Document Dialog */}
				<Dialog
					open={isAddDialogOpen}
					onOpenChange={(open) => {
						if (!open) resetForms();
						setIsAddDialogOpen(open);
					}}
				>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Thêm tài liệu y tế</DialogTitle>
							<DialogDescription>
								Tải lên tài liệu y tế cho hồ sơ của{" "}
								{profile.fullName || "bạn"}
							</DialogDescription>
						</DialogHeader>

						<Form {...addForm}>
							<form
								onSubmit={addForm.handleSubmit(
									handleAddDocument
								)}
								className="space-y-4 py-4"
							>
								<FormField
									control={addForm.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tên tài liệu</FormLabel>
											<FormControl>
												<Input
													placeholder="VD: Kết quả xét nghiệm, Đơn thuốc..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={addForm.control}
									name="note"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Ghi chú</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Thêm thông tin chi tiết về tài liệu này"
													rows={3}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="space-y-2">
									<FormLabel>Tệp đính kèm</FormLabel>
									<div className="border rounded-md p-4">
										{files.length > 0 && (
											<div className="space-y-2 mb-4">
												{files.map((file, index) => (
													<div
														key={index}
														className="flex items-center justify-between bg-muted/50 p-2 rounded"
													>
														<div className="flex items-center">
															<FileIcon className="h-4 w-4 mr-2" />
															<span className="text-sm truncate max-w-[200px]">
																{file.name}
															</span>
														</div>
														<Button
															variant="ghost"
															size="icon"
															type="button"
															onClick={() =>
																removeFile(
																	file.name
																)
															}
														>
															<X className="h-4 w-4" />
														</Button>
													</div>
												))}
											</div>
										)}
										<div className="flex items-center justify-center">
											<label
												htmlFor="add-files"
												className="cursor-pointer"
											>
												<div className="flex flex-col items-center gap-1 py-4">
													<Upload className="h-8 w-8 text-muted-foreground" />
													<span className="text-sm font-medium">
														Tải lên tệp
													</span>
													<span className="text-xs text-muted-foreground">
														PDF, JPG, PNG (tối đa
														10MB)
													</span>
												</div>
												<input
													id="add-files"
													type="file"
													multiple
													required
													className="hidden"
													onChange={handleFileChange}
												/>
											</label>
										</div>
									</div>
									{files.length === 0 && (
										<p className="text-sm text-destructive">
											Vui lòng tải lên ít nhất một tệp
										</p>
									)}
								</div>

								<DialogFooter className="sm:justify-end pt-4">
									<Button
										variant="outline"
										type="button"
										onClick={() =>
											setIsAddDialogOpen(false)
										}
									>
										Hủy
									</Button>
									<Button
										type="submit"
										disabled={
											!addForm.formState.isValid ||
											files.length === 0
										}
									>
										Lưu
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>

				{/* View Document Dialog */}
				<Dialog
					open={isViewDialogOpen}
					onOpenChange={setIsViewDialogOpen}
				>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>{currentDocument?.name}</DialogTitle>
							<DialogDescription>
								Được tạo vào:{" "}
								{currentDocument &&
									formatDate(currentDocument.createdAt!)}
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<h4 className="text-sm font-medium">Ghi chú</h4>
								<p className="text-sm">
									{currentDocument?.note ||
										"Không có ghi chú"}
								</p>
							</div>
							<div className="space-y-2">
								<h4 className="text-sm font-medium">
									Tệp đính kèm
								</h4>
								<div className="border rounded-md p-2 divide-y">
									{currentDocument?.attachments!.map(
										(file, index) => (
											<div
												key={index}
												className="flex items-center justify-between py-2"
											>
												<div className="flex items-center">
													<FileIcon className="h-4 w-4 mr-2" />
													<span className="text-sm">
														{file}
													</span>
												</div>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => {
														window.open(
															getImageViewUrl(
																file
															),
															"_blank"
														);
													}}
												>
													<Download className="h-4 w-4 mr-2" />
													Tải xuống
												</Button>
											</div>
										)
									)}
								</div>
							</div>
						</div>
						<DialogFooter className="sm:justify-end">
							<Button
								variant="outline"
								onClick={() => setIsViewDialogOpen(false)}
							>
								Đóng
							</Button>
							<Button
								onClick={() => {
									setIsViewDialogOpen(false);
									if (currentDocument)
										handleOpenEditDialog(currentDocument);
								}}
							>
								Chỉnh sửa
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Edit Document Dialog */}
				<Dialog
					open={isEditDialogOpen}
					onOpenChange={(open) => {
						if (!open) resetForms();
						setIsEditDialogOpen(open);
					}}
				>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Chỉnh sửa tài liệu y tế</DialogTitle>
							<DialogDescription>
								Cập nhật thông tin cho tài liệu "
								{currentDocument?.name}"
							</DialogDescription>
						</DialogHeader>

						<Form {...editForm}>
							<form
								onSubmit={editForm.handleSubmit(
									handleEditDocument
								)}
								className="space-y-4 py-4"
							>
								<FormField
									control={editForm.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tên tài liệu</FormLabel>
											<FormControl>
												<Input
													placeholder="VD: Kết quả xét nghiệm, Đơn thuốc..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={editForm.control}
									name="note"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Ghi chú</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Thêm thông tin chi tiết về tài liệu này"
													rows={3}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="space-y-2">
									<FormLabel>Tệp hiện tại</FormLabel>
									<div className="border rounded-md p-2 divide-y">
										{currentDocument?.attachments!.map(
											(file, index) =>
												!fileRemoveList.includes(
													file
												) && (
													<div
														key={index}
														className="flex items-center justify-between py-2"
													>
														<div className="flex items-center">
															<FileIcon className="h-4 w-4 mr-2" />
															<span className="text-sm">
																{file}
															</span>
														</div>
														<Button
															variant="ghost"
															size="icon"
															type="button"
															onClick={() =>
																removeFile(
																	file,
																	true
																)
															}
														>
															<X className="h-4 w-4" />
														</Button>
													</div>
												)
										)}
									</div>
								</div>

								<div className="space-y-2">
									<FormLabel>Thêm tệp mới</FormLabel>
									<div className="border rounded-md p-4">
										{files.length > 0 && (
											<div className="space-y-2 mb-4">
												{files.map((file, index) => (
													<div
														key={index}
														className="flex items-center justify-between bg-muted/50 p-2 rounded"
													>
														<div className="flex items-center">
															<FileIcon className="h-4 w-4 mr-2" />
															<span className="text-sm truncate max-w-[200px]">
																{file.name}
															</span>
														</div>
														<Button
															variant="ghost"
															size="icon"
															type="button"
															onClick={() =>
																removeFile(
																	file.name
																)
															}
														>
															<X className="h-4 w-4" />
														</Button>
													</div>
												))}
											</div>
										)}
										<div className="flex items-center justify-center">
											<label
												htmlFor="edit-files"
												className="cursor-pointer"
											>
												<div className="flex flex-col items-center gap-1 py-4">
													<Upload className="h-8 w-8 text-muted-foreground" />
													<span className="text-sm font-medium">
														Tải lên tệp
													</span>
													<span className="text-xs text-muted-foreground">
														PDF, JPG, PNG (tối đa
														10MB)
													</span>
												</div>
												<input
													id="edit-files"
													type="file"
													multiple
													className="hidden"
													onChange={handleFileChange}
												/>
											</label>
										</div>
									</div>
									{fileRemoveList.length ===
										currentDocument?.attachments!.length &&
										files.length === 0 && (
											<p className="text-sm text-destructive">
												Vui lòng giữ lại ít nhất một tệp
												hoặc tải lên tệp mới
											</p>
										)}
								</div>

								<DialogFooter className="sm:justify-end pt-4">
									<Button
										variant="outline"
										type="button"
										onClick={() =>
											setIsEditDialogOpen(false)
										}
									>
										Hủy
									</Button>
									<Button
										type="submit"
										disabled={
											!editForm.formState.isValid ||
											(fileRemoveList.length ===
												currentDocument?.attachments!
													.length &&
												files.length === 0)
										}
									>
										Lưu thay đổi
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>

				{/* Delete Confirmation Dialog */}
				<Dialog
					open={isDeleteDialogOpen}
					onOpenChange={setIsDeleteDialogOpen}
				>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Xác nhận xóa tài liệu</DialogTitle>
							<DialogDescription>
								Bạn có chắc chắn muốn xóa tài liệu "
								{currentDocument?.name}"? Hành động này không
								thể hoàn tác.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter className="sm:justify-end">
							<Button
								variant="outline"
								onClick={() => setIsDeleteDialogOpen(false)}
							>
								Hủy
							</Button>
							<Button
								variant="destructive"
								onClick={handleDeleteDocument}
							>
								Xóa tài liệu
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	);
};

export default MedicalDocumentsTab;
