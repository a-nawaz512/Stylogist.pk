import { useMutation, useQuery } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import useAuthStore from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';


// --- 4. SIGNUP HOOK ---
export const useSignup = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (userData) => {
            // Backend creates the user and dispatches the OTP email
            console.log("user data", userData);
            const { data } = await axiosClient.post('/auth/register', userData);
            return data;
        },
        onSuccess: (data, variables) => {
            // Route the user to the OTP page. 
            // We pass the email in the router state so the OTP page knows who to verify!
            navigate('/verify-otp', { state: { email: variables.email } });
        },
        onError: (error) => {
            // In production, you'd wire this to a toast notification system (like react-hot-toast)
            console.error("Registration failed:", error.response?.data?.message || "An error occurred");
        }
    });
};


// --- 1. LOGIN HOOK ---
export const useLogin = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (credentials) => {
            // Backend sets the HTTP-Only cookie and returns the user object
            const { data } = await axiosClient.post('/auth/login', credentials);
            return data.user;
        },
        onSuccess: (user) => {
            setAuth(user); // Save user to Zustand
            navigate('/'); // Redirect to store/dashboard
        },
    });
};

// --- 2. LOGOUT HOOK ---
export const useLogout = () => {
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async () => {
            // Backend clears the HTTP-Only cookie
            await axiosClient.post('/auth/logout');
        },
        onSuccess: () => {
            clearAuth(); // Wipe user from Zustand
            navigate('/login');
        },
    });
};

// --- 3. CHECK AUTH HOOK (Run on App Mount) ---
export const useCheckAuth = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    return useQuery({
        queryKey: ['authUser'],
        queryFn: async () => {
            try {
                // Backend verifies the cookie and returns the user
                const { data } = await axiosClient.get('/auth/me');
                setAuth(data.user);
                return data.user;
            } catch (error) {
                clearAuth(); // Cookie is invalid or expired
                throw error;
            }
        },
        retry: false, // Don't retry if it fails (user is simply logged out)
        refetchOnWindowFocus: false,
    });
};