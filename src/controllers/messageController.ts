import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { otherUserId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { sender_id: userId, receiver_id: otherUserId },
          { sender_id: otherUserId, receiver_id: userId }
        ]
      },
      orderBy: { timestamp: 'asc' }
    });

    res.status(200).json({ messages });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
