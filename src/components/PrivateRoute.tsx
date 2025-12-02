import { useAuth } from "../context/AuthContext"
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
    children: ReactNode;
}

export const PrivateRoute = ({children}: PrivateRouteProps) => {
    const { accessToken, isLoading } = useAuth();

    if (isLoading) { return <p>Loading...</p>}

    if (!accessToken) { return <Navigate to="/login" replace/>}  //replace evita que puedas echar atras.

    return <>{children}</>

}