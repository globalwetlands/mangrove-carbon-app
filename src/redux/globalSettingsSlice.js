import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showMenuHelpText: true,
}

const globalSettingsSlice = createSlice({
  name: 'globalSettings',
  initialState,
  reducers: {
    hideMenuHelpText: (state) => {
      state.showMenuHelpText = false
    },
  },
})

export const { hideMenuHelpText } = globalSettingsSlice.actions

export default globalSettingsSlice.reducer
