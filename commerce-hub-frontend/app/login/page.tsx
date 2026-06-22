"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const response = await fetch(
      "/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      router.push("/");
    } else {
      alert(
        data.error || "Login Failed"
      );
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">

      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-10 rounded-3xl w-[450px]"
      >
        <h1 className="text-4xl font-bold mb-8">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 rounded-xl bg-zinc-800 mb-4"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 rounded-xl bg-zinc-800 mb-6"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          className="w-full bg-blue-600 p-4 rounded-xl"
        >
          Login
        </button>
      </form>

    </main>
  );
}