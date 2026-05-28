import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { content, image_url } = req.body;

    if (!content) {
      res.status(400).json({ message: 'Content is required' });
      return;
    }

    const post = await prisma.post.create({
      data: {
        content,
        image_url,
        author_id: userId
      },
      include: { author: { select: { username: true, profile_picture: true } } }
    });

    res.status(201).json({ message: 'Post created', post });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        author: { select: { username: true, profile_picture: true } },
        comments: {
          include: { author: { select: { username: true } } },
          orderBy: { created_at: 'asc' }
        }
      }
    });

    res.status(200).json({ posts });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const postId = req.params.postId as string;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ message: 'Content is required' });
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        post_id: postId,
        author_id: userId
      },
      include: { author: { select: { username: true } } }
    });

    res.status(201).json({ message: 'Comment added', comment });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
