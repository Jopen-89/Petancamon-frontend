import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Form, useNavigate } from "react-router-dom";

//Componente donde llamo a la funcion login del Authprovider.

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/matches");
    } catch (err: any) {
      setError(err.message || "Error iniciando sesion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="text-black bg-white"
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="text-black bg-white"
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red">{error}</p>}
        <button disabled={isSubmitting}>
          {isSubmitting ? "Cargando" : "Entrar"}
        </button>
      </form>
    </>
  );
};
