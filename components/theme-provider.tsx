'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type Theme = 'dark' | 'light'

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
}

const STORAGE_KEY = 'the-way-of-becoming-theme'
const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'dark'
    }
    return window.localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const nextTheme: Theme = current === 'dark' ? 'light' : 'dark'
      window.localStorage.setItem(STORAGE_KEY, nextTheme)
      applyTheme(nextTheme)
      return nextTheme
    })
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <button
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        className="theme-toggle"
        onClick={toggleTheme}
        type="button"
      >
        <span className="theme-toggle-track">
          <span className="theme-toggle-thumb" />
        </span>
        <span className="theme-toggle-copy">{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
      </button>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
