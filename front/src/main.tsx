import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer.tsx';
import Header from './components/Header/Header.tsx';
import MainWrapper from './components/MainWrapper/MainWrapper.tsx';
import ScrollToTop from './components/ScrollOnTop/ScrollOnTop.tsx';
import './index.css';
import Auth from './pages/Auth/Auth.tsx';
import Breed from './pages/Breed/Breed.tsx';
import Favorites from './pages/Favorites/Favorites.tsx';
import Main from './pages/Main/Main.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import Register from './pages/Register/Register.tsx';
import { ROUTES } from './utils/routes.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainWrapper>
      <Router>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path={`${ROUTES.HOME}`} element={<Main />}></Route>
          <Route path={`${ROUTES.BREED}`} element={<Breed />}></Route>
          <Route path={`${ROUTES.FAVORITES}`} element={<Favorites />}></Route>
          <Route path={`${ROUTES.AUTH}`} element={<Auth />}></Route>
          <Route path={`${ROUTES.REGISTER}`} element={<Register />}></Route>
          <Route path={`${ROUTES.NOT_FOUND}`} element={<NotFound />}></Route>
        </Routes>
        <Footer />
      </Router>
    </MainWrapper>
  </StrictMode>,
);
