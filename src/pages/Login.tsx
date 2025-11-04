import React, { useState } from "react";

export type LoginValues = {
  tenant: string;
  username: string;
  password: string;
};

type LoginProps = {
  onLogin?: (values: LoginValues) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
};

/** Light theme (white) + Tenant & Username on ONE LINE */
export default function Login({ onLogin, loading = false, error = null }: LoginProps) {
  const [values, setValues] = useState<LoginValues>({ tenant: "", username: "", password: "" });
  const [touched, setTouched] = useState({ tenant: false, username: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const tenantError = !values.tenant && touched.tenant ? "Vui lòng nhập Tenant" : "";
  const userError = !values.username && touched.username ? "Vui lòng nhập UserName" : "";
  const pwError = !values.password && touched.password ? "Vui lòng nhập mật khẩu" : "";
  const disabled = loading || submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ tenant: true, username: true, password: true });
    setLocalError(null);
    if (!values.tenant || !values.username || !values.password) return;

    try {
      setSubmitting(true);
      if (onLogin) await onLogin(values);
      else console.log("Login submitted", values);
    } catch (err: any) {
      setLocalError(err?.message || "Đăng nhập thất bại. Thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-neutral-200 px-6 py-7">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Đăng nhập</h1>
          </div>

          {(error || localError) && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-4">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tenant + Username (ONE LINE) */}
            <div className="flex gap-3">
              {/* Tenant */}
              <div className="flex-1 space-y-1">
                <label htmlFor="tenant" className="block text-sm font-medium text-neutral-800">
                  Tenant
                </label>
                <input
                  id="tenant"
                  name="tenant"
                  type="text"
                  autoComplete="organization"
                  className={`mt-0.5 block w-full rounded-xl bg-white border px-3.5 py-2.5 text-neutral-900 placeholder-neutral-400 outline-none transition focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                    tenantError ? "border-red-400" : "border-neutral-300 hover:border-neutral-400"
                  }`}
                  placeholder="vd: acme"
                  value={values.tenant}
                  onChange={(e) => setValues((v) => ({ ...v, tenant: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, tenant: true }))}
                  disabled={disabled}
                />
                {tenantError && <p className="text-xs text-red-600 mt-1.5">{tenantError}</p>}
              </div>

              {/* Username */}
              <div className="flex-1 space-y-1">
                <label htmlFor="username" className="block text-sm font-medium text-neutral-800">
                  UserName
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  className={`mt-0.5 block w-full rounded-xl bg-white border px-3.5 py-2.5 text-neutral-900 placeholder-neutral-400 outline-none transition focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                    userError ? "border-red-400" : "border-neutral-300 hover:border-neutral-400"
                  }`}
                  placeholder="vd: john.doe"
                  value={values.username}
                  onChange={(e) => setValues((v) => ({ ...v, username: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                  disabled={disabled}
                />
                {userError && <p className="text-xs text-red-600 mt-1.5">{userError}</p>}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-800">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`mt-0.5 block w-full rounded-xl bg-white border px-3.5 py-2.5 pr-14 text-neutral-900 placeholder-neutral-400 outline-none transition focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                    pwError ? "border-red-400" : "border-neutral-300 hover:border-neutral-400"
                  }`}
                  placeholder="••••••••"
                  value={values.password}
                  onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  disabled={disabled}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 my-1.5 mr-1.5 h-9 px-3 rounded-lg text-xs text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  tabIndex={-1}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
              {pwError && <p className="text-xs text-red-600 mt-1.5">{pwError}</p>}
            </div>

            <button
              type="submit"
              disabled={disabled}
              className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-500 text-white font-semibold px-4 py-2.5 shadow-sm hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {submitting || loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <p className="text-xs leading-relaxed text-neutral-500 text-center">
              Điền đúng <span className="text-neutral-800 font-medium">Tenant</span> và <span className="text-neutral-800 font-medium">UserName</span> trước khi đăng nhập.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
