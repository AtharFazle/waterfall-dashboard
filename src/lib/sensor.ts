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

export function getStatusKetinggianAir(ketinggianAir?: number) {
    if (!ketinggianAir) {
        return 'Aman';
    }
    if (ketinggianAir < 80) {
        return 'Aman';
    } else if (ketinggianAir >= 80 && ketinggianAir <= 100) {
        return 'Waspada';
    } else {
        return 'Bahaya';
    }
}
