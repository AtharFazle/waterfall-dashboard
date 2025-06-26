// fetchWeather.ts

import axios from 'axios';

// ===========================================
// 1. DEFINISI TIPE DATA (INTERFACES)
//    Mendefinisikan struktur data untuk API BMKG dan format target kita.
// ===========================================

interface BmkgWeatherEntry {
    datetime: string;
    t: number;
    hu: number; // Kelembapan (Humidity)
    ws: number; // Kecepatan angin (Wind Speed)
    weather_desc: string;
    local_datetime: string;
    // ... properti lainnya bisa ditambahkan jika diperlukan
}

interface BmkgDataWrapper {
    lokasi: any;
    cuaca: BmkgWeatherEntry[][]; // Array of arrays
}

interface BmkgJsonResponse {
    lokasi: any;
    data: BmkgDataWrapper[];
}



interface WeatherData {
    time: string;
    temp: number;
    humidity: number;
    weatherDesc: string;
}

const flattenArray = <T>(arr: T[][]): T[] => {
    return arr.reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
};

export const transformWeatherData = (jsonData: BmkgJsonResponse): WeatherData[] => {
    if (!jsonData || !jsonData.data || !jsonData.data[0] || !jsonData.data[0].cuaca) {
        console.error("Invalid JSON structure received from the API.");
        return [];
    }

    const nestedWeatherArrays = jsonData.data[0].cuaca;

    const flattenedWeatherEntries = flattenArray(nestedWeatherArrays);

    const today = new Date();
    const year = today.getFullYear();
    // Gunakan padStart untuk memastikan format 'MM' dan 'DD'
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
    const day = String(today.getDate()).padStart(2, '0');
    const todayDateString = `${year}-${month}-${day}`;
    
    // console.log(`Filtering data for today's date: ${todayDateString}`);

    // Filter entri untuk hari ini saja
    const filteredEntries = flattenedWeatherEntries.filter(entry => {
        // Ambil bagian tanggal dari string local_datetime (misal: "2025-06-26")
        return entry.datetime.startsWith(todayDateString);
    });

    // console.log(flattenedWeatherEntries,'before filter');
    // console.log(filteredEntries,'after filter');

    // Ubah setiap entri cuaca yang sudah difilter ke format yang diinginkan
    const transformedData: WeatherData[] = filteredEntries.map(entry => {
        const localTime = new Date(entry.local_datetime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        return {
            time: localTime,
            temp: entry.t,
            humidity: entry.hu,
            weatherDesc: entry.weather_desc
        };
    });

    return transformedData;
};

export const getWeatherData = async () => {
    // URL API yang Anda berikan
    const url = 'https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=35.07.07.2014';

    try {
//         console.log(`Fetching data from: ${url}`);
        // Lakukan request GET dengan Axios.
        // Gunakan generic type <BmkgJsonResponse> untuk type safety.
        const response = await axios.get<BmkgJsonResponse>(url);

        // Ambil data dari respon Axios
        const rawData = response.data;

        // Transformasi data ke format yang diinginkan
        const transformedData: WeatherData[] = transformWeatherData(rawData);

        // Lakukan sesuatu dengan data yang telah di-transform
        return transformedData;
        
    } catch (error: any) {
        // Tangani error
        if (axios.isAxiosError(error)) {
            // Ini adalah error dari Axios (misal: 404, 500, network issue)
            console.error('AXIOS ERROR: Failed to fetch data from API.');
            console.error('Status Code:', error.response?.status);
            console.error('Error Message:', error.message);
        } else {
            // Error lain yang bukan dari Axios
            console.error('GENERIC ERROR:', error.message);
        }
    }
};
// Jalankan fungsi untuk memulai proses fetching data
// getWeatherData();