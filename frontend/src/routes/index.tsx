import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard1 from '../modules/dashboard/pages/Dashboard1'
import LoginPage from '../modules/auth/pages/login'
import MainLayout from '../app/layouts/MainLayout'

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={
                    <MainLayout>
                        <Dashboard1 />
                    </MainLayout>
                } />
            </Routes>
        </BrowserRouter>
    )
}