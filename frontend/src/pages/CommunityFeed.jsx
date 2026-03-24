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
const data = await res.json();
setPosts(data);
} catch (err) {
setError("Failed to load posts");
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


const formData = new FormData();
formData.append("content", newPost);
formData.append("authorName", newPostName || "Anonymous");
if (newPostImage) formData.append("image", newPostImage);

await fetch(`${API_BASE}/create`, {
  method: "POST",
  body: formData,
});

setNewPost("");
setNewPostName("");
setNewPostImage(null);
fetchPosts();


};

const handleAddComment = async (postId) => {
const content = commentInputs[postId];
if (!content) return;


const res = await fetch(`${API_BASE}/comment/${postId}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ content }),
});

const updated = await res.json();
setPosts((prev) =>
  prev.map((p) => (p._id === updated._id ? updated : p))
);
setCommentInputs((prev) => ({ ...prev, [postId]: "" }));


};

return ( <div className="flex min-h-screen bg-[#f6f4ef] dark:bg-black transition"> <Sidebar />


  <div className="flex-1 p-10">
    <Navbar />

    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 mt-8 mb-8">

      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Community Forum
      </h2>

      {/* CREATE POST */}
      <form onSubmit={handleCreatePost} className="mb-6 space-y-2">
        <div className="flex flex-col gap-2 md:flex-row">
          <input
            className="border rounded-xl px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-black dark:text-white border-gray-200 dark:border-gray-700"
            placeholder="Your name"
            value={newPostName}
            onChange={(e) => setNewPostName(e.target.value)}
          />
          <textarea
            className="flex-1 border rounded-xl p-3 text-sm bg-gray-50 dark:bg-gray-800 text-black dark:text-white border-gray-200 dark:border-gray-700"
            placeholder="Share something..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
        </div>

        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
          Post
        </button>
      </form>

      {/* POSTS */}
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 mb-4 shadow-sm hover:shadow-lg transition"
        >
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>{post.authorName}</span>
            <span>{new Date(post.createdAt).toLocaleString()}</span>
          </div>

          <p className="text-gray-800 dark:text-gray-200 mb-2">
            {post.content}
          </p>

          {/* COMMENTS */}
          <div className="space-y-1 mb-2">
            {post.comments?.map((c) => (
              <div
                key={c._id}
                className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
              >
                {c.content}
              </div>
            ))}
          </div>

          {/* ADD COMMENT */}
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-2 py-1 text-xs bg-gray-50 dark:bg-gray-800 text-black dark:text-white border-gray-200 dark:border-gray-700"
              placeholder="Add comment..."
              value={commentInputs[post._id] || ""}
              onChange={(e) =>
                setCommentInputs({
                  ...commentInputs,
                  [post._id]: e.target.value,
                })
              }
            />
            <button
              onClick={() => handleAddComment(post._id)}
              className="px-3 py-1 bg-gray-800 text-white rounded"
            >
              Send
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>


);
}

export default CommunityFeed;
