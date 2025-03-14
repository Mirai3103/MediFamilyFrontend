import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { Link } from "@tanstack/react-router";

// Sample data - in a real application, this would come from an API
const familiesData = [
	{
		id: 1,
		name: "Smith Family",
		members: 4,
		lastUpdated: "2023-06-15",
		upcomingAppointments: 2,
		profileComplete: true,
	},
	{
		id: 2,
		name: "Johnson Family",
		members: 3,
		lastUpdated: "2023-07-21",
		upcomingAppointments: 1,
		profileComplete: true,
	},
	{
		id: 3,
		name: "Williams Family",
		members: 5,
		lastUpdated: "2023-05-30",
		upcomingAppointments: 0,
		profileComplete: false,
	},
	{
		id: 4,
		name: "Brown Family",
		members: 2,
		lastUpdated: "2023-08-01",
		upcomingAppointments: 3,
		profileComplete: true,
	},
	{
		id: 5,
		name: "Miller Family",
		members: 6,
		lastUpdated: "2023-04-12",
		upcomingAppointments: 1,
		profileComplete: false,
	},
	{
		id: 6,
		name: "Garcia Family",
		members: 4,
		lastUpdated: "2023-07-05",
		upcomingAppointments: 0,
		profileComplete: true,
	},
];

const FamiliesPage = () => {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredFamilies = familiesData.filter((family) =>
		family.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className=" flex flex-col">
			<div className="flex-grow ">
				<div className="container ">
					<div className="flex flex-col space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-bold text-gray-900">
									Families Dashboard
								</h1>
								<p className="text-gray-500 mt-1">
									Manage all your family profiles in one place
								</p>
							</div>
							<Button className="bg-health-blue hover:bg-health-blue/90">
								<Plus className="mr-2 h-4 w-4" />
								Add Family
							</Button>
						</div>

						<div className="flex items-center space-x-2">
							<div className="relative flex-grow">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
								<Input
									placeholder="Search families..."
									className="pl-8 bg-white"
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredFamilies.map((family) => (
								<Card
									key={family.id}
									className="bg-white border-gray-200 transition-all hover:shadow-md"
								>
									<CardHeader className="pb-2">
										<div className="flex justify-between items-start">
											<CardTitle className="text-xl">
												{family.name}
											</CardTitle>
											{family.profileComplete ? (
												<Badge className="bg-green-100 text-green-800 hover:bg-green-100">
													Complete
												</Badge>
											) : (
												<Badge
													variant="outline"
													className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"
												>
													Incomplete
												</Badge>
											)}
										</div>
										<CardDescription>
											Last updated: {family.lastUpdated}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											<div className="flex justify-between text-sm">
												<span className="text-gray-500">
													Family Members
												</span>
												<span className="font-medium">
													{family.members}
												</span>
											</div>
											<div className="flex justify-between text-sm">
												<span className="text-gray-500">
													Upcoming Appointments
												</span>
												<span className="font-medium">
													{
														family.upcomingAppointments
													}
												</span>
											</div>
											<Separator />
										</div>
									</CardContent>
									<CardFooter>
										<Button
											variant="outline"
											className="w-full text-health-blue border-health-blue hover:bg-health-blue/10"
											asChild
										>
											<Link
												to={
													`/home/families/` +
													family.id
												}
											>
												View Details
											</Link>
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FamiliesPage;
