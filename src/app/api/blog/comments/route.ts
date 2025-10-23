import { prisma } from "@/lib/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, name, email, content } = body;

    // Validate required fields
    if (!postId || !name || !email || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    // Find or create user for the commenter
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create a new user for the commenter
      // Note: This creates a user without a password (for comment-only accounts)
      user = await prisma.user.create({
        data: {
          email,
          name: name,
          // passwordHash is optional for OAuth/comment-only users
        },
      });
    } else if (!user.name) {
      // Update display name if not set
      user = await prisma.user.update({
        where: { email },
        data: { name: name },
      });
    }

    // Create the comment (pending approval)
    const comment = await prisma.blogComment.create({
      data: {
        content,
        authorId: user.id,
        postId,
        approved: false, // Requires admin approval
      },
    });

    return NextResponse.json(
      {
        message: "Comment submitted successfully",
        comment: {
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
