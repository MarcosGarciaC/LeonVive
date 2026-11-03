import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Dashboard from './pages/Dashboard/Dashboard'
import { TopicPage, TopicsHub } from './pages/Topics/Topics'
import Juegos from "./pages/Juegos/Juegos.jsx";
import { TopicsRoutes } from './pages/Topics/Topics'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard NavbarComponent={Navbar} />} />
        <Route path="/temas/*" element={<TopicsRoutes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/juegos/*" element={<Juegos />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
