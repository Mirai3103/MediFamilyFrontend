import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	FileText,
	Pill,
	Calendar,
	Clipboard,
	Plus,
	Download,
	Search,
} from "lucide-react";

import MedicalRecordCard from "@/components/medical/MedicalRecordCard";
import FamilyMembersList from "@/components/medical/FamilyMembersList";
import { Link } from "@tanstack/react-router";

// Sample medical records data
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
			},
			{
				id: 102,
				name: "Mary Smith",
				age: 38,
				relation: "Mother",
				bloodType: "A-",
			},
			{
				id: 103,
				name: "James Smith",
				age: 12,
				relation: "Son",
				bloodType: "O+",
			},
			{
				id: 104,
				name: "Emily Smith",
				age: 8,
				relation: "Daughter",
				bloodType: "A+",
			},
		],
		records: [
			{
				id: 1001,
				date: "2023-05-15",
				title: "Annual Physical - John",
				doctor: "Dr. Wilson",
				type: "Check-up",
				description:
					"Annual physical examination. Blood pressure: 120/80. Weight: 78kg. All tests normal.",
				memberId: 101,
			},
			{
				id: 1002,
				date: "2023-06-20",
				title: "Vaccination - Emily",
				doctor: "Dr. Roberts",
				type: "Vaccination",
				description:
					"Received annual flu vaccination. No adverse reactions observed.",
				memberId: 104,
			},
			{
				id: 1003,
				date: "2023-07-08",
				title: "Dental Check - Family",
				doctor: "Dr. Thompson",
				type: "Dental",
				description:
					"Family dental checkup. James needs braces in 6 months. Others good dental health.",
				memberId: null,
			},
			{
				id: 1004,
				date: "2023-08-12",
				title: "Allergic Reaction - Mary",
				doctor: "Dr. Garcia",
				type: "Emergency",
				description:
					"Treated for mild allergic reaction to new medication. Prescribed antihistamines.",
				memberId: 102,
			},
		],
		medications: [
			{
				id: 2001,
				name: "Lisinopril",
				dosage: "10mg",
				frequency: "Once daily",
				forMember: "John Smith",
				startDate: "2023-01-10",
				endDate: "Ongoing",
			},
			{
				id: 2002,
				name: "Cetirizine",
				dosage: "5mg",
				frequency: "As needed",
				forMember: "Mary Smith",
				startDate: "2023-08-12",
				endDate: "2023-08-26",
			},
			{
				id: 2003,
				name: "Vitamin D3",
				dosage: "1000 IU",
				frequency: "Once daily",
				forMember: "All members",
				startDate: "2023-02-15",
				endDate: "Ongoing",
			},
		],
		appointments: [
			{
				id: 3001,
				date: "2023-10-05",
				time: "14:00",
				doctor: "Dr. Wilson",
				forMember: "John Smith",
				purpose: "Blood Pressure Follow-up",
			},
			{
				id: 3002,
				date: "2023-10-12",
				time: "10:30",
				doctor: "Dr. Roberts",
				forMember: "Emily Smith",
				purpose: "School Health Form",
			},
			{
				id: 3003,
				date: "2023-11-20",
				time: "09:15",
				doctor: "Dr. Thompson",
				forMember: "James Smith",
				purpose: "Orthodontic Consultation",
			},
		],
	},
	// More families would be here in a real application
};

