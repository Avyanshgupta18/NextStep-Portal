import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Heart, MessageCircle, Calendar, Search, TrendingUp, User } from 'lucide-react'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [sortBy])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('posts')
        .select(`
          *,
          comments(count)
        `)

      if (sortBy === 'upvotes') {
        query = query.order('upvotes', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError('Failed to load posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <h1>NextStep Journal</h1>
        <p className="hero-tagline">Real Stories. Real Growth.</p>
        <p className="hero-description">
          Share your real experiences from internships, college projects, and job applications 
          to help fellow students and early-career professionals
        </p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Search and Sort Controls */}
      <div className="controls">
        <div className="search-box">
          <div className="form-group">
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#718096' 
              }} />
              <input
                type="text"
                placeholder="Search experiences by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>
        </div>
        
        <div className="sort-select">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select"
          >
            <option value="created_at">Latest First</option>
            <option value="upvotes">Most Upvoted</option>
          </select>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="posts-grid">
        {filteredPosts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#4a5568' }}>
              {searchTerm ? 'No experiences found' : 'No experiences shared yet'}
            </h3>
            <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Be the first to share your career experience!'
              }
            </p>
            {!searchTerm && (
              <Link to="/create" className="btn btn-primary">
                Share Your Experience
              </Link>
            )}
          </div>
        ) : (
          filteredPosts.map((post) => (
            <Link key={post.id} to={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
              <div className="card post-card">
                <div className="post-header">
                  <div>
                    <h3 className="post-title">{post.title}</h3>
                    <div className="post-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={16} />
                        {post.author_name}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={16} />
                        {formatDate(post.created_at)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Heart size={16} />
                        {post.upvotes} upvotes
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MessageCircle size={16} />
                        {post.comments?.[0]?.count || 0} comments
                      </span>
                    </div>
                  </div>
                  {post.category && (
                    <span style={{
                      background: '#667eea',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '16px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {post.category}
                    </span>
                  )}
                </div>
                
                {post.content && (
                  <p className="post-content">
                    {post.content.length > 200 
                      ? `${post.content.substring(0, 200)}...` 
                      : post.content
                    }
                  </p>
                )}
                
                {post.image_url && (
                  <img 
                    src={post.image_url} 
                    alt={post.title}
                    className="post-image"
                    style={{ maxHeight: '200px' }}
                  />
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default Home 