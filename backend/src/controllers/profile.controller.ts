import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateProfileSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  sport: z.string().optional(),
  position: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  birthDate: z.string().optional(),
});

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        skills: true,
        resume: true,
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const data = updateProfileSchema.parse(req.body);

    const profile = await prisma.profile.findFirst({
      where: { userId: req.userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      },
      include: {
        skills: true,
        resume: true,
      },
    });

    res.json(updatedProfile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addSkill = async (req: AuthRequest, res: Response) => {
  try {
    const { name, level, description } = req.body;

    const profile = await prisma.profile.findFirst({
      where: { userId: req.userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const skill = await prisma.skill.create({
      data: {
        profileId: profile.id,
        name,
        level: parseInt(level),
        description,
      },
    });

    res.status(201).json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateResume = async (req: AuthRequest, res: Response) => {
  try {
    const { education, experience, achievements, certifications } = req.body;

    const profile = await prisma.profile.findFirst({
      where: { userId: req.userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const resume = await prisma.resume.upsert({
      where: { profileId: profile.id },
      update: {
        education,
        experience,
        achievements,
        certifications,
      },
      create: {
        profileId: profile.id,
        education,
        experience,
        achievements,
        certifications,
      },
    });

    res.json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const exploreProfiles = async (req: AuthRequest, res: Response) => {
  try {
    const { sport, type } = req.query;

    const profiles = await prisma.profile.findMany({
      where: {
        ...(sport && { sport: sport as string }),
        ...(type && { type: type as any }),
      },
      include: {
        skills: true,
        user: {
          select: {
            email: true,
          },
        },
      },
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
