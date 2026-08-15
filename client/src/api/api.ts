import axios, { AxiosError } from "axios";

const constUrl = import.meta.env.VITE_API_URL;

export const api = async (
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    data?: object
): Promise<unknown> => {
    try {
        const response = await axios({
            method,
            url: `${constUrl}/${url}`,
            data
        });
        return response.data;
    } catch (error: unknown) {
        const axiosError = error as AxiosError;
        // console.error("API Error:", axiosError);
        if (axiosError.response?.status === 401) {
            try {
                const refreshResponse = await axios.post(`${constUrl}/auth/refresh`);
                if (refreshResponse.status === 200) {
                    return api(method, url, data);
                }
            } catch {
                throw new Error("Unauthorized. Please log in again.");
            }
        }
    }
};