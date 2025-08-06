import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase, getUserId, getUserDisplayName } from '../lib/supabase'
import { ArrowLeft, Send } from 'lucide-react'

function CreatePost() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    category: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const userId = getUserId()
      const authorName = getUserDisplayName()
      
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            ...formData,
            user_id: userId,
            author_name: authorName,
            title: formData.title.trim(),
            content: formData.content.trim() || null,
            image_url: formData.image_url.trim() || null,
            category: formData.category.trim() || null
          }
        ])
        .select()

      if (error) throw error

      navigate('/')
    } catch (error) {
      console.error('Error creating post:', error)
      setError('Failed to create post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <div className="card">
        <div className="post-detail-header">
          <Link to="/" className="btn btn-secondary">
            <ArrowLeft size={20} />
          </Link>
          <h1>Share Your Experience</h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Experience Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., My Software Engineering Internship at Google"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select a category</option>
              <option value="Internship">Internship</option>
              <option value="Job Application">Job Application</option>
              <option value="College Project">College Project</option>
              <option value="Interview Experience">Interview Experience</option>
              <option value="Career Advice">Career Advice</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Your Experience
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Share your detailed experience, what you learned, challenges you faced, and advice for others..."
              rows="8"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image_url" className="form-label">
              Image URL (Optional)
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                'Publishing...'
              ) : (
                <>
                  <Send size={20} />
                  Share Experience
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost 