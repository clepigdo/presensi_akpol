<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard Mahasiswa') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 text-center">
                    
                    <h3 class="text-2xl font-bold mb-4">Halo, {{ Auth::user()->nama_lengkap }}!</h3>
                    
                    @if(session('success'))
                        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span class="block sm:inline">{{ session('success') }}</span>
                        </div>
                    @endif

                    <div class="mt-6">
    {{-- KONDISI 1: Belum Absen Masuk --}}
    @if ($cek_absen == null)
        <form action="{{ route('mahasiswa.absen') }}" method="POST">
            @csrf
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                🕒 ABSEN MASUK
            </button>
        </form>

    {{-- KONDISI 2: Sudah Masuk, TAPI Belum Pulang (Cek jam_pulang) --}}
    @elseif ($cek_absen->jam_pulang == null) 
        <div class="mb-4">
            <p class="text-gray-600">Anda masuk pukul: <span class="font-bold">{{ $cek_absen->jam_masuk }}</span></p>
        </div>
        <form action="{{ route('mahasiswa.absen') }}" method="POST">
            @csrf
            <button type="submit" class="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                🏠 ABSEN PULANG
            </button>
        </form>

    {{-- KONDISI 3: Sudah Selesai --}}
    @else
        <div class="bg-green-50 p-6 rounded-lg border border-green-200">
            <h4 class="text-lg font-bold text-green-800">✨ Absensi Hari Ini Selesai!</h4>
            <p class="text-gray-600 mt-2">
                Masuk: {{ $cek_absen->jam_masuk }} <br>
                Pulang: {{ $cek_absen->jam_pulang }} {{-- Ganti jadi jam_pulang --}}
            </p>
        </div>
    @endif
</div>
                    <div class="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
    <div class="p-6 text-gray-900">
        <h3 class="text-lg font-bold mb-4">📜 Riwayat Kehadiran Saya</h3>
        
        <div class="overflow-x-auto">
            <table class="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="border border-gray-300 px-4 py-2">Tanggal</th>
                        <th class="border border-gray-300 px-4 py-2">Masuk</th>
                        <th class="border border-gray-300 px-4 py-2">Pulang</th>
                        <th class="border border-gray-300 px-4 py-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($riwayat_absen as $data)
                    <tr class="text-center">
                        <td class="border border-gray-300 px-4 py-2">{{ $data->tanggal }}</td>
                        <td class="border border-gray-300 px-4 py-2">
                            <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                {{ $data->jam_masuk }}
                            </span>
                        </td>
                        <td class="border border-gray-300 px-4 py-2">
                            @if($data->jam_pulang)
                                <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                    {{ $data->jam_pulang }}
                                </span>
                            @else
                                -
                            @endif
                        </td>
                        <td class="border border-gray-300 px-4 py-2 capitalize">{{ $data->status }}</td>
                    </tr>
                    @endforeach
                    
                    @if($riwayat_absen->isEmpty())
                    <tr>
                        <td colspan="4" class="border border-gray-300 px-4 py-2 text-center text-gray-500">
                            Belum ada data absensi.
                        </td>
                    </tr>
                    @endif
                </tbody>
            </table>
        </div>
    </div>
</div>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>