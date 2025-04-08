import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HeartPulse } from "lucide-react";
import { AddVitalSignsForm } from "./forms/AddVitalSignsForm";
import type { VitalReading, Member } from "./sampleMedicalData";

interface VitalsTabContentProps {
  memberVitals: VitalReading[];
  memberData: Member;
}

export function VitalsTabContent({
  memberVitals,
  memberData,
}: VitalsTabContentProps) {
  // Sort vitals by date, most recent first
  const sortedVitals = [...memberVitals].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        {/* Pass memberData to the form */}
        <AddVitalSignsForm memberData={memberData} />
      </div>
      <Card>
        <CardContent className="pt-6">
          {sortedVitals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Blood Pressure</TableHead>
                  <TableHead>Heart Rate (bpm)</TableHead>
                  <TableHead>Temp (°C)</TableHead>
                  <TableHead>Weight (kg)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedVitals.map((vital, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{vital.date}</TableCell>
                    <TableCell>{vital.bloodPressure}</TableCell>
                    <TableCell>{vital.heartRate}</TableCell>
                    <TableCell>{vital.temperature}</TableCell>
                    <TableCell>{vital.weight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <HeartPulse className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-600">
                No vital signs recorded
              </h3>
              <p className="text-sm text-gray-500">
                Use the button above to add measurements.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
