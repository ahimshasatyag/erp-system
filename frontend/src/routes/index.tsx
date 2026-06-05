import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard1 from '../modules/dashboard/pages/Dashboard1'
import LoginPage from '../modules/auth/pages/login'
import MainLayout from '../app/layouts/MainLayout'
import ProtectedRoute from '../app/router/ProtectedRoute'
import PublicRoute from '../app/router/PublicRoute'

// CSR Pages
import CsrListPage from '../modules/csr/pages/CsrListPage'
import CsrFormPage from '../modules/csr/pages/CsrAddPage'
import CsrEditPage from '../modules/csr/pages/CsrEditPage'

// CST Pages
import CstListPage from '../modules/cst/pages/CstListPage'
import CstEditPage from '../modules/cst/pages/CstEditPage'

// LKT Pages
import LktListPage from '../modules/lkt/pages/LktListPage'
import LktAddPage from '../modules/lkt/pages/LktAddPage'
import LktEditPage from '../modules/lkt/pages/LktEditPage'
import LktRealisasiAddPage from '../modules/lkt/pages/LktRealisasiAddPage'
import LktRealisasiEditPage from '../modules/lkt/pages/LktRealisasiEditPage'

// LogBookProduct Routes
import LogBookProductListPage from '../modules/logbookproduct/pages/LogBookProductListPage'
import LogBookProductAddPage from '../modules/logbookproduct/pages/LogBookProductAddPage'
import LogBookProductEditPage from '../modules/logbookproduct/pages/LogBookProductEditPage'

// LogBookCustomer Routes
import LogBookCustomerListPage from '../modules/logbookcustomers/pages/LogBookCustomerListPage'
import LogBookCustomerAddPage from '../modules/logbookcustomers/pages/LogBookCustomerAddPage'
import LogBookCustomerEditPage from '../modules/logbookcustomers/pages/LogBookCustomerEditPage'

// Cek Serial Number Routes
import CekSerialNumberPage from '../modules/cekserialnumber/pages/CekSerialNumberPage'

// Product Routes
import ProductListPage from '../modules/products/pages/ProductListPage'
import ProductEditPage from '../modules/products/pages/ProductEditPage'
import ProductUploadPage from '../modules/products/pages/ProductUploadPage'

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
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Routes>
                                    <Route path="/" element={<Dashboard1 />} />

                                    {/* CSR Routes */}
                                    <Route path="/csr" element={<CsrListPage />} />
                                    <Route path="/csr/create" element={<CsrFormPage />} />
                                    <Route path="/csr/:code/edit" element={<CsrEditPage />} />

                                    {/* CST Routes */}
                                    <Route path="/cst" element={<CstListPage />} />
                                    <Route path="/cst/:code/edit" element={<CstEditPage />} />

                                    {/* LKT Routes */}
                                    <Route path="/lkt" element={<LktListPage />} />
                                    <Route path="/lkt/create/:cstCode" element={<LktAddPage />} />
                                    <Route path="/lkt/:code/edit" element={<LktEditPage />} />
                                    <Route path="/lkt/realisasi/create/:lktCode" element={<LktRealisasiAddPage />} />
                                    <Route path="/lkt/realisasi/:subCode/edit" element={<LktRealisasiEditPage />} />

                                    {/* LogBookProduct Routes */}
                                    <Route path="/logbookproduct" element={<LogBookProductListPage />} />
                                    <Route path="/logbookproduct/create" element={<LogBookProductAddPage />} />
                                    <Route path="/logbookproduct/:code/edit" element={<LogBookProductEditPage />} />

                                    {/* LogBookCustomer Routes */}
                                    <Route path="/logbookcustomers" element={<LogBookCustomerListPage />} />
                                    <Route path="/logbookcustomers/create" element={<LogBookCustomerAddPage />} />
                                    <Route path="/logbookcustomers/:id/edit" element={<LogBookCustomerEditPage />} />

                                    {/* Cek Serial Number Routes */}
                                    <Route path="/cekserialnumber" element={<CekSerialNumberPage />} />

                                    {/* Product Routes */}
                                    <Route path="/product" element={<ProductListPage />} />
                                    <Route path="/product/create" element={<ProductEditPage />} />
                                    <Route path="/product/edit/:id" element={<ProductEditPage />} />
                                    <Route path="/product/duplicate/:id" element={<ProductEditPage />} />
                                    <Route path="/product/upload" element={<ProductUploadPage />} />
                                </Routes>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}