import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './pages/public/NotFound'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ScrollToTop from './components/ScrollToTop'

// Public Pages (Lazy loaded)
const Home = lazy(() => import('./pages/public/Home'))
const Products = lazy(() => import('./pages/public/Products'))
const ProductDetail = lazy(() => import('./pages/public/ProductDetail'))
const Contact = lazy(() => import('./pages/public/Contact'))
const About = lazy(() => import('./pages/public/About'))
const Articles = lazy(() => import('./pages/public/Articles'))

// Admin Pages (Lazy loaded)
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const ManageProducts = lazy(() => import('./pages/admin/ManageProducts'))
const ManageCategories = lazy(() => import('./pages/admin/ManageCategories'))
const ManageArticles = lazy(() => import('./pages/admin/ManageArticles'))
const ManageAboutPage = lazy(() => import('./pages/admin/ManageAboutPage'))
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'))
const Settings = lazy(() => import('./pages/admin/Settings'))
const ChangePassword = lazy(() => import('./pages/admin/ChangePassword'))
const ManageMessages = lazy(() => import('./pages/admin/ManageMessages'))
const ManageHomePage = lazy(() => import('./pages/admin/ManageHomePage'))

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
                <Routes>
                  {/* Public Routes */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/produk" element={<Products />} />
                    <Route path="/products/:slug" element={<ProductDetail />} />
                    <Route path="/artikel" element={<Articles />} />
                    <Route path="/tentang-kami" element={<About />} />
                    <Route path="/hubungi-kami" element={<Contact />} />
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  {/* Admin Auth Route */}
                  <Route path="/admin/login" element={<Login />} />

                  {/* Admin Protected Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="produk" element={<ManageProducts />} />
                    <Route path="kategori" element={<ManageCategories />} />
                    <Route path="artikel" element={<ManageArticles />} />
                    <Route path="tentang" element={<ManageAboutPage />} />
                    <Route path="user" element={<ManageUsers />} />
                    <Route path="pengaturan" element={<Settings />} />
                    <Route path="ganti-password" element={<ChangePassword />} />
                    <Route path="pesan" element={<ManageMessages />} />
                    <Route path="beranda" element={<ManageHomePage />} />
                  </Route>
                </Routes>
              </Suspense>
              <Toaster position="top-center" richColors />
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
