import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase, getUserId } from '../lib/supabase'
import { ArrowLeft, Save } from 'lucide-react'

function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    category: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const currentUserId = getUserId()

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      // Check if current user is the author
      if (data.user_id !== currentUserId) {
        setError('You can only edit your own posts')
        return
      }

      setFormData({
        title: data.title || '',
        content: data.content || '',
        image_url: data.image_url || '',
        category: data.category || ''
      })
    } catch (error) {
      console.error('Error fetching post:', error)
      setError('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

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
      setSaving(true)
      setError(null)

      const { error } = await supabase
        .from('posts')
        .update({
          title: formData.title.trim(),
          content: formData.content.trim() || null,
          image_url: formData.image_url.trim() || null,
          category: formData.category.trim() || null
        })
        .eq('id', id)
        .eq('user_id', currentUserId) // Extra security check

      if (error) throw error

      navigate(`/post/${id}`)
    } catch (error) {
      console.error('Error updating post:', error)
      setError('Failed to update post. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="form-container">
        <div className="card">
          <div className="error-message">
            {error}
          </div>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="form-container">
      <div className="card">
        <div className="post-detail-header">
          <Link to={`/post/${id}`} className="btn btn-secondary">
            <ArrowLeft size={20} />
          </Link>
          <h1>Edit Experience</h1>
        </div>

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
            <Link to={`/post/${id}`} className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                'Saving...'
              ) : (
                <>
                  <Save size={20} />
                  Update Experience
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPost 