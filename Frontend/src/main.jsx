
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppContentProvider } from './Context/AppContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <AppContentProvider>
        <App />
      </AppContentProvider>
    </BrowserRouter>
 
)


