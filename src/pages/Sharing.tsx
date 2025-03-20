import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
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
	Users,
	UserPlus,
	Share2,
	UserX,
	Copy,
	ArrowLeft,
	UserCheck,
	Mail,
	Clock,
	Calendar,
} from "lucide-react";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import FamilyMembersList from "@/components/medical/FamilyMembersList";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

// Sample data
const medicalRecordsData = {
	1: {
		name: "Smith Family",
		members: [
			{
				id: 101,
				name: "John Smith",
				age: 42,
				relation: "Father",
				bloodType: "O+",
				height: "180 cm",
				weight: "78 kg",
				allergies: ["Penicillin"],
				chronicConditions: ["Hypertension"],
			},
			{
				id: 102,
				name: "Mary Smith",
				age: 38,
				relation: "Mother",
				bloodType: "A-",
				height: "165 cm",
				weight: "62 kg",
				allergies: ["Pollen"],
				chronicConditions: [],
			},
			{
				id: 103,
				name: "James Smith",
				age: 12,
				relation: "Son",
				bloodType: "O+",
				height: "152 cm",
				weight: "45 kg",
				allergies: [],
				chronicConditions: ["Asthma"],
			},
			{
				id: 104,
				name: "Emily Smith",
				age: 8,
				relation: "Daughter",
				bloodType: "A+",
				height: "128 cm",
				weight: "32 kg",
				allergies: ["Nuts"],
				chronicConditions: [],
			},
		],
	},
};

// Sample sharing data
const sharingData = [
	{
		id: 1,
		name: "Dr. Wilson",
		email: "dr.wilson@example.com",
		role: "Doctor",
		shared: "Full Family",
		expiration: "No expiration",
		status: "Active",
	},
	{
		id: 2,
		name: "Dr. Roberts",
		email: "dr.roberts@example.com",
		role: "Dentist",
		shared: "James Smith",
		expiration: "2024-12-31",
		status: "Active",
	},
	{
		id: 3,
		name: "Hospital Records",
		email: "records@hospital.com",
		role: "Healthcare Provider",
		shared: "John Smith",
		expiration: "2024-08-15",
		status: "Active",
	},
	{
		id: 4,
		name: "Dr. Thompson",
		email: "dr.thompson@example.com",
		role: "Specialist",
		shared: "Emily Smith",
		expiration: "2024-09-20",
		status: "Expired",
	},
];

