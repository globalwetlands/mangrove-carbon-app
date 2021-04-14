import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import widgetSettingsSlice from './widgetSettingsSlice'
import globalSettingsSlice from './globalSettingsSlice'

const createPersistedReducer = ({ key, reducer, config = {} }) => {
  const persistConfig = {
    key,
    storage,
    ...config,
  }

  const persistedReducer = persistReducer(persistConfig, reducer)
  return persistedReducer
}

const rootReducer = combineReducers({
  widgetSettings: createPersistedReducer({
    reducer: widgetSettingsSlice,
    key: 'widgetSettings',
  }),
  globalSettings: globalSettingsSlice,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
})
export const persistor = persistStore(store)
