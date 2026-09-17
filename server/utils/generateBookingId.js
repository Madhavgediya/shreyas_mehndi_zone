/**
 * Generate unique Mehndi Booking ID
 * Format: MH-YYYY-XXXXXX
 */
const generateBookingId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `MH-${year}-${randomNum}`;
};

module.exports = generateBookingId;
