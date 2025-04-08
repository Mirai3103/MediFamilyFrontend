import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, Plus } from "lucide-react";
import type { Medication } from "./sampleMedicalData";

interface MedicationsTabContentProps {
	memberMedications: Medication[];
}

export function MedicationsTabContent({
	memberMedications,
}: MedicationsTabContentProps) {
	return (
		<div className="space-y-4">
			<div className="flex justify-end mb-4">
				{/* Button can be placed above the card too if preferred */}
				<Button className="">
					<Plus className="mr-2 h-4 w-4" />
					Add Medication {/* Add onClick handler */}
				</Button>
			</div>
			<Card>
				<CardContent className="pt-6">
					{memberMedications.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Medication</TableHead>
									<TableHead>Dosage</TableHead>
									<TableHead>Frequency</TableHead>
									<TableHead className="hidden md:table-cell">
										Start Date
									</TableHead>
									<TableHead className="hidden md:table-cell">
										End Date
									</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{memberMedications.map((med) => (
									<TableRow key={med.id}>
										<TableCell className="font-medium">
											{med.name}
										</TableCell>
										<TableCell>{med.dosage}</TableCell>
										<TableCell>{med.frequency}</TableCell>
										<TableCell className="hidden md:table-cell">
											{med.startDate}
										</TableCell>
										<TableCell className="hidden md:table-cell">
											{med.endDate}
										</TableCell>
										<TableCell>
											<Badge
												className={
													med.endDate === "Ongoing"
														? "bg-green-100 text-green-800 hover:bg-green-100"
														: "bg-gray-100 text-gray-800 hover:bg-gray-100"
												}
											>
												{med.endDate === "Ongoing"
													? "Active"
													: "Completed"}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="text-center py-10">
							<Pill className="h-12 w-12 mx-auto text-gray-300 mb-3" />
							<h3 className="text-lg font-medium text-gray-600">
								No medications found
							</h3>
							<p className="text-sm text-gray-500">
								Add new medications
							</p>
							<Button className="mt-4 ">
								<Plus className="mr-2 h-4 w-4" />
								Add Medication {/* Add onClick handler */}
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
