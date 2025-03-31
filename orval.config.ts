import { defineConfig } from "orval";

export default defineConfig({
	"health-care": {
		output: {
			mode: "tags-split",
			target: "src/queries/generated",
			schemas: "src/models/generated",
			client: "react-query",
			mock: false,
			prettier: true,
			clean: true,
			override: {
				mutator: {
					path: "src/lib/axios-instance.ts",
					name: "customInstance",
				},
			},
		},
		input: {
			target:
				process.env.OPEN_API_PATH ||
				"http://localhost:8080/v3/api-docs",
		},
	},
});
