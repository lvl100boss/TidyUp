/**
 * Format duration into a human-readable string
 * @param {number} hours - Hours component of duration
 * @param {number} minutes - Minutes component of duration
 * @returns {string} Formatted duration string
 */
const formatDuration = (hours, minutes) => {
    if (hours > 0) {
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
};

export default formatDuration;
