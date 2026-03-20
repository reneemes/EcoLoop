import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Landing from './components/landing/Landing';

function App() {

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          {/* <Route path='/' element={<Landing/>}/> */}
          {/* <Route path='/' element={<Landing/>}/> */}
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
