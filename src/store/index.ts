// src/store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'      // uses window.localStorage
import registrationReducer from './registrationSlice'

const rootReducer = combineReducers({
  registration: registrationReducer,
  // …any other slices you may have
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['registration'],  // only persist the registration slice
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,   // redux-persist uses non-serializable actions
    }),
})

// This “persistor” will be passed into PersistGate
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
