import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "lucide-react";
import type { Medication } from "../sampleMedicalData";

interface CurrentMedicationsCardProps {
  medications: Medication[];
  setActiveTab: (tab: string) => void;
}

export function CurrentMedicationsCard({
  medications,
  setActiveTab,
}: CurrentMedicationsCardProps) {
  const currentMeds = medications.filter((med) => med.endDate === "Ongoing");
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Pill className="mr-2 h-5 w-5 text-health-blue" />
          Current Medications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentMeds.length > 0 ? (
          <ul className="space-y-3">
            {currentMeds.slice(0, 3).map((med) => (
              <li
                key={med.id}
                className="text-sm border-b pb-2 last:border-b-0"
              >
                <div className="font-medium">
                  {med.name} ({med.dosage})
                </div>
                <div className="text-gray-500 text-xs">
                  <span>{med.frequency}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No current medications.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-health-blue hover:bg-health-blue/10"
          onClick={() => setActiveTab("medications")}
        >
          View All Medications
        </Button>
      </CardFooter>
    </Card>
  );
}
