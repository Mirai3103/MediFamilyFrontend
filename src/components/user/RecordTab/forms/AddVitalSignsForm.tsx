// src/components/medical/forms/AddVitalSignsForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "usehooks-ts";
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
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Member } from "../sampleMedicalData"; // Import type

interface AddVitalSignsFormProps {
  memberData: Member;
  // Add an onSubmit prop if you want to handle submission logic in the parent
  // onSubmit: (vitals: NewVitalReading) => void;
}

export function AddVitalSignsForm({ memberData }: AddVitalSignsFormProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleAddVitals = () => {
    // TODO: Implement actual data saving logic here
    // You would typically collect data from stateful inputs
    // and call the onSubmit prop or an API function
    console.log("Simulating adding vitals...");
    toast("Vital signs added", {
      description: `The new vital signs for ${memberData.name} have been recorded successfully.`,
      // In a real app, you'd likely pass the actual data here
    });
    setOpen(false); // Close the dialog/drawer
  };

  const FormContent = () => (
    <div className="grid gap-4 py-4">
      {/* Note: Inputs should ideally be controlled components with useState */}
      <div
        className={
          isDesktop ? "grid grid-cols-4 items-center gap-4" : "grid gap-2"
        }
      >
        <label className={isDesktop ? "text-right text-sm" : "text-sm"}>
          Blood Pressure
        </label>
        <Input
          className={isDesktop ? "col-span-3" : ""}
          placeholder="e.g. 120/80"
        />
      </div>
      <div
        className={
          isDesktop ? "grid grid-cols-4 items-center gap-4" : "grid gap-2"
        }
      >
        <label className={isDesktop ? "text-right text-sm" : "text-sm"}>
          Heart Rate
        </label>
        <Input
          className={isDesktop ? "col-span-3" : ""}
          type="number"
          placeholder="e.g. 72"
        />
      </div>
      <div
        className={
          isDesktop ? "grid grid-cols-4 items-center gap-4" : "grid gap-2"
        }
      >
        <label className={isDesktop ? "text-right text-sm" : "text-sm"}>
          Temperature (°C)
        </label>
        <Input
          className={isDesktop ? "col-span-3" : ""}
          type="number"
          step="0.1"
          placeholder="e.g. 36.5"
        />
      </div>
      <div
        className={
          isDesktop ? "grid grid-cols-4 items-center gap-4" : "grid gap-2"
        }
      >
        <label className={isDesktop ? "text-right text-sm" : "text-sm"}>
          Weight (kg)
        </label>
        <Input
          className={isDesktop ? "col-span-3" : ""}
          type="number"
          step="0.1"
          placeholder={`e.g. ${memberData.weight.split(" ")[0]}`}
        />
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-health-blue hover:bg-health-blue/90">
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
          <FormContent />
          <DialogFooter>
            <Button type="submit" onClick={handleAddVitals}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-health-blue hover:bg-health-blue/90">
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
          <FormContent />
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
}
