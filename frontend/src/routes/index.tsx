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

// Product Category Routes
import ProductCategoryListPage from '../modules/productcategory/pages/ProductCategoryListPage'
import ProductCategoryAddPage from '../modules/productcategory/pages/ProductCategoryAddPage'
import ProductCategoryEditPage from '../modules/productcategory/pages/ProductCategoryEditPage'

// Product Sub Category Routes
import ProductSubCategoryListPage from '../modules/productsubcategory/pages/ProductSubCategoryListPage'
import ProductSubCategoryCreatePage from '../modules/productsubcategory/pages/ProductSubCategoryCreatePage'
import ProductSubCategoryEditPage from '../modules/productsubcategory/pages/ProductSubCategoryEditPage'

// Product Unit Routes
import ProductUnitListPage from '../modules/productunit/pages/ProductUnitListPage'
import ProductUnitAddPage from '../modules/productunit/pages/ProductUnitAddPage'
import ProductUnitEditPage from '../modules/productunit/pages/ProductUnitEditPage'

// Product Brand Routes
import ProductBrandListPage from '../modules/productbrand/pages/ProductBrandListPage'
import ProductBrandAddPage from '../modules/productbrand/pages/ProductBrandAddPage'
import ProductBrandEditPage from '../modules/productbrand/pages/ProductBrandEditPage'

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

                                    {/* Product Category Routes */}
                                    <Route path="/productcategory" element={<ProductCategoryListPage />} />
                                    <Route path="/productcategory/create" element={<ProductCategoryAddPage />} />
                                    <Route path="/productcategory/:id/edit" element={<ProductCategoryEditPage />} />
                                    
                                    {/* Product Sub Category Routes */}
                                    <Route path="/productsubcategory" element={<ProductSubCategoryListPage />} />
                                    <Route path="/productsubcategory/create" element={<ProductSubCategoryCreatePage />} />
                                    <Route path="/productsubcategory/:id/edit" element={<ProductSubCategoryEditPage />} />

                                    {/* Product Unit Routes */}
                                    <Route path="/productunit" element={<ProductUnitListPage />} />
                                    <Route path="/productunit/create" element={<ProductUnitAddPage />} />
                                    <Route path="/productunit/:id/edit" element={<ProductUnitEditPage />} />

                                    {/* Product Brand Routes */}
                                    <Route path="/productbrand" element={<ProductBrandListPage />} />
                                    <Route path="/productbrand/create" element={<ProductBrandAddPage />} />
                                    <Route path="/productbrand/:id/edit" element={<ProductBrandEditPage />} />

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