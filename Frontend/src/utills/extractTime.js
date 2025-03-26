// src/utils/extractTime.js
export function extractTime(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}a