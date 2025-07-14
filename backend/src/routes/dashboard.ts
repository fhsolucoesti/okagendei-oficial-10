
import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { Company, User, Appointment } from '../models';
import { AuthRequest } from '../types';
import { Op } from 'sequelize';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    
    if (user.role === 'super_admin') {
      // Super admin dashboard
      const totalCompanies = await Company.count();
      const activeCompanies = await Company.count({ where: { status: 'active' } });
      const trialCompanies = await Company.count({ where: { status: 'trial' } });
      const totalUsers = await User.count();
      
      // Monthly revenue
      const companies = await Company.findAll({
        attributes: ['monthlyRevenue']
      });
      const totalRevenue = companies.reduce((sum, company) => sum + Number(company.monthlyRevenue), 0);
      
      // Recent companies
      const recentCompanies = await Company.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        attributes: ['id', 'name', 'status', 'createdAt']
      });

      res.json({
        totalCompanies,
        activeCompanies,
        trialCompanies,
        totalUsers,
        totalRevenue,
        recentCompanies
      });
    } else {
      // Company dashboard
      const companyId = user.companyId;
      if (!companyId) {
        return res.status(400).json({ error: 'Company ID not found' });
      }

      const totalAppointments = await Appointment.count({ where: { companyId } });
      const todayAppointments = await Appointment.count({
        where: {
          companyId,
          date: {
            [Op.gte]: new Date().toISOString().split('T')[0]
          }
        }
      });
      
      const completedAppointments = await Appointment.count({
        where: { companyId, status: 'completed' }
      });

      // This month revenue (mock calculation)
      const thisMonthRevenue = completedAppointments * 50; // Average price mock

      res.json({
        totalAppointments,
        todayAppointments,
        completedAppointments,
        thisMonthRevenue
      });
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
});

export default router;
