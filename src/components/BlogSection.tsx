import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Clock, Calendar, Tag, X, ArrowLeft, BookOpen, Heart, MessageCircle, Star, Send } from 'lucide-react'
import { BlogPost, Comment, initialBlogs, categoryColors } from '../data/blogs'

const STORAGE_KEY = 'deepak-portfolio-blogs-v2'
const USER_RATED_KEY = 'deepak-blog-user-ratings-v2'
const USER_LIKED_KEY = 'deepak-blog-user-likes-v2'

export default function BlogSection({ onBack }: { onBack: () => void }) {
  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : initialBlogs
    } catch {
      return initialBlogs
    }
  })
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [readingBlogId, setReadingBlogId] = useState<string | null>(null)

  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(USER_RATED_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(USER_LIKED_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs))
  }, [blogs])

  useEffect(() => {
    localStorage.setItem(USER_RATED_KEY, JSON.stringify(userRatings))
  }, [userRatings])

  useEffect(() => {
    localStorage.setItem(USER_LIKED_KEY, JSON.stringify(userLikes))
  }, [userLikes])

  const readingBlog = blogs.find(b => b.id === readingBlogId) || null

  const categories = ['All', ...Array.from(new Set(blogs.map(b => b.category)))]

  const filtered = blogs.filter(b => {
    const q = search.toLowerCase()
    const matchSearch = b.title.toLowerCase().includes(q) ||
                        b.excerpt.toLowerCase().includes(q) ||
                        b.tags.some(t => t.toLowerCase().includes(q))
    const matchCat = selectedCategory === 'All' || b.category === selectedCategory
    return matchSearch && matchCat
  })

  const handleRate = (blogId: string, rating: number) => {
    if (userRatings[blogId]) return
    setBlogs(prev => prev.map(b => {
      if (b.id === blogId) {
        const newCount = b.ratingCount + 1
        const newRating = ((b.rating * b.ratingCount) + rating) / newCount
        return { ...b, rating: Math.round(newRating * 10) / 10, ratingCount: newCount }
      }
      return b
    }))
    setUserRatings(prev => ({ ...prev, [blogId]: rating }))
  }

  const handleLike = (blogId: string) => {
    const isLiked = userLikes[blogId]
    setBlogs(prev => prev.map(b => {
      if (b.id === blogId) {
        return { ...b, likes: isLiked ? b.likes - 1 : b.likes + 1 }
      }
      return b
    }))
    setUserLikes(prev => ({ ...prev, [blogId]: !isLiked }))
  }

  const handleAddComment = (blogId: string, comment: Comment) => {
    setBlogs(prev => prev.map(b => {
      if (b.id === blogId) {
        return { ...b, comments: [...b.comments, comment] }
      }
      return b
    }))
  }

  return (
    <div className="relative w-full h-full flex flex-col px-5 pt-10 pb-6 overflow-hidden bg-light-bg dark:bg-dark-bg transition-colors duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft size={16} />
          Back
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 shrink-0"
      >
        <h2 className="font-serif text-2xl font-bold text-light-text dark:text-dark-text mb-1">My Blog</h2>
        <p className="text-sm text-light-muted dark:text-dark-muted">Thoughts, journey, and lessons learned.</p>
      </motion.div>

      {/* Search & Filter */}
      <div className="mb-4 space-y-3 shrink-0">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-light-muted dark:text-dark-muted" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-dark-card/70 backdrop-blur-md rounded-2xl border border-light-border/60 dark:border-dark-border/60 text-sm outline-none focus:border-accent-blue/50 transition-colors placeholder:text-light-muted/60 dark:placeholder:text-dark-muted/60 text-light-text dark:text-dark-text"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-light-text dark:bg-dark-text text-white dark:text-dark-bg shadow-md'
                  : 'bg-white/60 dark:bg-dark-card/60 text-light-muted dark:text-dark-muted border border-light-border/40 dark:border-dark-border/40 hover:bg-white/90 dark:hover:bg-dark-card/90'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin min-h-0">
        <AnimatePresence mode="popLayout">
          {filtered.map((blog, i) => (
            <motion.article
              key={blog.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setReadingBlogId(blog.id)}
              className="group p-4 bg-white/70 dark:bg-dark-card/70 backdrop-blur-md rounded-2xl border border-light-border/50 dark:border-dark-border/50 shadow-sm cursor-pointer hover:shadow-md hover:border-accent-blue/20 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${categoryColors[blog.category] || 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}>
                  {blog.category}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-light-muted dark:text-dark-muted">
                  <Clock size={11} />
                  {blog.readTime} min
                </div>
              </div>
              <h3 className="font-semibold text-light-text dark:text-dark-text text-[15px] mb-1 group-hover:text-accent-blue transition-colors leading-snug">
                {blog.title}
              </h3>
              <p className="text-[13px] text-light-muted dark:text-dark-muted leading-relaxed line-clamp-2 mb-3">
                {blog.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-[11px] text-light-muted dark:text-dark-muted font-medium">
                      {blog.ratingCount > 0 ? `${blog.rating} (${blog.ratingCount})` : 'No ratings'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={12} className={userLikes[blog.id] ? "text-red-500 fill-red-500" : "text-light-muted dark:text-dark-muted"} />
                    <span className="text-[11px] text-light-muted dark:text-dark-muted">{blog.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={12} className="text-light-muted dark:text-dark-muted" />
                    <span className="text-[11px] text-light-muted dark:text-dark-muted">{blog.comments.length}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-light-muted/80 dark:text-dark-muted/80">
                  <Calendar size={11} />
                  {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-light-muted dark:text-dark-muted">
            <BookOpen size={32} className="mb-2 opacity-40" />
            <p className="text-sm">No blogs found.</p>
          </div>
        )}
      </div>

      {/* Read Modal — rendered as overlay within this relative container */}
      <AnimatePresence>
        {readingBlog && (
          <BlogReadModal
            blog={readingBlog}
            onClose={() => setReadingBlogId(null)}
            userRating={userRatings[readingBlog.id] || 0}
            userLiked={!!userLikes[readingBlog.id]}
            onRate={(rating) => handleRate(readingBlog.id, rating)}
            onLike={() => handleLike(readingBlog.id)}
            onComment={(comment) => handleAddComment(readingBlog.id, comment)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Blog Read Modal ─── */
function BlogReadModal({
  blog,
  onClose,
  userRating,
  userLiked,
  onRate,
  onLike,
  onComment
}: {
  blog: BlogPost
  onClose: () => void
  userRating: number
  userLiked: boolean
  onRate: (r: number) => void
  onLike: () => void
  onComment: (c: Comment) => void
}) {
  const [commentText, setCommentText] = useState('')
  const [commentAuthor, setCommentAuthor] = useState('')
  const [hoverRating, setHoverRating] = useState(0)

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !commentAuthor.trim()) return
    onComment({
      id: Date.now().toString(),
      author: commentAuthor.trim(),
      text: commentText.trim(),
      date: new Date().toISOString().split('T')[0]
    })
    setCommentText('')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-light-bg dark:bg-dark-bg flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-10 pb-4 border-b border-light-border/50 dark:border-dark-border/50 shrink-0">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-light-bg dark:hover:bg-dark-surface transition-colors"
        >
          <ArrowLeft size={18} className="text-light-text dark:text-dark-text" />
        </button>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${categoryColors[blog.category] || 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}>
          {blog.category}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 scrollbar-thin">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-2xl font-bold text-light-text dark:text-dark-text mb-3 leading-tight"
        >
          {blog.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 text-xs text-light-muted dark:text-dark-muted mb-6"
        >
          <span className="flex items-center gap-1"><Calendar size={12} /> {blog.date}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime} min read</span>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-[13px] text-light-text dark:text-dark-text leading-relaxed whitespace-pre-line space-y-3 mb-8"
        >
          {blog.content}
        </motion.div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8 pt-4 border-t border-light-border/40 dark:border-dark-border/40">
          {blog.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-light-bg dark:bg-dark-surface rounded-full text-xs text-light-muted dark:text-dark-muted border border-light-border/40 dark:border-dark-border/40">
              #{tag}
            </span>
          ))}
        </div>

        {/* Rating Section */}
        <div className="bg-light-bg dark:bg-dark-surface rounded-2xl p-4 mb-6 border border-light-border/30 dark:border-dark-border/30">
          <h4 className="text-sm font-semibold text-light-text dark:text-dark-text mb-2">Rate this article</h4>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => onRate(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                disabled={userRating > 0}
                className="p-1 transition-transform hover:scale-110 disabled:cursor-default"
              >
                <Star
                  size={24}
                  className={
                    (hoverRating ? star <= hoverRating : star <= (userRating || Math.round(blog.rating)))
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-300 dark:text-gray-600"
                  }
                />
              </button>
            ))}
            <span className="ml-2 text-xs text-light-muted dark:text-dark-muted">
              {userRating > 0
                ? `You rated ${userRating} star${userRating > 1 ? 's' : ''}!`
                : blog.ratingCount > 0
                  ? `${blog.rating} avg from ${blog.ratingCount} rating${blog.ratingCount > 1 ? 's' : ''}`
                  : 'Be the first to rate'}
            </span>
          </div>
        </div>

        {/* Like Button */}
        <div className="flex items-center gap-3 mb-8">
          <motion.button
            onClick={onLike}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
              userLiked
                ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                : 'bg-light-bg text-light-muted border border-light-border/40 hover:bg-red-50 hover:text-red-500 dark:bg-dark-surface dark:text-dark-muted dark:border-dark-border/40 dark:hover:bg-red-900/20 dark:hover:text-red-400'
            }`}
          >
            <Heart size={16} className={userLiked ? "fill-red-500" : ""} />
            {userLiked ? 'Liked' : 'Like'} ({blog.likes})
          </motion.button>
        </div>

        {/* Comments Section */}
        <div className="border-t border-light-border/40 dark:border-dark-border/40 pt-6">
          <h4 className="text-sm font-semibold text-light-text dark:text-dark-text mb-4 flex items-center gap-2">
            <MessageCircle size={16} />
            Comments ({blog.comments.length})
          </h4>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-6 space-y-3">
            <input
              type="text"
              placeholder="Your name..."
              value={commentAuthor}
              onChange={e => setCommentAuthor(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-light-bg dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border text-sm outline-none focus:border-accent-blue/50 text-light-text dark:text-dark-text placeholder:text-light-muted/60 dark:placeholder:text-dark-muted/60"
              required
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Share your thoughts..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-light-bg dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border text-sm outline-none focus:border-accent-blue/50 text-light-text dark:text-dark-text placeholder:text-light-muted/60 dark:placeholder:text-dark-muted/60"
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2.5 bg-accent-blue text-white rounded-xl text-sm font-medium shadow-sm"
              >
                <Send size={14} />
              </motion.button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            <AnimatePresence>
              {blog.comments.length === 0 && (
                <p className="text-xs text-light-muted/60 dark:text-dark-muted/60 text-center py-4">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
              {blog.comments.map((comment, idx) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-3 bg-light-bg dark:bg-dark-surface rounded-xl border border-light-border/30 dark:border-dark-border/30"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-light-text dark:text-dark-text">{comment.author}</span>
                    <span className="text-[10px] text-light-muted dark:text-dark-muted">{comment.date}</span>
                  </div>
                  <p className="text-[12px] text-light-muted dark:text-dark-muted leading-relaxed">{comment.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
