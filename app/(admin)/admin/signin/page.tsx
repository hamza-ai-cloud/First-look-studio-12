'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function AdminSignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/admin',
      });

      if (result?.error) {
        setError('Invalid administrator email or password.');
        setLoading(false);
        return;
      }

      window.location.href = '/admin';
    } catch {
      setError('Unable to authenticate. Please try again.');
      setLoading(false);
    }
  }

  return (
    <main className="fixed inset-0 z-[99999] min-h-screen overflow-y-auto bg-[#030303] text-white">

      {/* =====================================================
          GLOBAL BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* grid */}
        <div
          className="absolute inset-0 opacity-[0.065]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212,166,65,.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212,166,65,.5) 1px, transparent 1px)
            `,
            backgroundSize: '55px 55px',
          }}
        />

        {/* ambient glows */}
        <div className="absolute -left-[280px] -top-[280px] h-[700px] w-[700px] rounded-full bg-[#b98725]/[0.08] blur-[150px]" />

        <div className="absolute left-[38%] top-[30%] h-[500px] w-[500px] rounded-full bg-[#c99935]/[0.045] blur-[150px]" />

        <div className="absolute -bottom-[300px] -right-[250px] h-[750px] w-[750px] rounded-full bg-[#b98725]/[0.075] blur-[170px]" />

        {/* top right orbit */}
        <div className="absolute -right-[150px] -top-[220px] h-[470px] w-[470px] rounded-full border border-[#c89b3d]/35" />

        <div className="absolute -right-[100px] -top-[170px] h-[370px] w-[370px] rounded-full border border-[#c89b3d]/15" />

        <div className="absolute -right-[50px] -top-[120px] h-[270px] w-[270px] rounded-full border border-[#c89b3d]/10" />

        {/* bottom left orbit */}
        <div className="absolute -bottom-[250px] -left-[210px] h-[500px] w-[500px] rounded-full border border-[#c89b3d]/25" />

        {/* particles */}
        <span className="absolute left-[5%] top-[16%] h-1 w-1 rounded-full bg-[#d6a43c] shadow-[0_0_15px_4px_rgba(214,164,60,.25)]" />
        <span className="absolute left-[24%] top-[8%] h-0.5 w-0.5 rounded-full bg-[#d6a43c]" />
        <span className="absolute left-[44%] top-[17%] h-1 w-1 rounded-full bg-[#d6a43c]" />
        <span className="absolute right-[17%] top-[13%] h-1 w-1 rounded-full bg-[#d6a43c]" />
        <span className="absolute right-[7%] top-[49%] h-0.5 w-0.5 rounded-full bg-[#d6a43c]" />
        <span className="absolute left-[11%] bottom-[21%] h-0.5 w-0.5 rounded-full bg-[#d6a43c]" />
        <span className="absolute right-[31%] bottom-[12%] h-1 w-1 rounded-full bg-[#d6a43c]" />

        <Sparkles className="absolute left-[31%] top-[10%] h-3 w-3 text-[#d6a43c]/50" />
        <Sparkles className="absolute right-[23%] top-[23%] h-3 w-3 text-[#d6a43c]/40" />
        <Sparkles className="absolute left-[50%] bottom-[17%] h-2.5 w-2.5 text-[#d6a43c]/40" />
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1580px] items-center px-5 py-7 sm:px-8 lg:px-12 xl:px-16">

        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[1.02fr_.88fr] lg:gap-20">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <section className="relative hidden min-h-[760px] lg:flex lg:flex-col lg:justify-between">

            {/* Logo */}
            <div className="relative z-20 flex items-center gap-4">

              <div className="relative flex h-[58px] w-[58px] items-center justify-center rounded-xl border border-[#bd8e2d]/70 bg-[#0b0b0b] shadow-[0_0_40px_rgba(190,142,45,.08)]">
                <span className="font-serif text-[31px] text-[#d8aa43]">
                  F
                </span>

                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#d9aa40] shadow-[0_0_12px_3px_rgba(217,170,64,.4)]" />
              </div>

              <div>
                <div className="text-[19px] font-semibold tracking-[0.34em] text-white">
                  FIRST LOOK
                </div>

                <div className="mt-1 text-[9px] font-medium tracking-[0.52em] text-[#cfa13c]">
                  STUDIO
                </div>
              </div>
            </div>

            {/* decorative frames */}
            <div className="absolute left-[1%] top-[17%] h-[285px] w-[205px] rotate-[-8deg] border border-[#b7862d]/35" />

            <div className="absolute left-[3%] top-[19%] h-[285px] w-[205px] rotate-[-8deg] border border-[#b7862d]/12" />

            <div className="absolute bottom-[15%] right-[6%] h-[270px] w-[190px] rotate-[9deg] border border-[#b7862d]/30" />

            <div className="absolute bottom-[17%] right-[8%] h-[270px] w-[190px] rotate-[9deg] border border-[#b7862d]/10" />

            {/* center orbital design */}
            <div className="absolute left-[47%] top-[22%] h-[145px] w-[145px] rounded-full border border-[#b7862d]/25" />

            <div className="absolute left-[50%] top-[25%] h-[90px] w-[90px] rounded-full border border-[#b7862d]/20" />

            <div className="absolute left-[54%] top-[29%] h-3 w-3 rounded-full bg-[#d9aa42] shadow-[0_0_32px_12px_rgba(217,170,66,.22)]" />

            <div className="absolute left-[41%] top-[39%] h-[180px] w-[180px] rounded-full border border-[#b7862d]/10" />

            <div className="absolute left-[45%] top-[43%] h-[105px] w-[105px] rounded-full border border-[#b7862d]/20" />

            {/* heading */}
            <div className="relative z-10 max-w-[690px] pt-[110px]">

              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#8e6a27]/45 bg-[#0b0a07]/80 px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.28em] text-[#d1a23e] backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5" />
                Private Studio Portal
              </div>

              <h1 className="font-serif text-[66px] leading-[0.94] tracking-[-0.04em] text-white xl:text-[80px]">

                Where every

                <br />

                <span className="italic text-[#d5a63f]">
                  moment
                </span>

                <br />

                begins
                <span className="text-[#d5a63f]">.</span>
              </h1>

              <p className="mt-9 max-w-[570px] text-[14px] leading-7 text-[#929292]">
                Access the First Look Studio management space.
                Manage bookings, inquiries, gallery content and
                studio operations from one private workspace.
              </p>

              {/* stats */}
              <div className="mt-12 grid max-w-[590px] grid-cols-3 border-y border-[#252218] py-6">

                <div className="relative">
                  <div className="font-serif text-[32px] text-[#d5a63f]">
                    500+
                  </div>

                  <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.27em] text-[#686868]">
                    Events
                  </div>
                </div>

                <div className="relative border-l border-[#252218] pl-8">
                  <div className="font-serif text-[32px] text-[#d5a63f]">
                    12K+
                  </div>

                  <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.27em] text-[#686868]">
                    Clients
                  </div>
                </div>

                <div className="relative border-l border-[#252218] pl-8">
                  <div className="font-serif text-[32px] text-[#d5a63f]">
                    50K+
                  </div>

                  <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.27em] text-[#686868]">
                    Photos
                  </div>
                </div>

              </div>

              {/* micro security */}
              <div className="mt-8 flex items-center gap-7 text-[9px] uppercase tracking-[0.2em] text-[#555]">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Encrypted Session
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#cda13d]" />
                  Studio Network
                </span>
              </div>
            </div>

            {/* footer */}
            <div className="relative z-20 flex items-center justify-between text-[8px] font-medium uppercase tracking-[0.28em] text-[#505050]">
              <span>© 2026 First Look Studio</span>

              <span className="flex items-center gap-2">
                <Lock className="h-3 w-3" />
                Private Administration
              </span>
            </div>

          </section>

          {/* =================================================
              RIGHT LOGIN
          ================================================= */}

          <section className="relative mx-auto w-full max-w-[600px] lg:translate-x-[20%]">

            {/* ambient card glow */}
            <div className="absolute -inset-5 rounded-[34px] bg-[#c99634]/[0.035] blur-2xl" />

            {/* corner accents */}
            <div className="absolute -left-px -top-px z-20 h-16 w-16 border-l border-t border-[#d1a13c]" />
            <div className="absolute -right-px -top-px z-20 h-16 w-16 border-r border-t border-[#d1a13c]" />
            <div className="absolute -bottom-px -left-px z-20 h-16 w-16 border-b border-l border-[#d1a13c]" />
            <div className="absolute -bottom-px -right-px z-20 h-16 w-16 border-b border-r border-[#d1a13c]" />

            <div className="relative rounded-[27px] border border-[#272727] bg-[#090909]/95 p-7 shadow-[0_35px_110px_rgba(0,0,0,.75)] backdrop-blur-2xl sm:p-10">

              {/* card header */}
              <div className="flex items-start justify-between">

                <div className="relative flex h-[58px] w-[58px] items-center justify-center rounded-full border border-[#60491b] bg-[#131008]">
                  <Lock className="h-6 w-6 text-[#d4a33d]" />

                  <div className="absolute inset-[-8px] rounded-full border border-[#73571f]/20" />
                </div>

                <div className="flex items-center gap-2 rounded-full border border-emerald-900/60 bg-emerald-950/20 px-4 py-2 text-[8px] font-bold uppercase tracking-[0.25em] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_3px_rgba(52,211,153,.25)]" />
                  Secure Access
                </div>

              </div>

              {/* heading */}
              <div className="mt-9">

                <div className="mb-4 text-[9px] font-bold uppercase tracking-[0.34em] text-[#bd9133]">
                  Administration
                </div>

                <h2 className="font-serif text-[48px] leading-none tracking-[-0.035em] text-white sm:text-[52px]">
                  Welcome back.
                </h2>

                <p className="mt-4 max-w-[430px] text-[13px] leading-6 text-[#707070]">
                  Sign in to continue to your private studio dashboard.
                </p>

              </div>

              {/* form */}
              <form onSubmit={handleSubmit} className="mt-9 space-y-6">

                {/* email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-3 block text-[9px] font-bold uppercase tracking-[0.28em] text-[#777]"
                  >
                    Admin Email
                  </label>

                  <div className="group relative">

                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#4c4c4c] transition group-focus-within:text-[#d2a23c]" />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@firstlookstudio.com"
                      autoComplete="email"
                      required
                      className="h-[59px] w-full rounded-xl border border-[#292929] bg-[#0f0f0f] pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-[#414141] hover:border-[#383838] focus:border-[#806224] focus:bg-[#11100d] focus:ring-1 focus:ring-[#806224]/30"
                    />

                  </div>
                </div>

                {/* password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-3 block text-[9px] font-bold uppercase tracking-[0.28em] text-[#777]"
                  >
                    Password
                  </label>

                  <div className="group relative">

                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#4c4c4c] transition group-focus-within:text-[#d2a23c]" />

                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your secure password"
                      autoComplete="current-password"
                      required
                      className="h-[59px] w-full rounded-xl border border-[#292929] bg-[#0f0f0f] pl-12 pr-12 text-sm text-white outline-none transition-all placeholder:text-[#414141] hover:border-[#383838] focus:border-[#806224] focus:bg-[#11100d] focus:ring-1 focus:ring-[#806224]/30"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4d4d4d] transition hover:text-[#d2a23c]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-[17px] w-[17px]" />
                      ) : (
                        <Eye className="h-[17px] w-[17px]" />
                      )}
                    </button>

                  </div>
                </div>

                {/* private access */}
                <div className="group rounded-xl border border-[#302718] bg-gradient-to-r from-[#100e09] to-[#0c0b08] p-4 transition hover:border-[#5d481e]">

                  <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#57431b] bg-[#17130a]">
                      <Fingerprint className="h-5 w-5 text-[#d0a13d]" />
                    </div>

                    <div>
                      <div className="text-[10px] font-semibold text-[#d0a13d]">
                        Private studio access
                      </div>

                      <p className="mt-1.5 text-[9px] leading-5 text-[#5f5f5f]">
                        This area is restricted to authorized First Look
                        Studio administrators.
                      </p>
                    </div>

                  </div>

                </div>

                {/* error */}
                {error && (
                  <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-xs text-red-400">
                    {error}
                  </div>
                )}

                {/* button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex h-[62px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#d4aa4d] text-[13px] font-bold text-[#080808] shadow-[0_10px_35px_rgba(212,170,77,.08)] transition-all hover:bg-[#e0b75d] hover:shadow-[0_15px_45px_rgba(212,170,77,.18)] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {/* shine */}
                  <span className="absolute -left-[80%] top-0 h-full w-[45%] skew-x-[-20deg] bg-white/20 transition-all duration-700 group-hover:left-[115%]" />

                  <span className="relative z-10 flex items-center gap-3">
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#111]/30 border-t-[#111]" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        Enter Studio
                        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </span>

                </button>

              </form>

              {/* divider */}
              <div className="my-7 h-px bg-[#202020]" />

              {/* security */}
              <div className="grid grid-cols-2 gap-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-950/40">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  </div>

                  <div>
                    <div className="text-[9px] font-medium text-[#777]">
                      Protected workspace
                    </div>
                    <div className="mt-0.5 text-[7px] uppercase tracking-[0.15em] text-[#414141]">
                      Secure
                    </div>
                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-950/40">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  </div>

                  <div>
                    <div className="text-[9px] font-medium text-[#777]">
                      Admin-only access
                    </div>
                    <div className="mt-0.5 text-[7px] uppercase tracking-[0.15em] text-[#414141]">
                      Restricted
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* return */}
            <Link
              href="/"
              className="group mt-7 flex items-center justify-center gap-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#4d4d4d] transition hover:text-[#cda13e]"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              Back to First Look Studio
            </Link>

          </section>

        </div>
      </div>

    </main>
  );
}