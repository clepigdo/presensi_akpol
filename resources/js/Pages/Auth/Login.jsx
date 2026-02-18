import React, { useEffect, useRef, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";

// --- Komponen: Background Particles (Tetap Sama) ---
const ParticleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const setSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setSize();
        window.addEventListener("resize", setSize);

        const dots = [];
        const spacing = 60;
        for (let x = 0; x < canvas.width; x += spacing) {
            for (let y = 0; y < canvas.height; y += spacing) {
                if (Math.random() > 0.7) {
                    // Mengurangi jumlah titik agar lebih bersih
                    dots.push({
                        x,
                        y,
                        ox: x,
                        oy: y,
                        r: Math.random() * 1.5,
                        speed: Math.random() * 0.005 + 0.001,
                        phase: Math.random() * Math.PI * 2,
                    });
                }
            }
        }

        let animationFrame;
        const animate = (t) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dots.forEach((d) => {
                d.x = d.ox + Math.sin(t * d.speed + d.phase) * 2;
                d.y = d.oy + Math.cos(t * d.speed + d.phase) * 2;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(212,160,23,0.2)";
                ctx.fill();
            });
            animationFrame = requestAnimationFrame(animate);
        };
        animationFrame = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", setSize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 opacity-60 pointer-events-none"
        />
    );
};

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPass, setShowPass] = useState(false);

    useEffect(() => {
        return () => reset("password");
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <div className="h-screen bg-akpol-navy text-white font-cormorant overflow-hidden relative flex flex-col">
            <Head title="Masuk Sistem — AKPOL" />

            <ParticleCanvas />

            {/* --- Background Ambience --- */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0A1E3A_0%,#050A18_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,160,23,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,160,23,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            {/* --- Header Nav (Fixed Top) --- */}
            <nav className="fixed top-0 left-0 right-0 z-50 h-20 px-6 md:px-12 flex items-center justify-between border-b border-akpol-gold/10 bg-[#050A18]/90 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-3 group">
                    <img
                        src="../images/Logo_Akademi_Kepolisian.png"
                        alt="AKPOL"
                        className="h-9 w-auto drop-shadow-[0_0_8px_rgba(212,160,23,0.4)] transition-transform group-hover:scale-105"
                    />
                    <div>
                        <div className="font-cinzel font-bold text-xs tracking-[0.25em] text-white">
                            AKPOL
                        </div>
                        <div className="font-tech text-[8px] text-akpol-gold tracking-[0.2em] opacity-80">
                            AKADEMI KEPOLISIAN
                        </div>
                    </div>
                </Link>
                <div className="flex items-center gap-2 px-3 py-1 rounded border border-akpol-gold/10 bg-akpol-gold/5">
                    <span className="font-tech text-[9px] text-akpol-gold tracking-widest uppercase">
                        Secure // Auth
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22C55E]" />
                </div>
            </nav>
            <main className="min-h-screen w-full flex flex-col items-center justify-center relative z-10 px-4 py-20">
                {/* CONTAINER UTAMA */}
                <div className="w-full max-w-[400px]">
                    {/* Logo & Title Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-8"
                    >
                        <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
                            <div className="absolute inset-0 border border-akpol-gold/20 rounded-full animate-[spin_10s_linear_infinite]" />
                            <div className="absolute inset-2 border border-akpol-gold/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                            <img
                                src="../images/Logo_Akademi_Kepolisian.png"
                                alt="Logo"
                                className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(212,160,23,0.5)]"
                            />
                        </div>
                        <h1 className="font-cinzel text-2xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-akpol-gold to-[#B8860B]">
                            SIAK MAGANG
                        </h1>
                        <p className="font-tech text-[10px] text-akpol-slate/50 tracking-[0.4em] mt-2 uppercase">
                            LOGIN
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-[1px] bg-gradient-to-b from-akpol-gold/30 to-transparent rounded-lg opacity-50 blur-sm pointer-events-none" />

                        <div className="relative bg-[#0A1428]/95 backdrop-blur-xl border border-akpol-gold/10 rounded-lg p-8 shadow-2xl">
                            {status && (
                                <div className="mb-6 p-3 rounded bg-green-500/10 border border-green-500/20 text-center font-tech text-[10px] text-green-400 tracking-wide">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                {/* Email Input */}
                                <div className="space-y-1.5">
                                    <label className="block font-cinzel text-[9px] font-bold tracking-[0.15em] text-akpol-slate/70 uppercase">
                                        Email Dinas
                                    </label>
                                    <div className="relative group/input">
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="nomor@akpol.ac.id"
                                            className={`w-full bg-[#050A18] border ${errors.email ? "border-red-500/50" : "border-akpol-gold/15"} rounded text-white font-tech text-sm tracking-wide py-3 px-4 outline-none focus:border-akpol-gold/50 focus:bg-[#0F1A30] transition-all placeholder:text-gray-700`}
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="font-tech text-[9px] text-red-400 mt-1 uppercase tracking-wide">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password Input */}
                                <div className="space-y-1.5">
                                    <label className="block font-cinzel text-[9px] font-bold tracking-[0.15em] text-akpol-slate/70 uppercase">
                                        Kata Sandi
                                    </label>
                                    <div className="relative group/input">
                                        <input
                                            type={
                                                showPass ? "text" : "password"
                                            }
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="••••••••"
                                            className={`w-full bg-[#050A18] border ${errors.password ? "border-red-500/50" : "border-akpol-gold/15"} rounded text-white font-tech text-sm tracking-wide py-3 px-4 pr-10 outline-none focus:border-akpol-gold/50 focus:bg-[#0F1A30] transition-all placeholder:text-gray-700`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPass(!showPass)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-akpol-gold transition-colors"
                                        >
                                            {showPass ? (
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                                    <line
                                                        x1="1"
                                                        y1="1"
                                                        x2="23"
                                                        y2="23"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="3"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="font-tech text-[9px] text-red-400 mt-1 uppercase tracking-wide">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Checkbox & Forgot Password */}
                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div
                                            className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center transition-colors ${data.remember ? "bg-akpol-gold border-akpol-gold" : "border-gray-600 bg-transparent"}`}
                                        >
                                            {data.remember && (
                                                <svg
                                                    className="w-2.5 h-2.5 text-black"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                >
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked,
                                                )
                                            }
                                            className="hidden"
                                        />
                                        <span className="font-tech text-[9px] tracking-wider text-gray-400 uppercase">
                                            Ingat Saya
                                        </span>
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="font-tech text-[9px] tracking-wider text-akpol-gold/70 hover:text-akpol-gold uppercase transition-colors"
                                        >
                                            Lupa Sandi?
                                        </Link>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 bg-gradient-to-r from-[#B8860B] to-[#F0C040] rounded text-[#050A18] font-cinzel font-bold text-[11px] tracking-[0.2em] uppercase hover:shadow-[0_0_15px_rgba(212,160,23,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                                >
                                    {processing
                                        ? "Memproses..."
                                        : "Masuk Sistem"}
                                </button>
                            </form>
                        </div>
                        <div className="mt-6 text-center opacity-30 font-tech text-[8px] tracking-[0.2em]">
                            SECURE CONNECTION // AES-256
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
