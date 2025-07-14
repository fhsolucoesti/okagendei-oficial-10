
import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validate, companySchema } from '../middleware/validation';
import { Company, User } from '../models';
import { AuthRequest } from '../types';

const router = express.Router();

// Get all companies (Super Admin only)
router.get('/', authenticateToken, requireRole(['super_admin']), async (req, res) => {
  try {
    const companies = await Company.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ companies });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Failed to get companies' });
  }
});

// Get company by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    // Check permissions
    if (req.user!.role !== 'super_admin' && req.user!.companyId !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({ company });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ error: 'Failed to get company' });
  }
});

// Create company (Super Admin only)
router.post('/', authenticateToken, requireRole(['super_admin']), validate(companySchema), async (req, res) => {
  try {
    const company = await Company.create({
      ...req.body,
      status: 'active',
      employees: 1,
      monthlyRevenue: 0
    });

    res.status(201).json({
      message: 'Company created successfully',
      company
    });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// Update company
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    // Check permissions
    if (req.user!.role !== 'super_admin' && req.user!.companyId !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    await company.update(req.body);
    
    res.json({
      message: 'Company updated successfully',
      company
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// Delete company (Super Admin only)
router.delete('/:id', authenticateToken, requireRole(['super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    await company.destroy();
    
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

export default router;
