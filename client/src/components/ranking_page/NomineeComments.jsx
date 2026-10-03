import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import {
  FiChevronDown,
  FiChevronUp,
  FiMoreVertical,
  FiThumbsUp,
} from "react-icons/fi";

const MAX_DEPTH = 2;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "liked", label: "Most Liked" },
];

function SortIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="15" y2="12" />
      <line x1="4" y1="18" x2="10" y2="18" />
    </svg>
  );
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const minutes = Math.floor((now - date) / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  if (date >= startOfYesterday) return "Yesterday";

  const days = Math.floor((startOfToday - date) / 86400000);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function compareComments(a, b, sort) {
  if (sort === "oldest") {
    return new Date(a.createdAt) - new Date(b.createdAt);
  }
  if (sort === "liked") {
    return (
      b.likes.length - a.likes.length ||
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
  return new Date(b.createdAt) - new Date(a.createdAt);
}

function countAllReplies(node) {
  return (node.replies || []).reduce(
    (sum, child) => sum + 1 + countAllReplies(child),
    0,
  );
}

// Builds the comment tree (max 2 levels). Anything deeper attaches
// to the latest visible reply level instead of nesting further.
function buildTree(comments, sort) {
  const byParent = {};
  comments.forEach((c) => {
    const key = c.parentCommentId || "root";
    (byParent[key] = byParent[key] || []).push(c);
  });

  const collectDescendants = (commentId, list) => {
    (byParent[commentId] || []).forEach((child) => {
      list.push({ ...child, depth: MAX_DEPTH, replies: [], totalReplies: 0 });
      collectDescendants(child._id, list);
    });
  };

  const build = (parentId, depth) => {
    const nodes = [];
    (byParent[parentId] || []).forEach((c) => {
      const node = { ...c, depth, replies: [], totalReplies: 0 };
      if (depth < MAX_DEPTH) {
        node.replies = build(c._id, depth + 1);
      } else {
        collectDescendants(c._id, nodes);
      }
      node.totalReplies = countAllReplies(node);
      nodes.push(node);
    });
    return nodes.sort((a, b) => compareComments(a, b, sort));
  };

  return build("root", 0);
}

function Avatar({ name, picture, className = "w-10 h-10" }) {
  const [failed, setFailed] = useState(false);

  if (picture && !failed) {
    return (
      <img
        src={picture}
        alt={name || "User"}
        onError={() => setFailed(true)}
        className={`${className} rounded-full object-cover shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${className} rounded-full bg-[#272727] flex items-center justify-center text-[12px] font-medium text-[#F1F1F1] shrink-0 select-none`}
    >
      {getInitials(name)}
    </div>
  );
}

export default function NomineeComments({ nomineeId, categoryId }) {
  const { user, token } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [postingKey, setPostingKey] = useState(null); // "main" | commentId | "edit-<id>"
  const [replyTo, setReplyTo] = useState(null); // { id, name }
  const [replyText, setReplyText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [sort, setSort] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [likingId, setLikingId] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const mainTextareaRef = useRef(null);
  const replyTextareaRef = useRef(null);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const loadComments = async () => {
    if (!nomineeId) return;
    try {
      const res = await fetch(`/api/rankings/comments/${nomineeId}`);
      const data = await res.json();
      if (res.ok) setComments(data.comments || []);
    } catch {
      // keep whatever we have
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!nomineeId) return undefined;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/rankings/comments/${nomineeId}`);
        const data = await res.json();
        if (!cancelled && res.ok) setComments(data.comments || []);
      } catch {
        // ignore errors on initial load
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [nomineeId]);

  useEffect(() => {
    const closeMenus = () => {
      setOpenMenuId(null);
      setSortOpen(false);
    };
    document.addEventListener("click", closeMenus);
    return () => document.removeEventListener("click", closeMenus);
  }, []);

  const autoGrow = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const getDepth = (commentId) => {
    let depth = 0;
    let current = comments.find((c) => c._id === commentId);
    while (current && current.parentCommentId) {
      depth += 1;
      current = comments.find((c) => c._id === current.parentCommentId);
      if (depth > 10) break;
    }
    return depth;
  };

  const requireAuth = (action) => {
    if (token && user) return true;
    showSnackbar(`Sign in to ${action}`);
    return false;
  };

  const submitComment = async (key, parentCommentId, value) => {
    const trimmed = value.trim();
    if (!trimmed || postingKey) return false;

    setPostingKey(key);
    try {
      const res = await fetch("/api/rankings/comments", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          categoryId,
          nomineeId,
          parentCommentId,
          text: trimmed,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComments((prev) => [...prev, data.comment]);
      return true;
    } catch {
      showSnackbar("Failed to post comment");
      return false;
    } finally {
      setPostingKey(null);
    }
  };

  const handlePostMain = async () => {
    if (!requireAuth("comment")) return;
    const posted = await submitComment("main", null, text);
    if (posted) {
      setText("");
      if (mainTextareaRef.current)
        mainTextareaRef.current.style.height = "auto";
    }
  };

  const openReply = (c) => {
    if (!requireAuth("reply")) return;
    setReplyTo({ id: c._id, name: c.user?.name || "user" });
    setReplyText("");
    setOpenMenuId(null);
    setTimeout(() => autoGrow(replyTextareaRef.current), 0);
  };

  const handlePostReply = async () => {
    if (!replyTo) return;

    // Replies past max depth attach to the latest visible reply level
    const target = comments.find((c) => c._id === replyTo.id);
    let parentId = replyTo.id;
    if (target && getDepth(target._id) >= MAX_DEPTH && target.parentCommentId) {
      parentId = target.parentCommentId;
    }

    const posted = await submitComment(replyTo.id, parentId, replyText);
    if (posted) {
      // Auto-expand the root comment thread so the newly posted reply is visible
      let curr = comments.find((c) => c._id === parentId);
      let rootId = parentId;
      while (curr && curr.parentCommentId) {
        rootId = curr.parentCommentId;
        curr = comments.find((c) => c._id === curr.parentCommentId);
      }
      setExpandedReplies((prev) => ({ ...prev, [rootId]: true }));
      setReplyTo(null);
      setReplyText("");
    }
  };

  const handleLike = async (c) => {
    if (!requireAuth("like")) return;

    setLikingId(c._id);
    try {
      const res = await fetch(`/api/rankings/comments/${c._id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const uid = user?._id ? String(user._id) : null;
      setComments((prev) =>
        prev.map((x) => {
          if (x._id !== c._id) return x;
          let likes = x.likes.filter((id) => id !== uid);
          if (data.liked && uid) likes = [...likes, uid];
          return { ...x, likes };
        }),
      );
    } catch {
      showSnackbar("Failed to update like");
    } finally {
      setLikingId(null);
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditText(c.text);
    setOpenMenuId(null);
  };

  const handleSaveEdit = async (c) => {
    const trimmed = editText.trim();
    if (!trimmed || postingKey) return;

    setPostingKey(`edit-${c._id}`);
    try {
      const res = await fetch(`/api/rankings/comments/${c._id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ text: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComments((prev) =>
        prev.map((x) =>
          x._id === c._id ? { ...x, text: data.comment.text, edited: true } : x,
        ),
      );
      setEditingId(null);
      setEditText("");
    } catch {
      showSnackbar("Failed to edit comment");
    } finally {
      setPostingKey(null);
    }
  };

  const handleDelete = async (c) => {
    setOpenMenuId(null);
    if (!window.confirm("Delete this comment?")) return;

    try {
      const res = await fetch(`/api/rankings/comments/${c._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      if (replyTo?.id === c._id) setReplyTo(null);
      if (editingId === c._id) setEditingId(null);
      await loadComments();
    } catch {
      showSnackbar("Failed to delete comment");
    }
  };

  const handleReport = async (c) => {
    setOpenMenuId(null);
    if (!requireAuth("report")) return;

    try {
      const res = await fetch(`/api/rankings/comments/${c._id}/report`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      showSnackbar("Report submitted. Thank you!");
    } catch {
      showSnackbar("Failed to submit report");
    }
  };

  const renderComment = (c) => {
    const isOwner =
      user && c.user?._id && String(c.user._id) === String(user._id);
    const liked = user && c.likes.includes(String(user._id));
    const isEditing = editingId === c._id;
    const isReply = c.depth > 0;
    const showRepliesToggle = !isReply && c.totalReplies > 0;
    const isExpanded = !!expandedReplies[c._id];

    const indent =
      c.depth === 1
        ? "ml-8 pl-4 border-l border-[#272727]"
        : c.depth === 2
          ? "ml-6 pl-4 border-l border-[#272727]"
          : "";

    return (
      <div key={c._id} className={indent}>
        <div className="flex items-stretch gap-3 px-4 py-3">
          <div className="relative flex flex-col items-center shrink-0">
            <Avatar
              name={c.user?.name}
              picture={c.user?.picture}
              className={isReply ? "w-6 h-6" : "w-10 h-10"}
            />
            {showRepliesToggle && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-11 bottom-[17px] left-[19px] w-7 border-l-[1.5px] border-b-[1.5px] border-[#3F3F3F] rounded-bl-[12px]"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Username + timestamp + more menu */}
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-[#F1F1F1] truncate">
                {c.user?.name || "Unknown User"}
              </span>
              <span className="text-[12px] font-normal text-[#AAAAAA] shrink-0">
                {formatTime(c.createdAt)}
                {c.edited ? " (edited)" : ""}
              </span>

              <div className="relative ml-auto shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === c._id ? null : c._id);
                  }}
                  className="rounded-full p-1.5 text-[#AAAAAA] hover:bg-white/10 hover:text-[#F1F1F1] transition"
                  aria-label="Comment options"
                >
                  <FiMoreVertical className="w-4 h-4" />
                </button>
                {openMenuId === c._id && (
                  <div
                    className="absolute right-0 top-8 z-30 w-32 rounded-lg border border-[#3F3F3F] bg-[#272727] py-1 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isOwner ? (
                      <>
                        <button
                          type="button"
                          onClick={() => startEdit(c)}
                          className="w-full text-left px-4 py-1.5 text-[12px] text-[#F1F1F1] hover:bg-white/10 transition"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c)}
                          className="w-full text-left px-4 py-1.5 text-[12px] text-[#F28B82] hover:bg-white/10 transition"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleReport(c)}
                        className="w-full text-left px-4 py-1.5 text-[12px] text-[#F1F1F1] hover:bg-white/10 transition"
                      >
                        Report
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Comment text / inline edit */}
            {isEditing ? (
              <div className="mt-1.5">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={2}
                  autoFocus
                  className="w-full resize-none rounded border border-[#303030] bg-transparent px-2 py-1.5 text-[14px] leading-5 text-[#F1F1F1] focus:border-[#F1F1F1] focus:outline-none"
                />
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    disabled={!editText.trim() || !!postingKey}
                    onClick={() => handleSaveEdit(c)}
                    className="rounded-full bg-[#3EA6FF] px-4 py-1.5 text-[12px] font-medium text-[#0F0F0F] hover:brightness-110 disabled:bg-transparent disabled:text-[#AAAAAA] disabled:cursor-not-allowed transition"
                  >
                    {postingKey === `edit-${c._id}` ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEditText("");
                    }}
                    className="rounded-full px-3 py-1.5 text-[12px] font-medium text-[#F1F1F1] hover:bg-white/10 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-[14px] font-normal leading-5 text-[#F1F1F1] whitespace-pre-wrap break-words">
                {c.text}
              </p>
            )}

            {/* Like + Reply */}
            <div className="flex items-center gap-4 mt-2">
              <button
                type="button"
                onClick={() => handleLike(c)}
                disabled={likingId === c._id}
                className={`flex items-center gap-1 text-[12px] font-medium transition disabled:opacity-50 ${
                  liked
                    ? "text-[#D6A125]"
                    : "text-[#AAAAAA] hover:text-[#F1F1F1]"
                }`}
                title={liked ? "Unlike" : "Like"}
              >
                <FiThumbsUp className="w-4 h-4" />
                <span>{c.likes.length}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  replyTo?.id === c._id ? setReplyTo(null) : openReply(c)
                }
                className="rounded-full px-2 py-1 text-[12px] font-medium text-[#AAAAAA] hover:bg-white/10 hover:text-[#F1F1F1] transition"
              >
                Reply
              </button>
            </div>

            {/* Reply composer */}
            {replyTo?.id === c._id && (
              <div className="flex items-start gap-3 mt-3">
                <Avatar
                  name={user?.name}
                  picture={user?.profilePicture}
                  className="w-6 h-6"
                />
                <div className="flex-1 min-w-0">
                  <textarea
                    ref={replyTextareaRef}
                    rows={1}
                    value={replyText}
                    placeholder="Share your thoughts..."
                    onChange={(e) => {
                      setReplyText(e.target.value);
                      autoGrow(e.target);
                    }}
                    className="w-full resize-none overflow-hidden border-b border-[#272727] bg-transparent px-0 py-1.5 text-[14px] leading-5 text-[#F1F1F1] placeholder:text-[#AAAAAA] focus:border-[#F1F1F1] focus:outline-none transition-colors"
                  />
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setReplyTo(null);
                        setReplyText("");
                      }}
                      className="rounded-full px-3 py-1.5 text-[12px] font-medium text-[#F1F1F1] hover:bg-white/10 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!replyText.trim() || !!postingKey}
                      onClick={handlePostReply}
                      className="rounded-full bg-[#3EA6FF] px-4 py-1.5 text-[12px] font-medium text-[#0F0F0F] hover:brightness-110 disabled:bg-transparent disabled:text-[#AAAAAA] disabled:cursor-not-allowed transition"
                    >
                      {postingKey === replyTo.id ? "Posting..." : "Post Reply"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Total replies toggle (YouTube style) */}
            {showRepliesToggle && (
              <div className="mt-1.5">
                <button
                  type="button"
                  onClick={() => toggleReplies(c._id)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 -ml-1 text-[13px] font-normal text-[#F1F1F1] hover:bg-white/10 transition"
                >
                  <span>
                    {c.totalReplies}{" "}
                    {c.totalReplies === 1 ? "reply" : "replies"}
                  </span>
                  {isExpanded ? (
                    <FiChevronUp className="w-4 h-4" />
                  ) : (
                    <FiChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Nested replies */}
        {(isReply || isExpanded) && c.replies.map(renderComment)}
      </div>
    );
  };

  if (!nomineeId) return null;

  const tree = buildTree(comments, sort);

  return (
    <section
      style={{ fontFamily: "Roboto, Arial, sans-serif" }}
      className="select-text rounded-[12px] border border-[#272727] bg-[#0F0F0F] pt-3 pb-1"
    >
      {/* Section header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4">
        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-[18px] font-bold text-[#F1F1F1]">
              Community Discussion
            </h3>
            {comments.length > 0 && (
              <span className="text-[18px] font-bold text-[#F1F1F1]">
                {comments.length}
              </span>
            )}
          </div>
          <p className="text-[12px] text-[#AAAAAA] mt-0.5">
            Share your thoughts about this ranking.
          </p>
        </div>

        {comments.length > 0 && (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[14px] font-medium text-[#F1F1F1] hover:bg-white/10 transition"
            >
              <SortIcon className="w-5 h-5" />
              Sort by
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 z-30 w-40 rounded-lg border border-[#3F3F3F] bg-[#272727] py-1 shadow-xl">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSort(option.value);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-1.5 text-[14px] transition hover:bg-white/10 ${
                      sort === option.value
                        ? "text-[#D6A125] font-medium"
                        : "text-[#F1F1F1]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comment composer */}
      <div className="mt-3 px-4 pb-3">
        {token && user ? (
          <div className="flex items-start gap-3">
            <Avatar
              name={user.name}
              picture={user.profilePicture}
              className="w-10 h-10"
            />
            <div className="flex-1 min-w-0">
              <textarea
                ref={mainTextareaRef}
                rows={1}
                value={text}
                placeholder="Share your thoughts..."
                onChange={(e) => {
                  setText(e.target.value);
                  autoGrow(e.target);
                }}
                className="w-full resize-none overflow-hidden border-b border-[#272727] bg-transparent px-0 py-1.5 text-[14px] leading-5 text-[#F1F1F1] placeholder:text-[#AAAAAA] focus:border-[#F1F1F1] focus:outline-none transition-colors"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!text.trim() || !!postingKey}
                  onClick={handlePostMain}
                  className="flex items-center gap-2 rounded-full bg-[#3EA6FF] px-4 py-2 mt-2 text-[12px] font-medium text-[#0F0F0F] hover:brightness-110 disabled:bg-transparent disabled:text-[#AAAAAA] disabled:cursor-not-allowed transition"
                >
                  {postingKey === "main" && (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  )}
                  {postingKey === "main" ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#272727] px-4 py-3">
            <span className="text-[14px] text-[#AAAAAA]">
              Sign in to join the discussion.
            </span>
            <Link
              to="/login"
              className="rounded-full border border-[#3EA6FF] px-4 py-1.5 text-[12px] font-medium text-[#3EA6FF] hover:bg-[#3EA6FF]/10 transition"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Comment list */}
      <div className="border-t border-[#272727] pt-1">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-[#D6A125]" />
          </div>
        ) : tree.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[14px] text-[#F1F1F1] font-normal">
              No discussions yet.
            </p>
            <p className="text-[12px] text-[#AAAAAA] mt-1">
              Be the first to share your thoughts about this ranking.
            </p>
          </div>
        ) : (
          <div className="pb-1">{tree.map(renderComment)}</div>
        )}
      </div>
    </section>
  );
}
