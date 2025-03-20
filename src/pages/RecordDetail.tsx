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
import { useMediaQuery } from "usehooks-ts";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
	FileText,
	Activity,
	Pill,
	Calendar,
	Clipboard,
	Plus,
	Download,
	Heart,
	HeartPulse,
	ArrowLeft,
	Syringe,
	Thermometer,
	Weight,
	File,
} from "lucide-react";
import MedicalRecordCard from "@/components/medical/MedicalRecordCard";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "sonner";
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
			{
				id: 1005,
				date: "2023-09-05",
				title: "Asthma Follow-up - James",
				doctor: "Dr. Wilson",
				type: "Check-up",
				description:
					"Routine asthma follow-up. Lung function tests show improvement. Continuing with current medication regimen.",
				memberId: 103,
			},
			{
				id: 1006,
				date: "2023-10-10",
				title: "Fever and Cough - Emily",
				doctor: "Dr. Roberts",
				type: "Sick visit",
				description:
					"Presented with fever (38.5°C) and productive cough for 3 days. Diagnosed with upper respiratory infection. Prescribed rest, fluids, and over-the-counter fever reducer.",
				memberId: 104,
			},
			{
				id: 1007,
				date: "2023-11-22",
				title: "Blood Pressure Check - John",
				doctor: "Dr. Wilson",
				type: "Check-up",
				description:
					"Follow-up for hypertension. Blood pressure: 135/85. Advised to continue medication and increase physical activity.",
				memberId: 101,
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
			{
				id: 2004,
				name: "Albuterol Inhaler",
				dosage: "2 puffs",
				frequency: "As needed for breathing difficulty",
				forMember: "James Smith",
				startDate: "2022-03-20",
				endDate: "Ongoing",
			},
			{
				id: 2005,
				name: "Fluticasone Inhaler",
				dosage: "1 puff",
				frequency: "Twice daily",
				forMember: "James Smith",
				startDate: "2022-03-20",
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
		vaccinations: [
			{
				id: 4001,
				name: "Influenza",
				date: "2023-10-01",
				forMember: "John Smith",
				nextDue: "2024-10-01",
			},
			{
				id: 4002,
				name: "Influenza",
				date: "2023-10-01",
				forMember: "Mary Smith",
				nextDue: "2024-10-01",
			},
			{
				id: 4003,
				name: "Influenza",
				date: "2023-10-01",
				forMember: "James Smith",
				nextDue: "2024-10-01",
			},
			{
				id: 4004,
				name: "Influenza",
				date: "2023-10-01",
				forMember: "Emily Smith",
				nextDue: "2024-10-01",
			},
			{
				id: 4005,
				name: "Tdap",
				date: "2020-05-15",
				forMember: "John Smith",
				nextDue: "2030-05-15",
			},
			{
				id: 4006,
				name: "Tdap",
				date: "2020-06-10",
				forMember: "Mary Smith",
				nextDue: "2030-06-10",
			},
			{
				id: 4007,
				name: "MMR",
				date: "2012-04-20",
				forMember: "James Smith",
				nextDue: "N/A",
			},
			{
				id: 4008,
				name: "MMR",
				date: "2016-09-12",
				forMember: "Emily Smith",
				nextDue: "N/A",
			},
		],
		vitals: [
			{
				memberId: 101,
				readings: [
					{
						date: "2023-01-15",
						bloodPressure: "125/82",
						heartRate: 72,
						temperature: 36.6,
						weight: 79,
					},
					{
						date: "2023-05-15",
						bloodPressure: "120/80",
						heartRate: 70,
						temperature: 36.5,
						weight: 78,
					},
					{
						date: "2023-11-22",
						bloodPressure: "135/85",
						heartRate: 75,
						temperature: 36.7,
						weight: 77,
					},
				],
			},
			{
				memberId: 102,
				readings: [
					{
						date: "2023-02-10",
						bloodPressure: "110/70",
						heartRate: 68,
						temperature: 36.4,
						weight: 62,
					},
					{
						date: "2023-08-12",
						bloodPressure: "115/75",
						heartRate: 72,
						temperature: 37.2,
						weight: 62,
					},
				],
			},
			{
				memberId: 103,
				readings: [
					{
						date: "2023-03-05",
						bloodPressure: "100/65",
						heartRate: 75,
						temperature: 36.5,
						weight: 44,
					},
					{
						date: "2023-09-05",
						bloodPressure: "105/68",
						heartRate: 78,
						temperature: 36.6,
						weight: 45,
					},
				],
			},
			{
				memberId: 104,
				readings: [
					{
						date: "2023-04-20",
						bloodPressure: "90/60",
						heartRate: 82,
						temperature: 36.4,
						weight: 31,
					},
					{
						date: "2023-10-10",
						bloodPressure: "95/65",
						heartRate: 88,
						temperature: 38.5,
						weight: 32,
					},
				],
			},
		],
	},
	// More families would be here in a real application
};

