import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Moon, Sun, Info, Send, Briefcase, BookOpen, Wifi, WifiOff } from 'lucide-react'
import ChatPanel from './components/ChatPanel'
import ProjectsSection from './components/ProjectsSection'
import BlogSection from './components/BlogSection'

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentView, setCurrentView] = useState<'home' | 'projects' | 'blog'>('home')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking')
  const [message, setMessage] = useState('')
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('deepak-theme')
    return saved ? saved === 'dark' : false
  })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('deepak-theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('deepak-theme', 'light')
    }
  }, [isDark])

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health', { signal: AbortSignal.timeout(5000) })
        if (res.ok) {
          setBackendStatus('online')
        } else {
          setBackendStatus('offline')
        }
      } catch {
        setBackendStatus('offline')
      }
    }
    checkHealth()
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / rect.width,
          y: (e.clientY - rect.top - rect.height / 2) / rect.height,
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSend = () => {
    if (!message.trim()) return
    setMessage('')
    setIsChatOpen(true)
  }

  return (
    <div ref={containerRef} className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-[#0a0a0f] p-4 md:p-8 overflow-hidden transition-colors duration-500">
      {/* Desktop iPhone Frame — COLORFUL GRADIENT BORDER */}
      <div className="hidden md:block relative w-[390px] h-[844px] rounded-[60px] p-[5px] shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black rounded-b-3xl z-50" />
        <div className="absolute -left-[12px] top-32 w-[7px] h-10 bg-gray-800 rounded-l-md" />
        <div className="absolute -left-[12px] top-48 w-[7px] h-16 bg-gray-800 rounded-l-md" />
        <div className="absolute -right-[12px] top-40 w-[7px] h-16 bg-gray-800 rounded-r-md" />
        <div className="w-full h-full bg-light-bg dark:bg-dark-bg rounded-[55px] overflow-hidden relative transition-colors duration-500">
          <ScreenContent
            currentView={currentView}
            setCurrentView={setCurrentView}
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
            backendStatus={backendStatus}
            mousePosition={mousePosition}
            message={message}
            setMessage={setMessage}
            handleSend={handleSend}
            isDark={isDark}
            setIsDark={setIsDark}
          />
        </div>
      </div>

      {/* Mobile Full Screen */}
      <div className="md:hidden fixed inset-0 bg-light-bg dark:bg-dark-bg overflow-hidden transition-colors duration-500">
        <ScreenContent
          currentView={currentView}
          setCurrentView={setCurrentView}
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
          backendStatus={backendStatus}
          mousePosition={mousePosition}
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          isDark={isDark}
          setIsDark={setIsDark}
        />
      </div>
    </div>
  )
}

function ScreenContent(props: any) {
  const {
    currentView, setCurrentView, isChatOpen, setIsChatOpen,
    backendStatus, mousePosition, message, setMessage, handleSend,
    isDark, setIsDark
  } = props

  return (
    <>
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <HomeView
            key="home"
            setCurrentView={setCurrentView}
            setIsChatOpen={setIsChatOpen}
            backendStatus={backendStatus}
            mousePosition={mousePosition}
            message={message}
            setMessage={setMessage}
            handleSend={handleSend}
            isDark={isDark}
            setIsDark={setIsDark}
          />
        )}
        {currentView === 'projects' && (
          <ProjectsSection key="projects" onBack={() => setCurrentView('home')} />
        )}
        {currentView === 'blog' && (
          <BlogSection key="blog" onBack={() => setCurrentView('home')} />
        )}
      </AnimatePresence>

      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        backendStatus={backendStatus}
      />
    </>
  )
}

