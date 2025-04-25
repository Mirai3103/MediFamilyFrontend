import { createContext } from "react";
import { createContextualCan } from "@casl/react";
import { AppAbility } from "@/lib/casl";

export const AbilityContext = createContext<AppAbility>(null!);
export const Can = createContextualCan<AppAbility>(AbilityContext.Consumer);
