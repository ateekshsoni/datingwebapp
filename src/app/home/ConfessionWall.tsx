"use client";

import { useState, useEffect, useRef } from "react";
import {
  confessionService,
  type Confession,
} from "@/app/service/ConfessionService";
import { HeartIcon, LaughIcon, Frown } from "lucide-react";

export default function ConfessionWall() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [reactions, setReactions] = useState<Record<number, string>>({});
  const [comments, setComments] = useState<Record<number, string[]>>({});
  const [newComment, setNewComment] = useState<Record<number, string>>({});
  const likeAnimation = useRef<HTMLElement | null>(null);
  // Subscribe to confessions on component mount
  useEffect(() => {
    const unsubscribe =
      confessionService.subscribeToConfessions(setConfessions);
    return () => unsubscribe();
  }, []);

  // Fetch comments for a specific confession
  const fetchComments = async (confessionId: string, index: number) => {
    try {
      const res = await fetch(
        `/api/comment/comments?confessionId=${confessionId}`
      );
      const data = await res.json();

      setComments((prev) => ({
        ...prev,
        [index]: data.map((c: any) => c.comment),
      }));
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // Fetch comments whenever confessions change
  useEffect(() => {
    confessions.forEach((confession, index) =>
      fetchComments(confession.name, index)
    );
  }, [confessions]);

  // Handle comment submission
  const handleCommentSubmit = async (confessionId: string, index: number) => {
    try {
      const res = await fetch(`/api/comment/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confessionId,
          comment: newComment[index],
        }),
      });

      if (res.ok) {
        const commentData = await res.json();
        setComments((prev) => ({
          ...prev,
          [index]: [...prev[index], commentData.comment],
        }));
        setNewComment((prev) => ({ ...prev, [index]: "" }));
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  // Handle emoji reactions
  const handleReaction = (index: number, emoji: string) => {
    setReactions((prev) => ({ ...prev, [index]: emoji }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
      <h1 className="text-4xl font-extrabold text-white">Confession Wall</h1>

      <div className="grid gap-6 w-full max-w-3xl mt-8">
        {confessions.map((confession, index) => (
          <div
            key={index}
            className="relative p-6 rounded-xl  bg-white/10 backdrop-blur-lg shadow-lg border border-white/20 text-white
            before:absolute before:-bottom-5 before:right-6 before:w-0 before:h-0 
            before:border-t-[20px] before:border-t-white/10 
            before:border-r-[20px] before:border-r-transparent 
            before:border-l-[10px] before:border-l-transparent"
          >
            <div className="text-left text-lg font-medium">
              {confession.message}
            </div>

            <div className="absolute bottom-4 left-5 text-xs text-gray-400">
              {new Date(confession.timestamp).toLocaleString("en-US", {
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            <div className="text-right text-sm w-full font-semibold text-gray-300">
              {`- ${confession.name}`}
            </div>
            <div className="flex absolute -bottom-8 mb-2">
            <button 
              className=""
              onClick={() => {
              const icon = likeAnimation.current;
              if (icon && icon.classList.contains('ri-poker-hearts-line')) {
                icon.classList.remove('ri-poker-hearts-line');
                icon.classList.add('ri-poker-heartst-fill', 'text-red-600');
              } else if (icon) {
                icon.classList.remove('ri-poker-hearts-fill', 'text-red-600');
                icon.classList.add('ri-poker-hearts-line');
              }
              }}
            >
              <i
              ref={likeAnimation}
              className="ri-poker-hearts-line h-10 w-10"
              ></i>
            </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
