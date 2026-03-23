import './App.scss';
import { useLocation, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Landing from './components/landing/Landing';
import Login from './components/login/Login';
import About from './components/about/About';

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
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
