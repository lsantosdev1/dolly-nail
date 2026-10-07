import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Sparkles, Lock, Mail, ArrowRight } from "lucide-react";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("ana.martins@dollynail.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dolly-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-dolly-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-dolly-100 text-roseGold mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-dolly-900">
            Dolly Nail Studio
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Painel Restrito da Profissional
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-dolly-800 uppercase tracking-wider mb-1">
              E-mail Administrativo
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-dolly-50 border border-dolly-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-roseGold"
                required
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-dolly-800 uppercase tracking-wider mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-dolly-50 border border-dolly-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-roseGold"
                required
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-roseGold hover:bg-roseGold-dark disabled:opacity-50 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? "Acessando..." : "Entrar no Painel"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-dolly-100 text-center">
          <p className="text-[11px] text-neutral-400">
            Dados de demonstração preenchidos automaticamente.
          </p>
        </div>
      </div>
    </div>
  );
};
