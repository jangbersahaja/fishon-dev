"use client";

import { useState } from "react";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    email: string;
    name?: string | null;
  };
  approved: boolean;
}

interface BlogCommentSectionProps {
  postId: string;
  comments: Comment[];
}

export default function BlogCommentSection({
  postId,
  comments,
}: BlogCommentSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Filter only approved comments
  const approvedComments = comments.filter((c) => c.approved);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          name,
          email,
          content,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Comment submitted! It will appear after approval.",
        });
        setName("");
        setEmail("");
        setContent("");
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.message || "Failed to submit comment. Please try again.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h3 className="mb-6 text-lg font-semibold">
        Comments ({approvedComments.length})
      </h3>

      {/* Comment List */}
      <div className="mb-8 space-y-6">
        {approvedComments.length === 0 ? (
          <p className="text-gray-600">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          approvedComments.map((comment) => (
            <div key={comment.id} className="rounded-lg bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {comment.author.name || comment.author.email}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Comment Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 text-lg font-semibold">Leave a Comment</h4>

        {message && (
          <div
            className={`mb-4 rounded-md p-4 ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#EC2227] focus:outline-none focus:ring-1 focus:ring-[#EC2227]"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#EC2227] focus:outline-none focus:ring-1 focus:ring-[#EC2227]"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Comment *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#EC2227] focus:outline-none focus:ring-1 focus:ring-[#EC2227]"
              placeholder="Share your thoughts..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-[#EC2227] px-6 py-2 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Post Comment"}
          </button>

          <p className="text-xs text-gray-500">
            Your comment will be reviewed before appearing on the site.
          </p>
        </form>
      </div>
    </div>
  );
}
