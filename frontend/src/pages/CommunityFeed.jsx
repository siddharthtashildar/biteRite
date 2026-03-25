import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useUser } from "@clerk/clerk-react";

const API_HOST = "http://localhost:5000";
const API_BASE = `${API_HOST}/api/forum`;

function CommunityFeed() {
  const { user } = useUser();
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

  const handleToggleUpvote = async (postId) => {
    if (!user) return alert("Please sign in to upvote!");
    try {
      const res = await fetch(`${API_BASE}/upvote/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });
      const updated = await res.json();
      setPosts(prev => prev.map(p => p._id === updated._id ? updated : p));
    } catch (err) {
      setError("Failed to upvote");
    }
  };

  const handleToggleLike = async (postId) => {
    if (!user) return alert("Please sign in to like!");
    try {
      const res = await fetch(`${API_BASE}/like/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });
      const updated = await res.json();
      setPosts(prev => prev.map(p => p._id === updated._id ? updated : p));
    } catch (err) {
      setError("Failed to update like");
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      setError("");
      const formData = new FormData();
      formData.append("content", newPost.trim());
      formData.append("authorName", newPostName.trim() || "Anonymous");
      if (newPostImage) {
        // This name MUST be "image" to match your router's upload.single("image")
        formData.append("image", newPostImage); 
      }
      const res = await fetch(`${API_BASE}/create`, {
        method: "POST",
        body: formData
      });
      
      if (res.ok) {
      setNewPost("");
      setNewPostName("");
      setNewPostImage(null);
      // Reset the file input field manually if needed
      e.target.reset(); 
      await fetchPosts(); // This pulls the fresh data with the new imageUrl
    }
  } catch (err) {
    setError("Failed to create post");
  }
  };

  const handleAddComment = async (postId) => {
    const content = (commentInputs[postId] || "").trim();
    const authorName = (commentNames[postId] || "").trim();
    if (!content) return;
    try {
      const res = await fetch(`${API_BASE}/comment/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, authorName: authorName || "User" })
      });
      const updated = await res.json();
      setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setCommentNames((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      setError("Failed to add comment");
    }
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

  return (
    <div className="flex min-h-screen bg-[#f6f4ef] dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 p-6 md:p-10">
        <Navbar />
        
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mt-8 mb-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Community Forum</h2>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}

          {/* Post Creation Form */}
          <form onSubmit={handleCreatePost} className="mb-8 space-y-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <div className="flex flex-col gap-3">
              <input
                type="text"
                className="w-full md:w-64 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-400 outline-none"
                placeholder="Your name (optional)"
                value={newPostName}
                onChange={(e) => setNewPostName(e.target.value)}
              />
              <textarea
                className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl p-4 text-sm focus:ring-2 focus:ring-green-400 outline-none transition-all"
                placeholder="Share a healthy recipe or tip..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
              />
              <div className="flex items-center justify-between">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewPostImage(e.target.files?.[0] || null)}
                  className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                <button
                  type="submit"
                  disabled={!newPost.trim()}
                  className="px-6 py-2 bg-green-500 text-white text-sm font-bold rounded-xl disabled:opacity-50 hover:bg-green-600 transition-all shadow-lg shadow-green-200 dark:shadow-none"
                >
                  Post to Feed
                </button>
              </div>
            </div>
          </form>

          {/* Posts Feed */}
          {loading ? (
            <div className="py-10 text-center text-gray-500 dark:text-gray-400 animate-pulse">Gathering community wisdom...</div>
          ) : posts.length === 0 ? (
            <div className="py-10 text-center text-gray-400">No posts yet. Start the conversation!</div>
          ) : (
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {posts.map((post) => (
                <div key={post._id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold">
                        {(post.authorName || "A")[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-100">{post.authorName || "Anonymous"}</h4>
                        <p className="text-[10px] text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeletePost(post._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>

                  {post.imageUrl && (
                    <div className="mb-4 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700">
                      <img
                        src={`${API_HOST}${post.imageUrl.startsWith('/') ? '' : '/'}${post.imageUrl}`}
                        alt="Post content"
                        className="w-full max-h-80 object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found'; }} 
                      />
                    </div>
                  )}

                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{post.content}</p>

                  <div className="flex items-center gap-6 pt-4 border-t border-gray-50 dark:border-gray-700">
                    <button
                      onClick={() => handleToggleUpvote(post._id)}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        post.upvotes?.includes(user?.id)
                          ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-900/30"
                      }`}
                    >
                      <span>🔼 Approve</span>
                      <span>{post.upvotes?.length || 0}</span>
                    </button>

                    <button
                      onClick={() => handleToggleLike(post._id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                        post.likes?.includes(user?.id) ? "text-red-500" : "text-gray-400 hover:text-red-400"
                      }`}
                    >
                      <span className="text-lg">{post.likes?.includes(user?.id) ? "❤️" : "🤍"}</span>
                      <span>{post.likes?.length || 0}</span>
                    </button>

                    <span className="text-xs text-gray-400 ml-auto">
                      {post.comments?.length || 0} comments
                    </span>
                  </div>

                  {/* Comments */}
                  <div className="mt-4 space-y-2">
                    {post.comments?.map((c, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl text-xs border border-transparent dark:border-gray-700">
                        <span className="font-bold text-green-600 dark:text-green-400">{c.authorName}: </span>
                        <span className="text-gray-700 dark:text-gray-300">{c.content}</span>
                      </div>
                    ))}
                    
                    <div className="flex gap-2 mt-3">
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-24 border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-2 py-1.5 text-[10px] outline-none"
                        value={commentNames[post._id] || ""}
                        onChange={(e) => setCommentNames(prev => ({ ...prev, [post._id]: e.target.value }))}
                      />
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-1.5 text-[10px] outline-none focus:ring-1 focus:ring-green-400"
                        value={commentInputs[post._id] || ""}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        disabled={!(commentInputs[post._id] || "").trim()}
                        className="bg-gray-800 dark:bg-green-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold disabled:opacity-50"
                      >
                        Send
                      </button>
                    </div>
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