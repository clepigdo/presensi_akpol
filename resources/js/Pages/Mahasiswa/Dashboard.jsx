import React, { useState, useEffect, useRef } from "react";
import { Head, useForm, usePage, Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import * as faceapi from "face-api.js";

export default function Dashboard({
    auth,
    cek_absen,
    riwayat_absen,
    riwayat_logbook,
}) {
    const { flash } = usePage().props;

    // --- STATE DASAR ---
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState("logbook"); // Default ke logbook biar gampang lihat hasil
    const [isLogbookOpen, setIsLogbookOpen] = useState(false);

    // [STATE BARU]: Menyimpan ID logbook yang sedang diedit
    const [editId, setEditId] = useState(null);

    // --- STATE FACE RECOGNITION ---
    const [isFaceScannerOpen, setIsFaceScannerOpen] = useState(false);
    const [scanStatus, setScanStatus] = useState("Menunggu Inisiasi...");
    const videoRef = useRef();

    const logbookForm = useForm({
        judul_kegiatan: "",
        deskripsi_kegiatan: "",
    });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // --- FUNGSI MENGELOMPOKKAN LOGBOOK MINGGUAN (HANYA YANG SUDAH DI-SUBMIT) ---
    const groupedLogbook = React.useMemo(() => {
        if (!riwayat_logbook) return null;
        const submittedLogs = riwayat_logbook.filter((log) => !log.is_draft);
        if (submittedLogs.length === 0) return null;

        const sorted = [...submittedLogs].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at),
        );
        const startDate = new Date(sorted[0].created_at);
        const groups = {};

        submittedLogs.forEach((log) => {
            const date = new Date(log.created_at);
            const diffTime = Math.abs(date - startDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const weekNumber = Math.floor(diffDays / 7) + 1;
            const key = `Minggu ke-${weekNumber}`;

            if (!groups[key]) groups[key] = [];
            groups[key].push(log);
        });
        return groups;
    }, [riwayat_logbook]);

    // Variabel pembantu untuk daftar draft yang belum disubmit
    const drafts = (riwayat_logbook || []).filter((log) => log.is_draft);

    // Cek apakah ada logbook yang dibuat di hari ini
    const hasLogbookToday = (riwayat_logbook || []).some((log) => {
        const logDate = new Date(log.created_at).toLocaleDateString("id-ID");
        const todayDate = new Date().toLocaleDateString("id-ID");
        return logDate === todayDate;
    });

    // --- FUNGSI KAMERA & AI ---
    const startFaceScan = async () => {
        setIsFaceScannerOpen(true);
        setScanStatus("Memuat Modul AI...");
        try {
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
                faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
                faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
            ]);
            setScanStatus("Menyalakan Kamera...");
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (videoRef.current) videoRef.current.srcObject = stream;
            setScanStatus("Sistem Siap. Posisikan wajah Anda.");
        } catch (error) {
            setScanStatus("Gagal mengakses kamera/AI.");
        }
    };

    const cancelScan = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
        }
        setIsFaceScannerOpen(false);
        setScanStatus("Menunggu Inisiasi...");
    };

    const handleFaceVerification = async () => {
        if (!videoRef.current) return;
        setIsProcessing(true);
        setScanStatus("Menganalisis Titik Wajah...");
        try {
            const liveDetection = await faceapi
                .detectSingleFace(videoRef.current)
                .withFaceLandmarks()
                .withFaceDescriptor();
            if (!liveDetection) {
                setScanStatus("Wajah tidak terdeteksi. Coba lagi.");
                setIsProcessing(false);
                return;
            }
            setScanStatus("Mencocokkan Database...");
            const imgEl = document.createElement("img");
            imgEl.src = auth.user.face_data;

            await new Promise((resolve, reject) => {
                imgEl.onload = () => resolve();
                imgEl.onerror = () => reject(new Error("Gagal load gambar"));
            });

            const baseDetection = await faceapi
                .detectSingleFace(imgEl)
                .withFaceLandmarks()
                .withFaceDescriptor();
            if (!baseDetection) {
                setScanStatus("Data wajah awal rusak/tidak valid.");
                setIsProcessing(false);
                return;
            }
            const distance = faceapi.euclideanDistance(
                baseDetection.descriptor,
                liveDetection.descriptor,
            );
            if (distance < 0.6) {
                setScanStatus("Akses Diterima! Mengunci GPS...");
                executeAbsenGPS();
            } else {
                setScanStatus("AKSES DITOLAK: Wajah tidak cocok.");
                setIsProcessing(false);
            }
        } catch (error) {
            setScanStatus("Terjadi kesalahan sistem.");
            setIsProcessing(false);
        }
    };

    const executeAbsenGPS = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    router.post(
                        route("mahasiswa.absen"),
                        {
                            lat: position.coords.latitude,
                            long: position.coords.longitude,
                        },
                        {
                            onFinish: () => {
                                cancelScan();
                                setIsProcessing(false);
                            },
                        },
                    );
                },
                (error) => {
                    alert("GPS gagal dilacak. Berikan izin lokasi.");
                    setIsProcessing(false);
                },
                { enableHighAccuracy: true },
            );
        }
    };

    // [FUNGSI BARU]: Menangani klik tombol Edit dari tabel
    const handleEditClick = (log) => {
        setEditId(log.id);
        logbookForm.setData({
            judul_kegiatan: log.judul_kegiatan,
            deskripsi_kegiatan: log.deskripsi_kegiatan,
        });
        setIsLogbookOpen(true); // Paksa form terbuka
    };

    // [FUNGSI BARU]: Menangani klik tombol Batal di form
    const cancelForm = () => {
        setIsLogbookOpen(false);
        setEditId(null);
        logbookForm.reset();
    };

    // [DIUBAH]: Menangani dua rute berbeda (Store vs Update)
    const submitLogbook = (e) => {
        e.preventDefault();

        if (editId) {
            // Mode Update (Edit)
            logbookForm.put(route("mahasiswa.logbook.update", editId), {
                onSuccess: () => {
                    cancelForm();
                },
            });
        } else {
            // Mode Tambah Baru
            logbookForm.post(route("mahasiswa.logbook.store"), {
                onSuccess: () => {
                    cancelForm();
                },
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#050A18] text-slate-200 font-sans selection:bg-[#B8860B] flex flex-col relative overflow-hidden">
            <Head title="Command Center Presensi" />

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0A1E3A_0%,#050A18_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,160,23,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,160,23,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <nav className="relative z-20 border-b border-[#B8860B]/10 bg-[#050A18]/80 backdrop-blur-xl h-20 flex items-center px-8 justify-between">
                <div className="flex items-center gap-4">
                    <img
                        src="../images/Logo_Akademi_Kepolisian.png"
                        alt="Logo"
                        className="h-10 w-auto"
                    />
                    <div>
                        <h1 className="font-serif font-bold text-lg text-white tracking-widest">
                            SIAK MAGANG
                        </h1>
                        <p className="text-[9px] text-[#B8860B] font-mono tracking-widest uppercase">
                            Command Center
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-xs font-bold text-white uppercase">
                            {auth.user?.nama_lengkap}
                        </p>
                        <p className="text-[9px] text-emerald-400 font-mono tracking-widest uppercase">
                            ● Active
                        </p>
                    </div>
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="px-4 py-2 border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold rounded-lg hover:bg-red-600 hover:text-white transition"
                    >
                        LOGOUT
                    </Link>
                </div>
            </nav>

            <main className="flex-1 w-full max-w-[1600px] mx-auto py-8 px-6 z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
                {/* --- KOLOM KIRI: WIDGET & AKSI --- */}
                <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                    <div className="bg-[#0A1428]/90 border border-[#B8860B]/20 rounded-2xl p-6 shadow-xl shrink-0">
                        <h2 className="text-[#B8860B] text-[10px] font-mono tracking-widest uppercase mb-2">
                            Server Time (WIB)
                        </h2>
                        <h1 className="text-4xl xl:text-5xl font-bold text-white tracking-widest font-mono mb-1">
                            {currentTime.toLocaleTimeString("id-ID", {
                                hour12: false,
                            })}
                        </h1>
                        <p className="text-slate-400 text-xs uppercase">
                            {currentTime.toLocaleDateString("id-ID", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>

                    <div className="bg-[#0A1428]/90 border border-white/5 rounded-2xl p-6 shadow-xl flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>{" "}
                                Aksi Presensi
                            </h3>
                            {flash.success && (
                                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded font-bold uppercase">
                                    {flash.success}
                                </span>
                            )}
                            {flash.error && (
                                <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded font-bold uppercase">
                                    {flash.error}
                                </span>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                            {!cek_absen ? (
                                <button
                                    onClick={startFaceScan}
                                    className="w-full py-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-widest uppercase shadow-lg transition active:scale-[0.98]"
                                >
                                    INISIASI CHECK-IN (BIOMETRIK)
                                </button>
                            ) : cek_absen.jam_pulang === null ? (
                                <div className="space-y-4">
                                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                        <p className="text-[9px] text-[#B8860B] font-mono uppercase mb-1">
                                            Entry Time
                                        </p>
                                        <p className="text-xl font-bold text-white">
                                            {cek_absen.jam_masuk}
                                        </p>
                                    </div>

                                    {/* LOGIKA FORM DIUBAH: Prioritaskan isLogbookOpen agar bisa memunculkan form edit */}
                                    {isLogbookOpen ? (
                                        <form
                                            onSubmit={submitLogbook}
                                            className="bg-black/20 border border-[#B8860B]/30 p-4 rounded-xl space-y-3 animate-fade-in shadow-[0_0_15px_rgba(184,134,11,0.1)] relative"
                                        >
                                            {editId && (
                                                <div className="absolute -top-2.5 right-4 bg-[#B8860B] text-black text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                                                    Mode Edit
                                                </div>
                                            )}

                                            <input
                                                type="text"
                                                value={
                                                    logbookForm.data
                                                        .judul_kegiatan
                                                }
                                                onChange={(e) =>
                                                    logbookForm.setData(
                                                        "judul_kegiatan",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Judul Kegiatan..."
                                                className="w-full bg-black/40 border border-white/10 rounded-md text-white text-xs p-3 outline-none focus:border-[#B8860B]/50 transition"
                                                required
                                            />
                                            <textarea
                                                value={
                                                    logbookForm.data
                                                        .deskripsi_kegiatan
                                                }
                                                onChange={(e) =>
                                                    logbookForm.setData(
                                                        "deskripsi_kegiatan",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Deskripsi detail..."
                                                className="w-full bg-black/40 border border-white/10 rounded-md text-white text-xs p-3 outline-none focus:border-[#B8860B]/50 h-24 resize-none transition"
                                                required
                                            />

                                            <div className="flex gap-2 pt-1">
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        logbookForm.processing
                                                    }
                                                    className={`flex-1 py-2.5 font-bold text-[9px] uppercase tracking-widest rounded-md transition shadow-lg ${editId ? "bg-blue-500 text-white hover:bg-blue-600 shadow-blue-500/20" : "bg-[#B8860B] text-[#050A18] hover:brightness-110 shadow-[#B8860B]/20"}`}
                                                >
                                                    {logbookForm.processing
                                                        ? "Menyimpan..."
                                                        : editId
                                                          ? "Simpan Perubahan"
                                                          : "Simpan Draft"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={cancelForm}
                                                    className="px-4 py-2.5 border border-white/10 text-slate-400 text-[9px] uppercase tracking-widest font-bold rounded-md hover:bg-white/5 hover:text-white transition"
                                                >
                                                    Batal
                                                </button>
                                            </div>
                                        </form>
                                    ) : hasLogbookToday ? (
                                        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl text-center shadow-inner animate-fade-in">
                                            <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>{" "}
                                                Logbook Hari Ini Terekam
                                            </span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                setIsLogbookOpen(true)
                                            }
                                            className="w-full py-3 rounded-xl bg-[#B8860B]/10 border border-[#B8860B]/30 text-[#F0C040] font-bold text-[10px] tracking-widest uppercase hover:bg-[#B8860B]/20 transition shadow-sm"
                                        >
                                            Tulis Logbook Hari Ini
                                        </button>
                                    )}

                                    <button
                                        onClick={executeAbsenGPS}
                                        disabled={isProcessing}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold text-xs tracking-widest uppercase shadow-lg shadow-red-500/20 transition active:scale-[0.98] mt-4"
                                    >
                                        {isProcessing
                                            ? "MEMPROSES..."
                                            : "OTORISASI CHECK-OUT"}
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                                        ✓
                                    </div>
                                    <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-1">
                                        Misi Selesai
                                    </h4>
                                    <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                                        Sesi Shift Ditutup
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- KOLOM KANAN: TABEL TAB (ABSENSI & LOGBOOK) --- */}
                <div className="lg:col-span-8 flex flex-col">
                    <div className="bg-[#0A1428]/90 border border-white/5 rounded-2xl p-6 shadow-xl h-full flex flex-col">
                        <div className="flex justify-between items-end border-b border-white/10 mb-6 pb-2 shrink-0">
                            <div>
                                <h3 className="text-base font-bold text-white font-serif tracking-widest uppercase mb-1">
                                    Data Rekam Jejak
                                </h3>
                                <div className="flex gap-6 mt-4">
                                    <button
                                        onClick={() => setActiveTab("absensi")}
                                        className={`pb-2 text-[10px] font-mono tracking-widest uppercase transition-colors relative ${activeTab === "absensi" ? "text-[#B8860B]" : "text-slate-500 hover:text-slate-300"}`}
                                    >
                                        Log Kehadiran
                                        {activeTab === "absensi" && (
                                            <motion.div
                                                layoutId="underline"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B8860B]"
                                            />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("logbook")}
                                        className={`pb-2 text-[10px] font-mono tracking-widest uppercase transition-colors relative ${activeTab === "logbook" ? "text-[#B8860B]" : "text-slate-500 hover:text-slate-300"}`}
                                    >
                                        Log Aktivitas
                                        {activeTab === "logbook" && (
                                            <motion.div
                                                layoutId="underline"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B8860B]"
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-white/5 bg-black/20 flex-1 overflow-hidden flex flex-col">
                            {/* TAB 1: ABSENSI */}
                            {/* TAB 1: ABSENSI (Geo-Tracking Mode) */}
                            {activeTab === "absensi" && (
                                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#B8860B]/30 scrollbar-track-transparent p-2">
                                    {riwayat_absen.length > 0 ? (
                                        <div className="space-y-3 p-3">
                                            {riwayat_absen.map((data, index) => (
                                                <div key={index} className="bg-black/40 border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-500/30 hover:bg-black/60 transition-all group">
                                                    
                                                    {/* Sisi Kiri: Tanggal & Status */}
                                                    <div className="flex flex-col w-full sm:w-1/4 shrink-0">
                                                        <div className="text-white font-bold text-xs uppercase tracking-wider mb-1">
                                                            {new Date(data.tanggal).toLocaleDateString('id-ID', {weekday: 'long', day: 'numeric', month: 'short', year: 'numeric'})}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[8px] font-bold rounded tracking-widest uppercase">
                                                                OTORISASI VALID
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Sisi Tengah: In & Out Tracker */}
                                                    <div className="flex-1 flex flex-row gap-4 sm:gap-8 w-full border-t border-white/5 sm:border-t-0 pt-3 sm:pt-0">
                                                        
                                                        {/* Titik Masuk (IN) */}
                                                        <div className="flex-1">
                                                            <p className="text-[9px] text-blue-400 font-mono tracking-widest uppercase mb-1">Titik Infiltrasi (IN)</p>
                                                            <p className="text-base font-bold text-white font-mono">{data.jam_masuk} <span className="text-[10px] text-slate-500">WIB</span></p>
                                                            
                                                            {data.lat_masuk && data.long_masuk ? (
                                                                <div className="mt-1.5 flex items-center gap-1.5 bg-blue-900/20 border border-blue-500/20 px-2 py-1 rounded w-fit group-hover:border-blue-500/40 transition">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    </svg>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[8px] font-mono text-slate-300 leading-none">LAT: {parseFloat(data.lat_masuk).toFixed(5)}</span>
                                                                        <span className="text-[8px] font-mono text-slate-300 leading-none">LNG: {parseFloat(data.long_masuk).toFixed(5)}</span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[8px] font-mono text-slate-600 mt-1 block">Sinyal GPS Hilang</span>
                                                            )}
                                                        </div>

                                                        {/* Titik Pulang (OUT) */}
                                                        <div className="flex-1 border-l border-white/5 pl-4 sm:pl-8">
                                                            <p className="text-[9px] text-emerald-400 font-mono tracking-widest uppercase mb-1">Titik Ekstraksi (OUT)</p>
                                                            {data.jam_pulang ? (
                                                                <>
                                                                    <p className="text-base font-bold text-white font-mono">{data.jam_pulang} <span className="text-[10px] text-slate-500">WIB</span></p>
                                                                    {data.lat_pulang && data.long_pulang && (
                                                                        <div className="mt-1.5 flex items-center gap-1.5 bg-emerald-900/20 border border-emerald-500/20 px-2 py-1 rounded w-fit group-hover:border-emerald-500/40 transition">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            </svg>
                                                                            <div className="flex flex-col">
                                                                                <span className="text-[8px] font-mono text-slate-300 leading-none">LAT: {parseFloat(data.lat_pulang).toFixed(5)}</span>
                                                                                <span className="text-[8px] font-mono text-slate-300 leading-none">LNG: {parseFloat(data.long_pulang).toFixed(5)}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <div className="h-full flex items-center pt-2">
                                                                    <span className="text-[10px] text-emerald-500/50 font-mono tracking-widest flex items-center gap-2">
                                                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> Misi Berjalan
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center opacity-40 p-10 min-h-[300px]">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-[#B8860B] mb-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                            </svg>
                                            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">Belum Ada Rekam Jejak Geografis</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 2: LOGBOOK MINGGUAN (DRAFT & SUBMIT) */}
                            {activeTab === "logbook" && (
                                <div className="flex-1 p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-[#B8860B]/30 scrollbar-track-transparent">
                                    {/* SEKSI DRAFT HARIAN */}
                                    <div className="mb-8">
                                        <div className="flex justify-between items-end mb-4 border-b border-[#B8860B]/20 pb-2">
                                            <div>
                                                <h4 className="text-[#F0C040] font-serif font-bold text-xs tracking-widest uppercase">
                                                    Draft Laporan Harian
                                                </h4>
                                                <p className="text-[9px] font-mono text-slate-400">
                                                    Belum disubmit ke Admin
                                                </p>
                                            </div>
                                            {drafts.length > 0 && (
                                                <button
                                                    onClick={() =>
                                                        router.post(
                                                            route(
                                                                "mahasiswa.logbook.submit_mingguan",
                                                            ),
                                                        )
                                                    }
                                                    className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-[#050A18] border border-emerald-500/50 px-4 py-2 rounded text-[9px] font-bold tracking-widest uppercase transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                                                >
                                                    Submit Laporan Mingguan
                                                </button>
                                            )}
                                        </div>

                                        {drafts.length > 0 ? (
                                            <div className="space-y-3">
                                                {drafts.map((log) => (
                                                    <div
                                                        key={log.id}
                                                        className={`bg-black/40 border p-3 rounded-lg flex justify-between items-center transition-all ${editId === log.id ? "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]" : "border-white/10"}`}
                                                    >
                                                        <div>
                                                            <span className="text-[10px] font-bold text-white uppercase">
                                                                {
                                                                    log.judul_kegiatan
                                                                }
                                                            </span>
                                                            <span className="text-[9px] font-mono text-slate-500 block mt-0.5">
                                                                {new Date(
                                                                    log.created_at,
                                                                ).toLocaleDateString(
                                                                    "id-ID",
                                                                    {
                                                                        weekday:
                                                                            "long",
                                                                        day: "numeric",
                                                                        month: "long",
                                                                    },
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-2 items-center">
                                                            <span className="text-[8px] bg-[#B8860B]/20 text-[#F0C040] px-2 py-1 rounded font-bold uppercase tracking-widest border border-[#B8860B]/30 hidden sm:block">
                                                                DRAFT
                                                            </span>
                                                            {/* TOMBOL EDIT DRAFT */}
                                                            <button
                                                                onClick={() =>
                                                                    handleEditClick(
                                                                        log,
                                                                    )
                                                                }
                                                                className="p-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/30 rounded transition"
                                                                title="Edit Draft"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-3.5 w-3.5"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                >
                                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-black/20 border border-white/5 rounded-lg p-4 text-center">
                                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                                    Tidak ada draft yang
                                                    tersimpan
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* SEKSI LOGBOOK MINGGUAN (SUDAH DISUBMIT) */}
                                    <div>
                                        <div className="mb-4 border-b border-white/10 pb-2">
                                            <h4 className="text-white font-serif font-bold text-xs tracking-widest uppercase">
                                                Arsip Mingguan Terkirim
                                            </h4>
                                            <p className="text-[9px] font-mono text-slate-400">
                                                Laporan yang sedang / sudah
                                                direview
                                            </p>
                                        </div>

                                        {!groupedLogbook ? (
                                            <div className="bg-black/20 border border-white/5 rounded-lg p-6 text-center">
                                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                                    Belum ada laporan yang
                                                    disubmit
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {Object.keys(groupedLogbook)
                                                    .sort((a, b) =>
                                                        b.localeCompare(a),
                                                    )
                                                    .map((weekKey) => (
                                                        <div
                                                            key={weekKey}
                                                            className="bg-black/40 border border-white/10 rounded-xl overflow-hidden shadow-lg"
                                                        >
                                                            <div className="bg-white/5 px-5 py-3 flex justify-between items-center border-b border-white/10">
                                                                <h4 className="text-white font-serif font-bold text-xs tracking-widest uppercase">
                                                                    {weekKey}
                                                                </h4>
                                                                <span className="text-[9px] font-mono text-slate-400 bg-black/50 px-2 py-1 rounded border border-white/5">
                                                                    {
                                                                        groupedLogbook[
                                                                            weekKey
                                                                        ].length
                                                                    }{" "}
                                                                    Aktivitas
                                                                </span>
                                                            </div>

                                                            <table className="w-full text-left text-sm text-slate-300">
                                                                <tbody className="divide-y divide-white/5">
                                                                    {groupedLogbook[
                                                                        weekKey
                                                                    ].map(
                                                                        (
                                                                            log,
                                                                        ) => (
                                                                            <tr
                                                                                key={
                                                                                    log.id
                                                                                }
                                                                                className={`transition ${editId === log.id ? "bg-blue-900/10" : "hover:bg-white/5"}`}
                                                                            >
                                                                                <td className="px-5 py-4 w-[25%] align-top border-r border-white/5">
                                                                                    <div className="text-white font-bold text-[11px]">
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
                                                                                    <div className="text-[9px] font-mono text-slate-500 mt-1">
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
                                                                                <td className="px-5 py-4 align-top">
                                                                                    <div className="text-white text-xs font-bold mb-1.5 tracking-wide">
                                                                                        {
                                                                                            log.judul_kegiatan
                                                                                        }
                                                                                    </div>
                                                                                    <div className="text-[10px] text-slate-400 leading-relaxed">
                                                                                        {
                                                                                            log.deskripsi_kegiatan
                                                                                        }
                                                                                    </div>
                                                                                    {log.catatan_mentor && (
                                                                                        <div className="mt-2.5 flex gap-2 items-start bg-blue-900/20 border border-blue-500/20 p-2.5 rounded-lg">
                                                                                            <div className="text-blue-400 mt-0.5">
                                                                                                ↳
                                                                                            </div>
                                                                                            <div>
                                                                                                <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mb-0.5">
                                                                                                    Catatan
                                                                                                    Mentor
                                                                                                </span>
                                                                                                <span className="text-[10px] text-blue-200">
                                                                                                    {
                                                                                                        log.catatan_mentor
                                                                                                    }
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-5 py-4 w-[20%] text-center align-middle border-l border-white/5">
                                                                                    <span
                                                                                        className={`px-2 py-1 rounded border text-[8px] font-bold uppercase tracking-widest inline-flex items-center shadow-sm mb-2 w-full justify-center
                                                                                ${
                                                                                    log.status_verifikasi ===
                                                                                    "disetujui"
                                                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                                                                        : log.status_verifikasi ===
                                                                                            "ditolak"
                                                                                          ? "bg-red-500/10 text-red-400 border-red-500/30"
                                                                                          : "bg-[#B8860B]/10 text-[#F0C040] border-[#B8860B]/30"
                                                                                }`}
                                                                                    >
                                                                                        {
                                                                                            log.status_verifikasi
                                                                                        }
                                                                                    </span>

                                                                                    {/* TOMBOL EDIT REVISI (Hanya muncul jika DITOLAK) */}
                                                                                    {log.status_verifikasi ===
                                                                                        "ditolak" && (
                                                                                        <button
                                                                                            onClick={() =>
                                                                                                handleEditClick(
                                                                                                    log,
                                                                                                )
                                                                                            }
                                                                                            className="w-full px-2 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/40 rounded text-[8px] font-bold uppercase tracking-widest transition"
                                                                                        >
                                                                                            Edit
                                                                                            Revisi
                                                                                        </button>
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        ),
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* --- MODAL KAMERA --- */}
            <AnimatePresence>
                {isFaceScannerOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <div
                            className="absolute inset-0 bg-[#050A18]/95 backdrop-blur-md"
                            onClick={cancelScan}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md bg-[#0A1428] border border-[#B8860B]/30 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="p-5 border-b border-white/10 flex flex-col items-center shrink-0 bg-[#0A1428] rounded-t-2xl z-10">
                                <h3 className="text-white font-serif font-bold tracking-widest text-sm uppercase flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>{" "}
                                    Otorisasi Biometrik
                                </h3>
                                <p className="text-[9px] text-slate-400 font-mono tracking-widest mt-1 uppercase">
                                    Posisikan wajah di tengah area
                                </p>
                            </div>
                            <div className="p-6 flex flex-col items-center overflow-y-auto w-full scrollbar-thin scrollbar-thumb-[#B8860B]/30">
                                <div className="relative w-56 h-56 sm:w-64 sm:h-64 shrink-0 bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] mb-6">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
                                    />
                                    <div className="absolute inset-0 pointer-events-none p-4 flex items-center justify-center z-10">
                                        <div className="w-full h-full border-2 border-[#B8860B]/20 rounded-xl relative">
                                            <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-2 border-l-2 border-[#F0C040] rounded-tl-xl"></div>
                                            <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-2 border-r-2 border-[#F0C040] rounded-tr-xl"></div>
                                            <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-2 border-l-2 border-[#F0C040] rounded-bl-xl"></div>
                                            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-2 border-r-2 border-[#F0C040] rounded-br-xl"></div>
                                        </div>
                                    </div>
                                    <motion.div
                                        animate={{ y: ["0%", "250px", "0%"] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2.5,
                                            ease: "linear",
                                        }}
                                        className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#F0C040] to-transparent shadow-[0_0_10px_#F0C040] z-20 opacity-50"
                                    />
                                </div>
                                <div className="bg-black/30 w-full border border-white/5 rounded-lg p-3 mb-6">
                                    <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest text-center">
                                        {scanStatus}
                                    </p>
                                </div>
                                <div className="w-full space-y-3 shrink-0">
                                    <button
                                        onClick={handleFaceVerification}
                                        disabled={isProcessing}
                                        className="w-full py-3.5 bg-[#B8860B] text-[#050A18] rounded-lg font-bold text-[11px] tracking-widest uppercase hover:brightness-110 shadow-lg transition active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {isProcessing
                                            ? "Menganalisis..."
                                            : "MULAI IDENTIFIKASI"}
                                    </button>
                                    <button
                                        onClick={cancelScan}
                                        className="w-full py-3.5 border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition"
                                    >
                                        Batalkan Operasi
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
