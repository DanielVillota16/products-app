import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignUp from './components/SignUp'
import LogIn from './components/LogIn'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <Routes>
      <Route path='signup' Component={SignUp} />
      <Route path='login' Component={LogIn} />
      <Route path='/*' Component={App} />
    </Routes>
  </BrowserRouter>
)
