import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";

/* ─── Icons ─────────────────────────────────────────────────────────── */
const Icons = {
    Map: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-5 h-5"
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
            className="w-5 h-5"
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
    ),
    Shield: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-5 h-5"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    ),
    Login: () => (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
    ),
    Register: () => (
        <svg
            width="15"
            height="15"
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
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
    ),
    ArrowRight: () => (
        <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
        >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    ),
};

const FEATURES = [
    {
        Icon: Icons.Map,
        num: "01",
        label: "Presensi Lokasi",
        tag: "GPS Geotagging",
        desc: "Validasi kehadiran berbasis koordinat GPS yang terverifikasi, memastikan Mahasiswa hadir di titik magang yang telah ditentukan.",
        accent: "#22C9A5",
        bg: "rgba(34,201,165,0.08)",
    },
    {
        Icon: Icons.Book,
        num: "02",
        label: "E-Logbook",
        tag: "Log Aktivitas",
        desc: "Pelaporan kegiatan harian terstruktur dengan dokumentasi foto sebagai bukti kinerja dan aktivitas magang yang otentik.",
        accent: "#F5A623",
        bg: "rgba(245,166,35,0.08)",
    },
    {
        Icon: Icons.Shield,
        num: "03",
        label: "Monitoring",
        tag: "Real-time",
        desc: "Dashboard terintegrasi bagi Mentor & Admin untuk memantau presensi, lokasi, dan progres seluruh Mahasiswa secara langsung.",
        accent: "#E05C5C",
        bg: "rgba(224,92,92,0.08)",
    },
];

const AnimatedDot = ({ delay }) => (
    <motion.div
        className="w-1 h-1 rounded-full"
        style={{ background: "#22C9A5" }}
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity, delay }}
    />
);

const FeatureCard = ({ feature, index }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.65,
                delay: 0.5 + index * 0.13,
                ease: [0.22, 1, 0.36, 1],
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                className="relative overflow-hidden rounded-2xl p-7 h-full transition-all duration-400"
                style={{
                    background: hovered
                        ? `linear-gradient(135deg, ${feature.bg} 0%, rgba(255,255,255,0.03) 100%)`
                        : "rgba(255,255,255,0.03)",
                    border: `1px solid ${hovered ? feature.accent + "40" : "rgba(255,255,255,0.07)"}`,
                    transform: hovered ? "translateY(-5px)" : "translateY(0)",
                    boxShadow: hovered
                        ? `0 24px 60px -20px ${feature.accent}28`
                        : "none",
                    transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                }}
            >
                {/* Top accent bar */}
                <div
                    className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-400"
                    style={{
                        background: `linear-gradient(to right, transparent, ${feature.accent}, transparent)`,
                        opacity: hovered ? 1 : 0.25,
                    }}
                />

                <div className="flex items-start justify-between mb-6">
                    <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{
                            background: feature.bg,
                            color: feature.accent,
                            boxShadow: hovered
                                ? `0 0 24px ${feature.accent}30`
                                : "none",
                            transition: "box-shadow 0.3s",
                        }}
                    >
                        <feature.Icon />
                    </div>
                    <span
                        className="font-mono text-[11px] font-bold tracking-widest mt-1"
                        style={{ color: feature.accent, opacity: 0.3 }}
                    >
                        {feature.num}
                    </span>
                </div>

                <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-[0.15em] uppercase mb-3"
                    style={{ background: feature.bg, color: feature.accent }}
                >
                    <div
                        className="w-1 h-1 rounded-full"
                        style={{ background: feature.accent }}
                    />
                    {feature.tag}
                </div>

                <h3 className="text-white font-bold text-[15px] tracking-wide mb-3">
                    {feature.label}
                </h3>
                <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: "#6A8FA8" }}
                >
                    {feature.desc}
                </p>

                <div
                    className="flex items-center gap-1.5 mt-5 text-[11px] font-semibold tracking-wide"
                    style={{
                        color: feature.accent,
                        opacity: hovered ? 1 : 0,
                        transform: hovered
                            ? "translateX(0)"
                            : "translateX(-8px)",
                        transition: "all 0.3s",
                    }}
                >
                    Selengkapnya <Icons.ArrowRight />
                </div>
            </div>
        </motion.div>
    );
};

