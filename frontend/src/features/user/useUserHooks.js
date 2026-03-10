import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export const getLoginUser = () => {
    // Bring in Zustand actions to sync global state with the backend
    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            try {
                // 1. Fetch the data
                const { data } = await axiosClient.get("/users/me");

                console.log("login user data", data);


                // Account for standard MERN response structures
                const user = data.data?.user || data.user;

                // 2. Sync backend truth with Zustand frontend state
                setAuth(user);

                // 3. MUST RETURN for React Query caching
                return user;

            } catch (error) {
                // 4. Handle invalid/expired cookie securely
                clearAuth(); // Wipe Zustand state

                // Only toast if it's a true authentication error (401)
                if (error.response?.status === 401) {
                    toast.error("Session expired. Please log in again.");
                }

                throw error; // Alert React Query that the fetch failed
            }
        },
        retry: false, // Do not retry auth checks. If it fails, they are logged out.
        refetchOnWindowFocus: true, // It's good practice to re-verify the session if they leave the tab and come back
    });
};