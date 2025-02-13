import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { baseURL } from "../utils/env";

// On path change
const useAuth = () => {  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController(); // AbortController ile istek iptali
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
          navigate(data.redirect); // Backend yönlendirme istiyorsa, React Router ile yönlendir
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error checking authentication:", error);
        }
      }
    };

    checkAuth();

    return () => controller.abort(); // Component unmount edildiğinde fetch iptal edilir
  }, [location.pathname, navigate]);
};

export default useAuth;
