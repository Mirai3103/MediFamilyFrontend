// src/data/sampleMedicalData.ts
export const medicalRecordsData = {
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
			// James Smith (ID 103) was referenced in records/meds but not in members list, adding a placeholder
			{
				id: 103,
				name: "James Smith",
				age: 12,
				relation: "Son",
				bloodType: "B+",
				height: "150 cm",
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
				title: "Annual Check-up - John",
				doctor: "Dr. Miller",
				type: "Check-up",
				description:
					"Routine annual physical. Discussed hypertension management.",
				memberId: 101,
			},
			{
				id: 1002,
				date: "2023-06-20",
				title: "Flu Shot - Family",
				doctor: "Nurse Practitioner",
				type: "Vaccination",
				description: "Entire family received annual flu shots.",
				memberId: null,
			}, // Example family record
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
		],
		medications: [
			{
				id: 2001,
				name: "Lisinopril",
				dosage: "10mg",
				frequency: "Once daily",
				forMember: "John Smith",
				startDate: "2022-01-10",
				endDate: "Ongoing",
			},
			{
				id: 2002,
				name: "Cetirizine",
				dosage: "10mg",
				frequency: "As needed",
				forMember: "Mary Smith",
				startDate: "2023-08-12",
				endDate: "2023-08-26",
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
			{
				id: 2006,
				name: "Multivitamin",
				dosage: "1 tablet",
				frequency: "Once daily",
				forMember: "All members",
				startDate: "2023-01-01",
				endDate: "Ongoing",
			}, // Example for all
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
			{
				id: 3004,
				date: "2024-01-15",
				time: "11:00",
				doctor: "Dr. Miller",
				forMember: "Mary Smith",
				purpose: "Annual Gyn Check-up",
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
				name: "MMR (Booster)",
				date: "2021-08-15",
				forMember: "James Smith",
				nextDue: "N/A",
			},
		],
		vitals: [
			{
				memberId: 101,
				readings: [
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
	// Add more families if needed
};

// Define types for better code intelligence and safety (optional but recommended)
// You can generate these more accurately based on your actual data structure
export type Member = (typeof medicalRecordsData)[1]["members"][0];
export type Medication = (typeof medicalRecordsData)[1]["medications"][0];
export type Appointment = (typeof medicalRecordsData)[1]["appointments"][0];
export type Vaccination = (typeof medicalRecordsData)[1]["vaccinations"][0];
export type VitalReading =
	(typeof medicalRecordsData)[1]["vitals"][0]["readings"][0];
export type Vitals = (typeof medicalRecordsData)[1]["vitals"][0];
export type FamilyData = (typeof medicalRecordsData)[1];
