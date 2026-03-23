import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import DashboardLayout from './components/DashboardLayout'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />

          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path='/dashboard' element={<DashboardPage />} />
          </Route>

          <Route path='*' element={<Navigate to='/dashboard' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
