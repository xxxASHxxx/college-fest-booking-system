// Add days to date
export const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

// Subtract days from date
export const subtractDays = (date, days) => {
    return addDays(date, -days);
};

// Add months to date
export const addMonths = (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
};

// Get start of day
export const startOfDay = (date) => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
};

// Get end of day
export const endOfDay = (date) => {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
};

// Get start of week
export const startOfWeek = (date) => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = result.getDate() - day;
    result.setDate(diff);
    return startOfDay(result);
};

// Get end of week
export const endOfWeek = (date) => {
    const result = startOfWeek(date);
    result.setDate(result.getDate() + 6);
    return endOfDay(result);
};

// Get start of month
export const startOfMonth = (date) => {
    const result = new Date(date);
    result.setDate(1);
    return startOfDay(result);
};

// Get end of month
export const endOfMonth = (date) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + 1);
    result.setDate(0);
    return endOfDay(result);
};

// Check if date is between two dates
export const isBetween = (date, startDate, endDate) => {
    const d = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return d >= start && d <= end;
};

// Check if date is same day
export const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()
    );
};

// Check if date is weekend
export const isWeekend = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    return day === 0 || day === 6;
};

// Get days in month
export const getDaysInMonth = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
};

// Get month name
export const getMonthName = (date, short = false) => {
    const months = short
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return months[new Date(date).getMonth()];
};

// Get day name
export const getDayName = (date, short = false) => {
    const days = short
        ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return days[new Date(date).getDay()];
};

// Calculate age
export const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

// Get date range
export const getDateRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
    }

    return dates;
};

// Parse date string to Date object
export const parseDate = (dateString, format = 'YYYY-MM-DD') => {
    // Simple parser for common formats
    if (format === 'YYYY-MM-DD') {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    if (format === 'DD/MM/YYYY') {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    }

    return new Date(dateString);
};
