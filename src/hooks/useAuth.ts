import { useAppSelector } from "@/redux/hooks";

export const useAuth = () => {
  const { user, token, isLoading } = useAppSelector((state) => state.auth);
  
  return {
    isAuthenticated: !!token,
    user,
    userRole: user?.role?.toLowerCase(),
    isLoading
  };
};