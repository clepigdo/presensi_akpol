import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard({ auth, stats, logs }) {
    // --- 1. Style Injector (Fonts & Custom Scrollbar) ---
    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-tech { font-family: 'Share Tech Mono', monospace; }
        
        /* Custom Scrollbar Elegant */
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #050A18; }
        ::-webkit-scrollbar-thumb { background: #D4A017; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #F0C040; }
    `;

    // --- 2. Safety Data (Mencegah Error jika data kosong) ---
    const safeStats = stats || { total: 0, hadir: 0, absen: 0 };
    const safeLogs = logs || [];
    const userInitial = auth?.user?.nama_lengkap?.charAt(0) || "A";

    return (
        <div className="flex h-screen w-full bg-[#050A18] text-white font-sans overflow-hidden selection:bg-[#D4A017] selection:text-black">
            <Head title="Command Center — AKPOL" />
            <style>{styles}</style>

            {/* --- BACKGROUND LAYER (Global) --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[#050A18]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,160,23,0.08)_0%,transparent_50%)]" />
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `linear-gradient(#D4A017 1px, transparent 1px), linear-gradient(90deg, #D4A017 1px, transparent 1px)`,
                        backgroundSize: "30px 30px",
                    }}
                />
            </div>

            {/* ======================= SIDEBAR (Kiri) ======================= */}
            <aside className="relative z-20 w-72 h-full hidden lg:flex flex-col border-r border-[#D4A017]/20 bg-[#0A1428]/80 backdrop-blur-xl">
                {/* Logo Area */}
                <div className="h-24 flex items-center gap-4 px-8 border-b border-[#D4A017]/10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#D4A017] blur-lg opacity-20 animate-pulse"></div>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Lambang_Akpol.png"
                            alt="AKPOL"
                            className="h-10 w-auto relative z-10 drop-shadow-[0_0_5px_rgba(212,160,23,0.8)]"
                        />
                    </div>
                    <div>
                        <h1 className="font-cinzel text-sm font-black tracking-widest text-white leading-none">
                            COMMAND
                        </h1>
                        <p className="font-tech text-[10px] text-[#D4A017] tracking-[0.3em] mt-1">
                            CENTER
                        </p>
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                    <div className="px-4 mb-4">
                        <p className="text-[9px] font-tech text-gray-500 uppercase tracking-[0.2em]">
                            Main Navigation
                        </p>
                    </div>

                    <Link
                        href="#"
                        className="group flex items-center gap-4 px-4 py-3 bg-[#D4A017]/10 border border-[#D4A017]/40 rounded-sm text-[#D4A017] transition-all shadow-[0_0_15px_rgba(212,160,23,0.1)]"
                    >
                        <span className="text-lg">📊</span>
                        <span className="font-cinzel text-[11px] font-bold tracking-widest">
                            Dashboard
                        </span>
                        <div className="ml-auto w-1.5 h-1.5 bg-[#D4A017] rounded-full shadow-[0_0_5px_#D4A017]"></div>
                    </Link>

                    <Link
                        href="#"
                        className="group flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#D4A017]/5 border border-transparent hover:border-[#D4A017]/10 rounded-sm transition-all"
                    >
                        <span className="text-lg grayscale group-hover:grayscale-0 transition-all">
                            📍
                        </span>
                        <span className="font-cinzel text-[11px] font-bold tracking-widest">
                            Peta Sebaran
                        </span>
                    </Link>

                    <Link
                        href="#"
                        className="group flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#D4A017]/5 border border-transparent hover:border-[#D4A017]/10 rounded-sm transition-all"
                    >
                        <span className="text-lg grayscale group-hover:grayscale-0 transition-all">
                            👥
                        </span>
                        <span className="font-cinzel text-[11px] font-bold tracking-widest">
                            Data Taruna
                        </span>
                    </Link>

                    <Link
                        href="#"
                        className="group flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#D4A017]/5 border border-transparent hover:border-[#D4A017]/10 rounded-sm transition-all"
                    >
                        <span className="text-lg grayscale group-hover:grayscale-0 transition-all">
                            ⚙️
                        </span>
                        <span className="font-cinzel text-[11px] font-bold tracking-widest">
                            Pengaturan
                        </span>
                    </Link>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-6 border-t border-[#D4A017]/10 bg-[#050A18]/50">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center gap-2 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-sm transition-all text-[10px] font-bold tracking-widest uppercase font-tech"
                    >
                        <span>🛑</span> Logout System
                    </Link>
                    <p className="text-center text-[8px] text-gray-600 mt-3 font-tech tracking-widest">
                        VERSI 2.4.0 // SECURE
                    </p>
                </div>
            </aside>

            {/* ======================= CONTENT AREA (Kanan) ======================= */}
            <div className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
                {/* --- NAVBAR (Atas) --- */}
                <header className="h-20 bg-[#0A1428]/60 backdrop-blur-md border-b border-[#D4A017]/10 flex items-center justify-between px-8 shrink-0">
                    <div>
                        <h2 className="text-lg font-cinzel font-black text-white tracking-widest flex items-center gap-3">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
                            LIVE MONITORING
                        </h2>
                        <p className="text-gray-500 text-[10px] font-tech tracking-[0.2em] uppercase pl-5">
                            Realtime Presensi Taruna Magang
                        </p>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-bold text-[#D4A017] uppercase tracking-wider font-cinzel">
                                {auth?.user?.nama_lengkap || "ADMINISTRATOR"}
                            </p>
                            <p className="text-[9px] text-gray-400 tracking-widest font-tech">
                                AKSES: SUPERVISOR
                            </p>
                        </div>
                        {/* Avatar Box */}
                        <div className="h-10 w-10 bg-[#050A18] border border-[#D4A017] rounded-sm flex items-center justify-center relative group cursor-pointer">
                            <span className="font-cinzel font-bold text-[#D4A017]">
                                {userInitial}
                            </span>
                            {/* Glow Corner */}
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#D4A017]"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#D4A017]"></div>
                        </div>
                    </div>
                </header>

                {/* --- MAIN SCROLLABLE CONTENT --- */}
                <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* 1. STATS GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Card Total */}
                            <div className="bg-[#0A1428]/60 border border-[#D4A017]/20 p-6 rounded-sm relative overflow-hidden group hover:bg-[#0A1428]/80 transition-all">
                                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Lambang_Akpol.png"
                                        className="w-32 h-32 grayscale"
                                    />
                                </div>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] font-tech">
                                    Total Personel
                                </p>
                                <h3 className="text-4xl font-black text-white font-cinzel tracking-widest mt-2">
                                    {safeStats.total}
                                </h3>
                                <div className="w-full bg-[#050A18] h-1 mt-4 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#D4A017] w-full shadow-[0_0_10px_#D4A017]"></div>
                                </div>
                            </div>

                            {/* Card Hadir */}
                            <div className="bg-[#0A1428]/60 border border-green-500/20 p-6 rounded-sm relative overflow-hidden group hover:bg-[#0A1428]/80 transition-all">
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] font-tech">
                                    Hadir (Present)
                                </p>
                                <h3 className="text-4xl font-black text-green-400 font-cinzel tracking-widest mt-2">
                                    {safeStats.hadir}
                                </h3>
                                <div className="w-full bg-[#050A18] h-1 mt-4 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]"
                                        style={{
                                            width: `${safeStats.total > 0 ? (safeStats.hadir / safeStats.total) * 100 : 0}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Card Absen */}
                            <div className="bg-[#0A1428]/60 border border-red-500/20 p-6 rounded-sm relative overflow-hidden group hover:bg-[#0A1428]/80 transition-all">
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] font-tech">
                                    Belum Lapor (Alpha)
                                </p>
                                <h3 className="text-4xl font-black text-red-500 font-cinzel tracking-widest mt-2">
                                    {safeStats.absen}
                                </h3>
                                <div className="w-full bg-[#050A18] h-1 mt-4 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500 shadow-[0_0_10px_#ef4444]"
                                        style={{
                                            width: `${safeStats.total > 0 ? (safeStats.absen / safeStats.total) * 100 : 0}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* 2. DATA TABLE */}
                        <div className="border border-[#D4A017]/20 rounded-sm overflow-hidden bg-[#0A1428]/80 backdrop-blur-sm shadow-2xl">
                            {/* Table Toolbar */}
                            <div className="px-6 py-4 border-b border-[#D4A017]/10 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#D4A017]/5">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">📋</span>
                                    <div>
                                        <h4 className="font-cinzel text-xs font-bold text-[#D4A017] tracking-widest uppercase">
                                            Log Aktivitas
                                        </h4>
                                        <p className="font-tech text-[9px] text-gray-500 tracking-wider">
                                            Data masuk hari ini
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button className="px-4 py-1.5 border border-[#D4A017]/30 text-[#D4A017] text-[10px] font-bold uppercase tracking-wider hover:bg-[#D4A017] hover:text-[#050A18] transition-colors font-tech">
                                        Export Data
                                    </button>
                                    <button className="px-4 py-1.5 bg-[#D4A017] text-[#050A18] text-[10px] font-bold uppercase tracking-wider hover:bg-white transition-colors font-tech">
                                        Refresh Feed
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#030610] text-gray-500 border-b border-[#D4A017]/10">
                                        <tr>
                                            <th className="px-6 py-4 font-cinzel text-[10px] font-bold tracking-[0.15em] uppercase">
                                                Personel
                                            </th>
                                            <th className="px-6 py-4 font-cinzel text-[10px] font-bold tracking-[0.15em] uppercase">
                                                Waktu
                                            </th>
                                            <th className="px-6 py-4 font-cinzel text-[10px] font-bold tracking-[0.15em] uppercase">
                                                Lokasi
                                            </th>
                                            <th className="px-6 py-4 font-cinzel text-[10px] font-bold tracking-[0.15em] uppercase">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 font-cinzel text-[10px] font-bold tracking-[0.15em] uppercase text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#D4A017]/5">
                                        {safeLogs.length > 0 ? (
                                            safeLogs.map((log, i) => (
                                                <tr
                                                    key={i}
                                                    className="hover:bg-[#D4A017]/5 transition-colors group"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-sm bg-[#050A18] border border-[#D4A017]/20 flex items-center justify-center font-bold text-[#D4A017] text-xs font-cinzel group-hover:border-[#D4A017] transition-colors">
                                                                {log.user.nama_lengkap.charAt(
                                                                    0,
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-white text-xs tracking-wide font-cinzel group-hover:text-[#D4A017] transition-colors">
                                                                    {
                                                                        log.user
                                                                            .nama_lengkap
                                                                    }
                                                                </p>
                                                                <p className="text-[9px] text-gray-500 font-tech">
                                                                    NRP:{" "}
                                                                    {log.user
                                                                        .id ||
                                                                        "-"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-tech text-[#D4A017] text-xs tracking-wider">
                                                        {log.jam_masuk}{" "}
                                                        <span className="text-gray-600">
                                                            WIB
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1 text-gray-400 text-[10px] font-tech tracking-wider">
                                                            <span className="text-red-400">
                                                                📍
                                                            </span>
                                                            <span>
                                                                -7.021, 110.423
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-green-500/5 text-green-400 border border-green-500/20 text-[9px] font-bold tracking-widest uppercase font-tech">
                                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></span>
                                                            Hadir
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-gray-500 hover:text-[#D4A017] transition-colors text-lg">
                                                            👁‍🗨
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-6 py-20 text-center"
                                                >
                                                    <div className="flex flex-col items-center justify-center opacity-30">
                                                        <span className="text-5xl mb-4 grayscale">
                                                            📡
                                                        </span>
                                                        <p className="text-sm font-cinzel tracking-widest text-white uppercase">
                                                            No Data Signal
                                                        </p>
                                                        <p className="text-[10px] font-tech text-[#D4A017] tracking-wider mt-1">
                                                            Belum ada data
                                                            presensi yang masuk
                                                            hari ini.
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer */}
                            <div className="bg-[#030610] px-6 py-3 border-t border-[#D4A017]/10 flex justify-between items-center">
                                <span className="text-[9px] font-tech text-gray-600 tracking-wider">
                                    MENAMPILKAN {safeLogs.length} DATA
                                </span>
                                <div className="flex gap-1">
                                    <button className="px-2 py-1 border border-gray-800 text-gray-500 text-[9px] hover:text-white hover:border-gray-600 font-tech">
                                        PREV
                                    </button>
                                    <button className="px-2 py-1 bg-[#D4A017] text-[#050A18] text-[9px] font-bold font-tech">
                                        1
                                    </button>
                                    <button className="px-2 py-1 border border-gray-800 text-gray-500 text-[9px] hover:text-white hover:border-gray-600 font-tech">
                                        NEXT
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
