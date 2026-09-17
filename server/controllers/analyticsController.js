const Design = require('../models/Design');
const Category = require('../models/Category');
const Booking = require('../models/Booking');
const Inquiry = require('../models/Inquiry');
const User = require('../models/User');
const Favorite = require('../models/Favorite');
const ShareAnalytics = require('../models/ShareAnalytics');
const { successResponse } = require('../utils/apiResponse');

// @desc    Get dashboard metrics & charts
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalDesigns,
      totalCategories,
      totalBookings,
      pendingBookings,
      completedBookings,
      totalInquiries,
      totalUsers,
      totalFavorites,
      totalShares,
    ] = await Promise.all([
      Design.countDocuments(),
      Category.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: 'Completed' }),
      Inquiry.countDocuments(),
      User.countDocuments({ role: 'USER' }),
      Favorite.countDocuments(),
      ShareAnalytics.countDocuments(),
    ]);

    // Popular designs by likes
    const popularDesigns = await Design.find()
      .populate('category', 'name')
      .sort({ likesCount: -1, viewsCount: -1 })
      .limit(6)
      .select('title likesCount viewsCount sharesCount price images');

    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('bookingId name eventType eventDate status createdAt');

    // Bookings count by status
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Monthly bookings aggregated over the current year
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const monthlyBookings = await Booking.aggregate([
      { $match: { createdAt: { $gte: startOfYear } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const formattedMonthly = monthNames.map((m, index) => {
      const match = monthlyBookings.find((item) => item._id === index + 1);
      return {
        month: m,
        bookings: match ? match.count : 0,
      };
    });

    // Share counts by platform
    const sharesByPlatform = await ShareAnalytics.aggregate([
      { $group: { _id: '$platform', count: { $sum: 1 } } },
    ]);

    return successResponse(
      res,
      {
        kpis: {
          totalDesigns,
          totalCategories,
          totalBookings,
          pendingBookings,
          completedBookings,
          totalInquiries,
          totalUsers,
          totalFavorites,
          totalShares,
        },
        popularDesigns,
        recentBookings,
        bookingsByStatus,
        monthlyBookings: formattedMonthly,
        sharesByPlatform,
      },
      'Dashboard analytics fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
