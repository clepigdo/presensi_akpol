import React, { useEffect, useRef, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import * as faceapi from "face-api.js";

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

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_lengkap: "",
        nim_atau_nrp: "",
        email: "",
        no_hp: "", // [TAMBAHAN BARU]
        jenis_kelamin: "", // [TAMBAHAN BARU]
        alamat_domisili: "", // [TAMBAHAN BARU]
        password: "",
        password_confirmation: "",
        face_data: "",
    });

    const [showPass, setShowPass] = useState(false);
    const [showConfPass, setShowConfPass] = useState(false);

    // --- STATE & REFS FACE RECOGNITION ---
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [scanStatus, setScanStatus] = useState("");
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const videoRef = useRef();
    const canvasRef = useRef();

    useEffect(() => {
        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
                    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
                    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
                ]);
                setIsModelLoaded(true);
            } catch (err) {
                console.error("Gagal memuat model face-api", err);
            }
        };
        loadModels();

        return () => reset("password", "password_confirmation");
    }, []);

    // --- FUNGSI KAMERA ---
    const startCamera = async () => {
        setIsCameraOn(true);
        setScanStatus("Menyalakan sensor visual...");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setScanStatus("Sistem siap. Posisikan wajah di tengah.");
        } catch (error) {
            setScanStatus("Akses kamera ditolak / tidak ditemukan.");
            setIsCameraOn(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject
                .getTracks()
                .forEach((track) => track.stop());
        }
        setIsCameraOn(false);
    };

    const captureFace = async () => {
        if (!videoRef.current) return;
        setScanStatus("Menganalisis matriks wajah...");

        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageDataUrl = canvas.toDataURL("image/jpeg");

        const imgEl = document.createElement("img");
        imgEl.src = imageDataUrl;

        await new Promise((resolve) => (imgEl.onload = resolve));
        const detection = await faceapi
            .detectSingleFace(imgEl)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (detection) {
            setScanStatus("Biometrik Tervalidasi & Diamankan.");
            setData("face_data", imageDataUrl);
            stopCamera();
        } else {
            setScanStatus(
                "Wajah tidak terdeteksi. Cari pencahayaan lebih baik.",
            );
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    const EyeIcon = ({ isVisible }) =>
        isVisible ? (
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
                <line x1="1" y1="1" x2="23" y2="23" />
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
                <circle cx="12" cy="12" r="3" />
            </svg>
        );

    return (
        <div className="min-h-screen bg-akpol-navy text-white font-cormorant overflow-x-hidden overflow-y-auto relative flex flex-col">
            <Head title="Registrasi Magang — AKPOL" />

            <ParticleCanvas />

            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0A1E3A_0%,#050A18_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,160,23,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,160,23,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

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
                <div className="flex items-center gap-2 px-3 py-1 rounded border border-akpol-gold/10 bg-akpol-gold/5 hidden sm:flex">
                    <span className="font-tech text-[9px] text-akpol-gold tracking-widest uppercase">
                        Secure // Enroll
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_5px_#3B82F6]" />
                </div>
            </nav>

            <main className="flex-1 w-full flex flex-col items-center justify-center relative z-10 px-4 pt-28 pb-10">
                <div className="w-full max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-6"
                    >
                        <div className="relative w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                            <div className="absolute inset-0 border border-akpol-gold/20 rounded-full animate-[spin_10s_linear_infinite]" />
                            <div className="absolute inset-2 border border-akpol-gold/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                            <img
                                src="../images/Logo_Akademi_Kepolisian.png"
                                alt="Logo"
                                className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(212,160,23,0.5)]"
                            />
                        </div>
                        <h1 className="font-cinzel text-xl md:text-2xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-akpol-gold to-[#B8860B]">
                            SIAK MAGANG
                        </h1>
                        <p className="font-tech text-[9px] text-akpol-slate/50 tracking-[0.4em] mt-1 uppercase">
                            REGISTRASI AKUN & BIOMETRIK
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-[1px] bg-gradient-to-b from-akpol-gold/30 to-transparent rounded-lg opacity-50 blur-sm pointer-events-none" />

                        <div className="relative bg-[#0A1428]/95 backdrop-blur-xl border border-akpol-gold/10 rounded-lg p-6 md:p-8 shadow-2xl">
                            <form
                                onSubmit={submit}
                                className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-12"
                            >
                                {/* --- KOLOM KIRI: FORM DATA DIRI (DIPADATKAN) --- */}
                                <div className="flex flex-col gap-4 lg:border-r lg:border-akpol-gold/10 lg:pr-8">
                                    {/* Baris 1: Nama & NIM */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="block font-cinzel text-[9px] font-bold tracking-[0.15em] text-akpol-slate/70 uppercase">
                                                Nama Lengkap
                                            </label>
                                            <input
                                                type="text"
                                                value={data.nama_lengkap}
                                                onChange={(e) =>
                                                    setData(
                                                        "nama_lengkap",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Sesuai KTP/KTM"
                                                required
                                                className="w-full bg-[#050A18] border border-akpol-gold/15 rounded text-white font-tech text-xs tracking-wide py-2 px-3 outline-none focus:border-akpol-gold/50 focus:bg-[#0F1A30] transition-all placeholder:text-gray-700"
                                            />
                                            {errors.nama_lengkap && (
                                                <p className="font-tech text-[8px] text-red-400 uppercase tracking-wide">
                                                    {errors.nama_lengkap}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block font-cinzel text-[9px] font-bold tracking-[0.15em] text-akpol-slate/70 uppercase">
                                                NIM / NRP
                                            </label>
                                            <input
                                                type="text"
                                                value={data.nim_atau_nrp}
                                                onChange={(e) =>
                                                    setData(
                                                        "nim_atau_nrp",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Nomor Induk Mahasiswa"
                                                required
                                                className="w-full bg-[#050A18] border border-akpol-gold/15 rounded text-white font-tech text-xs tracking-wide py-2 px-3 outline-none focus:border-akpol-gold/50 focus:bg-[#0F1A30] transition-all placeholder:text-gray-700"
                                            />
                                            {errors.nim_atau_nrp && (
                                                <p className="font-tech text-[8px] text-red-400 uppercase tracking-wide">
                                                    {errors.nim_atau_nrp}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Baris 2: Email & No HP */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="block font-cinzel text-[9px] font-bold tracking-[0.15em] text-akpol-slate/70 uppercase">
                                                Email Institusi
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="nomor@kampus.ac.id"
                                                required
                                                className="w-full bg-[#050A18] border border-akpol-gold/15 rounded text-white font-tech text-xs tracking-wide py-2 px-3 outline-none focus:border-akpol-gold/50 focus:bg-[#0F1A30] transition-all placeholder:text-gray-700"
                                            />
                                            {errors.email && (
                                                <p className="font-tech text-[8px] text-red-400 uppercase tracking-wide">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block font-cinzel text-[9px] font-bold tracking-[0.15em] text-akpol-slate/70 uppercase">
                                                No. Handphone / WA
                                            </label>
                                            <input
                                                type="tel"
                                                value={data.no_hp}
                                                onChange={(e) =>
                                                    setData(
                                                        "no_hp",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="081234567890"
                                                required
                                                className="w-full bg-[#050A18] border border-akpol-gold/15 rounded text-white font-tech text-xs tracking-wide py-2 px-3 outline-none focus:border-akpol-gold/50 focus:bg-[#0F1A30] transition-all placeholder:text-gray-700"
                                            />
                                            {errors.no_hp && (
                                                <p className="font-tech text-[8px] text-red-400 uppercase tracking-wide">
                                                    {errors.no_hp}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Baris 3: Jenis Kelamin & Alamat */}
                                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4">
                                        <div className="space-y-1">
                                            <label className="block font-cinzel text-[9px] font-bold tracking-[0.15em] text-akpol-slate/70 uppercase">
                                                Jenis Kelamin
                                            </label>
                                            <select
                                                value={data.jenis_kelamin}
                                                onChange={(e) =>
                                                    setData(
                                                        "jenis_kelamin",
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                className="w-full bg-[#050A18] border border-akpol-gold/15 rounded text-white font-tech text-xs tracking-wide py-2 px-3 outline-none focus:border-akpol-gold/50 focus:bg-[#0F1A30] transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled>
                                                    Pilih Jenis Kelamin
                                                </option>
                                                <option value="Laki-laki">
                                                    Laki-laki
                                                </option>
                                                <option value="Perempuan">
                                                    Perempuan
                                                </option>
                                            </select>
                                            {errors.jenis_kelamin && (
                                                <p className="font-tech text-[8px] text-red-400 uppercase tracking-wide">
                                                    {errors.jenis_kelamin}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block font-cinzel text-[9px] font-bold tracking-[0.15em] text-akpol-slate/70 uppercase">
                                                Alamat Domisili Magang
                                            </label>
                                            <input
                                                type="text"
                                                value={data.alamat_domisili}
                                                onChange={(e) =>
                                                    setData(
                                                        "alamat_domisili",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Alamat kos / rumah"
                                                required
                                                className="w-full bg-[#050A18] border border-akpol-gold/15 rounded text-white font-tech text-xs tracking-wide py-2 px-3 outline-none focus:border-akpol-gold/50 focus:bg-[#0F1A30] transition-all placeholder:text-gray-700"
                                            />
                                            {errors.alamat_domisili && (
                                                <p className="font-tech text-[8px] text-red-400 uppercase tracking-wide">
                                                    {errors.alamat_domisili}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Baris 4: Password */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5 mt-1">
                                        <div className="space-y-1">
                                            <label className="block font-cinzel text-[9px] font-bold tracking-[0.15em] text-akpol-slate/70 uppercase">
                                                Kata Sandi
                                            </label>
                                            <div className="relative group/input">
                                                <input
                                                    type={
                                                        showPass
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={data.password}
                                                    onChange={(e) =>
                                                        setData(
                                                            "password",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="••••••••"
                                                    required
                                                    className="w-full bg-[#050A18] border border-akpol-gold/15 rounded text-white font-tech text-xs tracking-wide py-2 px-3 pr-10 outline-none focus:border-akpol-gold/50 focus:bg-[#0F1A30] transition-all placeholder:text-gray-700"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPass(!showPass)
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-akpol-gold transition-colors"
                                                >
                                                    <EyeIcon
                                                        isVisible={showPass}
                                                    />
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <p className="font-tech text-[8px] text-red-400 uppercase tracking-wide">
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block font-cinzel text-[9px] font-bold tracking-[0.15em] text-akpol-slate/70 uppercase">
                                                Konfirmasi Sandi
                                            </label>
                                            <div className="relative group/input">
                                                <input
                                                    type={
                                                        showConfPass
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={
                                                        data.password_confirmation
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "password_confirmation",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="••••••••"
                                                    required
                                                    className="w-full bg-[#050A18] border border-akpol-gold/15 rounded text-white font-tech text-xs tracking-wide py-2 px-3 pr-10 outline-none focus:border-akpol-gold/50 focus:bg-[#0F1A30] transition-all placeholder:text-gray-700"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfPass(
                                                            !showConfPass,
                                                        )
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-akpol-gold transition-colors"
                                                >
                                                    <EyeIcon
                                                        isVisible={showConfPass}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* --- KOLOM KANAN: KAMERA BIOMETRIK --- */}
                                <div className="flex flex-col items-center justify-center">
                                    <label className="block font-cinzel text-[10px] font-bold tracking-[0.15em] text-akpol-gold uppercase mb-3 w-full text-center">
                                        Registrasi Face ID
                                    </label>

                                    <div className="w-48 h-48 bg-[#050A18] border-2 border-akpol-gold/30 rounded-xl overflow-hidden relative flex items-center justify-center shadow-inner mb-4">
                                        {data.face_data ? (
                                            <img
                                                src={data.face_data}
                                                alt="Biometrik"
                                                className="w-full h-full object-cover transform -scale-x-100"
                                            />
                                        ) : isCameraOn ? (
                                            <>
                                                <video
                                                    ref={videoRef}
                                                    autoPlay
                                                    muted
                                                    playsInline
                                                    className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
                                                />
                                                <div className="absolute inset-0 border-2 border-blue-500/30 m-4 rounded-lg pointer-events-none"></div>
                                                <motion.div
                                                    animate={{
                                                        y: [
                                                            "0%",
                                                            "200px",
                                                            "0%",
                                                        ],
                                                    }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 2.5,
                                                        ease: "linear",
                                                    }}
                                                    className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_10px_#3B82F6] z-20 opacity-50"
                                                />
                                            </>
                                        ) : (
                                            <div className="text-center opacity-40 p-4">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1}
                                                    stroke="currentColor"
                                                    className="w-10 h-10 mx-auto mb-2 text-akpol-gold"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                                                    />
                                                </svg>
                                                <span className="font-tech text-[8px] tracking-[0.2em] uppercase text-akpol-gold">
                                                    Kamera Off
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <p
                                        className={`font-tech text-[9px] tracking-[0.1em] uppercase text-center mb-4 min-h-[14px] ${data.face_data ? "text-emerald-400" : "text-akpol-gold/70"}`}
                                    >
                                        {scanStatus ||
                                            (data.face_data
                                                ? "Target Terkunci"
                                                : "Wajib Merekam Wajah")}
                                    </p>

                                    <div className="w-full flex gap-2">
                                        {data.face_data ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData("face_data", "")
                                                }
                                                className="w-full py-2 bg-red-500/10 text-red-400 border border-red-500/30 font-tech font-bold text-[9px] tracking-widest uppercase rounded hover:bg-red-500 hover:text-white transition"
                                            >
                                                Hapus & Ulangi
                                            </button>
                                        ) : isCameraOn ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={captureFace}
                                                    className="flex-1 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 font-tech font-bold text-[9px] tracking-widest uppercase rounded hover:bg-blue-500 hover:text-white transition"
                                                >
                                                    Pindai
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={stopCamera}
                                                    className="px-3 py-2 bg-white/5 border border-white/10 text-slate-400 font-tech text-[9px] uppercase font-bold rounded hover:bg-white/10 transition"
                                                >
                                                    Batal
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={startCamera}
                                                disabled={!isModelLoaded}
                                                className="w-full py-2 bg-akpol-gold/10 text-akpol-gold border border-akpol-gold/30 font-tech font-bold text-[9px] tracking-widest uppercase rounded hover:bg-akpol-gold hover:text-[#050A18] transition disabled:opacity-50"
                                            >
                                                {isModelLoaded
                                                    ? "Aktivasi Kamera"
                                                    : "Memuat..."}
                                            </button>
                                        )}
                                    </div>
                                    {errors.face_data && (
                                        <p className="font-tech text-[8px] text-red-400 uppercase tracking-wide mt-2 text-center">
                                            {errors.face_data}
                                        </p>
                                    )}
                                    <canvas
                                        ref={canvasRef}
                                        className="hidden"
                                    />
                                </div>

                                {/* --- TOMBOL SUBMIT UTAMA --- */}
                                <div className="lg:col-span-2 pt-5 border-t border-akpol-gold/10">
                                    <button
                                        type="submit"
                                        disabled={processing || !data.face_data}
                                        className="w-full py-3.5 bg-gradient-to-r from-[#B8860B] to-[#F0C040] rounded text-[#050A18] font-cinzel font-bold text-[11px] tracking-[0.2em] uppercase hover:shadow-[0_0_15px_rgba(212,160,23,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                                    >
                                        {processing
                                            ? "Memproses Data..."
                                            : !data.face_data
                                              ? "Lengkapi Data Biometrik"
                                              : "Daftar Sistem"}
                                    </button>
                                    <div className="text-center mt-4">
                                        <span className="font-tech text-[8px] tracking-wider text-akpol-slate/70 uppercase">
                                            Sudah Punya Akun?{" "}
                                        </span>
                                        <Link
                                            href={route("login")}
                                            className="font-tech text-[8px] font-bold tracking-wider text-akpol-gold hover:text-[#F0C040] uppercase transition-colors"
                                        >
                                            Masuk Di Sini
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
