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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import type { Appointment } from "../sampleMedicalData";

interface UpcomingAppointmentsSectionProps {
  appointments: Appointment[];
}

export function UpcomingAppointmentsSection({
  appointments,
}: UpcomingAppointmentsSectionProps) {
  // Optional: Filter for only future appointments if needed
  // const upcomingAppointments = appointments.filter(app => new Date(app.date) >= new Date());

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-health-blue" />
          Upcoming Appointments
        </CardTitle>
        <CardDescription>Scheduled medical appointments</CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="hidden sm:table-cell">Time</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead className="hidden md:table-cell">Doctor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {appointment.time}
                  </TableCell>
                  <TableCell className="font-medium">
                    {appointment.purpose}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {appointment.doctor}
                  </TableCell>
                  <TableCell>
                    {/* Add logic here if status can change */}
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      Scheduled
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
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
              Schedule Appointment {/* Add onClick handler */}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
