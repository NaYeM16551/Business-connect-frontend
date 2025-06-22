// src/store/registrationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface RegistrationState {
  email: string
  username: string
  password: string
  industry: string[]
  interests: string[]
  achievements: string[]
}

const initialState: RegistrationState = {
  email: '',
  username: '',
  password: '',
  industry: [],
  interests: [],
  achievements: []
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
    setIndustryAndInterests(state, action: PayloadAction<{ industry: string[]; interests: string[] }>) {
      state.industry = action.payload.industry
      state.interests = action.payload.interests
    },
    setAchievements(state, action: PayloadAction<string[]>) {
      state.achievements = action.payload
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
