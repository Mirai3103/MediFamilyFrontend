import axios, { AxiosError } from "axios";
import Axios, { AxiosRequestConfig } from "axios";
import qs from "qs";
const apiClient = axios.create({
	headers: {
		"Content-Type": "application/json",
	},
	paramsSerializer: (params) =>
		qs.stringify(params, { arrayFormat: "repeat" }),
});

// Add a request interceptor
apiClient.interceptors.request.use(
	(config) => {
		console.log("Request made with ", config);
		const token = localStorage.getItem("access_token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default apiClient;

export const customInstance = <T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig
): Promise<T> => {
	const source = Axios.CancelToken.source();
	const promise = apiClient({
		...config,
		...options,
		cancelToken: source.token,
	}).then(({ data }) => data);

	// @ts-ignore
	promise.cancel = () => {
		source.cancel("Query was cancelled");
	};

	return promise;
};

export type ErrorType<Error> = AxiosError<Error>;
