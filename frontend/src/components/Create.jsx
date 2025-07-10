import React, { useState } from 'react';

const Create = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 2 * 1024 * 1024) {
      setImage(file);
      setError('');
    } else {
      setError('Image must be less than 2MB');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      // Build form data
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) formData.append('image', image);

      // Call parent handler or API
      await onSubmit(formData);

      // Reset form
      setTitle('');
      setContent('');
      setImage(null);
      setError('');
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 shadow-lg rounded-2xl space-y-4"
    >
      <h2 className="text-2xl font-bold">Create New Post</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="text"
        placeholder="Post Title"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Write your post content here..."
        className="w-full p-3 border rounded-lg min-h-[150px] focus:outline-none focus:ring"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-lg"
        />
        {image && (
          <span className="text-sm text-gray-600">{image.name}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
          loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
};

export default Create;
