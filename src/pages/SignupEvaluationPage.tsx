import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

type Option = {
  value: string;
  label: string;
};

type Question = {
  id: number;
  text: string;
  options: Option[];
};

type answers = {
  question1: string;
  question2: string;
  question3: string;
};

export const SignupEvaluation = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  const [answers, setAnswers] = useState({
    question1: "",
    question2: "",
    question3: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setAnswers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const loadEvaluation = async () => {
      setIsLoading(true);
      try {
        const result = await fetch("http://localhost:3000/signup/evaluation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(answers),
        });
        if (!result.ok) {
          setErr("Server rejected the request");
          return;
        }
        const data = await result.json();
        navigate("/", {state: {success: "evaluation completed successfully"}});
      } catch {
        setErr("network error, connection to server failed");
      } finally {
        setIsLoading(false);
      }
    };
    loadEvaluation();
  };

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const result = await fetch("http://localhost:3000/signup/evaluation", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!result.ok) {
          setErr("Server rejected the request");
        }
        const data = await result.json();
        setQuestions(data.questions);
      } catch (err) {
        setErr("Network error, unable to connect to the server");
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestions();
  }, []);

  return (
    <>
      <h2>Evaluation list</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question.id}>
            <p className="font-medium">{question.text}</p>

            {question.options.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`question${question.id}`}
                  value={option.value}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                {option.label}
              </label>
            ))}
          </div>
        ))}
        <button
          type="submit"
          className="px-4 py2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          SAVE
        </button>
      </form>
    </>
  );
};
