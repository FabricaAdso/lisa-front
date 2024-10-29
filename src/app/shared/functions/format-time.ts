
export function formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const formattedClosingHour = `${hours}:${minutes}`;

    return formattedClosingHour

}