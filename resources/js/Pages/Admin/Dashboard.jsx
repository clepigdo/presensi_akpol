import React, { useState, useEffect } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard({
    auth,
    stats,
    daftar_mahasiswa,
    logbooks,
    absensi_hari_ini,
}) {
    const { flash } = usePage().props;
    const [currentTime, setCurrentTime] = useState(new Date());

    const [selectedLog, setSelectedLog] = useState(null);
    const [selectedPersonel, setSelectedPersonel] = useState(null);

    // [STATE BARU]: Untuk mengatur filter/tab tabel logbook
    const [logbookTab, setLogbookTab] = useState("pending"); // default: menampilkan antrean

    const [selectedUserId, setSelectedUserId] = useState(null); // Filter per orang
    const [dateFilter, setDateFilter] = useState("all"); // 'all', 'weekly', 'monthly'

    const { data, setData, post, processing, reset } = useForm({
        status_verifikasi: "",
        catatan_mentor: "",
    });
    const [personelTab, setPersonelTab] = useState("all");

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const openReviewModal = (log) => {
        setSelectedLog(log);
        setData({
            status_verifikasi:
                log.status_verifikasi === "pending"
                    ? "disetujui"
                    : log.status_verifikasi,
            catatan_mentor: log.catatan_mentor || "",
        });
    };

    const handleVerify = (e) => {
        e.preventDefault();
        post(route("admin.logbooks.verify", selectedLog.id), {
            onSuccess: () => {
                setSelectedLog(null);
                reset();
            },
        });
    };

    const filteredLogbooks = (logbooks || []).filter((log) => {
        // 1. Filter Status (Pending vs Arsip)
        const matchTab =
            logbookTab === "pending"
                ? log.status_verifikasi === "pending"
                : log.status_verifikasi !== "pending";

        // 2. Filter User (Jika ada user yang dipilih)
        const matchUser = selectedUserId
            ? log.user_id === selectedUserId
            : true;

        // 3. Filter Waktu (Mingguan / Bulanan)
        let matchDate = true;
        const logDate = new Date(log.created_at);
        const now = new Date();

        if (dateFilter === "weekly") {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            matchDate = logDate >= oneWeekAgo;
        } else if (dateFilter === "monthly") {
            matchDate =
                logDate.getMonth() === now.getMonth() &&
                logDate.getFullYear() === now.getFullYear();
        }

        return matchTab && matchUser && matchDate;
    });

    return (
        <div className="min-h-screen bg-[#050A18] text-slate-200 font-sans selection:bg-[#B8860B] selection:text-white flex flex-col h-screen overflow-hidden">
            <Head title="HQ Command Center" />

            {/* BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0A1E3A_0%,#050A18_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,160,23,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,160,23,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-[150px]"></div>
            </div>

            {/* NAVBAR */}
            <nav className="relative z-20 border-b border-[#B8860B]/10 bg-[#0A1428]/95 backdrop-blur-xl shrink-0 shadow-md">
                <div className="w-full px-6 flex justify-between h-16 items-center">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 border border-[#B8860B] rounded flex items-center justify-center bg-[#B8860B]/10 shadow-[0_0_10px_rgba(184,134,11,0.2)]">
                            <span className="text-[#B8860B] font-black text-sm font-serif">
                                HQ
                            </span>
                        </div>
                        <div>
                            <h1 className="font-serif font-bold text-sm text-white tracking-[0.15em]">
                                SIAK MAGANG{" "}
                                <span className="text-[#B8860B]">ADMIN</span>
                            </h1>
                            <p className="text-[8px] text-blue-400 font-mono tracking-[0.2em] uppercase opacity-80">
                                Central Monitoring System
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="text-right border-r border-white/10 pr-5">
                            <p className="text-xs font-bold text-white uppercase tracking-wider">
                                {auth.user?.nama_lengkap}
                            </p>
                            <p className="text-[9px] text-blue-400 font-mono uppercase tracking-widest">
                                SysAdmin
                            </p>
                        </div>
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="text-[10px] font-bold text-red-400 hover:text-red-300 tracking-widest uppercase transition-colors px-2 py-1 rounded hover:bg-red-500/10"
                        >
                            LOG OUT
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex-1 w-full relative z-10 p-6 flex flex-col gap-6 overflow-hidden max-w-[1600px] mx-auto">
                {/* WIDGET BAR (Atas) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
                    <div className="bg-[#0A1428]/80 border border-blue-500/20 rounded-xl p-5 shadow-lg flex items-center justify-between">
                        <div>
                            <h3 className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-1">
                                Total Personel Aktif
                            </h3>
                            <p className="text-4xl font-black text-white tracking-tight">
                                {stats.total_mahasiswa}
                            </p>
                        </div>
                    </div>

                    <div
                        onClick={() => setPersonelTab("present")}
                        className="bg-[#0A1428]/80 border border-emerald-500/20 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] cursor-pointer rounded-xl p-5 shadow-lg flex items-center justify-between group transition-all relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-2 group-hover:text-white transition">
                                Kehadiran Hari Ini
                                <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                                    {currentTime.toLocaleTimeString()}
                                </span>
                            </h3>
                            <p className="text-4xl font-black text-white tracking-tight">
                                {stats.hadir_hari_ini}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 relative z-10 group-hover:scale-110 transition-transform">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* [WIDGET DIUBAH]: Sekarang clickable & ada efek hover */}
                    <div
                        onClick={() => setLogbookTab("pending")}
                        className="bg-[#0A1428]/80 border border-[#B8860B]/30 hover:border-[#F0C040] hover:shadow-[0_0_20px_rgba(184,134,11,0.2)] cursor-pointer rounded-xl p-5 shadow-lg flex items-center justify-between relative overflow-hidden group transition-all"
                    >
                        <div className="absolute inset-0 bg-[#B8860B]/5 group-hover:bg-[#B8860B]/10 animate-pulse"></div>
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-mono text-[#F0C040] uppercase tracking-widest mb-1 group-hover:text-white transition">
                                Verifikasi Tertunda
                            </h3>
                            <p className="text-4xl font-black text-white tracking-tight">
                                {stats.logbook_pending}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#B8860B]/20 flex items-center justify-center text-[#F0C040] relative z-10">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                    {/* PANEL KIRI: DATABASE PERSONEL */}
                    {/* PANEL KIRI: DATABASE PERSONEL & LIVE ABSEN */}
                    <div className="col-span-4 bg-[#0A1428]/90 border border-white/10 rounded-xl flex flex-col overflow-hidden shadow-2xl">
                        <div className="px-5 pt-5 border-b border-white/10 bg-black/40 flex flex-col shrink-0">
                            <h2 className="font-serif font-bold tracking-widest text-white text-xs flex items-center gap-3 mb-4">
                                <span
                                    className={`w-2 h-2 rounded-full animate-ping relative ${personelTab === "present" ? "bg-emerald-500" : "bg-blue-500"}`}
                                >
                                    <span
                                        className={`absolute inset-0 rounded-full ${personelTab === "present" ? "bg-emerald-500" : "bg-blue-500"}`}
                                    ></span>
                                </span>
                                {personelTab === "all"
                                    ? "DATABASE PERSONEL"
                                    : "LIVE PRESENSI"}
                            </h2>

                            {/* Tab Navigasi Panel Kiri */}
                            <div className="flex gap-6">
                                <button
                                    onClick={() => setPersonelTab("all")}
                                    className={`pb-3 text-[9px] font-bold uppercase tracking-widest transition relative ${personelTab === "all" ? "text-blue-400" : "text-slate-500 hover:text-slate-300"}`}
                                >
                                    Semua Personel
                                    {personelTab === "all" && (
                                        <motion.div
                                            layoutId="lefttab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                                        />
                                    )}
                                </button>
                                <button
                                    onClick={() => setPersonelTab("present")}
                                    className={`pb-3 text-[9px] font-bold uppercase tracking-widest transition relative ${personelTab === "present" ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"}`}
                                >
                                    Hadir Hari Ini
                                    {personelTab === "present" && (
                                        <motion.div
                                            layoutId="lefttab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-black/20">
                            {/* TAMPILAN TAB 1: SEMUA PERSONEL */}
                            {personelTab === "all" &&
                                (daftar_mahasiswa?.length > 0 ? (
                                    <table className="w-full text-left">
                                        <thead className="text-[9px] uppercase font-mono text-slate-500 border-b border-white/5 bg-[#050A18] sticky top-0 z-10">
                                            <tr>
                                                <th className="py-3 px-5 font-medium tracking-widest">
                                                    Nama & ID
                                                </th>
                                                <th className="py-3 px-5 font-medium text-right tracking-widest">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {daftar_mahasiswa.map((mhs) => (
                                                <tr
                                                    key={mhs.id}
                                                    className="hover:bg-white/5 transition cursor-pointer group"
                                                    onClick={() =>
                                                        setSelectedPersonel(mhs)
                                                    }
                                                >
                                                    <td className="py-3 px-5">
                                                        <div className="font-bold text-white text-[11px] truncate w-32">
                                                            {mhs.nama_lengkap}
                                                        </div>
                                                        <div className="text-[9px] font-mono text-slate-500">
                                                            {mhs.nim_atau_nrp}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-5 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {/* [TOMBOL BARU]: Filter Logbook */}
                                                            <button
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation(); // Mencegah modal profil ikut terbuka saat klik tombol ini
                                                                    setSelectedUserId(
                                                                        mhs.id,
                                                                    );
                                                                    setLogbookTab(
                                                                        "arsip",
                                                                    ); // Otomatis buka tab arsip untuk melihat riwayatnya
                                                                }}
                                                                className="text-[8px] font-bold bg-[#B8860B]/10 text-[#F0C040] border border-[#B8860B]/30 px-2 py-1 rounded hover:bg-[#B8860B] hover:text-black transition opacity-0 group-hover:opacity-100"
                                                            >
                                                                LOGBOOK
                                                            </button>

                                                            {/* [TOMBOL LAMA]: Profil Identitas */}
                                                            <button className="text-[8px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition">
                                                                PROFIL
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-40 p-6">
                                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                                            Belum ada personel
                                        </span>
                                    </div>
                                ))}

                            {/* TAMPILAN TAB 2: HADIR HARI INI */}
                            {personelTab === "present" &&
                                (absensi_hari_ini?.length > 0 ? (
                                    <table className="w-full text-left">
                                        <thead className="text-[9px] uppercase font-mono text-slate-500 border-b border-white/5 bg-[#050A18] sticky top-0 z-10">
                                            <tr>
                                                <th className="py-3 px-5 font-medium tracking-widest">
                                                    Personel Aktif
                                                </th>
                                                <th className="py-3 px-5 font-medium text-center tracking-widest">
                                                    In / Out
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {absensi_hari_ini.map((absen) => (
                                                <tr
                                                    key={absen.id}
                                                    className="hover:bg-white/5 transition"
                                                >
                                                    <td className="py-3 px-5">
                                                        <div className="font-bold text-white text-[11px] truncate w-40">
                                                            {
                                                                absen.user
                                                                    ?.nama_lengkap
                                                            }
                                                        </div>
                                                        <div className="text-[9px] font-mono text-emerald-400 mt-0.5">
                                                            Status: Deployed
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-5 text-center">
                                                        <div className="text-[10px] font-bold text-white font-mono">
                                                            {absen.jam_masuk}
                                                        </div>
                                                        <div className="text-[9px] font-mono text-slate-500">
                                                            {absen.jam_pulang ||
                                                                "--:--"}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-40 p-6">
                                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                                            Belum ada yang hadir
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* PANEL KANAN: MANAJEMEN LOGBOOK (Dengan Fitur Tab) */}
                    <div className="col-span-8 bg-[#0A1428]/90 border border-white/10 rounded-xl flex flex-col overflow-hidden shadow-2xl">
                        <div className="px-5 pt-5 border-b border-white/10 bg-[#B8860B]/5 flex flex-col shrink-0">
                            {/* BARIS BARU: FILTER SPESIFIK */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                {/* Menampilkan indikator jika sedang filter per orang */}
                                {selectedUserId && (
                                    <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 px-3 py-1 rounded-full">
                                        <span className="text-[9px] font-bold text-blue-400 uppercase">
                                            User:{" "}
                                            {
                                                logbooks.find(
                                                    (l) =>
                                                        l.user_id ===
                                                        selectedUserId,
                                                )?.user.nama_lengkap
                                            }
                                        </span>
                                        <button
                                            onClick={() =>
                                                setSelectedUserId(null)
                                            }
                                            className="text-blue-400 hover:text-white text-xs"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}

                                {/* Dropdown Filter Waktu */}
                                <select
                                    value={dateFilter}
                                    onChange={(e) =>
                                        setDateFilter(e.target.value)
                                    }
                                    className="bg-black/40 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-slate-400 rounded px-2 py-1 outline-none focus:border-[#B8860B]/50"
                                >
                                    <option value="all">Semua Waktu</option>
                                    <option value="weekly">Minggu Ini</option>
                                    <option value="monthly">Bulan Ini</option>
                                </select>

                                {(selectedUserId || dateFilter !== "all") && (
                                    <button
                                        onClick={() => {
                                            setSelectedUserId(null);
                                            setDateFilter("all");
                                        }}
                                        className="text-[9px] text-slate-500 hover:text-red-400 font-bold uppercase underline decoration-dotted"
                                    >
                                        Reset Filter
                                    </button>
                                )}
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-serif font-bold tracking-widest text-[#F0C040] text-xs">
                                    PAPAN KONTROL LOGBOOK
                                </h2>
                                {flash.success && (
                                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20">
                                        {flash.success}
                                    </span>
                                )}
                            </div>

                            {/* [NAVIGASI TAB BARU] */}
                            <div className="flex gap-6">
                                <button
                                    onClick={() => setLogbookTab("pending")}
                                    className={`pb-3 text-[10px] font-bold uppercase tracking-widest transition relative ${logbookTab === "pending" ? "text-[#F0C040]" : "text-slate-500 hover:text-slate-300"}`}
                                >
                                    Menunggu Review ({stats.logbook_pending})
                                    {logbookTab === "pending" && (
                                        <motion.div
                                            layoutId="admintab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F0C040]"
                                        />
                                    )}
                                </button>
                                <button
                                    onClick={() => setLogbookTab("arsip")}
                                    className={`pb-3 text-[10px] font-bold uppercase tracking-widest transition relative ${logbookTab === "arsip" ? "text-[#F0C040]" : "text-slate-500 hover:text-slate-300"}`}
                                >
                                    Arsip Riwayat
                                    {logbookTab === "arsip" && (
                                        <motion.div
                                            layoutId="admintab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F0C040]"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-black/20">
                            {filteredLogbooks?.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="text-[9px] uppercase font-mono text-slate-500 border-b border-white/5 bg-[#050A18] sticky top-0 z-10">
                                        <tr>
                                            <th className="py-3 px-5 font-medium tracking-widest">
                                                Mahasiswa
                                            </th>
                                            <th className="py-3 px-5 font-medium tracking-widest w-1/2">
                                                Judul Aktivitas
                                            </th>
                                            <th className="py-3 px-5 font-medium text-center tracking-widest">
                                                Status
                                            </th>
                                            <th className="py-3 px-5 font-medium text-right tracking-widest">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredLogbooks.map((log) => (
                                            <tr
                                                key={log.id}
                                                className="hover:bg-white/[0.03] transition group"
                                            >
                                                <td className="py-4 px-5 align-top">
                                                    <div className="font-bold text-white text-[11px] truncate max-w-[150px]">
                                                        {log.user.nama_lengkap}
                                                    </div>
                                                    <div className="text-[9px] font-mono text-slate-500 mt-1">
                                                        {new Date(
                                                            log.created_at,
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                            },
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-5 align-top">
                                                    <div className="text-white text-xs font-bold truncate max-w-[350px]">
                                                        {log.judul_kegiatan}
                                                    </div>
                                                    {/* Truncate deskripsi agar tabel rapi */}
                                                    <div className="text-[10px] text-slate-400 line-clamp-2 max-w-[350px] mt-1">
                                                        {log.deskripsi_kegiatan}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-5 align-top text-center">
                                                    <span
                                                        className={`px-2.5 py-1 rounded text-[8px] font-bold uppercase tracking-widest border ${
                                                            log.status_verifikasi ===
                                                            "disetujui"
                                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                                                : log.status_verifikasi ===
                                                                    "ditolak"
                                                                  ? "bg-red-500/10 text-red-400 border-red-500/30"
                                                                  : "bg-[#B8860B]/10 text-[#F0C040] border-[#B8860B]/30"
                                                        }`}
                                                    >
                                                        {log.status_verifikasi}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5 align-top text-right">
                                                    <button
                                                        onClick={() =>
                                                            openReviewModal(log)
                                                        }
                                                        className={`text-[9px] font-bold uppercase border px-4 py-1.5 rounded transition shadow-sm ${
                                                            log.status_verifikasi ===
                                                            "pending"
                                                                ? "bg-[#B8860B]/20 text-[#F0C040] border-[#B8860B]/50 hover:bg-[#B8860B] hover:text-black"
                                                                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                                                        }`}
                                                    >
                                                        {log.status_verifikasi ===
                                                        "pending"
                                                            ? "Review"
                                                            : "Detail"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-40 p-6">
                                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                                        {logbookTab === "pending"
                                            ? "Tidak Ada Antrean"
                                            : "Arsip Kosong"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL 1: PROFIL PERSONEL (Tetap Sama) */}
            <AnimatePresence>
                {selectedPersonel && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPersonel(null)}
                            className="absolute inset-0 bg-[#050A18]/90 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md bg-[#0A1428] border border-blue-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                        >
                            <div className="p-5 border-b border-white/10 bg-blue-500/10 flex justify-between items-center">
                                <h3 className="text-blue-400 font-serif font-bold tracking-widest text-sm">
                                    PROFIL IDENTITAS
                                </h3>
                                <button
                                    onClick={() => setSelectedPersonel(null)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-6 flex flex-col items-center bg-black/20">
                                <div className="w-32 h-32 rounded-xl bg-[#050A18] border-2 border-blue-500/50 mb-4 overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                    {selectedPersonel.face_data ? (
                                        <img
                                            src={selectedPersonel.face_data}
                                            alt="Biometrik"
                                            className="w-full h-full object-cover transform -scale-x-100"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-[10px] uppercase text-center p-2">
                                            Tanpa
                                            <br />
                                            Biometrik
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-white font-bold text-lg text-center uppercase tracking-wider mb-1">
                                    {selectedPersonel.nama_lengkap}
                                </h2>
                                <p className="text-blue-400 font-mono text-xs mb-6 tracking-widest">
                                    {selectedPersonel.nim_atau_nrp}
                                </p>
                                <div className="w-full space-y-3">
                                    <div className="bg-[#050A18] border border-white/5 p-3 rounded-lg flex justify-between items-center">
                                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                                            Email
                                        </span>
                                        <span className="text-xs font-medium text-white">
                                            {selectedPersonel.email}
                                        </span>
                                    </div>
                                    <div className="bg-[#050A18] border border-white/5 p-3 rounded-lg flex justify-between items-center">
                                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                                            Role Sistem
                                        </span>
                                        <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded uppercase tracking-widest font-bold">
                                            {selectedPersonel.role}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedPersonel(null)}
                                    className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-white tracking-widest uppercase transition"
                                >
                                    Tutup Profil
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL 2: REVIEW LOGBOOK (Tetap Sama) */}
            <AnimatePresence>
                {selectedLog && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedLog(null)}
                            className="absolute inset-0 bg-[#050A18]/90 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-2xl bg-[#0A1428] border border-[#B8860B]/30 rounded-xl shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="p-5 border-b border-white/10 bg-[#B8860B]/10 flex justify-between items-center shrink-0">
                                <div>
                                    <h3 className="text-[#F0C040] font-serif font-bold tracking-widest text-sm">
                                        REVIEW AKTIVITAS
                                    </h3>
                                    <p className="text-[9px] text-slate-300 font-mono mt-0.5 uppercase tracking-widest">
                                        {selectedLog.user.nama_lengkap}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1.5 rounded text-[9px] font-bold uppercase border ${selectedLog.status_verifikasi === "pending" ? "bg-[#B8860B]/20 text-[#F0C040] border-[#B8860B]/50" : "bg-slate-800 text-slate-400"}`}
                                >
                                    Status Saat Ini:{" "}
                                    {selectedLog.status_verifikasi}
                                </span>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-black/20">
                                <div>
                                    <label className="text-[9px] font-mono text-[#B8860B] tracking-widest uppercase mb-1.5 block">
                                        Judul Kegiatan
                                    </label>
                                    <p className="text-white font-bold text-sm bg-[#050A18] p-3.5 rounded-lg border border-white/5">
                                        {selectedLog.judul_kegiatan}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-[9px] font-mono text-[#B8860B] tracking-widest uppercase mb-1.5 block">
                                        Deskripsi Detail
                                    </label>
                                    <div className="text-slate-300 text-xs leading-relaxed bg-[#050A18] p-4 rounded-lg border border-white/5 whitespace-pre-wrap">
                                        {selectedLog.deskripsi_kegiatan}
                                    </div>
                                </div>

                                <form
                                    onSubmit={handleVerify}
                                    className="space-y-4 pt-5 border-t border-white/10 mt-2"
                                >
                                    <div>
                                        <label className="text-[9px] font-mono text-[#B8860B] tracking-widest uppercase mb-2 block">
                                            Keputusan Verifikasi
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        "status_verifikasi",
                                                        "disetujui",
                                                    )
                                                }
                                                className={`py-3 rounded-lg font-bold text-[10px] tracking-widest uppercase border transition ${data.status_verifikasi === "disetujui" ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-[#050A18] border-white/10 text-slate-500 hover:border-emerald-500/30 hover:text-emerald-500/70"}`}
                                            >
                                                Setujui Laporan
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        "status_verifikasi",
                                                        "ditolak",
                                                    )
                                                }
                                                className={`py-3 rounded-lg font-bold text-[10px] tracking-widest uppercase border transition ${data.status_verifikasi === "ditolak" ? "bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]" : "bg-[#050A18] border-white/10 text-slate-500 hover:border-red-500/30 hover:text-red-500/70"}`}
                                            >
                                                Tolak / Minta Revisi
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-mono text-[#B8860B] tracking-widest uppercase mb-1.5 block">
                                            Catatan Mentor (Opsional)
                                        </label>
                                        <textarea
                                            value={data.catatan_mentor}
                                            onChange={(e) =>
                                                setData(
                                                    "catatan_mentor",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Berikan instruksi atau masukan untuk mahasiswa..."
                                            className="w-full bg-[#050A18] border border-white/10 rounded-lg text-white text-xs p-3.5 outline-none focus:border-[#B8860B]/50 transition resize-none h-24"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedLog(null)}
                                            className="px-5 py-2.5 text-[10px] font-bold tracking-widest uppercase text-slate-500 hover:text-white transition"
                                        >
                                            Batal / Tutup
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-8 py-2.5 bg-[#B8860B] text-[#050A18] rounded-lg font-bold text-[10px] tracking-widest uppercase hover:brightness-110 shadow-lg transition"
                                        >
                                            {processing
                                                ? "Menyimpan..."
                                                : "Eksekusi Keputusan"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
