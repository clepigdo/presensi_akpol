import React from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function Logbook({ auth, cek_absen, riwayat_logbook }) {
    const { flash, errors } = usePage().props;

    // Setup form menggunakan Inertia
    const { data, setData, post, processing, reset } = useForm({
        judul_kegiatan: "",
        deskripsi_kegiatan: "",
    });

    const submitLogbook = (e) => {
        e.preventDefault();
        post(route("mahasiswa.logbook.store"), {
            onSuccess: () => reset("judul_kegiatan", "deskripsi_kegiatan"),
        });
    };

    // Framer Motion Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    return (
        <div className="min-h-screen bg-[#050A18] text-slate-200 font-sans selection:bg-[#B8860B] selection:text-white overflow-hidden flex flex-col">
            <Head title="Log Aktivitas - SIAK MAGANG" />

            {/* --- BACKGROUND AMBIENCE --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0A1E3A_0%,#050A18_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,160,23,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,160,23,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#B8860B]/5 rounded-full blur-[120px]"></div>
            </div>

            {/* --- NAVBAR --- */}
            <nav className="relative z-20 border-b border-[#B8860B]/10 bg-[#050A18]/80 backdrop-blur-xl top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center gap-4">
                            <img
                                src="../images/Logo_Akademi_Kepolisian.png"
                                alt="Logo"
                                className="h-10 w-auto drop-shadow-[0_0_8px_rgba(212,160,23,0.4)]"
                            />
                            <div>
                                <h1 className="font-serif font-bold text-lg text-white tracking-[0.15em]">
                                    SIAK MAGANG
                                </h1>
                                <p className="text-[9px] text-[#B8860B] font-mono tracking-[0.2em] uppercase opacity-80">
                                    Logbook Intelligence
                                </p>
                            </div>
                        </div>

                        {/* NAVIGASI TAB */}
                        <div className="hidden md:flex items-center gap-2 bg-black/20 p-1.5 rounded-lg border border-white/5">
                            <Link
                                href={route("mahasiswa.dashboard")}
                                className="px-4 py-2 rounded-md text-[10px] font-mono tracking-widest uppercase transition-all text-slate-400 hover:text-white hover:bg-white/5"
                            >
                                Dashboard Presensi
                            </Link>
                            <div className="px-4 py-2 rounded-md text-[10px] font-mono tracking-widest uppercase bg-[#B8860B]/20 text-[#F0C040] border border-[#B8860B]/30 shadow-[0_0_10px_rgba(184,134,11,0.2)]">
                                Log Aktivitas
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="group relative px-4 py-2 flex items-center gap-2 overflow-hidden rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold transition duration-200 hover:bg-red-600 hover:text-white"
                            >
                                <span>LOGOUT</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#B8860B]/50 to-transparent"></div>
            </nav>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 w-full relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-[#B8860B]/20 scrollbar-track-transparent">
                {/* NOTIFIKASI ERROR / SUKSES */}
                {(flash.success || flash.error || errors.absen_required) && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-lg border ${flash.error || errors.absen_required ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="font-medium text-sm tracking-wide">
                            {flash.success ||
                                flash.error ||
                                errors.absen_required}
                        </p>
                    </motion.div>
                )}

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                    {/* --- KIRI: FORM PENGISIAN LOGBOOK (4 Kolom) --- */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-5 flex flex-col gap-6"
                    >
                        <div className="bg-[#0A1428]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden h-full flex flex-col">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B8860B] to-transparent"></div>

                            <h3 className="text-lg font-bold text-white font-serif tracking-wider uppercase mb-1">
                                Entry Data Logbook
                            </h3>
                            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-6">
                                Laporkan aktivitas magang harian Anda
                            </p>

                            {!cek_absen ? (
                                // STATE: TERKUNCI KARENA BELUM ABSEN
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-red-500/20 bg-red-500/5 rounded-xl">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-12 h-12 text-red-500/50 mb-3"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <h4 className="text-red-400 font-bold tracking-widest uppercase text-sm mb-2">
                                        Akses Ditolak
                                    </h4>
                                    <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                                        Sistem mendeteksi Anda belum melakukan
                                        Check-In. Silakan kembali ke Dashboard
                                        untuk melakukan presensi terlebih
                                        dahulu.
                                    </p>
                                    <Link
                                        href={route("mahasiswa.dashboard")}
                                        className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold tracking-widest uppercase text-white transition-colors"
                                    >
                                        Kembali ke Dashboard
                                    </Link>
                                </div>
                            ) : (
                                // STATE: TERBUKA - BISA ISI FORM
                                <form
                                    onSubmit={submitLogbook}
                                    className="flex-1 flex flex-col gap-4"
                                >
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-bold tracking-widest uppercase font-mono text-[#B8860B]">
                                            Judul Kegiatan
                                        </label>
                                        <input
                                            type="text"
                                            value={data.judul_kegiatan}
                                            onChange={(e) =>
                                                setData(
                                                    "judul_kegiatan",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Cth: Mengembangkan Modul Deteksi Wajah"
                                            className="w-full bg-black/40 border border-white/10 focus:border-[#B8860B]/50 rounded-lg text-white text-sm py-3 px-4 outline-none transition-colors placeholder:text-slate-600"
                                            required
                                        />
                                        {errors.judul_kegiatan && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.judul_kegiatan}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5 flex-1 flex flex-col">
                                        <label className="block text-[10px] font-bold tracking-widest uppercase font-mono text-[#B8860B]">
                                            Deskripsi / Hasil Kegiatan
                                        </label>
                                        <textarea
                                            value={data.deskripsi_kegiatan}
                                            onChange={(e) =>
                                                setData(
                                                    "deskripsi_kegiatan",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Jelaskan secara rinci apa saja yang Anda kerjakan hari ini..."
                                            className="w-full flex-1 bg-black/40 border border-white/10 focus:border-[#B8860B]/50 rounded-lg text-white text-sm py-3 px-4 outline-none transition-colors placeholder:text-slate-600 resize-none min-h-[150px]"
                                            required
                                        ></textarea>
                                        {errors.deskripsi_kegiatan && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {errors.deskripsi_kegiatan}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-[#B8860B] to-[#D4A017] hover:brightness-110 text-black font-black text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(184,134,11,0.3)] transition-all active:scale-[0.98]"
                                    >
                                        {processing
                                            ? "MENGIRIM LOG..."
                                            : "SIMPAN LOG KEGIATAN"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>

                    {/* --- KANAN: TABEL RIWAYAT LOGBOOK (7 Kolom) --- */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-7 flex flex-col"
                    >
                        <div className="bg-[#0A1428]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex-grow flex flex-col relative overflow-hidden">
                            <h3 className="text-base font-bold text-white font-serif tracking-wider uppercase mb-1">
                                Database Logbook
                            </h3>
                            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-6">
                                Arsip kegiatan yang telah dilaporkan
                            </p>

                            <div className="overflow-hidden rounded-xl border border-white/5 bg-black/20 flex-grow flex flex-col">
                                <div className="overflow-x-auto overflow-y-auto max-h-[500px] flex-grow scrollbar-thin scrollbar-thumb-white/10">
                                    <table className="w-full text-left text-sm text-slate-300">
                                        <thead className="bg-[#050A18] text-[9px] uppercase font-mono tracking-widest text-slate-400 border-b border-white/10 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-4">
                                                    Tanggal & Waktu
                                                </th>
                                                <th className="px-6 py-4">
                                                    Kegiatan
                                                </th>
                                                <th className="px-6 py-4 text-center">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {riwayat_logbook.length > 0 ? (
                                                riwayat_logbook.map((log) => (
                                                    <tr
                                                        key={log.id}
                                                        className="hover:bg-white/5 transition duration-150"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-xs text-white font-medium">
                                                                {new Date(
                                                                    log.created_at,
                                                                ).toLocaleDateString(
                                                                    "id-ID",
                                                                    {
                                                                        day: "numeric",
                                                                        month: "short",
                                                                        year: "numeric",
                                                                    },
                                                                )}
                                                            </div>
                                                            <div className="text-[10px] font-mono text-slate-500 mt-1">
                                                                {new Date(
                                                                    log.created_at,
                                                                ).toLocaleTimeString(
                                                                    "id-ID",
                                                                    {
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    },
                                                                )}{" "}
                                                                WIB
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-xs font-bold text-[#F0C040] mb-1 leading-snug">
                                                                {
                                                                    log.judul_kegiatan
                                                                }
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                                                                {
                                                                    log.deskripsi_kegiatan
                                                                }
                                                            </div>
                                                            {log.catatan_mentor && (
                                                                <div className="mt-2 text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-300 p-2 rounded">
                                                                    <span className="font-bold">
                                                                        Mentor:
                                                                    </span>{" "}
                                                                    {
                                                                        log.catatan_mentor
                                                                    }
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-center align-top">
                                                            <span
                                                                className={`px-2 py-1 rounded border text-[8px] font-bold uppercase tracking-widest inline-flex items-center
                                                                ${
                                                                    log.status_verifikasi ===
                                                                    "disetujui"
                                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                                                        : log.status_verifikasi ===
                                                                            "ditolak"
                                                                          ? "bg-red-500/10 text-red-400 border-red-500/30"
                                                                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                                                                }`}
                                                            >
                                                                {
                                                                    log.status_verifikasi
                                                                }
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="px-6 py-20 text-center"
                                                    >
                                                        <div className="flex flex-col items-center justify-center gap-3 opacity-40">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={1}
                                                                stroke="currentColor"
                                                                className="w-10 h-10 text-[#B8860B]"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                                                />
                                                            </svg>
                                                            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
                                                                Belum ada
                                                                catatan logbook
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}
