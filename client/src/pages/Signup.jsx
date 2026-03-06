import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Moon,
  Sun,
  MailCheck,
  UserPlus,
  Train,
} from "lucide-react";
import API from "../lib/api";

export default function Signup() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    code: "",
    username: "",
    password: "",
  });

  const handleSendCode = async () => {
    await API.post("/auth/send-code", { email: form.email });
    alert("Verification code sent!");
    setStep(2);
  };

  const handleVerify = async () => {
    await API.post("/auth/verify-code", {
      email: form.email,
      code: form.code,
    });
    alert("Email verified!");
    setStep(3);
  };

  const handleSignup = async () => {
    await API.post("/auth/complete-signup", {
      email: form.email,
      username: form.username,
      password: form.password,
    });

    alert("Account created!");
    navigate("/login");
  };

  const stepTitle = {
    1: "Verify your email",
    2: "Enter verification code",
    3: "Create your RailSwap profile",
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black transition-colors duration-200 p-4 relative">

        {/* Background Gradient Glow */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/20 rounded-full blur-[140px] opacity-40 pointer-events-none" />

        {/* Header */}
        <header className="absolute top-0 w-full max-w-7xl mx-auto p-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
              <Train size={18} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent bg-clip-text">
              RailSwap
            </span>
          </div>
        </header>

        {/* Signup Card */}
        <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8 md:p-10">

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {stepTitle[step]}
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition-all ${
                  step >= s
                    ? "bg-gradient-to-r from-indigo-500 to-pink-500"
                    : "bg-gray-200 dark:bg-gray-800"
                }`}
              />
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="name@email.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleSendCode}
                className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              >
                Send Code <MailCheck size={18} />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <input
                placeholder="Verification Code"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value })
                }
                className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                onClick={handleVerify}
                className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90"
              >
                Verify Code <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5">

              <input
                placeholder="Username"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                onClick={handleSignup}
                className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90"
              >
                Create Account <UserPlus size={18} />
              </button>

            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline"
              >
                Sign in
              </span>
            </p>
          </div>

        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="fixed bottom-6 right-6 p-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-full shadow-lg text-gray-500 dark:text-gray-400 hover:text-indigo-500"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

      </div>
    </div>
  );
}