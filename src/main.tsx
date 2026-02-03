import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import { TableProvider } from './context/TableContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TableProvider>
      <App />
    </TableProvider>
  </React.StrictMode>,
)
