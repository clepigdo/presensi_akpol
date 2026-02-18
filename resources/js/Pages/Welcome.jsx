import React, { useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";

const Icons = {
    Map: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-6 h-6"
        >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
        </svg>
    ),
    Book: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-6 h-6"
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    ),
    Monitor: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-6 h-6"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    ),
    Login: () => (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
        >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
    ),
    Register: () => (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
    ),
    Dashboard: () => (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
        >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
        </svg>
    ),
};

const FEATURES = [
    {
        Icon: Icons.Map,
        color: "text-blue-500",
        glow: "bg-blue-500/15",
        border: "border-blue-500/30",
        label: "Presensi Lokasi",
        sub: "GPS & GEOTAGGING",
        desc: "Validasi kehadiran berbasis GPS untuk memastikan kedisiplinan Mahasiswa berada di titik koordinat magang yang terverifikasi.",
    },
    {
        Icon: Icons.Book,
        color: "text-akpol-gold",
        glow: "bg-akpol-gold/15",
        border: "border-akpol-gold/30",
        label: "E-Logbook",
        sub: "LOG AKTIVITAS DIGITAL",
        desc: "Pelaporan kegiatan harian terstruktur yang mewajibkan dokumentasi foto sebagai bukti kinerja dan aktivitas magang.",
    },
    {
        Icon: Icons.Monitor,
        color: "text-red-600",
        glow: "bg-red-600/15",
        border: "border-red-600/30",
        label: "Monitoring Terpusat",
        sub: "PENGAWASAN REAL-TIME",
        desc: "Dashboard terintegrasi bagi Mentor & Admin untuk memantau presensi, lokasi, dan progres Mahasiswa secara real-time.",
    },
];

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

        const initDots = () => {
            dots.length = 0;
            for (let x = 0; x < canvas.width; x += spacing) {
                for (let y = 0; y < canvas.height; y += spacing) {
                    dots.push({
                        x,
                        y,
                        ox: x,
                        oy: y,
                        r: Math.random() * 1.2 + 0.3,
                        speed: Math.random() * 0.008 + 0.002,
                        phase: Math.random() * Math.PI * 2,
                    });
                }
            }
        };
        initDots();

        let animationFrame;
        const animate = (t) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dots.forEach((d) => {
                d.x = d.ox + Math.sin(t * d.speed + d.phase) * 4;
                d.y = d.oy + Math.cos(t * d.speed + d.phase) * 4;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(212,160,23,0.18)";
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
            className="fixed inset-0 z-0 opacity-70 pointer-events-none"
        />
    );
};

const FeatureCard = ({ feature, index }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1 },
            }}
            className="group relative border border-akpol-gold/10 bg-gradient-to-br from-[#0F1E3A]/90 to-[#050A18]/95 backdrop-blur-md rounded p-8 overflow-hidden transition-all hover:-translate-y-1 hover:border-akpol-gold/30"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-akpol-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-akpol-gold/40 transition-all group-hover:w-5 group-hover:h-5 group-hover:opacity-100" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-akpol-gold/40 transition-all group-hover:w-5 group-hover:h-5 group-hover:opacity-100" />
            <div
                className={`relative w-12 h-12 rounded border ${feature.border} ${feature.glow} flex items-center justify-center ${feature.color} mb-5`}
            >
                <feature.Icon />
                <div
                    className={`absolute inset-0 bg-[radial-gradient(circle,var(--tw-gradient-from),transparent)] from-current opacity-20`}
                />
            </div>

            <h3 className="font-cinzel font-bold text-sm text-white tracking-[0.08em] mb-1">
                {feature.label}
            </h3>
            <div
                className={`font-tech text-[9px] ${feature.color} tracking-[0.15em] mb-4 opacity-80 uppercase`}
            >
                {feature.sub}
            </div>
            <div
                className={`w-10 h-px bg-gradient-to-r from-current to-transparent ${feature.color} opacity-60 mb-4`}
            />
            <p className="font-cormorant italic text-akpol-slate/75 leading-relaxed">
                {feature.desc}
            </p>

            <div className="absolute bottom-4 right-5 font-tech text-[10px] text-akpol-gold/20 tracking-widest">
                0{index + 1}
            </div>
        </motion.div>
    );
};

