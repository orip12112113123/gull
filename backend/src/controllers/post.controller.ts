import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

const prisma = new PrismaClient();

const createPostSchema = z.object({
  type: z.enum(['TEXT', 'IMAGE', 'VIDEO']),
  content: z.string().optional(),
  mediaUrl: z.string().optional(),
});

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { type, content, mediaUrl } = createPostSchema.parse(req.body);

    const post = await prisma.post.create({
      data: {
        userId: req.userId!,
        type,
        content,
        mediaUrl,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFeed = async (req: AuthRequest, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        likes: true,
        comments: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    const like = await prisma.like.create({
      data: {
        userId: req.userId!,
        postId,
      },
    });

    res.status(201).json(like);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const unlikePost = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    await prisma.like.deleteMany({
      where: {
        userId: req.userId!,
        postId,
      },
    });

    res.json({ message: 'Post unliked' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const commentOnPost = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.create({
      data: {
        userId: req.userId!,
        postId,
        content,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
