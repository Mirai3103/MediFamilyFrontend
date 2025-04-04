import PersonalInfoSection from "./PersonalInfoSection";
import SecuritySection from "./SecuritySection";
import { Profile } from "@/models/generated";

interface PersonalInfoTabProps {
	profile: Profile;
}

const PersonalInfoTab = ({ profile }: PersonalInfoTabProps) => {
	return (
		<>
			<PersonalInfoSection profile={profile} />
			<SecuritySection />
		</>
	);
};

export default PersonalInfoTab;
