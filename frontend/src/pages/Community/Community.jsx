import { useState, useEffect } from "react";
import { MessageSquare, Heart, X } from "lucide-react";
import "./Community.css";
import Navbar from "@/components/Navbar";
import { io } from "socket.io-client";
import axios from "axios";
import GenderScan from "@/components/GenderScan";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("recent");
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTags, setSearchTags] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [socket, setSocket] = useState(null);
  const [verified, setVerified] = useState(false);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    localStorage.removeItem("gender");
    setVerified(false);
    setScanning(true);
  }, []);

  const handleVerification = (isFemale) => {
    if (isFemale) {
      localStorage.setItem("gender", "female");
      setVerified(true);
      setScanning(false);
    } else {
      alert("🚫 Access denied! Only women can join this community.");
      localStorage.setItem("gender", "male");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    if (!verified) return;

    const newSocket = io("https://pcod-healthcare.onrender.com");
    setSocket(newSocket);

    axios
      .get("https://pcod-healthcare.onrender.com/api/community")
      .then((res) => {
        console.log("📥 Fetched posts:", res.data);
        setPosts(res.data);
      })
      .catch((err) => console.error("❌ Error fetching posts:", err));

    newSocket.on("postCreated", (post) => {
      console.log("📢 New post received:", post);
      setPosts((prev) => [post, ...prev]);
    });

    return () => newSocket.close();
  }, [verified]);

  if (scanning) {
    return <GenderScan onVerified={handleVerification} />;
  }

  const categoryIcons = {
    Relationships: "❤️",
    "Career & Business": "💼",
    "Health & Wellness": "🧘",
    Education: "📚",
    Parenting: "👶",
  };

  const trendingTags = [
    "#WomenInTech",
    "#SelfCare",
    "#WorkLife",
    "#Wellness",
    "#Motivation",
  ];

  const categories = [
    "Relationships",
    "Career & Business",
    "Health & Wellness",
    "Education",
    "Parenting",
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesTags =
      searchTags.length === 0 ||
      searchTags.some((tag) => post.tags?.includes(tag));
    return matchesCategory && matchesTags;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (activeTab === "recent") {
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (activeTab === "popular") {
      return (b.likes || 0) + (b.comments || 0) - ((a.likes || 0) + (a.comments || 0));
    }
    return (b.comments || 0) - (a.comments || 0);
  });

  const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return date.toLocaleString("en-IN", options);
};

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => setTags(tags.filter((t) => t !== tag));

  const handleSearchTagInput = (e) => {
    if (e.key === "Enter" && searchInput.trim()) {
      if (!searchTags.includes(searchInput.trim())) {
        setSearchTags([...searchTags, searchInput.trim()]);
      }
      setSearchInput("");
    }
  };

  const handleRemoveSearchTag = (tag) =>
    setSearchTags(searchTags.filter((t) => t !== tag));

  const handleTrendingTagClick = (tag) => {
    const cleanTag = tag.replace("#", "");
    if (!searchTags.includes(cleanTag)) {
      setSearchTags([...searchTags, cleanTag]);
    }
  };

  const resetForm = () => {
    setStep(1);
    setCategory("");
    setContent("");
    setTags([]);
    setTagInput("");
  };

  const handleSubmit = async () => {
    if (category && content) {
      try {
        const username = localStorage.getItem("username") || "CameraVerifiedUser";
        const gender = localStorage.getItem("gender") || "unknown";

        console.log("📤 Sending gender:", gender);

        const res = await axios.post(
          "https://pcod-healthcare.onrender.com/api/community",
          { category, content, tags, authorName: username },
          {
            headers: { "x-user-gender": gender },
          }
        );

        console.log("✅ Post created:", res.data);

        socket.emit("newPost", res.data);

        resetForm();
        setIsNewPostOpen(false);
        alert("✨ Post published successfully!");
      } catch (err) {
        console.error("Error posting:", err);
        alert("⚠️ Error creating post. Are you logged in as a female user?");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-screen community-container">
        <div className="community-wrapper">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-section">
              <h2 className="sidebar-title">Categories</h2>
              <ul className="category-list">
                <li
                  className={`category-item ${
                    selectedCategory === "All" ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory("All")}
                >
                  All Categories
                </li>
                {categories.map((cat) => (
                  <li
                    key={cat}
                    className={`category-item ${
                      selectedCategory === cat ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <span className="category-icon">{categoryIcons[cat]}</span>
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-section">
              <h2 className="sidebar-title">Trending Tags</h2>
              <div className="trending-tags">
                {trendingTags.map((tag) => (
                  <span
                    key={tag}
                    className="tag"
                    onClick={() => handleTrendingTagClick(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="sidebar-subtitle">Search Tags</h3>
              <input
                type="text"
                className="tag-input"
                placeholder="Enter tags..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchTagInput}
              />

              {searchTags.length > 0 && (
                <div className="search-tags">
                  {searchTags.map((tag) => (
                    <span key={tag} className="tag active">
                      {tag}
                      <button
                        className="tag-remove"
                        onClick={() => handleRemoveSearchTag(tag)}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Feed */}
          <div className="main-content">
            <div className="feed-header">
              <h1 className="feed-title">Community Feed</h1>
              <button
                className="new-post-btn"
                onClick={() => setIsNewPostOpen(true)}
              >
                + New Post
              </button>
            </div>

            {/* Tabs */}
            <div className="tabs">
              <button
                className={`tab ${activeTab === "recent" ? "active" : ""}`}
                onClick={() => setActiveTab("recent")}
              >
                Recent
              </button>
              <button
                className={`tab ${activeTab === "popular" ? "active" : ""}`}
                onClick={() => setActiveTab("popular")}
              >
                Popular
              </button>
              <button
                className={`tab ${activeTab === "replies" ? "active" : ""}`}
                onClick={() => setActiveTab("replies")}
              >
                Replies
              </button>
            </div>

            {/* Posts */}
            <div className="posts">
              {sortedPosts.length > 0 ? (
                sortedPosts.map((post) => (
                  <div key={post._id || post.id} className="post">
                    <div className="post-content">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          post.author?.name || "User"
                        )}&background=ff69b4&color=fff&bold=true`}
                        alt={post.author?.name || "User"}
                        className="avatar"
                      />
                      <div className="post-body">
                        <div className="post-header">
                          <h3 className="author-name">
                            {post.author?.name || "Anonymous"}
                          </h3>
                          <span className="post-time">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                        <p className="post-text">{post.content}</p>
                        <div className="post-actions">
                          <button className="action-btn">
                            <Heart size={16} />
                            <span>{post.likes || 0}</span>
                          </button>
                          <button className="action-btn">
                            <MessageSquare size={16} />
                            <span>{post.comments || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-posts">
                  <p>No posts found. Be the first to post!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Post Dialog */}
        {isNewPostOpen && (
          <div
            className="dialog-overlay"
            onClick={() => setIsNewPostOpen(false)}
          >
            <div className="dialog" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-header">
                <h2>
                  {step === 1
                    ? "Select Category"
                    : step === 2
                    ? "Write Your Post"
                    : "Add Tags"}
                </h2>
                <button
                  className="close-btn"
                  onClick={() => setIsNewPostOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="dialog-content">
                {step === 1 && (
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="select-input"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {categoryIcons[cat]} {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {step === 2 && (
                  <div className="form-group">
                    <label>What's on your mind?</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Share your thoughts, questions, or experiences..."
                      className="textarea"
                    />
                  </div>
                )}

                {step === 3 && (
                  <div className="form-group">
                    <label>Add Tags (optional)</label>
                    <input
                      type="text"
                      placeholder="Enter a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="tag-input"
                    />
                    {tags.length > 0 && (
                      <div className="tags-container">
                        {tags.map((tag) => (
                          <span key={tag} className="tag active">
                            {tag}
                            <button
                              className="tag-remove"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="dialog-footer">
                {step > 1 ? (
                  <button
                    className="btn secondary"
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </button>
                ) : (
                  <button
                    className="btn secondary"
                    onClick={() => setIsNewPostOpen(false)}
                  >
                    Cancel
                  </button>
                )}

                {step < 3 ? (
                  <button
                    className="btn primary"
                    onClick={() => setStep(step + 1)}
                    disabled={
                      (step === 1 && !category) || (step === 2 && !content)
                    }
                  >
                    Next
                  </button>
                ) : (
                  <button className="btn primary" onClick={handleSubmit}>
                    Post
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
