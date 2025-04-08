import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Heart, Activity, Thermometer, Weight } from "lucide-react";
import type { VitalReading } from "../sampleMedicalData";

interface LatestVitalsCardProps {
  latestVitals: VitalReading | null;
  setActiveTab: (tab: string) => void;
}

export function LatestVitalsCard({
  latestVitals,
  setActiveTab,
}: LatestVitalsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <HeartPulse className="mr-2 h-5 w-5 text-health-blue" />
          Latest Vital Signs
        </CardTitle>
      </CardHeader>
      <CardContent>
        {latestVitals ? (
          <div className="space-y-3">
            <div className="flex justify-between text-sm items-center border-b pb-2">
              <span className="font-medium text-gray-600">Date:</span>
              <span className="text-gray-800">{latestVitals.date}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="text-gray-500">BP:</span>
                <span className="text-gray-800 font-medium">
                  {latestVitals.bloodPressure}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-gray-500">HR:</span>
                <span className="text-gray-800 font-medium">
                  {latestVitals.heartRate} bpm
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Thermometer className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span className="text-gray-500">Temp:</span>
                <span className="text-gray-800 font-medium">
                  {latestVitals.temperature}°C
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Weight className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-500">Wt:</span>
                <span className="text-gray-800 font-medium">
                  {latestVitals.weight} kg
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-3">
            <p className="text-gray-500 text-sm">No vital signs recorded</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-health-blue hover:bg-health-blue/10"
          onClick={() => setActiveTab("vitals")}
        >
          View Vital History
        </Button>
      </CardFooter>
    </Card>
  );
}
