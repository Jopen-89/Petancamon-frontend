import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import type { ReactNode } from "react";

//1. tipo de usuario que devuelve el backend
export type User = {
  id: string;
  username: string;
  level: string;
};
//2. tipo de respuesta del backend en /login
type LoginResponse = {
  accessToken: string;
  user: User;
};

//3. Shape del contexto de autenticacion (value)
type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

//claves para localStorage

const TOKEN_KEY = "petancamon_accessToken";
const USER_KEY = "petancamon_user";

const AUTH_BASE_URL = "http://localhost:3000";

//4. Creamos el contexto ("la caja")

const AuthContext = createContext<AuthContextType | undefined>(undefined);

//5. Provider: aqui vive la lógica real de autenticacion

type AuthProviderProps = {
  children: ReactNode;
};

//AUTHPROVIDER CAPA QUE SE PONE POR ENCIMA DE BROWSERPROVIDER provee a todos los children con
//Provider de contexto, provee contexto global a toda la app. Provee datos a sus hijos. No cambia la UI (por eso no es componente padre)
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  // se envia al backend fetch(url, options)

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${AUTH_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      console.log("Error al iniciar sesion");
    }

    const data: LoginResponse = await response.json();

    setAccessToken(data.accessToken);
    setUser(data.user);
    console.log("a ver el user:", data.user)

    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  //value el paquete de datos que provider comparte con todos sus hijos
  const value: AuthContextType = {
    user,
    accessToken,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; //una vez hecho esto, cualquier componente dentro puede hacer const { user } = useMicontext()
  //children = todas las paginas, router, layout, provider envuelve toda la app
};

//hook ayuda para usar el contexto en cualquier componente // const { user, logout } = useAuth()

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useMiContexto debe usarse dentro de Mi provider");
  return ctx;
};
