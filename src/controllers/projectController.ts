import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';
import { createProjectSchema, updateProjectSchema } from '../validators/projectValidator';

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsedData = createProjectSchema.parse(req.body);
    const userId = req.user!.id;

    // @ts-ignore
    const project = await prisma.project.create({
      data: {
        title: parsedData.title,
        description: parsedData.description,
        deadline: parsedData.deadline ? new Date(parsedData.deadline) : null,
        github_link: parsedData.github_link || null,
        creator_id: userId,
        members: {
          create: {
            user_id: userId,
            role: 'CREATOR',
          }
        }
      },
      include: {
        members: true
      }
    });

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const projects = await prisma.project.findMany({
      include: {
        creator: { select: { username: true, email: true } },
        members: { select: { user: { select: { username: true } }, role: true } },
        // @ts-ignore
        _count: { select: { members: true } }
      },
      orderBy: { created_at: 'desc' }
    });
    res.status(200).json({ projects });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const joinProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;
    const userId = req.user!.id;

    // Check if project exists and member count
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { _count: { select: { members: true } } }
    });

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (project.status !== 'OPEN') {
      res.status(400).json({ message: 'Project is not open for new members' });
      return;
    }

    // @ts-ignore
    if (project._count.members >= 5) {
      res.status(400).json({ message: 'Project has reached the maximum of 5 members' });
      return;
    }

    // Check if already a member
    const existingMember = await prisma.teamMember.findUnique({
      where: { project_id_user_id: { project_id: projectId, user_id: userId } }
    });

    if (existingMember) {
      res.status(400).json({ message: 'You are already a member of this project' });
      return;
    }

    // Here we could implement a pending request system, but for MVP we join directly
    // Or we add them as PENDING_MEMBER role. Let's do PENDING role.
    const member = await prisma.teamMember.create({
      data: {
        project_id: projectId,
        user_id: userId,
        role: 'PENDING',
      }
    });

    res.status(200).json({ message: 'Join request sent successfully', member });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateProjectMemberStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;
    const memberId = req.params.memberId as string;
    const { status } = req.body; // 'ACCEPTED' or 'REJECTED'
    const userId = req.user!.id;

    // Verify current user is the creator
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project || project.creator_id !== userId) {
      res.status(403).json({ message: 'Only the project creator can manage members' });
      return;
    }

    if (status === 'REJECTED') {
      await prisma.teamMember.delete({
        where: { id: memberId }
      });
      res.status(200).json({ message: 'Member request rejected' });
      return;
    }

    // Check member limit again before accepting
    const memberCount = await prisma.teamMember.count({
      where: { project_id: projectId, role: { not: 'PENDING' } }
    });

    if (memberCount >= 5) {
      res.status(400).json({ message: 'Project has already reached maximum active members' });
      return;
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id: memberId },
      data: { role: 'MEMBER' }
    });

    res.status(200).json({ message: 'Member accepted', member: updatedMember });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
