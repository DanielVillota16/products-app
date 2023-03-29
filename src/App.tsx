import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import { ThemeProvider } from './context/ThemeContext';

function App() {

  return (
    <ThemeProvider>
      <Routes>
        <Route path='signup' Component={SignUp} />
        <Route path='login' Component={LogIn} />
        <Route path='/*' Component={Home} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
