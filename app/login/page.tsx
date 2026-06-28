"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Email atau kata sandi salah.");
        setLoading(false);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-dark p-4 font-sans">
      <div className="w-full max-w-[380px] bg-white rounded-[16px] p-[2.5rem] border-t-[3px] border-t-red-primary">
        <div className="text-center mb-8">
          <h2 className="text-[24px] font-playfair font-bold text-gray-900 mb-1">
            Kas Agustusan RT3
          </h2>
          <p className="text-[13px] text-text-muted">
            Silakan masuk ke panel admin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-[13px] font-medium text-gray-700 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-[14px] text-gray-900 bg-white rounded-[8px] border border-[#E5E7EB] focus:outline-none focus:border-[#B91C1C] focus:ring-[3px] focus:ring-[#FEF2F2] transition-colors placeholder-gray-400"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-[13px] font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 text-[14px] text-gray-900 bg-white rounded-[8px] border border-[#E5E7EB] focus:outline-none focus:border-[#B91C1C] focus:ring-[3px] focus:ring-[#FEF2F2] transition-colors placeholder-gray-400"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-[8px] bg-red-tint-bg text-red-primary text-[13px] font-medium border border-red-tint-border">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-primary hover:bg-[#991B1B] text-white text-[14px] font-medium py-2.5 px-4 rounded-[8px] transition-colors disabled:opacity-70 mt-2"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
           <Link href="/" className="text-[13px] text-text-muted hover:text-red-primary transition-colors">
              Kembali ke Beranda
           </Link>
        </div>
      </div>
    </div>
  );
}
