import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Chat from './pages/chat'
import '@fontsource/kiwi-maru'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Chat />
  </React.StrictMode>,
)
