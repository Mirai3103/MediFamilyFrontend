import { Profile } from "@/models/generated";
import HealthMetricsCards from "./HealthMetricsCards";
import HealthDetailCards from "./HealthDetailCards";

interface HealthProfileDisplayProps {
	profile: Profile;
}

const HealthProfileDisplay = ({ profile }: HealthProfileDisplayProps) => {
	console.log("HealthProfileDisplay", profile);
	return (
		<div className="space-y-6">
			<HealthMetricsCards profile={profile} />
			<HealthDetailCards profile={profile} />
		</div>
	);
};

export default HealthProfileDisplay;
