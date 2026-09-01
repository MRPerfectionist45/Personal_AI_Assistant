import { motion } from 'framer-motion'
import { ArrowLeft, Github, ExternalLink } from 'lucide-react'

const projects = [
  {
    title: 'RAG-Based AI Teaching Assistant',
    description: 'AI-powered teaching assistant that answers questions from uploaded educational videos using RAG, semantic search, and speech-to-text. Achieved 94% improvement in answer relevance.',
    tech: ['Python', 'LangChain', 'NLP', 'RAG', 'LLMs'],
    github: 'https://github.com/MRPerfectionist45/RAG-Based-AI-Teaching-Assistant-System.git',
    color: 'from-blue-400 to-indigo-500',
    icon: '🎓'
  },
  {
    title: 'Crop Recommendation System',
    description: 'ML classification model recommending optimal crops based on NPK soil nutrients and climate parameters. Achieved 92% prediction accuracy through rigorous EDA and algorithm comparison.',
    tech: ['Python', 'Scikit-learn', 'Classification', 'ML'],
    github: 'https://github.com/MRPerfectionist45',
    color: 'from-emerald-400 to-teal-500',
    icon: '🌾'
  },
  {
    title: 'House Price Prediction',
    description: 'Robust regression model predicting residential property values with 97% R² score. Comprehensive feature engineering and model fine-tuning to minimize RMSE.',
    tech: ['Python', 'Pandas', 'Scikit-learn', 'Regression'],
    github: 'https://github.com/MRPerfectionist45/House-Prediction-ML-model.git',
    color: 'from-orange-400 to-amber-500',
    icon: '🏠'
  },
  {
    title: 'The Ledger',
    description: 'Personal discipline tracking web app with Firebase Firestore, Google Sign-In, streak tracking, and structured logging for actionable behavioral insights.',
    tech: ['JavaScript', 'Firebase', 'Google Sign-In'],
    github: 'https://github.com/MRPerfectionist45',
    color: 'from-pink-400 to-rose-500',
    icon: '📊'
  },
  {
    title: 'SaiKrupa Suzuki Website',
    description: 'Responsive dealership website with animated hero slider, EMI calculator, bike comparison, WhatsApp integration, and booking forms. Deployed on Netlify.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/MRPerfectionist45',
    demo: 'https://saikrupa-suzuki.netlify.app',
    color: 'from-cyan-400 to-blue-500',
    icon: '🏍️'
  }
]

export default function ProjectsSection({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative z-10 flex flex-col h-full px-5 pt-10 pb-6 overflow-hidden bg-light-bg dark:bg-dark-bg transition-colors duration-500">
      <div className="flex items-center justify-between mb-5">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft size={16} />
          Back
        </motion.button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <h2 className="font-serif text-2xl font-bold text-light-text dark:text-dark-text mb-1">Projects</h2>
        <p className="text-sm text-light-muted dark:text-dark-muted">Things I have built with code and curiosity.</p>
      </motion.div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="group p-4 bg-white/70 dark:bg-dark-card/70 backdrop-blur-md rounded-2xl border border-light-border/50 dark:border-dark-border/50 shadow-sm hover:shadow-md hover:border-accent-blue/20 transition-all"
          >
            <div className="flex items-start gap-3 mb-2.5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center text-lg shadow-sm flex-shrink-0`}>
                {project.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[15px] text-light-text dark:text-dark-text group-hover:text-accent-blue transition-colors leading-snug">
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {project.tech.map(t => (
                    <span key={t} className="px-1.5 py-0.5 bg-light-bg dark:bg-dark-surface rounded-md text-[10px] text-light-muted dark:text-dark-muted border border-light-border/30 dark:border-dark-border/30">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-[13px] text-light-muted dark:text-dark-muted leading-relaxed mb-3">
              {project.description}
            </p>
            <div className="flex gap-2">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-light-bg dark:bg-dark-surface rounded-lg text-[11px] font-medium text-light-text dark:text-dark-text hover:bg-light-text hover:text-white dark:hover:bg-dark-text dark:hover:text-dark-bg transition-colors"
              >
                <Github size={12} />
                Code
              </a>
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-accent-blue/10 rounded-lg text-[11px] font-medium text-accent-blue hover:bg-accent-blue hover:text-white transition-colors"
                >
                  <ExternalLink size={12} />
                  Live Demo
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
