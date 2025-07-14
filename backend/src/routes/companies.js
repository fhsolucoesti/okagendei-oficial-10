
const express = require('express');
const { Company, User, Service, Professional, Appointment } = require('../models');
const { authenticateToken, authorizeRoles, authorizeCompany } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// Listar todas as empresas (Super Admin)
router.get('/', authenticateToken, authorizeRoles('super_admin'), async (req, res) => {
  try {
    const companies = await Company.findAll({
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'name', 'email', 'role']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(companies);
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter empresa específica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar permissão
    if (req.user.role !== 'super_admin' && req.user.companyId !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const company = await Company.findByPk(id, {
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'name', 'email', 'role']
        },
        {
          model: Service,
          as: 'services',
          where: { isActive: true },
          required: false
        },
        {
          model: Professional,
          as: 'professionals',
          where: { isActive: true },
          required: false
        }
      ]
    });

    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    res.json(company);
  } catch (error) {
    console.error('Erro ao obter empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar nova empresa
router.post('/', authenticateToken, authorizeRoles('super_admin'), validate(schemas.company), async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar empresa
router.put('/:id', authenticateToken, authorizeCompany, validate(schemas.company), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar permissão
    if (req.user.role !== 'super_admin' && req.user.companyId !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await Company.update(req.body, { where: { id } });
    res.json({ message: 'Empresa atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar empresa
router.delete('/:id', authenticateToken, authorizeRoles('super_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    await Company.destroy({ where: { id } });
    res.json({ message: 'Empresa deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas da empresa
router.get('/:id/stats', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar permissão
    if (req.user.role !== 'super_admin' && req.user.companyId !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const [appointmentsCount, servicesCount, professionalsCount] = await Promise.all([
      Appointment.count({ where: { companyId: id } }),
      Service.count({ where: { companyId: id, isActive: true } }),
      Professional.count({ where: { companyId: id, isActive: true } })
    ]);

    res.json({
      appointments: appointmentsCount,
      services: servicesCount,
      professionals: professionalsCount
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
