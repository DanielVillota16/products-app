import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Home, LogIn, SignUp } from './components';

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
