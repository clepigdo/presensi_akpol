import React, { useEffect, useRef, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";

// --- Komponen: Background Particles (Sama dengan Login/Register) ---
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
                ctx.fillStyle = "rgba(212,160,23,0.2)"; // akpol-gold
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

export default function SetupProfile({ auth }) {
    const [step, setStep] = useState(1);
    const [cameraActive, setCameraActive] = useState(false);
    const [imageCaptured, setImageCaptured] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        no_hp: "",
        jenis_kelamin: "",
        alamat_domisili: "",
        face_data: null,
    });

    // --- Efek untuk menyalakan/mematikan Kamera di Step 2 ---
    useEffect(() => {
        let stream = null;
        if (step === 2 && !imageCaptured) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((mediaStream) => {
                    stream = mediaStream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        setCameraActive(true);
                    }
                })
                .catch((err) => {
                    console.error(
                        "Akses kamera ditolak atau tidak ditemukan:",
                        err,
                    );
                    alert(
                        "Sistem membutuhkan akses kamera untuk fitur Face Recognition.",
                    );
                });
        }

        // Cleanup: Matikan kamera jika pindah step atau komponen di-unmount
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
                setCameraActive(false);
            }
        };
    }, [step, imageCaptured]);

    const handleNextStep = () => {
        // Di sini bisa ditambahkan validasi manual sebelum lanjut ke step 2
        setStep(2);
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(
                videoRef.current,
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height,
            );

            // Konversi canvas ke base64 image
            const imageData = canvasRef.current.toDataURL("image/png");
            setImageCaptured(imageData);
            setData("face_data", imageData);
        }
    };

    const handleRetake = () => {
        setImageCaptured(null);
        setData("face_data", null);
    };

    const submit = (e) => {
        e.preventDefault();
        // Route ini akan kita buat nanti di backend Laravel
        post(route('profile.setup.store'));
        console.log("Data yang dikirim:", data);
        alert("Simulasi Berhasil! Data siap dikirim ke backend.");
    };

    return (
        <div className="min-h-screen bg-[#050A18] text-white font-sans overflow-hidden relative flex flex-col">
            <Head title="Setup Profil & Biometrik — AKPOL" />

            <ParticleCanvas />

            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0A1E3A_0%,#050A18_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,160,23,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,160,23,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            {/* Navbar Minimalis */}
            <nav className="relative z-50 h-20 px-6 md:px-12 flex items-center justify-between border-b border-[#B8860B]/10 bg-[#050A18]/90 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <img
                        src="../images/Logo_Akademi_Kepolisian.png"
                        alt="AKPOL"
                        className="h-9 w-auto drop-shadow-[0_0_8px_rgba(212,160,23,0.4)]"
                    />
                    <div>
                        <div className="font-serif font-bold text-xs tracking-[0.25em] text-white">
                            SIAK MAGANG
                        </div>
                        <div className="font-mono text-[8px] text-[#B8860B] tracking-[0.2em] opacity-80">
                            AKADEMI KEPOLISIAN
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded border border-[#B8860B]/10 bg-[#B8860B]/5">
                    <span className="font-mono text-[9px] text-[#B8860B] tracking-widest uppercase">
                        System Initialization
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_5px_#3B82F6]" />
                </div>
            </nav>

            <main className="flex-1 w-full flex flex-col items-center justify-center relative z-10 px-4 py-10">
                <div className="w-full max-w-2xl">
                    {/* Header & Progress Bar */}
                    <div className="text-center mb-8">
                        <h1 className="font-serif text-2xl font-black tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-[#F0C040] to-[#B8860B] mb-6">
                            ONBOARDING PROTOCOL
                        </h1>

                        {/* Progress Tracker */}
                        <div className="flex items-center justify-center gap-4 max-w-xs mx-auto">
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold border-2 transition-colors duration-300 ${step >= 1 ? "border-[#B8860B] bg-[#B8860B]/20 text-[#F0C040]" : "border-slate-700 text-slate-500"}`}
                                >
                                    1
                                </div>
                                <span
                                    className={`text-[9px] font-mono tracking-widest uppercase ${step >= 1 ? "text-[#F0C040]" : "text-slate-500"}`}
                                >
                                    Data Diri
                                </span>
                            </div>
                            <div
                                className={`flex-1 h-[2px] transition-colors duration-300 ${step === 2 ? "bg-[#B8860B]" : "bg-slate-700"}`}
                            ></div>
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold border-2 transition-colors duration-300 ${step === 2 ? "border-[#B8860B] bg-[#B8860B]/20 text-[#F0C040]" : "border-slate-700 text-slate-500"}`}
                                >
                                    2
                                </div>
                                <span
                                    className={`text-[9px] font-mono tracking-widest uppercase ${step === 2 ? "text-[#F0C040]" : "text-slate-500"}`}
                                >
                                    Biometrik
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card Container */}
                    <div className="relative group">
                        <div className="absolute -inset-[1px] bg-gradient-to-b from-[#B8860B]/30 to-transparent rounded-2xl opacity-50 blur-sm pointer-events-none" />
                        <div className="relative bg-[#0A1428]/95 backdrop-blur-xl border border-[#B8860B]/10 rounded-2xl p-6 md:p-8 shadow-2xl min-h-[400px]">
                            <form onSubmit={submit}>
                                <AnimatePresence mode="wait">
                                    {/* --- STEP 1: FORM DATA DIRI --- */}
                                    {step === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            <div className="border-b border-white/10 pb-4 mb-4">
                                                <h3 className="text-white font-serif tracking-wider flex items-center gap-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        className="w-5 h-5 text-[#B8860B]"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    Kelengkapan Identitas
                                                </h3>
                                                <p className="text-[10px] text-slate-400 font-mono mt-1">
                                                    Lengkapi data berikut untuk
                                                    administrasi magang Akademi
                                                    Kepolisian.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-1.5">
                                                    <label className="block font-serif text-[10px] font-bold tracking-[0.1em] text-slate-400 uppercase">
                                                        Nomor Handphone / WA
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.no_hp}
                                                        onChange={(e) =>
                                                            setData(
                                                                "no_hp",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="081234567890"
                                                        className="w-full bg-[#050A18] border border-[#B8860B]/15 rounded text-white font-mono text-sm py-3 px-4 outline-none focus:border-[#B8860B]/50 transition-all placeholder:text-gray-700"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="block font-serif text-[10px] font-bold tracking-[0.1em] text-slate-400 uppercase">
                                                        Jenis Kelamin
                                                    </label>
                                                    <select
                                                        value={
                                                            data.jenis_kelamin
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "jenis_kelamin",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full bg-[#050A18] border border-[#B8860B]/15 rounded text-white font-mono text-sm py-3 px-4 outline-none focus:border-[#B8860B]/50 transition-all appearance-none"
                                                        required
                                                    >
                                                        <option
                                                            value=""
                                                            disabled
                                                        >
                                                            Pilih Jenis Kelamin
                                                        </option>
                                                        <option value="L">
                                                            Laki-laki
                                                        </option>
                                                        <option value="P">
                                                            Perempuan
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="block font-serif text-[10px] font-bold tracking-[0.1em] text-slate-400 uppercase">
                                                    Alamat Domisili (Selama
                                                    Magang)
                                                </label>
                                                <textarea
                                                    value={data.alamat_domisili}
                                                    onChange={(e) =>
                                                        setData(
                                                            "alamat_domisili",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Alamat lengkap kos / rumah di Semarang..."
                                                    rows="3"
                                                    className="w-full bg-[#050A18] border border-[#B8860B]/15 rounded text-white font-mono text-sm py-3 px-4 outline-none focus:border-[#B8860B]/50 transition-all placeholder:text-gray-700 resize-none"
                                                    required
                                                ></textarea>
                                            </div>

                                            <div className="pt-4 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={handleNextStep}
                                                    className="px-8 py-3 bg-[#B8860B]/20 border border-[#B8860B]/50 hover:bg-[#B8860B]/30 rounded text-[#F0C040] font-serif font-bold text-[11px] tracking-[0.2em] uppercase transition-all flex items-center gap-2"
                                                >
                                                    Lanjut ke Biometrik
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={2}
                                                        stroke="currentColor"
                                                        className="w-4 h-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* --- STEP 2: FACE RECOGNITION --- */}
                                    {step === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="text-center mb-6">
                                                <h3 className="text-white font-serif tracking-widest uppercase mb-1">
                                                    Face Enrollment
                                                </h3>
                                                <p className="text-[10px] text-slate-400 font-mono">
                                                    Posisikan wajah Anda di
                                                    tengah kotak untuk
                                                    pemindaian sistem.
                                                </p>
                                            </div>

                                            {/* UI HUD KAMERA */}
                                            <div className="relative w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden border-2 border-[#0A1428] bg-black shadow-[0_0_30px_rgba(212,160,23,0.15)] mb-6 group">
                                                {/* Corner Brackets (HUD UI) */}
                                                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#B8860B] z-20"></div>
                                                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#B8860B] z-20"></div>
                                                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#B8860B] z-20"></div>
                                                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#B8860B] z-20"></div>

                                                {/* Video Stream / Image Preview */}
                                                {imageCaptured ? (
                                                    <img
                                                        src={imageCaptured}
                                                        alt="Captured Face"
                                                        className="w-full h-full object-cover relative z-10"
                                                    />
                                                ) : (
                                                    <video
                                                        ref={videoRef}
                                                        autoPlay
                                                        playsInline
                                                        className="w-full h-full object-cover relative z-10 transform scale-x-[-1]"
                                                    ></video>
                                                )}

                                                <canvas
                                                    ref={canvasRef}
                                                    className="hidden"
                                                ></canvas>

                                                {/* Scanning Animation Overlay (Hanya saat kamera aktif & belum dicapture) */}
                                                {cameraActive &&
                                                    !imageCaptured && (
                                                        <motion.div
                                                            className="absolute left-0 right-0 h-1 bg-emerald-400/50 shadow-[0_0_15px_#10B981] z-30"
                                                            animate={{
                                                                top: [
                                                                    "10%",
                                                                    "90%",
                                                                    "10%",
                                                                ],
                                                            }}
                                                            transition={{
                                                                duration: 3,
                                                                ease: "linear",
                                                                repeat: Infinity,
                                                            }}
                                                        />
                                                    )}

                                                {/* Status Indicator UI */}
                                                <div className="absolute bottom-2 left-0 right-0 flex justify-center z-30">
                                                    <span
                                                        className={`text-[8px] font-mono tracking-widest px-2 py-0.5 rounded backdrop-blur-sm border ${imageCaptured ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}
                                                    >
                                                        {imageCaptured
                                                            ? "FACE ACQUIRED // 100%"
                                                            : "STANDBY // WAITING FOR SENSOR"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="w-full flex items-center justify-between pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    className="px-4 py-3 text-slate-400 hover:text-white font-mono text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={2}
                                                        stroke="currentColor"
                                                        className="w-3 h-3"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                                                        />
                                                    </svg>
                                                    Kembali
                                                </button>

                                                {imageCaptured ? (
                                                    <div className="flex gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                handleRetake
                                                            }
                                                            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded text-white font-serif text-[10px] tracking-widest uppercase transition-all"
                                                        >
                                                            Ulangi
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                processing
                                                            }
                                                            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 rounded text-white font-serif font-bold text-[11px] tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                                        >
                                                            {processing
                                                                ? "Menyimpan..."
                                                                : "Simpan & Selesai"}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={handleCapture}
                                                        className="px-6 py-3 bg-[#B8860B] hover:bg-[#F0C040] rounded text-[#0A1428] font-serif font-bold text-[11px] tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(184,134,11,0.4)] flex items-center gap-2"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className="w-4 h-4"
                                                        >
                                                            <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        Pindai Wajah
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>
                    </div>

                    <div className="mt-6 text-center opacity-30 font-mono text-[8px] tracking-[0.2em] uppercase">
                        BIOMETRIC SENSOR MODULE // SECURE DATA VAULT
                    </div>
                </div>
            </main>
        </div>
    );
}
