export function getStatusByKelembapan(kelembapan?: number) {
    if (!kelembapan) {
        return 'Loading..';
    }
    if (kelembapan < 40) {
        return 'Kering';
    } else if (kelembapan >= 40 && kelembapan <= 60) {
        return 'Normal';
    } else {
        return 'Basah';
    }
}