import * as dashboardService from './dashboard.service.js';

export const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getPublicDashboardStats();
    res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};