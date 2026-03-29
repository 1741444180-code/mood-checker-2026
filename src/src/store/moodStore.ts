import { create } from 'zustand'

interface Mood {
  id: number
  date: string
  moodType: string
  note?: string
  tags?: string[]
}

interface User {
  id: string
  name: string
  email: string
}

interface AppState {
  user: User | null
  moods: Mood[]
  loading: boolean
  error: string | null
  
  // User actions
  setUser: (user: User) => void
  clearUser: () => void
  
  // Mood actions
  addMood: (mood: Mood) => void
  updateMood: (id: number, mood: Partial<Mood>) => void
  deleteMood: (id: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  moods: [],
  loading: false,
  error: null,
  
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  
  addMood: (mood) => set((state) => ({ moods: [...state.moods, mood] })),
  updateMood: (id, updatedMood) => 
    set((state) => ({
      moods: state.moods.map((mood) => (mood.id === id ? { ...mood, ...updatedMood } : mood))
    })),
  deleteMood: (id) => 
    set((state) => ({
      moods: state.moods.filter((mood) => mood.id !== id)
    })),
    
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))