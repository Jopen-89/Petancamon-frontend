import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const SignupPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const result = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });
      if (!result.ok) {
        setErr("Server rejected the request");
        return;
      }
      await login(email, password);
      navigate("/signup/evaluation");
    } catch (err) {
      setErr("Network error, connection to server failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          className="text-black bg-white"
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Email</label>
        <input
          className="text-black bg-white"
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          className="text-black bg-white"
          type="text"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">SAVE</button>
      </form>
    </>
  );
};
