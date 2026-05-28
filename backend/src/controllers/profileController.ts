import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.params.userId as string) || req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, username: true, email: true, role: true, status: true,
        profile_picture: true, created_at: true,
        profile: true,
        projectsCreated: { select: { id: true, title: true, status: true } },
        teams: { include: { project: { select: { id: true, title: true, status: true } } } }
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { bio, skills, education, experience, github, profile_picture } = req.body;

    // Update or create profile
    const profile = await prisma.profile.upsert({
      where: { user_id: userId },
      update: { bio, skills, education, experience, github },
      create: { user_id: userId, bio, skills, education, experience, github }
    });

    if (profile_picture) {
      await prisma.user.update({
        where: { id: userId },
        data: { profile_picture }
      });
    }

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
