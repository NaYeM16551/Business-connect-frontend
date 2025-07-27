// src/store/registrationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface RegistrationState {
  email: string
  username: string
  password: string
  industry: string[]
  interests: string[]
  achievements: string[]
  role : string // Added role to the state
}

const initialState: RegistrationState = {
  email: '',
  username: '',
  password: '',
  industry: [],
  interests: [],
  achievements: [],
  role: '' // Initialize role
}

export const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload
    },
    setCredentials(state, action: PayloadAction<{ username: string; password: string }>) {
      state.username = action.payload.username
      state.password = action.payload.password
    },
    setIndustryAndInterests(state, action: PayloadAction<{ industry: string[]; interests: string[]; role: string }>) {
      state.industry = action.payload.industry
      state.interests = action.payload.interests
      state.role = action.payload.role
    },
    setAchievements(state, action: PayloadAction<string[]>) {
      state.achievements = action.payload
    },
    setRole(state, action: PayloadAction<string>) {
      state.role = action.payload
    },
    resetRegistration() {
      return initialState
    }
  }
})

export const {
  setEmail,
  setCredentials,
  setIndustryAndInterests,
  setAchievements,
  resetRegistration
} = registrationSlice.actions
export default registrationSlice.reducer
