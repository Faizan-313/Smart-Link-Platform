import axios, { AxiosError } from "axios";

const constUrl = import.meta.env.VITE_API_URL;

export const api = async <T = unknown>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    data?: object,
    config?: { withCredentials?: boolean }
): Promise<T> => {
    const requestConfig = {
        method,
        url: `${constUrl}${url}`,
        data,
        withCredentials: config?.withCredentials ?? true,
    };

    try {
        const response = await axios(requestConfig);
        return response.data as T;
    } catch (error: unknown) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 401) {
            try {
                const refreshResponse = await axios.post(
                    `${constUrl}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                if (refreshResponse.status === 200) {
                    const retryResponse = await axios({
                        ...requestConfig,
                        withCredentials: true,
                    });

                    return retryResponse.data as T;
                }
            } catch {
                throw new Error("Unauthorized. Please log in again.");
            }
        }

        const message =
            axiosError.response && typeof axiosError.response.data === "object" && axiosError.response.data !== null
                ? (axiosError.response.data as { message?: string }).message || axiosError.message
                : axiosError.message || "Request failed.";

        throw Object.assign(new Error(message), {
            cause: axiosError,
        });
    }
};