import { useState, useEffect } from "react";
import axios from "axios";

export default function YourStory() {
  const [stories, setStories] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [myStories, setMyStories] = useState([]);

  const userId = localStorage.getItem("userId") || "demoUser";
  const userName = localStorage.getItem("username") || "Anonymous";

  useEffect(() => {
    axios.get("https://pcod-healthcare.onrender.com/api/stories").then((res) => setStories(res.data));
    axios.get(`https://pcod-healthcare.onrender.com/api/stories/user/${userId}`).then((res) => setMyStories(res.data));
  }, []);

  const submitStory = async (e) => {
    e.preventDefault();
    await axios.post("https://pcod-healthcare.onrender.com/api/stories", {
      userId,
      userName,
      title,
      content,
      image,
      isPublic,
    });
    setTitle("");
    setContent("");
    setImage("");
    alert("Story posted successfully!");
    const res = await axios.get("https://pcod-healthcare.onrender.com/api/stories");
    setStories(res.data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">💖 Your Story</h1>

      {/* Story Form */}
      <form onSubmit={submitStory} className="bg-white shadow-lg p-6 rounded-xl max-w-2xl mx-auto space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Story Title"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your story..."
          className="w-full border p-2 rounded h-32"
          required
        />
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Optional image URL"
          className="w-full border p-2 rounded"
        />

        <div className="flex items-center gap-2">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          <span className="text-sm text-gray-600">Make Public</span>
        </div>

        <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg w-full">
          Share Story
        </button>
      </form>

      {/* My Stories Section */}
      <section className="mt-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">My Stories</h2>
        {myStories.length === 0 ? (
          <p className="text-gray-500">You haven't shared any stories yet.</p>
        ) : (
          <div className="space-y-4">
            {myStories.map((story) => (
              <div key={story._id} className="bg-white p-5 rounded-lg shadow">
                <h3 className="font-semibold text-lg">{story.title}</h3>
                <p className="mt-2 text-gray-700">{story.content}</p>
                {story.image && <img src={story.image} alt="" className="mt-3 rounded-md" />}
                <p className="text-sm text-gray-500 mt-2">AI Reply: {story.aiReply}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Community Stories Section */}
      <section className="mt-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Community Stories</h2>
        {stories.map((story) => (
          <div key={story._id} className="bg-white p-5 rounded-lg shadow mb-4">
            <h3 className="font-semibold text-lg">{story.title}</h3>
            <p className="mt-2 text-gray-700">{story.content}</p>
            {story.image && <img src={story.image} alt="" className="mt-3 rounded-md" />}
            <p className="text-sm text-gray-500 mt-2">By {story.userName}</p>
            <p className="italic text-pink-600 mt-2">💬 {story.aiReply}</p>
          </div>
        ))}
      </section>
    </div>
  );
}