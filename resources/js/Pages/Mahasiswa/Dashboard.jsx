import React, { useState, useEffect } from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react"; // Tambahkan Link disini

export default function Dashboard({ auth, cek_absen, riwayat_absen }) {
    const { flash } = usePage().props;
    const [currentTime, setCurrentTime] = useState(new Date());
    const { post, processing } = useForm();

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleAbsen = (e) => {
        e.preventDefault();
        post(route("mahasiswa.absen"));
    };

    const formatTime = (date) =>
        date.toLocaleTimeString("id-ID", { hour12: false });
    const formatDate = (date) =>
        date.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-indigo-500 selection:text-white">
            <Head title="Dashboard Magang - AKPOL" />

            {/* --- BACKGROUND GRADIENTS --- */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[128px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[128px]"></div>
            </div>

            {/* --- NAVBAR --- */}
            <nav className="relative z-20 border-b border-slate-800 bg-[#0F172A]/90 backdrop-blur-xl top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center gap-4">
                            <img
                                src="../images/Logo_Akademi_Kepolisian.png"
                                alt="Logo"
                                className="h-10 w-auto drop-shadow-md opacity-90 hover:opacity-100 transition"
                            />
                            <div>
                                <h1 className="font-bold text-lg text-white tracking-tight">
                                    SIAK MAGANG
                                </h1>
                                <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                                    Monitoring Kegiatan Mahasiswa
                                </p>
                            </div>
                        </div>

                        {/* Area Kanan Navbar */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-white">
                                        {auth.user?.nama_lengkap}
                                    </p>
                                    <p className="text-xs text-indigo-400 font-medium uppercase tracking-wide">
                                        Peserta Magang Aktif
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 ring-2 ring-white/10">
                                    {auth.user?.nama_lengkap?.charAt(0)}
                                </div>
                            </div>

                            {/* --- TOMBOL LOGOUT (BARU) --- */}
                            <div className="h-8 w-[1px] bg-slate-700 hidden sm:block"></div>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-600 hover:text-white transition duration-200 shadow-md hover:shadow-red-600/20"
                            >
                                KELUAR
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- MAIN CONTENT --- */}
            <main className="relative z-10 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* NOTIFIKASI */}
                {flash.success && (
                    <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 shadow-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                fillRule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="font-medium text-sm">{flash.success}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* --- KOLOM KIRI (4 Kolom) --- */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* WIDGET JAM */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 text-center shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-24 h-24 text-white"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-indigo-400 text-xs font-bold tracking-[0.2em] uppercase mb-2">
                                Waktu Server
                            </h2>
                            <h1 className="text-5xl font-bold text-white tracking-tighter tabular-nums mb-1">
                                {formatTime(currentTime)}
                            </h1>
                            <p className="text-slate-400 text-sm font-medium">
                                {formatDate(currentTime)}
                            </p>
                        </div>

                        {/* CARD ACTION ABSENSI */}
                        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Presensi Harian
                                </h3>
                                <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded font-medium">
                                    GPS WAJIB AKTIF
                                </span>
                            </div>

                            {!cek_absen ? (
                                // BELUM ABSEN (MASUK)
                                <div>
                                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-6">
                                        <p className="text-sm text-indigo-300 leading-relaxed">
                                            Halo,{" "}
                                            <strong>
                                                {auth.user?.nama_lengkap}
                                            </strong>
                                            . Silakan melakukan Check-In untuk
                                            memulai kegiatan magang hari ini.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleAbsen}
                                        disabled={processing}
                                        className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                                    >
                                        {processing ? (
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                        ) : (
                                            <>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                CHECK-IN KEHADIRAN
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : cek_absen.jam_pulang === null ? (
                                // SUDAH MASUK (PULANG)
                                <div>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                                                Waktu Masuk
                                            </p>
                                            <p className="text-xl font-bold text-white font-mono">
                                                {cek_absen.jam_masuk}
                                            </p>
                                        </div>
                                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 opacity-50">
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                                                Waktu Pulang
                                            </p>
                                            <p className="text-xl font-bold text-white font-mono">
                                                --:--
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleAbsen}
                                        disabled={processing}
                                        className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-lg shadow-rose-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        {processing ? (
                                            "Memproses Data..."
                                        ) : (
                                            <>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    className="w-5 h-5"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                                                        clipRule="evenodd"
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                CHECK-OUT (SELESAI)
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                // SELESAI
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-400">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-8 h-8"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 11.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <h4 className="text-white font-bold mb-1">
                                        Aktivitas Selesai
                                    </h4>
                                    <p className="text-xs text-slate-400 mb-4">
                                        Terima kasih atas kontribusi Anda hari
                                        ini.
                                    </p>
                                    <div className="flex justify-center gap-6 text-sm">
                                        <div>
                                            <span className="block text-[10px] uppercase text-slate-500">
                                                Masuk
                                            </span>
                                            <span className="font-mono text-white">
                                                {cek_absen.jam_masuk}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] uppercase text-slate-500">
                                                Pulang
                                            </span>
                                            <span className="font-mono text-white">
                                                {cek_absen.jam_pulang}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- KOLOM KANAN (8 Kolom) --- */}
                    <div className="lg:col-span-8">
                        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-base font-bold text-white">
                                        Log Aktivitas Magang
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Rekapitulasi kehadiran 30 hari terakhir
                                    </p>
                                </div>
                                <button className="text-xs font-medium bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-3 h-3"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Export Laporan
                                </button>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-slate-700/50 flex-grow">
                                <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="bg-slate-900/80 text-xs uppercase font-semibold text-slate-400">
                                        <tr>
                                            <th className="px-6 py-4 tracking-wider">
                                                Tanggal Kegiatan
                                            </th>
                                            <th className="px-6 py-4 text-center tracking-wider">
                                                Jam Masuk
                                            </th>
                                            <th className="px-6 py-4 text-center tracking-wider">
                                                Jam Pulang
                                            </th>
                                            <th className="px-6 py-4 text-center tracking-wider">
                                                Status Validasi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50 bg-slate-800/20">
                                        {riwayat_absen.length > 0 ? (
                                            riwayat_absen.map((data, index) => (
                                                <tr
                                                    key={index}
                                                    className="hover:bg-white/5 transition duration-150"
                                                >
                                                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                                                        {data.tanggal}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="font-mono text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded text-xs border border-indigo-500/20">
                                                            {data.jam_masuk}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {data.jam_pulang ? (
                                                            <span className="font-mono text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded text-xs border border-emerald-500/20">
                                                                {
                                                                    data.jam_pulang
                                                                }
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-600 text-xs italic">
                                                                Belum Check-out
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                                                                data.status ===
                                                                "hadir"
                                                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                                    : "bg-slate-700 text-slate-400 border border-slate-600"
                                                            }`}
                                                        >
                                                            {data.status ===
                                                                "hadir" && (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                    className="w-3 h-3"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            )}
                                                            {data.status ===
                                                            "hadir"
                                                                ? "Valid"
                                                                : data.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="px-6 py-16 text-center text-slate-500"
                                                >
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="w-8 h-8 opacity-50"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                                            />
                                                        </svg>
                                                        <span className="text-sm italic">
                                                            Belum ada data log
                                                            aktivitas.
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
                </div>
            </main>
        </div>
    );
}
