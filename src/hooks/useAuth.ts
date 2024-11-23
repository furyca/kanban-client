import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../utils/env";

// On path change
const useAuth = ({ pathname }: { pathname: string }) => {  
  const navigate = useNavigate();
  useEffect(() => {
    const getPage = async () => {
      const response = await fetch(`${baseURL}${pathname}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      
      json.redirect && navigate(json.redirect);
    };

    getPage();
  }, []);
};

export default useAuth;
