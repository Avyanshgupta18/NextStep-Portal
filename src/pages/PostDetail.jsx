import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase, getUserId, getUserDisplayName } from '../lib/supabase'
import { ArrowLeft, Heart, MessageCircle, Calendar, Edit, Trash2, Send, User } from 'lucide-react'

function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const [error, setError] = useState(null)
  const currentUserId = getUserId()

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [id])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setPost(data)
    } catch (error) {
      console.error('Error fetching post:', error)
      setError('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleUpvote = async () => {
    try {
      const newUpvotes = post.upvotes + 1
      const { error } = await supabase
        .from('posts')
        .update({ upvotes: newUpvotes })
        .eq('id', id)

      if (error) throw error
      setPost(prev => ({ ...prev, upvotes: newUpvotes }))
    } catch (error) {
      console.error('Error upvoting post:', error)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      setCommentLoading(true)
      const userId = getUserId()
      const authorName = getUserDisplayName()
      
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: id,
            content: newComment.trim(),
            user_id: userId,
            author_name: authorName
          }
        ])
        .select()

      if (error) throw error

      setComments(prev => [...prev, ...data])
      setNewComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setCommentLoading(false)
    }
  }

  const handleDeletePost = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      // Delete comments first
      await supabase.from('comments').delete().eq('post_id', id)
      
      // Then delete the post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      navigate('/')
    } catch (error) {
      console.error('Error deleting post:', error)
      setError('Failed to delete post')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error
      setComments(prev => prev.filter(comment => comment.id !== commentId))
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

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

  const canEditPost = post && post.user_id === currentUserId

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="card">
        <div className="error-message">
          {error || 'Post not found'}
        </div>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="post-detail-container">
      <div className="card">
        <div className="post-detail-header">
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-secondary"
            style={{ padding: '0.5rem' }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ margin: 0, flex: 1 }}>Experience Details</h1>
        </div>

        <div className="post-header">
          <div>
            <h2 className="post-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              {post.title}
            </h2>
            <div className="post-meta" style={{ marginBottom: '1rem' }}>
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
                {comments.length} comments
              </span>
            </div>
          </div>
          {post.category && (
            <span style={{
              background: '#667eea',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {post.category}
            </span>
          )}
        </div>

        {post.image_url && (
          <img 
            src={post.image_url} 
            alt={post.title}
            className="post-image"
          />
        )}

        {post.content && (
          <div className="post-content" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} style={{ marginBottom: '1rem' }}>
                {paragraph}
              </p>
            ))}
          </div>
        )}

        <div className="post-actions">
          <button onClick={handleUpvote} className="upvote-btn">
            <Heart size={20} />
            Upvote ({post.upvotes})
          </button>
          {canEditPost && (
            <>
              <Link to={`/edit/${post.id}`} className="btn btn-secondary">
                <Edit size={16} />
                Edit
              </Link>
              <button onClick={handleDeletePost} className="btn btn-danger">
                <Trash2 size={16} />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="card comments-section">
        <h3 className="comments-title">
          Comments ({comments.length})
        </h3>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts or ask a question..."
              className="form-textarea"
              rows="3"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={commentLoading || !newComment.trim()}
          >
            {commentLoading ? (
              'Adding...'
            ) : (
              <>
                <Send size={16} />
                Add Comment
              </>
            )}
          </button>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <p style={{ color: '#718096', textAlign: 'center', padding: '2rem' }}>
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div>
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div className="comment-author">
                    <User size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    {comment.author_name}
                  </div>
                  {comment.user_id === currentUserId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="btn btn-danger"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
                <div className="comment-content">
                  {comment.content}
                </div>
                <div className="comment-meta">
                  {formatDate(comment.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PostDetail 