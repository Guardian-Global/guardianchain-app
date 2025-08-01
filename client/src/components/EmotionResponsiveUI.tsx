import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';

type EmotionState = 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'neutral';

interface EmotionTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
}

const emotionThemes: Record<EmotionState, EmotionTheme> = {
  joy: {
    primary: 'from-yellow-400 to-orange-500',
    secondary: 'from-yellow-500/20 to-orange-500/20',
    accent: '#f59e0b',
    background: 'bg-gradient-to-br from-yellow-900/10 to-orange-900/10',
    text: 'text-yellow-200',
    border: 'border-yellow-500/30'
  },
  sadness: {
    primary: 'from-blue-500 to-indigo-600',
    secondary: 'from-blue-500/20 to-indigo-600/20',
    accent: '#3b82f6',
    background: 'bg-gradient-to-br from-blue-900/10 to-indigo-900/10',
    text: 'text-blue-200',
    border: 'border-blue-500/30'
  },
  anger: {
    primary: 'from-red-500 to-pink-600',
    secondary: 'from-red-500/20 to-pink-600/20',
    accent: '#ef4444',
    background: 'bg-gradient-to-br from-red-900/10 to-pink-900/10',
    text: 'text-red-200',
    border: 'border-red-500/30'
  },
  fear: {
    primary: 'from-purple-500 to-violet-600',
    secondary: 'from-purple-500/20 to-violet-600/20',
    accent: '#8b5cf6',
    background: 'bg-gradient-to-br from-purple-900/10 to-violet-900/10',
    text: 'text-purple-200',
    border: 'border-purple-500/30'
  },
  surprise: {
    primary: 'from-green-400 to-emerald-500',
    secondary: 'from-green-400/20 to-emerald-500/20',
    accent: '#10b981',
    background: 'bg-gradient-to-br from-green-900/10 to-emerald-900/10',
    text: 'text-green-200',
    border: 'border-green-500/30'
  },
  neutral: {
    primary: 'from-slate-500 to-gray-600',
    secondary: 'from-slate-500/20 to-gray-600/20',
    accent: '#64748b',
    background: 'bg-gradient-to-br from-slate-900/10 to-gray-900/10',
    text: 'text-slate-200',
    border: 'border-slate-500/30'
  }
};

interface EmotionContextType {
  currentEmotion: EmotionState;
  setEmotion: (emotion: EmotionState) => void;
  theme: EmotionTheme;
  analyzeContent: (content: string) => EmotionState;
}

const EmotionContext = createContext<EmotionContextType | undefined>(undefined);

export function useEmotion() {
  const context = useContext(EmotionContext);
  if (!context) {
    throw new Error('useEmotion must be used within EmotionProvider');
  }
  return context;
}

interface EmotionProviderProps {
  children: ReactNode;
}

export function EmotionProvider({ children }: EmotionProviderProps) {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionState>('neutral');
  
  const theme = emotionThemes[currentEmotion];

  const analyzeContent = (content: string): EmotionState => {
    const lowerContent = content.toLowerCase();
    
    // Simple keyword-based emotion detection
    const emotionKeywords = {
      joy: ['happy', 'joy', 'celebrate', 'love', 'excited', 'wonderful', 'amazing', 'fantastic', 'great'],
      sadness: ['sad', 'cry', 'lost', 'grief', 'miss', 'sorrow', 'mourn', 'death', 'farewell'],
      anger: ['angry', 'mad', 'furious', 'hate', 'rage', 'injustice', 'unfair', 'betrayed'],
      fear: ['afraid', 'scared', 'terrified', 'anxiety', 'worry', 'panic', 'nightmare'],
      surprise: ['surprise', 'shocked', 'unexpected', 'amazed', 'wow', 'incredible', 'unbelievable']
    };

    let maxScore = 0;
    let detectedEmotion: EmotionState = 'neutral';

    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (lowerContent.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion as EmotionState;
      }
    });

    return detectedEmotion;
  };

  const setEmotion = (emotion: EmotionState) => {
    setCurrentEmotion(emotion);
  };

  // Auto-detect emotion based on page content changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const textContent = document.body.innerText;
      if (textContent.length > 100) {
        const detectedEmotion = analyzeContent(textContent);
        if (detectedEmotion !== 'neutral' && detectedEmotion !== currentEmotion) {
          setCurrentEmotion(detectedEmotion);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, [currentEmotion]);

  return (
    <EmotionContext.Provider value={{ currentEmotion, setEmotion, theme, analyzeContent }}>
      {children}
    </EmotionContext.Provider>
  );
}

interface EmotionAnimatedBackgroundProps {
  children: ReactNode;
}

export function EmotionAnimatedBackground({ children }: EmotionAnimatedBackgroundProps) {
  const { theme, currentEmotion } = useEmotion();

  const getAnimationVariants = () => {
    switch (currentEmotion) {
      case 'joy':
        return {
          animate: { 
            background: [
              'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
              'radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
              'radial-gradient(circle at 40% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 70%)'
            ]
          },
          transition: { duration: 4, repeat: Infinity, repeatType: "reverse" as const }
        };
      case 'sadness':
        return {
          animate: { 
            background: [
              'radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 60%, rgba(79, 70, 229, 0.05) 0%, transparent 50%)'
            ]
          },
          transition: { duration: 6, repeat: Infinity, repeatType: "reverse" as const }
        };
      case 'anger':
        return {
          animate: { 
            background: [
              'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 60%)',
              'radial-gradient(circle at 30% 70%, rgba(219, 39, 119, 0.1) 0%, transparent 60%)'
            ]
          },
          transition: { duration: 2, repeat: Infinity, repeatType: "reverse" as const }
        };
      default:
        return {
          animate: { 
            background: 'radial-gradient(circle at 50% 50%, rgba(71, 85, 105, 0.05) 0%, transparent 70%)'
          }
        };
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        {...getAnimationVariants()}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

interface EmotionIndicatorProps {
  className?: string;
}

export function EmotionIndicator({ className = '' }: EmotionIndicatorProps) {
  const { currentEmotion, theme } = useEmotion();

  const emotionEmojis = {
    joy: '😊',
    sadness: '😢',
    anger: '😠',
    fear: '😨',
    surprise: '😲',
    neutral: '😐'
  };

  return (
    <motion.div
      key={currentEmotion}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${theme.background} ${theme.border} border ${className}`}
    >
      <span className="text-lg">{emotionEmojis[currentEmotion]}</span>
      <span className={`text-sm font-medium capitalize ${theme.text}`}>
        {currentEmotion}
      </span>
    </motion.div>
  );
}

interface EmotionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export function EmotionButton({ children, onClick, className = '', variant = 'primary' }: EmotionButtonProps) {
  const { theme } = useEmotion();

  const baseClasses = variant === 'primary' 
    ? `bg-gradient-to-r ${theme.primary} hover:opacity-90`
    : `bg-gradient-to-r ${theme.secondary} hover:opacity-80 ${theme.border} border`;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 ${baseClasses} ${className}`}
    >
      {children}
    </motion.button>
  );
}