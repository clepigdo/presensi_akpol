import React from "react";
import { Head, Link } from "@inertiajs/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Perbaikan icon default Leaflet yang sering hilang di React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MonitoringMap({ auth, locations }) {
    // Koordinat pusat (Contoh: Semarang / AKPOL)
    const center = [-7.021, 110.423];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
            <Head title="Tactical Map - AKPOL" />

            {/* --- SIDEBAR (Sama dengan Dashboard) --- */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0F172A] border-r border-amber-500/10 z-[1000] hidden lg:block">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Lambang_Akpol.png"
                        className="h-10 w-auto"
                        alt="AKPOL"
                    />
                    <div className="font-cinzel text-sm font-bold text-white tracking-widest leading-tight">
                        COMMAND CENTER
                    </div>
                </div>
                <nav className="p-4 space-y-2 mt-4">
                    <Link
                        href={route("admin.dashboard")}
                        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-lg transition text-xs uppercase tracking-wider"
                    >
                        <span>📊</span> Dashboard
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 font-bold text-xs uppercase tracking-wider"
                    >
                        <span>📍</span> Monitoring Map
                    </Link>
                </nav>
            </aside>

            {/* --- MAIN AREA --- */}
            <main className="lg:ml-64 relative h-screen">
                {/* Header Overlay di Atas Map */}
                <div className="absolute top-6 left-6 right-6 z-[999] pointer-events-none">
                    <div className="bg-[#0F172A]/80 backdrop-blur-md border border-amber-500/20 p-4 rounded-xl shadow-2xl flex justify-between items-center pointer-events-auto">
                        <div>
                            <h2 className="text-lg font-cinzel font-black text-white tracking-tight uppercase">
                                Tactical Geographic Monitoring
                            </h2>
                            <p className="text-[10px] text-amber-500 font-mono tracking-[0.2em]">
                                SISTEM PELACAKAN TARUNA PRESISI
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                                Live Sat-Link
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- MAP CONTAINER --- */}
                <div className="h-full w-full grayscale-[0.8] contrast-[1.2] invert-[0.1]">
                    <MapContainer
                        center={center}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                    >
                        {/* TileLayer menggunakan tema Dark dari CartoDB */}
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />

                        {/* Render Lokasi Taruna */}
                        {locations.map((loc, i) => (
                            <Marker
                                key={i}
                                position={[loc.latitude, loc.longitude]}
                            >
                                <Popup>
                                    <div className="p-1 font-sans text-slate-900">
                                        <p className="font-bold border-b pb-1 mb-1 uppercase text-xs">
                                            {loc.user.nama_lengkap}
                                        </p>
                                        <p className="text-[10px]">
                                            Waktu Lapor:{" "}
                                            <span className="font-mono">
                                                {loc.jam_masuk}
                                            </span>
                                        </p>
                                        <p className="text-[10px] text-indigo-600 font-bold mt-1">
                                            Status: TERVERIFIKASI
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </main>
        </div>
    );
}
