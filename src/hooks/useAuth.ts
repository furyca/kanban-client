import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { baseURL } from "../utils/env";

// On path change
const useAuth = () => {  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const checkAuth = async () => {
      try {
        const response = await fetch(`${baseURL}${location.pathname}`, {
          credentials: "include",
          signal,
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        if (data.redirect) {
          navigate(data.redirect);
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error checking authentication:", error);
        }
      }
    };

    checkAuth();

    return () => controller.abort();
  }, [location.pathname, navigate]);
};

export default useAuth;
