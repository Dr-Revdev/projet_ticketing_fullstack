import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import DashboardLayout from './components/DashboardLayout'
import TicketsPage from './pages/TicketsPage'
import CreateTicketPage from './pages/CreationTicketPage'
import TicketDetailPage from './pages/TicketDetailPage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import UtilisateursPage from './pages/UtilisateursPage'
import ProfilPage from './pages/ProfilPage'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/change-password' element={<ChangePasswordPage />} />

          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path='/tickets' element={<TicketsPage />} />
            <Route path='/tickets/new' element={<CreateTicketPage />} />
            <Route path='/tickets/:id' element={<TicketDetailPage />} />
            <Route path='/utilisateurs' element={<UtilisateursPage />} />
            <Route path='/profil' element={<ProfilPage />} />
          </Route>

          <Route path='*' element={<Navigate to='/dashboard' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