export default function Welcome({ auth, canLogin, canRegister }) {
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 },
        },
    };
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
        },
    };

    return (
        <>
            <Head title="Sistem Monitoring Magang — AKPOL" />

            <div className="min-h-screen bg-akpol-navy text-white font-cormorant overflow-x-hidden relative">
                <ParticleCanvas />
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#0A1E3A,#050A18_70%)]" />
                    <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(212,160,23,0.06),transparent_70%)] rounded-full" />
                    <div className="absolute bottom-0 -right-[10%] w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(155,28,28,0.08),transparent_70%)] rounded-full" />
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,0.03)_3px,rgba(0,0,0,0.03)_4px)]" />
                </div>
                <motion.div
                    initial={{ top: "-5%" }}
                    animate={{ top: "105%" }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="fixed left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-akpol-gold/30 to-transparent z-[1] pointer-events-none"
                />

                {/* --- Navbar --- */}
                <motion.nav
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.1 }}
                    className="relative z-20 h-[72px] px-6 md:px-12 flex items-center justify-between border-b border-akpol-gold/10 bg-[#050A18]/85 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-4">
                        <img
                            src="images/Logo_Akademi_Kepolisian.png"
                            alt="AKPOL"
                            className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(212,160,23,0.4)]"
                        />
                        <div>
                            <div className="font-cinzel font-bold text-[13px] tracking-[0.3em] leading-none">
                                AKPOL
                            </div>
                            <div className="font-tech text-[8px] text-akpol-gold tracking-[0.2em] mt-[3px]">
                                AKADEMI KEPOLISIAN
                            </div>
                        </div>
                        <div className="w-px h-7 bg-akpol-gold/15 mx-3 hidden md:block" />
                        <div className="hidden md:flex gap-7 font-cinzel text-[10px] font-semibold tracking-widest text-akpol-slate uppercase">
                            {["Beranda", "Tentang", "Panduan"].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="relative group hover:text-akpol-gold-light transition-colors"
                                >
                                    {item}
                                    <span className="absolute bottom-[-2px] left-0 w-0 h-px bg-akpol-gold transition-all duration-300 group-hover:w-full" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block font-tech text-[9px] text-akpol-slate/50 tracking-widest">
                            SYS // ONLINE
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22C55E]" />

                        {auth?.user ? (
                            <Link
                                href={route("dashboard")}
                                className="btn-primary"
                            >
                                <Icons.Dashboard /> Dashboard
                            </Link>
                        ) : (
                            canLogin && (
                                <Link
                                    href={route("login")}
                                    className="btn-primary"
                                >
                                    <Icons.Login /> Masuk
                                </Link>
                            )
                        )}
                    </div>
                </motion.nav>

                <div className="relative z-10 border-b border-akpol-gold/10 bg-akpol-gold/5 py-2 overflow-hidden flex">
                    <motion.div
                        animate={{ x: "-50%" }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="flex whitespace-nowrap gap-16 font-tech text-[9px] text-akpol-gold/50 tracking-[0.15em]"
                    >
                        {[...Array(2)].map((_, i) => (
                            <span key={i} className="flex gap-16">
                                <span>⬡ PRESISI — PROAKTIF — INOVATIF</span>
                                <span>⬡ SISTEM MONITORING MAGANG TARUNA</span>
                                <span>
                                    ⬡ REAL-TIME • TRANSPARAN • AKUNTABEL
                                </span>
                                <span>⬡ AKADEMI KEPOLISIAN INDONESIA</span>
                                <span>⬡ PRESENSI DIGITAL GPS</span>
                            </span>
                        ))}
                    </motion.div>
                </div>

                {/* --- Main Hero --- */}
                <motion.main
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center"
                >
                    {/* Badge */}
                    <motion.div
                        variants={fadeUp}
                        className="inline-flex items-center gap-2 px-3 py-1.5 border border-akpol-gold/25 bg-akpol-gold/5 font-cinzel text-[9px] text-akpol-gold tracking-[0.3em] mb-8 [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)]"
                    >
                        <div className="w-1 h-1 bg-akpol-gold rounded-full" />
                        SISTEM INFORMASI MONITORING
                    </motion.div>
                    <motion.div
                        variants={fadeUp}
                        className="relative w-[200px] h-[200px] mb-12 flex items-center justify-center"
                    >
                        <div className="absolute inset-x-[-20px] top-1/2 h-px bg-akpol-gold/25" />
                        <div className="absolute inset-y-[-20px] left-1/2 w-px bg-akpol-gold/25" />

                        {/* Rotating Ring */}
                        <div className="absolute inset-0 animate-spin-slow">
                            <svg
                                viewBox="0 0 200 200"
                                className="w-full h-full"
                            >
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="94"
                                    fill="none"
                                    stroke="rgba(212,160,23,0.12)"
                                    strokeWidth="1"
                                    strokeDasharray="6 10"
                                />
                            </svg>
                        </div>

                        {/* Static Ring */}
                        <svg
                            viewBox="0 0 200 200"
                            className="absolute inset-0 w-full h-full"
                        >
                            <circle
                                cx="100"
                                cy="100"
                                r="88"
                                fill="none"
                                stroke="rgba(212,160,23,0.45)"
                                strokeWidth="0.75"
                            />
                        </svg>

                        {/* Corners */}
                        {[
                            "-top-1 -left-1",
                            "-top-1 -right-1",
                            "-bottom-1 -left-1",
                            "-bottom-1 -right-1",
                        ].map((pos, i) => (
                            <div
                                key={i}
                                className={`absolute w-3.5 h-3.5 border-akpol-gold/50 ${pos.includes("left") ? "border-l" : "border-r"} ${pos.includes("top") ? "border-t" : "border-b"} ${pos}`}
                            />
                        ))}

                        {/* Center Logo */}
                        <div className="w-[130px] h-[130px] rounded-full bg-akpol-gold/5 border border-akpol-gold/15 flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                            <img
                                src="images/Logo_Akademi_Kepolisian.png"
                                className="w-[100px] h-[100px] object-contain drop-shadow-[0_0_16px_rgba(212,160,23,0.5)]"
                                alt="Logo"
                            />
                        </div>
                    </motion.div>

                    {/* Titles */}
                    <motion.div variants={fadeUp}>
                        <h1 className="font-cinzel text-5xl md:text-[80px] font-black leading-none tracking-tight text-white mb-2">
                            MAGANG MAHASISWA
                        </h1>
                        <h1 className="font-cinzel text-5xl md:text-[80px] font-black leading-none tracking-tight bg-gradient-to-br from-[#9B1C1C] via-[#DC2626] to-[#DC2626] text-transparent bg-clip-text">
                            AKADEMI KEPOLISIAN
                        </h1>

                        {/* Decorative Line */}
                        <div className="flex items-center justify-center gap-4 my-6">
                            <div className="flex-1 max-w-[120px] h-px bg-gradient-to-r from-transparent to-akpol-gold/40" />
                            <div className="flex gap-1.5">
                                <div className="w-1.5 h-px bg-akpol-gold/40" />
                                <div className="w-5 h-px bg-akpol-gold" />
                                <div className="w-1.5 h-px bg-akpol-gold/40" />
                            </div>
                            <div className="flex-1 max-w-[120px] h-px bg-gradient-to-l from-transparent to-akpol-gold/40" />
                        </div>
                    </motion.div>

                    {/* Subtitle */}
                    <motion.div
                        variants={fadeUp}
                        className="max-w-[600px] mx-auto"
                    >
                        <p className="text-lg md:text-[22px] italic text-akpol-slate/85 leading-relaxed tracking-wide">
                            Sistem informasi terpadu untuk validasi presensi,
                            monitoring aktivitas, dan log harian{" "}
                            <span className="text-akpol-gold-light font-semibold not-italic">
                                Mahasiswa
                            </span>{" "}
                            di lingkungan AKPOL secara{" "}
                            <span className="text-akpol-gold-light font-semibold not-italic">
                                Real-time
                            </span>
                            ,{" "}
                            <span className="text-akpol-gold-light font-semibold not-italic">
                                Transparan
                            </span>
                            , dan{" "}
                            <span className="text-akpol-gold-light font-semibold not-italic">
                                Akuntabel
                            </span>
                            .
                        </p>
                    </motion.div>

                    {/* Buttons */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    staggerChildren: 0.1,
                                    delayChildren: 0.3,
                                },
                            },
                        }}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-wrap justify-center gap-5 mt-12"
                    >
                        {!auth?.user ? (
                            <>
                                {canLogin && (
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            href={route("login")}
                                            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-akpol-gold text-akpol-navy font-cinzel font-bold text-xs tracking-[0.2em] uppercase rounded-xl shadow-[0_10px_20px_-10px_rgba(212,160,23,0.5)] transition-all hover:shadow-[0_15px_30px_-10px_rgba(212,160,23,0.6)] overflow-hidden"
                                        >
                                            {/* Efek Kilau (Shine) saat hover */}
                                            <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-[-20deg]" />

                                            <Icons.Login className="w-4 h-4" />
                                            <span>Masuk Sistem</span>
                                        </Link>
                                    </motion.div>
                                )}

                                {canRegister && (
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            href={route("register")}
                                            className="inline-flex items-center gap-3 px-8 py-4 bg-white/[0.03] border border-white/10 text-white font-cinzel font-bold text-xs tracking-[0.2em] uppercase rounded-xl backdrop-blur-md transition-all hover:bg-white/[0.08] hover:border-akpol-gold/50"
                                        >
                                            <Icons.Register className="w-4 h-4 text-akpol-gold" />
                                            <span>Registrasi Mahasiswa</span>
                                        </Link>
                                    </motion.div>
                                )}
                            </>
                        ) : (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href={route("dashboard")}
                                    className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-akpol-gold to-akpol-gold-light text-akpol-navy font-cinzel font-black text-xs tracking-[0.2em] uppercase rounded-xl shadow-xl overflow-hidden"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-[-20deg]" />
                                    <Icons.Dashboard className="w-4 h-4" />
                                    <span>Akses Dashboard</span>
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        variants={fadeUp}
                        className="flex justify-center w-full max-w-[600px] mt-16 py-5 border-y border-akpol-gold/10"
                    >
                        {[
                            { num: "GPS", label: "Validasi Lokasi" },
                            { num: "24/7", label: "Monitoring Aktif" },
                            { num: "100%", label: "Digital & Paperless" },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className={`px-6 text-center ${i !== 2 ? "border-r border-akpol-gold/10" : ""}`}
                            >
                                <div className="font-cinzel text-xl font-bold text-akpol-gold tracking-wider">
                                    {stat.num}
                                </div>
                                <div className="font-tech text-[9px] text-akpol-slate tracking-[0.12em] mt-1 uppercase">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Feature Grid */}
                    <motion.div
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1000px] w-full mt-16 text-left"
                    >
                        {FEATURES.map((f, i) => (
                            <FeatureCard key={i} feature={f} index={i} />
                        ))}
                    </motion.div>
                </motion.main>

                {/* --- Footer --- */}
                <footer className="relative z-10 mt-20 border-t border-akpol-gold/10 bg-[#050A18]/80 py-8 px-12 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-3 opacity-50">
                        <img
                            src="images/Logo_Akademi_Kepolisian.png"
                            className="w-6 h-6 object-contain"
                            alt="Footer Logo"
                        />
                        <span className="font-cinzel text-[9px] text-akpol-slate tracking-[0.2em]">
                            AKADEMI KEPOLISIAN INDONESIA
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="font-tech text-[8px] text-akpol-slate/25 tracking-[0.15em]">
                            © 2026 — ALL RIGHTS RESERVED
                        </div>
                        <div className="px-2.5 py-0.5 border border-green-500/20 bg-green-500/5">
                            <span className="font-tech text-[8px] text-green-500 tracking-[0.15em]">
                                SISTEM AKTIF
                            </span>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Global CSS for Button Styles (to keep JSX clean) */}
            <style>{`
        .btn-primary {
            @apply relative inline-flex items-center gap-2.5 px-9 py-3.5 bg-gradient-to-br from-[#B8860B] via-[#D4A017] to-[#F0C040] text-[#050A18] font-cinzel font-bold text-[11px] tracking-[0.2em] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,160,23,0.4)] [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))];
        }
        .btn-ghost {
            @apply relative inline-flex items-center gap-2.5 px-9 py-3.5 bg-transparent border border-akpol-slate/25 text-akpol-slate font-cinzel font-semibold text-[11px] tracking-[0.2em] uppercase transition-all duration-300 hover:text-akpol-gold hover:border-akpol-gold/50 hover:-translate-y-0.5 [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))];
        }
      `}</style>
        </>
    );
}
