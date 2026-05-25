import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard1 from '../modules/dashboard/pages/Dashboard1'
import LoginPage from '../modules/auth/pages/login'
import MainLayout from '../app/layouts/MainLayout'
import ProtectedRoute from '../app/router/ProtectedRoute'
import PublicRoute from '../app/router/PublicRoute'

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public guest routes (Redirect to dashboard if logged in) */}
                <Route 
                    path="/login" 
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    } 
                />

                {/* Protected private routes (Redirect to login if unauthenticated) */}
                <Route 
                    path="/" 
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Dashboard1 />
                            </MainLayout>
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </BrowserRouter>
    )
}