function HomeView({ setCurrentView, setIsChatOpen, backendStatus, mousePosition, message, setMessage, handleSend, isDark, setIsDark }: any) {
  const navItems = [
    { icon: Briefcase, label: 'Projects', color: 'text-teal-500', action: () => setCurrentView('projects') },
    { icon: BookOpen, label: 'Blog', color: 'text-pink-500', action: () => setCurrentView('blog') },
  ]

  const blobs = [
    { color: 'from-red-300 to-pink-300', size: 'w-72 h-72', top: '5%', left: '10%' },
    { color: 'from-green-300 to-emerald-300', size: 'w-80 h-80', top: '25%', right: '5%' },
    { color: 'from-blue-300 to-cyan-300', size: 'w-64 h-64', bottom: '25%', left: '5%' },
    { color: 'from-yellow-300 to-orange-300', size: 'w-56 h-56', bottom: '10%', right: '10%' },
    { color: 'from-purple-300 to-violet-300', size: 'w-60 h-60', top: '45%', left: '40%' },
  ]

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Animated Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {blobs.map((blob: any, i: number) => (
          <motion.div
            key={i}
            className={`absolute ${blob.size} rounded-full opacity-40 blur-3xl bg-gradient-to-br ${blob.color}`}
            style={{ top: blob.top, left: blob.left, right: blob.right, bottom: blob.bottom }}
            animate={{
              x: mousePosition.x * (20 + i * 10),
              y: mousePosition.y * (20 + i * 10),
              scale: [1, 1.1, 1],
            }}
            transition={{
              x: { type: 'spring', stiffness: 30, damping: 20 },
              y: { type: 'spring', stiffness: 30, damping: 20 },
              scale: { duration: 8, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 },
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-6 pt-12 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.a
            href="/Deepak_Gaikwad_Resume.pdf"
            download
            className="flex items-center gap-2 px-4 py-2.5 bg-white/70 dark:bg-dark-card/70 backdrop-blur-md rounded-full shadow-sm border border-light-border dark:border-dark-border text-sm font-medium text-light-text dark:text-dark-text hover:bg-white/90 dark:hover:bg-dark-card/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText size={15} />
            <span>Resume</span>
            <span className="text-light-muted dark:text-dark-muted text-xs">→</span>
          </motion.a>

          <div className="flex items-center gap-2.5">
            <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-medium ${
              backendStatus === 'online' ? 'bg-green-50 text-green-600 border border-green-200' :
              backendStatus === 'offline' ? 'bg-red-50 text-red-600 border border-red-200' :
              'bg-yellow-50 text-yellow-600 border border-yellow-200'
            }`}>
              {backendStatus === 'online' ? <Wifi size={11} /> : <WifiOff size={11} />}
              <span className="capitalize">{backendStatus}</span>
            </div>

            <motion.button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 bg-white/70 dark:bg-dark-card/70 backdrop-blur-md rounded-full shadow-sm border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </motion.button>
            <motion.button
              className="p-2.5 bg-white/70 dark:bg-dark-card/70 backdrop-blur-md rounded-full shadow-sm border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Info size={17} />
            </motion.button>
          </div>
        </div>

        {/* Hero — Loosened layout */}
        <div className="flex-1 flex flex-col items-center text-center justify-center">

          {/* CHAT INPUT */}
          <motion.div
            className="w-full max-w-[320px] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative flex items-center bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-full shadow-lg border border-light-border/60 dark:border-dark-border/60 px-5 py-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent outline-none text-light-text dark:text-dark-text placeholder:text-light-muted/70 dark:placeholder:text-dark-muted/70 text-sm"
              />
              <motion.button
                onClick={handleSend}
                className="ml-3 w-9 h-9 bg-accent-blue rounded-full flex items-center justify-center text-white shadow-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Send size={16} className="ml-0.5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Name & Title */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <p className="font-serif italic text-lg text-light-muted dark:text-dark-muted mb-2 tracking-wide">
              Hey, I am Deepak Gaikwad
            </p>
            <h1 className="font-serif text-[2.5rem] leading-tight font-bold text-light-text dark:text-dark-text mb-6">
              AI Engineer &<br />Data Scientist
            </h1>
          </motion.div>

          {/* Profile Avatar — ENLARGED + ENHANCED QUALITY */}
          <motion.div
            className="relative mb-7"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25, type: 'spring' }}
          >
            <div className="w-36 h-36 rounded-full overflow-hidden border-[4px] border-white dark:border-dark-card shadow-2xl"
              style={{ imageRendering: 'auto' }}
            >
              <img
                src="/deepak-profile-300.png"
                alt="Deepak Gaikwad"
                className="w-full h-full object-cover object-top"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
            </div>
            {/* Colorful glowing ring behind avatar */}
            <div className="absolute inset-0 -z-10 w-36 h-36 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 blur-xl opacity-60 animate-pulse" />
            <div className="absolute -inset-2 -z-20 w-40 h-40 rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300 blur-2xl opacity-40" />
          </motion.div>

          {/* Nav Pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {navItems.map((item: any, index: number) => (
              <motion.button
                key={item.label}
                onClick={item.action}
                className="flex items-center gap-1.5 px-5 py-3 bg-white/70 dark:bg-dark-card/70 backdrop-blur-md rounded-2xl shadow-sm border border-light-border/60 dark:border-dark-border/60 text-sm font-medium text-light-text dark:text-dark-text hover:bg-white/90 dark:hover:bg-dark-card/90 transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.06 }}
              >
                <item.icon size={16} className={item.color} />
                {item.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Tagline — BOLDER & MORE VISIBLE */}
          <motion.div
            className="mt-2 px-6 py-2 rounded-full bg-white/40 dark:bg-dark-card/40 backdrop-blur-sm border border-light-border/30 dark:border-dark-border/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="font-serif italic text-base font-semibold text-light-text dark:text-dark-text tracking-wide">
              Think deeply. Build simply.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default App