const MemberMedicalRecord = () => {
	const [activeTab, setActiveTab] = useState("overview");
	const [searchTerm, setSearchTerm] = useState("");
	const isDesktop = useMediaQuery("(min-width: 768px)");

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

	// Get member data based on the memberId from URL params
	const memberData = familyData.members.find((m) => m.id === Number(101));

	if (!memberData) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center">
				<h2 className="text-2xl mb-4">Family member not found</h2>
				<Button asChild>
					<Link to={`/families/${1}`}>Return to Family</Link>
				</Button>
			</div>
		);
	}

	// Filter records based on search term and current member
	const memberRecords = familyData.records.filter((record) => {
		const matchesSearch = searchTerm
			? record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				record.description
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
			: true;

		// Include records specifically for this member OR records for the entire family (memberId = null)
		return (
			matchesSearch &&
			(record.memberId === Number(101) || record.memberId === null)
		);
	});

	// Filter medications for this member
	const memberMedications = familyData.medications.filter((med) => {
		return (
			med.forMember === memberData.name || med.forMember === "All members"
		);
	});

	// Filter appointments for this member
	const memberAppointments = familyData.appointments.filter((appointment) => {
		return appointment.forMember === memberData.name;
	});

	// Filter vaccinations for this member
	const memberVaccinations = familyData.vaccinations.filter((vaccination) => {
		return vaccination.forMember === memberData.name;
	});

	// Get vital readings for this member
	const memberVitals =
		familyData.vitals.find((v) => v.memberId === Number(101))?.readings ||
		[];

	const AddVitalSignsForm = () => {
		const [open, setOpen] = useState(false);

		const handleAddVitals = () => {
			toast("Vital signs added", {
				description:
					"The new vital signs have been recorded successfully.",
			});
			setOpen(false);
		};

		return isDesktop ? (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button className="bg-health-blue">
						<Plus className="mr-2 h-4 w-4" />
						Add Vital Signs
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Add Vital Signs</DialogTitle>
						<DialogDescription>
							Record new vital signs for {memberData.name}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right text-sm">
								Blood Pressure
							</label>
							<Input
								className="col-span-3"
								placeholder="e.g. 120/80"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right text-sm">
								Heart Rate
							</label>
							<Input
								className="col-span-3"
								type="number"
								placeholder="e.g. 72"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right text-sm">
								Temperature (°C)
							</label>
							<Input
								className="col-span-3"
								type="number"
								step="0.1"
								placeholder="e.g. 36.5"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right text-sm">
								Weight (kg)
							</label>
							<Input
								className="col-span-3"
								type="number"
								step="0.1"
								placeholder={`e.g. ${memberData.weight.split(" ")[0]}`}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit" onClick={handleAddVitals}>
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		) : (
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerTrigger asChild>
					<Button className="bg-health-blue">
						<Plus className="mr-2 h-4 w-4" />
						Add Vital Signs
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader className="text-left">
						<DrawerTitle>Add Vital Signs</DrawerTitle>
						<DrawerDescription>
							Record new vital signs for {memberData.name}
						</DrawerDescription>
					</DrawerHeader>
					<div className="px-4">
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<label className="text-sm">
									Blood Pressure
								</label>
								<Input placeholder="e.g. 120/80" />
							</div>
							<div className="grid gap-2">
								<label className="text-sm">Heart Rate</label>
								<Input type="number" placeholder="e.g. 72" />
							</div>
							<div className="grid gap-2">
								<label className="text-sm">
									Temperature (°C)
								</label>
								<Input
									type="number"
									step="0.1"
									placeholder="e.g. 36.5"
								/>
							</div>
							<div className="grid gap-2">
								<label className="text-sm">Weight (kg)</label>
								<Input
									type="number"
									step="0.1"
									placeholder={`e.g. ${memberData.weight.split(" ")[0]}`}
								/>
							</div>
						</div>
					</div>
					<DrawerFooter className="pt-2">
						<Button onClick={handleAddVitals}>Save changes</Button>
						<DrawerClose asChild>
							<Button variant="outline">Cancel</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		);
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
									{memberData.name}
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

						{/* Member profile section */}
						<div className="bg-white rounded-lg shadow-sm border p-6">
							<div className="flex flex-col md:flex-row gap-6">
								<div className="flex-shrink-0 flex flex-col items-center">
									<Avatar className="h-24 w-24 border-2 border-health-blue/20">
										<div className="flex h-full w-full items-center justify-center bg-health-blue/10 text-xl font-medium text-health-blue">
											{memberData.name.charAt(0)}
										</div>
									</Avatar>
									<div className="mt-4 text-center">
										<h2 className="text-xl font-bold">
											{memberData.name}
										</h2>
										<p className="text-gray-500">
											{memberData.relation}
										</p>
									</div>
								</div>

								<div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
												Age: {memberData.age}
											</Badge>
											<Badge className="bg-red-100 text-red-800 hover:bg-red-100">
												Blood Type:{" "}
												{memberData.bloodType}
											</Badge>
										</div>

										<div className="flex flex-col space-y-1">
											<span className="text-sm font-medium">
												Height:
											</span>
											<span className="text-gray-700">
												{memberData.height}
											</span>
										</div>

										<div className="flex flex-col space-y-1">
											<span className="text-sm font-medium">
												Weight:
											</span>
											<span className="text-gray-700">
												{memberData.weight}
											</span>
										</div>
									</div>

									<div className="space-y-2">
										<div className="flex flex-col space-y-1">
											<span className="text-sm font-medium">
												Allergies:
											</span>
											<div className="flex flex-wrap gap-1">
												{memberData.allergies.length >
												0 ? (
													memberData.allergies.map(
														(allergy, index) => (
															<Badge
																key={index}
																className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
															>
																{allergy}
															</Badge>
														)
													)
												) : (
													<span className="text-gray-500">
														None reported
													</span>
												)}
											</div>
										</div>

										<div className="flex flex-col space-y-1">
											<span className="text-sm font-medium">
												Chronic Conditions:
											</span>
											<div className="flex flex-wrap gap-1">
												{memberData.chronicConditions
													.length > 0 ? (
													memberData.chronicConditions.map(
														(condition, index) => (
															<Badge
																key={index}
																className="bg-purple-100 text-purple-800 hover:bg-purple-100"
															>
																{condition}
															</Badge>
														)
													)
												) : (
													<span className="text-gray-500">
														None reported
													</span>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Main content tabs */}
						<div className="flex items-center space-x-2 mt-4">
							<div className="relative flex-grow">
								<Input
									placeholder="Search medical records..."
									className="bg-white"
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
									value="vaccinations"
									className="data-[state=active]:bg-health-blue/10"
								>
									<Syringe className="mr-2 h-4 w-4" />
									Vaccinations
								</TabsTrigger>
								<TabsTrigger
									value="vitals"
									className="data-[state=active]:bg-health-blue/10"
								>
									<HeartPulse className="mr-2 h-4 w-4" />
									Vital Signs
								</TabsTrigger>
							</TabsList>

							{/* Overview Tab Content */}
							<TabsContent value="overview" className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-lg flex items-center">
												<File className="mr-2 h-5 w-5 text-health-blue" />
												Recent Medical Records
											</CardTitle>
										</CardHeader>
										<CardContent>
											<ul className="space-y-3">
												{memberRecords
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
												{memberMedications
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
															<div className="text-gray-500">
																<span>
																	{
																		med.frequency
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
												<HeartPulse className="mr-2 h-5 w-5 text-health-blue" />
												Latest Vital Signs
											</CardTitle>
										</CardHeader>
										<CardContent>
											{memberVitals.length > 0 ? (
												<div className="space-y-3">
													<div className="flex justify-between text-sm">
														<span className="font-medium">
															Date:
														</span>
														<span>
															{
																memberVitals[
																	memberVitals.length -
																		1
																].date
															}
														</span>
													</div>
													<div className="grid grid-cols-2 gap-2 text-sm">
														<div className="flex items-center gap-2">
															<Heart className="h-4 w-4 text-red-500" />
															<span>
																{
																	memberVitals[
																		memberVitals.length -
																			1
																	]
																		.bloodPressure
																}
															</span>
														</div>
														<div className="flex items-center gap-2">
															<Activity className="h-4 w-4 text-blue-500" />
															<span>
																{
																	memberVitals[
																		memberVitals.length -
																			1
																	].heartRate
																}{" "}
																bpm
															</span>
														</div>
														<div className="flex items-center gap-2">
															<Thermometer className="h-4 w-4 text-orange-500" />
															<span>
																{
																	memberVitals[
																		memberVitals.length -
																			1
																	]
																		.temperature
																}
																°C
															</span>
														</div>
														<div className="flex items-center gap-2">
															<Weight className="h-4 w-4 text-green-500" />
															<span>
																{
																	memberVitals[
																		memberVitals.length -
																			1
																	].weight
																}{" "}
																kg
															</span>
														</div>
													</div>
												</div>
											) : (
												<div className="text-center py-3">
													<p className="text-gray-500">
														No vital signs recorded
													</p>
												</div>
											)}
										</CardContent>
										<CardFooter>
											<Button
												variant="ghost"
												size="sm"
												className="w-full text-health-blue"
												onClick={() =>
													setActiveTab("vitals")
												}
											>
												View Vital History
											</Button>
										</CardFooter>
									</Card>
								</div>

								{/* Upcoming appointments section in overview */}
								<Card className="mt-6">
									<CardHeader>
										<CardTitle className="flex items-center">
											<Calendar className="mr-2 h-5 w-5 text-health-blue" />
											Upcoming Appointments
										</CardTitle>
										<CardDescription>
											Scheduled medical appointments
										</CardDescription>
									</CardHeader>
									<CardContent>
										{memberAppointments.length > 0 ? (
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
															Status
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{memberAppointments.map(
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
											<div className="text-center py-6">
												<Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
												<h3 className="text-lg font-medium text-gray-600">
													No upcoming appointments
												</h3>
												<Button className="mt-4 bg-health-blue hover:bg-health-blue/90">
													<Plus className="mr-2 h-4 w-4" />
													Schedule Appointment
												</Button>
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>

							{/* Medical Records Tab Content */}
							<TabsContent value="records" className="space-y-4">
								<div className="flex justify-between mb-4">
									<h3 className="text-xl font-bold">
										Medical Records
									</h3>
									<Button className="bg-health-blue hover:bg-health-blue/90">
										<Plus className="mr-2 h-4 w-4" />
										Add Record
									</Button>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{memberRecords.length > 0 ? (
										memberRecords.map((record) => (
											<MedicalRecordCard
												key={record.id}
												record={record}
												memberName={
													record.memberId === null
														? "All Family"
														: memberData.name
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
								<div className="flex justify-between mb-4">
									<h3 className="text-xl font-bold">
										Medications
									</h3>
									<Button className="bg-health-blue hover:bg-health-blue/90">
										<Plus className="mr-2 h-4 w-4" />
										Add Medication
									</Button>
								</div>
								<Card>
									<CardContent className="pt-6">
										{memberMedications.length > 0 ? (
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
															Start Date
														</TableHead>
														<TableHead>
															End Date
														</TableHead>
														<TableHead>
															Status
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{memberMedications.map(
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
																		med.startDate
																	}
																</TableCell>
																<TableCell>
																	{
																		med.endDate
																	}
																</TableCell>
																<TableCell>
																	<Badge
																		className={
																			med.endDate ===
																			"Ongoing"
																				? "bg-green-100 text-green-800 hover:bg-green-100"
																				: "bg-gray-100 text-gray-800 hover:bg-gray-100"
																		}
																	>
																		{med.endDate ===
																		"Ongoing"
																			? "Active"
																			: "Completed"}
																	</Badge>
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
													Add new medications
												</p>
												<Button className="mt-4 bg-health-blue hover:bg-health-blue/90">
													<Plus className="mr-2 h-4 w-4" />
													Add Medication
												</Button>
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>

							{/* Vaccinations Tab Content */}
							<TabsContent
								value="vaccinations"
								className="space-y-4"
							>
								<div className="flex justify-between mb-4">
									<h3 className="text-xl font-bold">
										Vaccinations
									</h3>
									<Button className="bg-health-blue hover:bg-health-blue/90">
										<Plus className="mr-2 h-4 w-4" />
										Add Vaccination
									</Button>
								</div>
								<Card>
									<CardContent className="pt-6">
										{memberVaccinations.length > 0 ? (
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>
															Vaccination
														</TableHead>
														<TableHead>
															Date Administered
														</TableHead>
														<TableHead>
															Next Due
														</TableHead>
														<TableHead>
															Status
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{memberVaccinations.map(
														(vaccination) => (
															<TableRow
																key={
																	vaccination.id
																}
															>
																<TableCell className="font-medium">
																	{
																		vaccination.name
																	}
																</TableCell>
																<TableCell>
																	{
																		vaccination.date
																	}
																</TableCell>
																<TableCell>
																	{
																		vaccination.nextDue
																	}
																</TableCell>
																<TableCell>
																	<Badge
																		className={
																			vaccination.nextDue ===
																			"N/A"
																				? "bg-green-100 text-green-800 hover:bg-green-100"
																				: "bg-blue-100 text-blue-800 hover:bg-blue-100"
																		}
																	>
																		{vaccination.nextDue ===
																		"N/A"
																			? "Complete"
																			: "Due for renewal"}
																	</Badge>
																</TableCell>
															</TableRow>
														)
													)}
												</TableBody>
											</Table>
										) : (
											<div className="text-center py-10">
												<Syringe className="h-12 w-12 mx-auto text-gray-300 mb-3" />
												<h3 className="text-lg font-medium text-gray-600">
													No vaccinations found
												</h3>
												<p className="text-gray-500">
													Add vaccination records
												</p>
												<Button className="mt-4 bg-health-blue hover:bg-health-blue/90">
													<Plus className="mr-2 h-4 w-4" />
													Add Vaccination
												</Button>
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>

							{/* Vital Signs Tab Content */}
							<TabsContent value="vitals" className="space-y-4">
								<div className="flex justify-between mb-4">
									<h3 className="text-xl font-bold">
										Vital Signs History
									</h3>
									<AddVitalSignsForm />
								</div>
								<Card>
									<CardContent className="pt-6">
										{memberVitals.length > 0 ? (
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>
															Date
														</TableHead>
														<TableHead>
															Blood Pressure
														</TableHead>
														<TableHead>
															Heart Rate
														</TableHead>
														<TableHead>
															Temperature
														</TableHead>
														<TableHead>
															Weight
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{memberVitals.map(
														(vital, index) => (
															<TableRow
																key={index}
															>
																<TableCell>
																	{vital.date}
																</TableCell>
																<TableCell>
																	{
																		vital.bloodPressure
																	}
																</TableCell>
																<TableCell>
																	{
																		vital.heartRate
																	}{" "}
																	bpm
																</TableCell>
																<TableCell>
																	{
																		vital.temperature
																	}
																	°C
																</TableCell>
																<TableCell>
																	{
																		vital.weight
																	}{" "}
																	kg
																</TableCell>
															</TableRow>
														)
													)}
												</TableBody>
											</Table>
										) : (
											<div className="text-center py-10">
												<HeartPulse className="h-12 w-12 mx-auto text-gray-300 mb-3" />
												<h3 className="text-lg font-medium text-gray-600">
													No vital signs recorded
												</h3>
												<p className="text-gray-500">
													Add vital sign measurements
												</p>
												<AddVitalSignsForm />
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MemberMedicalRecord;
