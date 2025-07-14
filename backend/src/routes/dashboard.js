
const express = require('express');
const { Op } = require('sequelize');
const { Company, User, Service, Professional, Appointment, Client } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Estatísticas gerais (Super Admin)
router.get('/admin/stats', authenticateToken, authorizeRoles('super_admin'), async (req, res) => {
  try {
    const [companiesCount, usersCount, totalRevenue, activeCompanies] = await Promise.all([
      Company.count(),
      User.count(),
      Company.sum('monthlyRevenue'),
      Company.count({ where: { status: 'active' } })
    ]);

    res.json({
      companies: companiesCount,
      users: usersCount,
      revenue: totalRevenue || 0,
      activeCompanies
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas da empresa
router.get('/company/stats', authenticateToken, async (req, res) => {
  try {
    const companyId = req.user.companyId;
    
    if (!companyId) {
      return res.status(400).json({ error: 'Empresa não encontrada' });
    }

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [
      totalAppointments,
      monthlyAppointments,
      totalClients,
      totalServices,
      totalProfessionals,
      monthlyRevenue
    ] = await Promise.all([
      Appointment.count({ where: { companyId } }),
      Appointment.count({
        where: {
          companyId,
          date: {
            [Op.between]: [startOfMonth, endOfMonth]
          }
        }
      }),
      Client.count({ where: { companyId } }),
      Service.count({ where: { companyId, isActive: true } }),
      Professional.count({ where: { companyId, isActive: true } }),
      Appointment.sum('price', {
        where: {
          companyId,
          date: {
            [Op.between]: [startOfMonth, endOfMonth]
          },
          status: 'completed'
        }
      })
    ]);

    res.json({
      totalAppointments,
      monthlyAppointments,
      totalClients,
      totalServices,
      totalProfessionals,
      monthlyRevenue: monthlyRevenue || 0
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas da empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Próximos agendamentos
router.get('/appointments/upcoming', authenticateToken, async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const today = new Date();
    
    const appointments = await Appointment.findAll({
      where: {
        companyId,
        date: {
          [Op.gte]: today
        },
        status: 'scheduled'
      },
      include: [
        {
          model: Professional,
          as: 'professional',
          attributes: ['name']
        },
        {
          model: Service,
          as: 'service',
          attributes: ['name']
        }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']],
      limit: 10
    });

    res.json(appointments);
  } catch (error) {
    console.error('Erro ao obter próximos agendamentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
