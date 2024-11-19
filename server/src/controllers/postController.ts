import { Request, Response, NextFunction } from "express";
import { Post } from "../models/Post";
import { AuthenticatedRequest } from "../types";

// Get all posts with pagination and filtering
export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await Post.find(query)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate("author", "name email");

    const total = await Post.countDocuments(query);

    res.status(200).json({
      posts,
      total,
      page: +page,
      limit: +limit,
    });
  } catch (error) {
    next(error); // Pass error to the global error handler
  }
};

// Create a new post
export const createPost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, content, tags } = req.body;
    const image = req.file?.path;

    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const newPost = new Post({
      title,
      content,
      tags,
      image,
      author: req.user.id,
    });

    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    next(error); // Pass error to the global error handler
  }
};
