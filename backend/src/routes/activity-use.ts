import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Create a new activity use
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { startTime, endTime, activityId } = req.body;
    const userId = req.user.id; // Get user ID from authenticated user

    const activityUse = await prisma.activityUse.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        activityId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        activity: true,
      },
    });

    res.json(activityUse);
  } catch (error) {
    console.error('Error creating activity use:', error);
    res.status(500).json({ error: 'Failed to create activity use' });
  }
});

// Get all activity uses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const activityUses = await prisma.activityUse.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        activity: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    res.json(activityUses);
  } catch (error) {
    console.error('Error fetching activity uses:', error);
    res.status(500).json({ error: 'Failed to fetch activity uses' });
  }
});

export default router;
