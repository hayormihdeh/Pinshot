import { useContext } from "react";
import { AuthContext } from "@config/contextStore";

export const useAuthContext = () => useContext(AuthContext)