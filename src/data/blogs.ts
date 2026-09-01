export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  date: string
  readTime: number
  tags: string[]
  likes: number
  rating: number
  ratingCount: number
  comments: Comment[]
}

export interface Comment {
  id: string
  author: string
  text: string
  date: string
}

export const initialBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'My Journey into AI & Data Science',
    excerpt: 'From writing my first Python script to building RAG pipelines — here is my story, my philosophy, and what drives me every single day.',
    content: `Hey there! I'm Deepak Gaikwad, a final-year B.Tech student at JSPM University, Pune, specializing in Computer Science Engineering with Artificial Intelligence and Data Science.

My journey into tech didn't start with a fancy laptop or a coding bootcamp. It started with curiosity — a simple question: "Can I make a computer learn from data?" That question led me to write my first Python script to predict house prices, and I was hooked.

Over the past few years, I've explored everything from classical Machine Learning (Regression, Classification, Clustering) to modern Generative AI systems using LangChain, RAG, and LLMs. What excites me most is the intersection of data and human impact.

My Philosophy
I believe in building things that matter. Whether it's a teaching assistant that helps students learn faster, a crop recommendation system that helps farmers, or a safety app that protects women — AI can be a force for good.

I'm not just a coder. I'm a reader (40+ books and counting), a cricket enthusiast, and someone who believes that discipline compounds. My daily routine includes coding, reading, and reflecting — because growth happens in the small moments.

What Drives Me
• Solving real problems with data and AI
• Building end-to-end ML pipelines from scratch
• Learning something new every single day
• Surrounding myself with people smarter than me

Currently, I'm open to internships and full-time roles in Data Science, AI Engineering, and Machine Learning. If you're building something impactful, I'd love to chat!

Think deeply. Build simply. That's my motto.`,
    category: 'About Me',
    date: '2026-08-08',
    readTime: 4,
    tags: ['AI', 'Journey', 'Deepak Gaikwad', 'Data Science'],
    likes: 0,
    rating: 0,
    ratingCount: 0,
    comments: []
  }
]

export const categoryColors: Record<string, string> = {
  'About Me': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Career: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Technical: 'bg-blue-100 text-blue-700 border-blue-200',
  'Data Science': 'bg-purple-100 text-purple-700 border-purple-200',
  Opinion: 'bg-orange-100 text-orange-700 border-orange-200',
  Tutorial: 'bg-pink-100 text-pink-700 border-pink-200',
}
