import './App.scss';
import { useLocation, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/protected/protected';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Landing from './components/landing/Landing';
import Login from './components/login/Auth';
import About from './components/about/About';
import Dashboard from './components/dashboard/dashboard';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  return (
    <>
      {!isAuthPage && <Header/>}
      <main>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/about' element={<About/>}/>

          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }/>
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
