import React from 'react'

const ThemeAndVideoContext = React.createContext({
  isDarkTheme: false,
  activeTab: 'Home',
  toggleTheme: () => {},
  changeTab: () => {},
  addVideo: () => {},
  savedVideos: [],
})
export default ThemeAndVideoContext
