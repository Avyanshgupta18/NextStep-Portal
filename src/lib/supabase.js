import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// User ID management
export const getUserId = () => {
  let userId = localStorage.getItem('nextstep_user_id')
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36)
    localStorage.setItem('nextstep_user_id', userId)
  }
  return userId
}

export const generateDisplayName = () => {
  const adjectives = ['Smart', 'Creative', 'Ambitious', 'Dedicated', 'Innovative', 'Talented', 'Focused', 'Driven', 'Skilled', 'Passionate']
  const nouns = ['Student', 'Professional', 'Developer', 'Learner', 'Explorer', 'Achiever', 'Builder', 'Thinker', 'Creator', 'Innovator']
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const number = Math.floor(Math.random() * 999) + 1
  
  return `${adjective}${noun}${number}`
}

export const getUserDisplayName = () => {
  let displayName = localStorage.getItem('nextstep_display_name')
  if (!displayName) {
    displayName = generateDisplayName()
    localStorage.setItem('nextstep_display_name', displayName)
  }
  return displayName
} 