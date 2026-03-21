
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";


const API_HOST = "http://localhost:5000";
const API_BASE = `${API_HOST}/api/forum`;

function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newPostName, setNewPostName] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [commentNames, setCommentNames] = useState({});

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/posts`);
      if (!res.ok) throw new Error("Failed to load posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      setError("");
      const formData = new FormData();
      formData.append("content", newPost.trim());
      formData.append(
        "authorName",
        newPostName.trim() || "Anonymous"
      );
      if (newPostImage) {
        formData.append("image", newPostImage);
      }

      const res = await fetch(`${API_BASE}/create`, {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Failed to create post");
      setNewPost("");
      setNewPostName("");
      setNewPostImage(null);
      await fetchPosts();
    } catch (err) {
      setError(err.message || "Failed to create post");
    }
  };

  // const handleToggleLike = async (postId) => {
  //   try {
  //     setError("");
  //     const res = await fetch(`${API_BASE}/like/${postId}`, {
  //       method: "POST"
  //     });
  //     if (!res.ok) throw new Error("Failed to update like");
  //     const updated = await res.json();
  //     setPosts((prev) =>
  //       prev.map((p) => (p._id === updated._id ? updated : p))
  //     );
  //   } catch (err) {
  //     setError(err.message || "Failed to update like");
  //   }
  // };

  const handleAddComment = async (postId) => {
    const content = (commentInputs[postId] || "").trim();
    const authorName = (commentNames[postId] || "").trim();
    if (!content) return;
    try {
      setError("");
      const res = await fetch(`${API_BASE}/comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content,
          authorName: authorName || "User"
        })
      });
      if (!res.ok) throw new Error("Failed to add comment");
      const updated = await res.json();
      setPosts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setCommentNames((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      setError(err.message || "Failed to add comment");
    }
  };

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentNameChange = (postId, value) => {
    setCommentNames((prev) => ({ ...prev, [postId]: value }));
  };

  const handleDeletePost = async (postId) => {
  if (!window.confirm("Delete this post?")) return;
  try {
    const res = await fetch(`${API_BASE}/delete/${postId}`, { method: "DELETE" });
    if (res.ok) fetchPosts();
  } catch (err) {
    setError("Failed to delete post");
  }
};

const handleToggleLike = async (postId) => {
  try {
    // For now, using a placeholder 'me' or your Clerk user.id
    const userId = "user_123"; 
    const res = await fetch(`${API_BASE}/like/${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    const updated = await res.json();
    setPosts(prev => prev.map(p => p._id === updated._id ? updated : p));
  } catch (err) {
    setError("Failed to update like");
  }
};

  return (
    <div className="flex min-h-screen bg-[#f6f4ef]">
      <Sidebar />
      <div className="flex-1 p-10">
      <Navbar />
      
    <div className="bg-white p-6 rounded-2xl shadow-sm mt-8 mb-8">
      <h2 className="text-lg font-semibold mb-4">Community Forum</h2>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleCreatePost} className="mb-6 space-y-2">
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                className="w-40 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Your name (optional)"
                value={newPostName}
                onChange={(e) => setNewPostName(e.target.value)}
              />
              <textarea
                className="flex-1 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Share something with the community..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={2}
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewPostImage(e.target.files?.[0] || null)
              }
              className="text-xs text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newPost.trim()}
            className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg disabled:opacity-60 disabled:cursor-not-allowed hover:bg-green-600"
          >
            Post
          </button>
        </div>
      </form>

      {loading ? (
        <div className="py-4 text-sm text-gray-500">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="py-4 text-sm text-gray-500">
          No posts yet. Be the first to share!
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {posts.map((post) => (
            <div
              key={post._id}
              className="border border-gray-100 rounded-xl p-3 text-sm"
            >
              <div className="flex items-center justify-between mb-1.5">
               <div className="flex items-center gap-3">
                <span className="font-medium text-gray-800">
                  {post.authorName || "Anonymous"}
                </span>

                <button 
                  onClick={() => handleDeletePost(post._id)}
                  className="text-red-400 hover:text-red-600 text-[10px] uppercase font-bold tracking-wider"
                >
                  <svg 
                     xmlns="http://www.w3.org/2000/svg" 
                     fill="none" 
                     viewBox="0 0 24 24" 
                     strokeWidth={1.5} 
                     stroke="currentColor" 
                     className="w-5 h-5 text-red-500 group-hover:text-red-500 transition-colors"
                   >
                     <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                   </svg>
                </button>
               </div>
                <span className="text-[11px] text-gray-400">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
              </div>
              {post.imageUrl && (
                <div className="mb-2">
                  <img
                    src={`${API_HOST}${post.imageUrl}`}
                    alt="Post attachment"
                    className="w-full max-h-64 object-cover rounded-lg border border-gray-100"
                  />
                </div>
              )}
              <p className="text-gray-700 mb-2 whitespace-pre-line">
                {post.content}
              </p>
              <div className="flex items-center gap-4 mb-2 text-xs text-gray-500">
                <button
                  type="button"
                  onClick={() => handleToggleLike(post._id)}
                  className="flex items-center gap-1 hover:text-green-600"
                >
                  <span>❤️</span>
                  <span>{post.likes?.length || 0} likes</span>
                </button>
                <span>
                  {post.comments?.length || 0}{" "}
                  {post.comments?.length === 1 ? "comment" : "comments"}
                </span>
              </div>

              <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                {post.comments?.map((c, idx) => (
                  <div
                    key={c._id || `${post._id}-${idx}`}
                    className="text-xs text-gray-700 bg-gray-50 rounded-lg px-2 py-1"
                  >
                    <span className="font-medium">
                      {c.authorName || "User"}:
                    </span>{" "}
                    <span>{c.content}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  className="w-28 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
                  placeholder="Name"
                  value={commentNames[post._id] || ""}
                  onChange={(e) =>
                    handleCommentNameChange(post._id, e.target.value)
                  }
                />
                <input
                  type="text"
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
                  placeholder="Write a comment..."
                  value={commentInputs[post._id] || ""}
                  onChange={(e) =>
                    handleCommentInputChange(post._id, e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleAddComment(post._id)}
                  disabled={!(commentInputs[post._id] || "").trim()}
                  className="px-3 py-1 bg-gray-800 text-white text-xs rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
    </div>
  );
}

export default CommunityFeed;