export default function Welcome({ auth, canLogin, canRegister }) {
    return (
        <>
            <Head title="Sistem Monitoring Magang — AKPOL" />

            <div
                className="min-h-screen relative overflow-x-hidden text-white"
                style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
            >
                {/* ── Background ─────────────────────────────────────── */}
                <div className="fixed inset-0 z-0">
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(135deg, #0B1C2C 0%, #0D2137 50%, #071420 100%)",
                        }}
                    />
                    <div
                        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(34,201,165,0.09) 0%, transparent 70%)",
                        }}
                    />
                    <div
                        className="absolute top-1/2 -right-32 w-[500px] h-[500px] rounded-full"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 70%)",
                        }}
                    />
                    <div
                        className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(224,92,92,0.06) 0%, transparent 70%)",
                        }}
                    />
                    <svg
                        className="absolute inset-0 w-full h-full"
                        style={{ opacity: 0.035 }}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <pattern
                                id="grid"
                                width="48"
                                height="48"
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d="M 48 0 L 0 0 0 48"
                                    fill="none"
                                    stroke="#A0D8D0"
                                    strokeWidth="0.5"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                    <div
                        className="absolute top-0 right-0 w-[2px] h-full"
                        style={{
                            background:
                                "linear-gradient(to bottom, transparent, rgba(34,201,165,0.15) 30%, rgba(245,166,35,0.12) 70%, transparent)",
                        }}
                    />
                </div>

                {/* ── Navbar ─────────────────────────────────────────── */}
                <motion.nav
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-14 h-[68px]"
                    style={{
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        backdropFilter: "blur(24px)",
                        background: "rgba(7,20,32,0.65)",
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{
                                background: "rgba(34,201,165,0.12)",
                                border: "1px solid rgba(34,201,165,0.25)",
                            }}
                        >
                            <img
                                src="images/Logo_Akademi_Kepolisian.png"
                                alt="AKPOL"
                                className="w-6 h-6 object-contain"
                            />
                        </div>
                        <div>
                            <div className="text-[11px] font-black tracking-[0.3em] text-white leading-none">
                                AKPOL
                            </div>
                            <div
                                className="text-[8px] tracking-[0.2em] mt-0.5"
                                style={{ color: "#22C9A5" }}
                            >
                                AKADEMI KEPOLISIAN
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {["Beranda", "Tentang", "Panduan"].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-[12px] font-medium tracking-wider"
                                style={{
                                    color: "#5A8BA0",
                                    transition: "color 0.2s",
                                }}
                                onMouseEnter={(e) =>
                                    (e.target.style.color = "#22C9A5")
                                }
                                onMouseLeave={(e) =>
                                    (e.target.style.color = "#5A8BA0")
                                }
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                            <AnimatedDot delay={0} />
                            <AnimatedDot delay={0.3} />
                            <AnimatedDot delay={0.6} />
                            <span
                                className="text-[9px] tracking-[0.15em] font-mono ml-1"
                                style={{ color: "#22C9A5" }}
                            >
                                ONLINE
                            </span>
                        </div>
                        {auth?.user ? (
                            <Link
                                href={route("dashboard")}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold tracking-wider"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #22C9A5, #19A88A)",
                                    color: "#071420",
                                }}
                            >
                                <Icons.Dashboard /> Dashboard
                            </Link>
                        ) : (
                            canLogin && (
                                <Link
                                    href={route("login")}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold tracking-wider"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #22C9A5, #19A88A)",
                                        color: "#071420",
                                    }}
                                >
                                    <Icons.Login /> Masuk
                                </Link>
                            )
                        )}
                    </div>
                </motion.nav>

                {/* ── Main ───────────────────────────────────────────── */}
                <main className="relative z-10 max-w-6xl mx-auto px-6 md:px-14 pt-20 pb-28">
                    {/* Hero grid */}
                    <div className="grid md:grid-cols-[1fr_220px] gap-12 items-center mb-20">
                        <div>
                            {/* Eyebrow */}
                            <motion.div
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="flex items-center gap-3 mb-8"
                            >
                                <div
                                    className="h-px w-8"
                                    style={{ background: "#22C9A5" }}
                                />
                                <span
                                    className="text-[10px] font-bold tracking-[0.35em] uppercase"
                                    style={{ color: "#22C9A5" }}
                                >
                                    Sistem Informasi Monitoring Magang
                                </span>
                            </motion.div>

                            {/* Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 28 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.2,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                style={{
                                    fontFamily:
                                        "'Playfair Display', Georgia, serif",
                                    lineHeight: 1.05,
                                }}
                                className="font-black mb-5"
                            >
                                <span className="block text-[52px] md:text-[70px] text-white tracking-tight">
                                    Magang
                                </span>
                                <span
                                    className="block text-[52px] md:text-[70px] tracking-tight"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #F5A623 0%, #FAD07A 60%, #F5A623 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    Mahasiswa
                                </span>
                                <span
                                    className="block text-[32px] md:text-[42px] tracking-tight"
                                    style={{ color: "#3A6070" }}
                                >
                                    Akademi Kepolisian
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.35 }}
                                className="text-[15px] leading-[1.8] max-w-[500px] mb-10"
                                style={{ color: "#6A8FA8" }}
                            >
                                Platform terpadu untuk validasi presensi GPS,
                                pencatatan logbook harian, dan pengawasan
                                aktivitas magang secara{" "}
                                <span
                                    style={{
                                        color: "#22C9A5",
                                        fontWeight: 600,
                                    }}
                                >
                                    real-time
                                </span>
                                ,{" "}
                                <span
                                    style={{
                                        color: "#F5A623",
                                        fontWeight: 600,
                                    }}
                                >
                                    transparan
                                </span>
                                , dan{" "}
                                <span
                                    style={{
                                        color: "#E05C5C",
                                        fontWeight: 600,
                                    }}
                                >
                                    akuntabel
                                </span>
                                .
                            </motion.p>

                            {/* CTAs */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.45 }}
                                className="flex flex-wrap gap-3"
                            >
                                {!auth?.user ? (
                                    <>
                                        {canLogin && (
                                            <Link
                                                href={route("login")}
                                                className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-[12px] tracking-widest uppercase overflow-hidden"
                                                style={{
                                                    background:
                                                        "linear-gradient(135deg, #F5A623, #FAD07A)",
                                                    color: "#0B1C2C",
                                                    boxShadow:
                                                        "0 8px 40px -10px rgba(245,166,35,0.55)",
                                                    transition:
                                                        "transform 0.2s, box-shadow 0.2s",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform =
                                                        "translateY(-2px)";
                                                    e.currentTarget.style.boxShadow =
                                                        "0 14px 50px -10px rgba(245,166,35,0.65)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform =
                                                        "translateY(0)";
                                                    e.currentTarget.style.boxShadow =
                                                        "0 8px 40px -10px rgba(245,166,35,0.55)";
                                                }}
                                            >
                                                <Icons.Login /> Masuk Sistem
                                            </Link>
                                        )}
                                        {canRegister && (
                                            <Link
                                                href={route("register")}
                                                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-[12px] tracking-widest uppercase"
                                                style={{
                                                    background:
                                                        "rgba(34,201,165,0.1)",
                                                    color: "#22C9A5",
                                                    border: "1px solid rgba(34,201,165,0.3)",
                                                    transition: "all 0.2s",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background =
                                                        "rgba(34,201,165,0.18)";
                                                    e.currentTarget.style.transform =
                                                        "translateY(-2px)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background =
                                                        "rgba(34,201,165,0.1)";
                                                    e.currentTarget.style.transform =
                                                        "translateY(0)";
                                                }}
                                            >
                                                <Icons.Register /> Registrasi
                                            </Link>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={route("dashboard")}
                                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-[12px] tracking-widest uppercase"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #F5A623, #FAD07A)",
                                            color: "#0B1C2C",
                                            boxShadow:
                                                "0 8px 40px -10px rgba(245,166,35,0.55)",
                                        }}
                                    >
                                        <Icons.Dashboard /> Akses Dashboard
                                    </Link>
                                )}
                            </motion.div>
                        </div>

                        {/* Emblem */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 1.1,
                                delay: 0.25,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="hidden md:flex items-center justify-center"
                        >
                            <div className="relative w-48 h-48">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 35,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        border: "1px dashed rgba(34,201,165,0.2)",
                                    }}
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{
                                        duration: 22,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="absolute inset-4 rounded-full"
                                    style={{
                                        border: "1px solid rgba(245,166,35,0.18)",
                                    }}
                                />
                                {[0, 90, 180, 270].map((deg) => (
                                    <div
                                        key={deg}
                                        className="absolute inset-0 flex items-start justify-center"
                                        style={{
                                            transform: `rotate(${deg}deg)`,
                                        }}
                                    >
                                        <div className="w-2 h-2 -mt-1 flex items-center justify-center">
                                            <div
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{
                                                    background: "#22C9A5",
                                                    opacity: 0.5,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background:
                                            "radial-gradient(circle, rgba(34,201,165,0.06) 0%, transparent 70%)",
                                    }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div
                                        className="w-28 h-28 rounded-full flex items-center justify-center"
                                        style={{
                                            background:
                                                "rgba(255,255,255,0.04)",
                                            border: "1px solid rgba(255,255,255,0.09)",
                                        }}
                                    >
                                        <img
                                            src="images/Logo_Akademi_Kepolisian.png"
                                            className="w-20 h-20 object-contain"
                                            style={{
                                                filter: "drop-shadow(0 0 20px rgba(245,166,35,0.4))",
                                            }}
                                            alt="Logo"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="grid grid-cols-3 gap-4 mb-16"
                    >
                        {[
                            {
                                val: "GPS",
                                label: "Validasi Lokasi",
                                color: "#22C9A5",
                            },
                            {
                                val: "24/7",
                                label: "Monitoring Aktif",
                                color: "#F5A623",
                            },
                            {
                                val: "100%",
                                label: "Digital Paperless",
                                color: "#E05C5C",
                            },
                        ].map((s, i) => (
                            <div
                                key={i}
                                className="rounded-xl p-5 text-center"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                            >
                                <div
                                    className="text-2xl font-black tracking-tight mb-1"
                                    style={{ color: s.color }}
                                >
                                    {s.val}
                                </div>
                                <div
                                    className="text-[10px] tracking-[0.15em] uppercase"
                                    style={{ color: "#3A6070" }}
                                >
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Section label */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.52 }}
                        className="flex items-center gap-4 mb-6"
                    >
                        <span
                            className="text-[10px] font-bold tracking-[0.3em] uppercase"
                            style={{ color: "#3A6070" }}
                        >
                            Fitur Utama
                        </span>
                        <div
                            className="flex-1 h-px"
                            style={{ background: "rgba(255,255,255,0.06)" }}
                        />
                    </motion.div>

                    {/* Feature cards */}
                    <div className="grid md:grid-cols-3 gap-4">
                        {FEATURES.map((f, i) => (
                            <FeatureCard key={i} feature={f} index={i} />
                        ))}
                    </div>
                </main>

                {/* Footer */}
                <footer
                    className="relative z-10 px-6 md:px-14 py-6 flex items-center justify-between"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                    <div className="flex items-center gap-2.5">
                        <img
                            src="images/Logo_Akademi_Kepolisian.png"
                            className="w-5 h-5 object-contain"
                            style={{ opacity: 0.35 }}
                            alt=""
                        />
                        <span
                            className="text-[9px] tracking-[0.2em] uppercase"
                            style={{ color: "#2A4A5A" }}
                        >
                            Akademi Kepolisian Indonesia
                        </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <motion.div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "#22C9A5" }}
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span
                            className="text-[9px] tracking-[0.15em] font-mono"
                            style={{ color: "#2A4A5A" }}
                        >
                            SISTEM AKTIF · © 2026
                        </span>
                    </div>
                </footer>

                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Playfair+Display:wght@700;900&display=swap');
                `}</style>
            </div>
        </>
    );
}