const FamilyMedicalRecords = () => {
	const [activeTab, setActiveTab] = useState("overview");
	const [searchTerm, setSearchTerm] = useState("");
	const [activeMember, setActiveMember] = useState<number | null>(null);

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

	// Filter records based on search term and active member
	const filteredRecords = familyData.records.filter((record) => {
		const matchesSearch =
			record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			record.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesMember = activeMember
			? record.memberId === activeMember
			: true;
		return matchesSearch && matchesMember;
	});

	// Filter medications based on active member
	const filteredMedications = familyData.medications.filter((med) => {
		if (!activeMember) return true;
		return (
			med.forMember ===
				familyData.members.find((m) => m.id === activeMember)?.name ||
			med.forMember === "All members"
		);
	});

	// Filter appointments based on active member
	const filteredAppointments = familyData.appointments.filter(
		(appointment) => {
			if (!activeMember) return true;
			return (
				appointment.forMember ===
				familyData.members.find((m) => m.id === activeMember)?.name
			);
		}
	);

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
								<span className="font-medium text-gray-700">
									{familyData.name}
								</span>
							</div>
							<div className="flex items-center justify-between mb-4">
								<div>
									<h1 className="text-2xl font-bold text-gray-900">
										{familyData.name} - Hồ Sơ Y Tế
									</h1>
									<p className="text-gray-500 mt-1">
										Manage medical records, medications, and
										appointments
									</p>
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										className="bg-white"
									>
										<Download className="mr-2 h-4 w-4" />
										Export Records
									</Button>
									<Button className="bg-health-blue hover:bg-health-blue/90">
										<Plus className="mr-2 h-4 w-4" />
										Add Record
									</Button>
								</div>
							</div>
						</div>

						{/* Family members section */}
						<FamilyMembersList
							members={familyData.members}
							activeMember={activeMember}
							onMemberClick={setActiveMember}
							familyId={1}
							linkToMemberDetail={true}
						/>

						{/* Main content tabs */}
						<div className="flex items-center space-x-2 mt-4">
							<div className="relative flex-grow">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
								<Input
									placeholder="Search medical records..."
									className="pl-8 bg-white"
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
								/>
							</div>
						</div>

						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="space-y-4"
						>
							<TabsList className="bg-white border">
								<TabsTrigger
									value="overview"
									className="data-[state=active]:bg-health-blue/10"
								>
									<FileText className="mr-2 h-4 w-4" />
									Overview
								</TabsTrigger>
								<TabsTrigger
									value="records"
									className="data-[state=active]:bg-health-blue/10"
								>
									<Clipboard className="mr-2 h-4 w-4" />
									Medical Records
								</TabsTrigger>
								<TabsTrigger
									value="medications"
									className="data-[state=active]:bg-health-blue/10"
								>
									<Pill className="mr-2 h-4 w-4" />
									Medications
								</TabsTrigger>
								<TabsTrigger
									value="appointments"
									className="data-[state=active]:bg-health-blue/10"
								>
									<Calendar className="mr-2 h-4 w-4" />
									Appointments
								</TabsTrigger>
							</TabsList>

							{/* Overview Tab Content */}
							<TabsContent value="overview" className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-lg flex items-center">
												<FileText className="mr-2 h-5 w-5 text-health-blue" />
												Recent Records
											</CardTitle>
										</CardHeader>
										<CardContent>
											<ul className="space-y-3">
												{familyData.records
													.slice(0, 3)
													.map((record) => (
														<li
															key={record.id}
															className="text-sm border-b pb-2"
														>
															<div className="font-medium">
																{record.title}
															</div>
															<div className="text-gray-500 flex justify-between">
																<span>
																	{
																		record.date
																	}
																</span>
																<span>
																	{
																		record.doctor
																	}
																</span>
															</div>
														</li>
													))}
											</ul>
										</CardContent>
										<CardFooter>
											<Button
												variant="ghost"
												size="sm"
												className="w-full text-health-blue"
												onClick={() =>
													setActiveTab("records")
												}
											>
												View All Records
											</Button>
										</CardFooter>
									</Card>

									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-lg flex items-center">
												<Pill className="mr-2 h-5 w-5 text-health-blue" />
												Current Medications
											</CardTitle>
										</CardHeader>
										<CardContent>
											<ul className="space-y-3">
												{familyData.medications
													.slice(0, 3)
													.map((med) => (
														<li
															key={med.id}
															className="text-sm border-b pb-2"
														>
															<div className="font-medium">
																{med.name} (
																{med.dosage})
															</div>
															<div className="text-gray-500 flex justify-between">
																<span>
																	{
																		med.frequency
																	}
																</span>
																<span>
																	For:{" "}
																	{
																		med.forMember
																	}
																</span>
															</div>
														</li>
													))}
											</ul>
										</CardContent>
										<CardFooter>
											<Button
												variant="ghost"
												size="sm"
												className="w-full text-health-blue"
												onClick={() =>
													setActiveTab("medications")
												}
											>
												View All Medications
											</Button>
										</CardFooter>
									</Card>

									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-lg flex items-center">
												<Calendar className="mr-2 h-5 w-5 text-health-blue" />
												Upcoming Appointments
											</CardTitle>
										</CardHeader>
										<CardContent>
											<ul className="space-y-3">
												{familyData.appointments
													.slice(0, 3)
													.map((appointment) => (
														<li
															key={appointment.id}
															className="text-sm border-b pb-2"
														>
															<div className="font-medium">
																{
																	appointment.purpose
																}
															</div>
															<div className="text-gray-500 flex justify-between">
																<span>
																	{
																		appointment.date
																	}
																	,{" "}
																	{
																		appointment.time
																	}
																</span>
																<span>
																	{
																		appointment.forMember
																	}
																</span>
															</div>
														</li>
													))}
											</ul>
										</CardContent>
										<CardFooter>
											<Button
												variant="ghost"
												size="sm"
												className="w-full text-health-blue"
												onClick={() =>
													setActiveTab("appointments")
												}
											>
												View All Appointments
											</Button>
										</CardFooter>
									</Card>
								</div>

								<Card className="mt-6">
									<CardHeader>
										<CardTitle>Health Summary</CardTitle>
										<CardDescription>
											Key health indicators for each
											family member
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Name</TableHead>
													<TableHead>Age</TableHead>
													<TableHead>
														Blood Type
													</TableHead>
													<TableHead>
														Allergies
													</TableHead>
													<TableHead>
														Last Check-up
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{familyData.members.map(
													(member) => (
														<TableRow
															key={member.id}
														>
															<TableCell className="font-medium">
																{member.name}
															</TableCell>
															<TableCell>
																{member.age}
															</TableCell>
															<TableCell>
																{
																	member.bloodType
																}
															</TableCell>
															<TableCell>
																None reported
															</TableCell>
															<TableCell>
																{familyData.records.find(
																	(r) =>
																		r.memberId ===
																		member.id
																)?.date ||
																	"No data"}
															</TableCell>
														</TableRow>
													)
												)}
											</TableBody>
										</Table>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Medical Records Tab Content */}
							<TabsContent value="records" className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{filteredRecords.length > 0 ? (
										filteredRecords.map((record) => (
											<MedicalRecordCard
												key={record.id}
												record={record}
												memberName={
													record.memberId
														? familyData.members.find(
																(m) =>
																	m.id ===
																	record.memberId
															)?.name || "Unknown"
														: "All Family"
												}
											/>
										))
									) : (
										<div className="col-span-2 text-center py-10 bg-white rounded-lg border">
											<FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
											<h3 className="text-lg font-medium text-gray-600">
												No medical records found
											</h3>
											<p className="text-gray-500">
												Add new records or adjust your
												search criteria
											</p>
											<Button className="mt-4 bg-health-blue hover:bg-health-blue/90">
												<Plus className="mr-2 h-4 w-4" />
												Add New Record
											</Button>
										</div>
									)}
								</div>
							</TabsContent>

							{/* Medications Tab Content */}
							<TabsContent
								value="medications"
								className="space-y-4"
							>
								<Card>
									<CardHeader>
										<CardTitle>
											Current Medications
										</CardTitle>
										<CardDescription>
											Active and ongoing medications for
											family members
										</CardDescription>
									</CardHeader>
									<CardContent>
										{filteredMedications.length > 0 ? (
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>
															Medication
														</TableHead>
														<TableHead>
															Dosage
														</TableHead>
														<TableHead>
															Frequency
														</TableHead>
														<TableHead>
															For Member
														</TableHead>
														<TableHead>
															Start Date
														</TableHead>
														<TableHead>
															End Date
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{filteredMedications.map(
														(med) => (
															<TableRow
																key={med.id}
															>
																<TableCell className="font-medium">
																	{med.name}
																</TableCell>
																<TableCell>
																	{med.dosage}
																</TableCell>
																<TableCell>
																	{
																		med.frequency
																	}
																</TableCell>
																<TableCell>
																	{
																		med.forMember
																	}
																</TableCell>
																<TableCell>
																	{
																		med.startDate
																	}
																</TableCell>
																<TableCell>
																	{
																		med.endDate
																	}
																</TableCell>
															</TableRow>
														)
													)}
												</TableBody>
											</Table>
										) : (
											<div className="text-center py-10">
												<Pill className="h-12 w-12 mx-auto text-gray-300 mb-3" />
												<h3 className="text-lg font-medium text-gray-600">
													No medications found
												</h3>
												<p className="text-gray-500">
													Add new medications or
													adjust your filter
												</p>
											</div>
										)}
									</CardContent>
									<CardFooter className="flex justify-end">
										<Button className="bg-health-blue hover:bg-health-blue/90">
											<Plus className="mr-2 h-4 w-4" />
											Add Medication
										</Button>
									</CardFooter>
								</Card>
							</TabsContent>

							{/* Appointments Tab Content */}
							<TabsContent
								value="appointments"
								className="space-y-4"
							>
								<Card>
									<CardHeader>
										<CardTitle>
											Upcoming Appointments
										</CardTitle>
										<CardDescription>
											Scheduled appointments for family
											members
										</CardDescription>
									</CardHeader>
									<CardContent>
										{filteredAppointments.length > 0 ? (
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>
															Date
														</TableHead>
														<TableHead>
															Time
														</TableHead>
														<TableHead>
															Purpose
														</TableHead>
														<TableHead>
															Doctor
														</TableHead>
														<TableHead>
															For Member
														</TableHead>
														<TableHead>
															Status
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{filteredAppointments.map(
														(appointment) => (
															<TableRow
																key={
																	appointment.id
																}
															>
																<TableCell>
																	{
																		appointment.date
																	}
																</TableCell>
																<TableCell>
																	{
																		appointment.time
																	}
																</TableCell>
																<TableCell className="font-medium">
																	{
																		appointment.purpose
																	}
																</TableCell>
																<TableCell>
																	{
																		appointment.doctor
																	}
																</TableCell>
																<TableCell>
																	{
																		appointment.forMember
																	}
																</TableCell>
																<TableCell>
																	<Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
																		Scheduled
																	</Badge>
																</TableCell>
															</TableRow>
														)
													)}
												</TableBody>
											</Table>
										) : (
											<div className="text-center py-10">
												<Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
												<h3 className="text-lg font-medium text-gray-600">
													No appointments found
												</h3>
												<p className="text-gray-500">
													Schedule new appointments or
													adjust your filter
												</p>
											</div>
										)}
									</CardContent>
									<CardFooter className="flex justify-end">
										<Button className="bg-health-blue hover:bg-health-blue/90">
											<Plus className="mr-2 h-4 w-4" />
											Schedule Appointment
										</Button>
									</CardFooter>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FamilyMedicalRecords;
