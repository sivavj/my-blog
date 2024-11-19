import { Request, Response } from "express";
import { Comment } from "../models/Comment";

// Create comment
export const createComment = async (req: Request, res: Response) => {
  const { content, postId, user } = req.body;
  try {
    const newComment = new Comment({
      content,
      postId,
      author: user._id,
    });

    await newComment.save();
    res
      .status(201)
      .json({ message: "Comment created successfully", comment: newComment });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong while creating the comment." });
  }
};

// Get comments for a post
export const getComments = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId }).populate(
      "author",
      "username"
    );
    res.json({ comments });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong while fetching comments." });
  }
};
