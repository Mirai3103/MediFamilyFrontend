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
import { Syringe, Plus } from "lucide-react";
import type { Vaccination } from "./sampleMedicalData";

interface VaccinationsTabContentProps {
  memberVaccinations: Vaccination[];
}

export function VaccinationsTabContent({
  memberVaccinations,
}: VaccinationsTabContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button className="bg-health-blue hover:bg-health-blue/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Vaccination {/* Add onClick handler */}
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          {memberVaccinations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vaccination</TableHead>
                  <TableHead>Date Administered</TableHead>
                  <TableHead>Next Due</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberVaccinations.map((vaccination) => (
                  <TableRow key={vaccination.id}>
                    <TableCell className="font-medium">
                      {vaccination.name}
                    </TableCell>
                    <TableCell>{vaccination.date}</TableCell>
                    <TableCell>{vaccination.nextDue || "N/A"}</TableCell>
                    <TableCell>
                      {/* More robust status check might be needed */}
                      <Badge
                        className={
                          !vaccination.nextDue || vaccination.nextDue === "N/A"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : new Date(vaccination.nextDue) > new Date()
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" // Example for due/overdue
                        }
                      >
                        {!vaccination.nextDue || vaccination.nextDue === "N/A"
                          ? "Up-to-date"
                          : new Date(vaccination.nextDue) > new Date()
                            ? `Due ${vaccination.nextDue}`
                            : "Due"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <Syringe className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-600">
                No vaccinations found
              </h3>
              <p className="text-sm text-gray-500">Add vaccination records</p>
              <Button className="mt-4 bg-health-blue hover:bg-health-blue/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Vaccination {/* Add onClick handler */}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
