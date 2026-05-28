import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';

export const getPendingUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      where: { status: 'PENDING_APPROVAL' },
      select: { id: true, username: true, email: true, created_at: true, resume_url: true }
    });
    res.status(200).json({ users });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const targetUserId = req.params.targetUserId as string;
    const status = req.body.status as string;
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { status }
    });

    res.status(200).json({ message: `User status updated to ${status}`, user: { id: updatedUser.id, status: updatedUser.status } });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getSystemStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await prisma.user.count();
    const activeProjects = await prisma.project.count({ where: { status: 'IN_PROGRESS' } });
    const pendingUsers = await prisma.user.count({ where: { status: 'PENDING_APPROVAL' } });
    
    res.status(200).json({ stats: { totalUsers, activeProjects, pendingUsers } });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