const RecordSharing = () => {
	const [activeMember, setActiveMember] = useState<number | null>(101);
	const [showDialog, setShowDialog] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [sharingLinks, setSharingLinks] = useState<{ [key: string]: string }>(
		{}
	);

	// Get family data based on the familyId from URL params
	const familyData = medicalRecordsData[1];

	if (!familyData) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center">
				<h2 className="text-2xl mb-4">Family not found</h2>
				<Button asChild>
					<Link to="/families">Return to Families</Link>
				</Button>
			</div>
		);
	}

	const activeShares = sharingData
		.filter((share) => {
			if (!searchTerm) return true;
			return (
				share.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				share.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				share.role.toLowerCase().includes(searchTerm.toLowerCase())
			);
		})
		.filter((share) => {
			if (activeMember === null) return true;
			return (
				share.shared ===
					familyData.members.find((m) => m.id === activeMember)
						?.name || share.shared === "Full Family"
			);
		});

	const handleMemberClick = (memberId: number | null) => {
		setActiveMember(memberId);
	};

	const generateSharingLink = (type: "family" | "member", id: number) => {
		const link = `https://familyhealth.example.com/shared/${type}/${id}/${Math.random().toString(36).substring(2, 15)}`;
		const key = type === "family" ? "family" : `member-${id}`;
		setSharingLinks({ ...sharingLinks, [key]: link });
		toast("Sharing link generated", {
			description: "Link has been copied to clipboard.",
		});
		navigator.clipboard.writeText(link);
	};

	const handleAddShare = () => {
		toast("Share added", {
			description: "The new share has been added successfully.",
		});
		setShowDialog(false);
	};

	const handleRevokeAccess = (shareId: number) => {
		toast("Access revoked", {
			description: "The access has been revoked successfully.",
		});
	};

	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex-grow bg-slate-50">
				<div className="container py-6 px-4 sm:px-6 lg:px-8 max-w-6xl">
					<div className="flex flex-col space-y-6">
						{/* Header with breadcrumb and title */}
						<div>
							<div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
								<Link
									to="/families"
									className="hover:text-health-blue"
								>
									Families
								</Link>
								<span>/</span>
								<Link
									to={`/families/${1}`}
									className="hover:text-health-blue"
								>
									{familyData.name}
								</Link>
								<span>/</span>
								<span className="font-medium text-gray-700">
									Share Management
								</span>
							</div>
							<div className="flex items-center justify-between">
								<Button
									variant="ghost"
									className="text-gray-500 -ml-3 mb-2"
									asChild
								>
									<Link to={`/families/${1}`}>
										<ArrowLeft className="mr-1 h-4 w-4" />
										Back to Family
									</Link>
								</Button>
								<Dialog
									open={showDialog}
									onOpenChange={setShowDialog}
								>
									<DialogTrigger asChild>
										<Button className="bg-health-blue hover:bg-health-blue/90">
											<UserPlus className="mr-2 h-4 w-4" />
											Share Medical Records
										</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>
												Share Medical Records
											</DialogTitle>
											<DialogDescription>
												Share medical records with
												healthcare providers or family
												members
											</DialogDescription>
										</DialogHeader>
										<div className="grid gap-4 py-4">
											<div className="grid grid-cols-4 items-center gap-4">
												<label className="text-right text-sm">
													Name
												</label>
												<Input
													className="col-span-3"
													placeholder="e.g. Dr. Johnson"
												/>
											</div>
											<div className="grid grid-cols-4 items-center gap-4">
												<label className="text-right text-sm">
													Email
												</label>
												<Input
													className="col-span-3"
													type="email"
													placeholder="e.g. doctor@example.com"
												/>
											</div>
											<div className="grid grid-cols-4 items-center gap-4">
												<label className="text-right text-sm">
													Role
												</label>
												<Select>
													<SelectTrigger className="col-span-3">
														<SelectValue placeholder="Select role" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="doctor">
															Doctor
														</SelectItem>
														<SelectItem value="specialist">
															Specialist
														</SelectItem>
														<SelectItem value="nurse">
															Nurse
														</SelectItem>
														<SelectItem value="family">
															Family Member
														</SelectItem>
														<SelectItem value="other">
															Other
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="grid grid-cols-4 items-center gap-4">
												<label className="text-right text-sm">
													Share
												</label>
												<Select>
													<SelectTrigger className="col-span-3">
														<SelectValue placeholder="Select records to share" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="full-family">
															Full Family Records
														</SelectItem>
														{familyData.members.map(
															(member) => (
																<SelectItem
																	key={
																		member.id
																	}
																	value={`member-${member.id}`}
																>
																	{
																		member.name
																	}
																	's Records
																</SelectItem>
															)
														)}
													</SelectContent>
												</Select>
											</div>
											<div className="grid grid-cols-4 items-center gap-4">
												<label className="text-right text-sm">
													Expires
												</label>
												<Select>
													<SelectTrigger className="col-span-3">
														<SelectValue placeholder="Select expiration" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="never">
															No expiration
														</SelectItem>
														<SelectItem value="7days">
															7 days
														</SelectItem>
														<SelectItem value="30days">
															30 days
														</SelectItem>
														<SelectItem value="90days">
															90 days
														</SelectItem>
														<SelectItem value="1year">
															1 year
														</SelectItem>
														<SelectItem value="custom">
															Custom date
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="grid grid-cols-4 items-center gap-4">
												<div className="text-right text-sm">
													Notify
												</div>
												<div className="col-span-3 flex items-center space-x-2">
													<Switch id="notify" />
													<label
														htmlFor="notify"
														className="text-sm"
													>
														Send email notification
													</label>
												</div>
											</div>
										</div>
										<DialogFooter>
											<Button
												type="submit"
												onClick={handleAddShare}
											>
												Share
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</div>
						</div>

						{/* Filter by family member */}
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center">
									<Users className="mr-2 h-5 w-5 text-health-blue" />
									Filter by Family Member
								</CardTitle>
								<CardDescription>
									Select a family member to view their shared
									records
								</CardDescription>
							</CardHeader>
							<CardContent>
								<FamilyMembersList
									members={familyData.members}
									activeMember={activeMember}
									onMemberClick={handleMemberClick}
								/>
							</CardContent>
						</Card>

						{/* Generate sharing links */}
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center">
									<Share2 className="mr-2 h-5 w-5 text-health-blue" />
									Quick Sharing Links
								</CardTitle>
								<CardDescription>
									Generate temporary links to share medical
									records
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex flex-col gap-2">
										<div className="flex justify-between items-center">
											<div className="flex items-center gap-2">
												<Users className="h-5 w-5 text-health-blue" />
												<span className="font-medium">
													Full Family Records
												</span>
											</div>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													generateSharingLink(
														"family",
														Number(1)
													)
												}
											>
												Generate Link
											</Button>
										</div>
										{sharingLinks["family"] && (
											<div className="flex items-center gap-2 bg-slate-50 p-2 rounded-md text-sm">
												<Input
													value={
														sharingLinks["family"]
													}
													readOnly
													className="h-8"
												/>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8"
													onClick={() => {
														navigator.clipboard.writeText(
															sharingLinks[
																"family"
															]
														);
														toast("Link copied", {
															description:
																"Sharing link copied to clipboard.",
														});
													}}
												>
													<Copy className="h-4 w-4" />
												</Button>
											</div>
										)}
									</div>

									{activeMember !== null && (
										<div className="flex flex-col gap-2">
											<div className="flex justify-between items-center">
												<div className="flex items-center gap-2">
													<UserCheck className="h-5 w-5 text-health-blue" />
													<span className="font-medium">
														{
															familyData.members.find(
																(m) =>
																	m.id ===
																	activeMember
															)?.name
														}
														's Records
													</span>
												</div>
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														generateSharingLink(
															"member",
															activeMember
														)
													}
												>
													Generate Link
												</Button>
											</div>
											{sharingLinks[
												`member-${activeMember}`
											] && (
												<div className="flex items-center gap-2 bg-slate-50 p-2 rounded-md text-sm">
													<Input
														value={
															sharingLinks[
																`member-${activeMember}`
															]
														}
														readOnly
														className="h-8"
													/>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8"
														onClick={() => {
															navigator.clipboard.writeText(
																sharingLinks[
																	`member-${activeMember}`
																]
															);
															toast(
																"Link copied",
																{
																	description:
																		"Sharing link copied to clipboard.",
																}
															);
														}}
													>
														<Copy className="h-4 w-4" />
													</Button>
												</div>
											)}
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Active Shares Table */}
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<h3 className="text-xl font-bold">
									Active Shares
								</h3>
								<div className="w-64">
									<Input
										placeholder="Search shares..."
										value={searchTerm}
										onChange={(e) =>
											setSearchTerm(e.target.value)
										}
										className="bg-white"
									/>
								</div>
							</div>

							<Card>
								<CardContent className="p-0 overflow-auto">
									{activeShares.length > 0 ? (
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Name</TableHead>
													<TableHead>Email</TableHead>
													<TableHead>Role</TableHead>
													<TableHead>
														Shared Records
													</TableHead>
													<TableHead>
														Expiration
													</TableHead>
													<TableHead>
														Status
													</TableHead>
													<TableHead className="text-right">
														Actions
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{activeShares.map((share) => (
													<TableRow key={share.id}>
														<TableCell className="font-medium">
															{share.name}
														</TableCell>
														<TableCell>
															{share.email}
														</TableCell>
														<TableCell>
															{share.role}
														</TableCell>
														<TableCell>
															{share.shared}
														</TableCell>
														<TableCell>
															<div className="flex items-center gap-2">
																{share.expiration ===
																"No expiration" ? (
																	<span>
																		No
																		expiration
																	</span>
																) : (
																	<>
																		<Calendar className="h-3 w-3 text-gray-500" />
																		<span>
																			{
																				share.expiration
																			}
																		</span>
																	</>
																)}
															</div>
														</TableCell>
														<TableCell>
															<Badge
																className={
																	share.status ===
																	"Active"
																		? "bg-green-100 text-green-800 hover:bg-green-100"
																		: "bg-gray-100 text-gray-800 hover:bg-gray-100"
																}
															>
																{share.status}
															</Badge>
														</TableCell>
														<TableCell className="text-right">
															<DropdownMenu>
																<DropdownMenuTrigger
																	asChild
																>
																	<Button
																		variant="ghost"
																		size="icon"
																		className="h-8 w-8"
																	>
																		<span className="sr-only">
																			Open
																			menu
																		</span>
																		<svg
																			width="15"
																			height="15"
																			viewBox="0 0 15 15"
																			fill="none"
																			xmlns="http://www.w3.org/2000/svg"
																			className="h-4 w-4"
																		>
																			<path
																				d="M8.625 2.5C8.625 3.12132 8.12132 3.625 7.5 3.625C6.87868 3.625 6.375 3.12132 6.375 2.5C6.375 1.87868 6.87868 1.375 7.5 1.375C8.12132 1.375 8.625 1.87868 8.625 2.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM8.625 12.5C8.625 13.1213 8.12132 13.625 7.5 13.625C6.87868 13.625 6.375 13.1213 6.375 12.5C6.375 11.8787 6.87868 11.375 7.5 11.375C8.12132 11.375 8.625 11.8787 8.625 12.5Z"
																				fill="currentColor"
																			></path>
																		</svg>
																	</Button>
																</DropdownMenuTrigger>
																<DropdownMenuContent align="end">
																	<DropdownMenuLabel>
																		Actions
																	</DropdownMenuLabel>
																	<DropdownMenuSeparator />
																	<DropdownMenuItem
																		className="flex items-center gap-2 cursor-pointer"
																		onClick={() => {
																			toast(
																				"Email sent",
																				{
																					description:
																						"A reminder email has been sent.",
																				}
																			);
																		}}
																	>
																		<Mail className="h-4 w-4" />
																		Send
																		Reminder
																	</DropdownMenuItem>
																	<DropdownMenuItem
																		className="flex items-center gap-2 cursor-pointer"
																		onClick={() => {
																			toast(
																				"Expiration extended",
																				{
																					description:
																						"The expiration date has been extended.",
																				}
																			);
																		}}
																	>
																		<Clock className="h-4 w-4" />
																		Extend
																		Expiration
																	</DropdownMenuItem>
																	<DropdownMenuItem
																		className="flex items-center gap-2 text-destructive cursor-pointer"
																		onClick={() =>
																			handleRevokeAccess(
																				share.id
																			)
																		}
																	>
																		<UserX className="h-4 w-4" />
																		Revoke
																		Access
																	</DropdownMenuItem>
																</DropdownMenuContent>
															</DropdownMenu>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									) : (
										<div className="text-center py-10">
											<Share2 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
											<h3 className="text-lg font-medium text-gray-600">
												No active shares found
											</h3>
											<p className="text-gray-500">
												{searchTerm
													? "Try adjusting your search term"
													: "Share your medical records with healthcare providers"}
											</p>
											{!searchTerm && (
												<Button
													onClick={() =>
														setShowDialog(true)
													}
													className="mt-4 bg-health-blue hover:bg-health-blue/90"
												>
													<UserPlus className="mr-2 h-4 w-4" />
													Share Medical Records
												</Button>
											)}
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecordSharing;
