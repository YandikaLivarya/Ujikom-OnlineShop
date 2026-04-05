import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavbarComponents from './Components/NavbarComponents.jsx'
import FooterComponents from './Components/FooterComponents.jsx'

import Home from './Pages/Home.jsx'
import Katalog from './Pages/Katalog.jsx'
import DetailProduct from './Pages/DetailProduct.jsx'
import Cart from './Pages/Cart.jsx'
import Collection from './Pages/Collection.jsx'
import Auth from './Pages/Auth.jsx'
import Register from './Pages/Register.jsx'
import OrderSuccess from './Pages/OrderSuccess.jsx'
import TrackPackage from './Pages/TrackPackage.jsx'
import Payment from './Pages/Payment.jsx'
import ForgotPassword from './Pages/ForgotPassword.jsx'
import Profile from './Pages/Profile.jsx'
import LoginAdmin from './Pages/LoginAdmin.jsx'

import DashboardAdmin from './Pages/DashboardAdmin.jsx'
import MainPage from './Pages/MainPage.jsx'
import MainLayout from './Pages/MainLayout.jsx'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* GRUP 1: Halaman dengan Navbar & Footer Customer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/detail-product/:id" element={<DetailProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/track-package" element={<TrackPackage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* GRUP 2: Halaman Admin (TANPA MainLayout) */}
        {/* Dashboard dikeluarkan agar tidak ada Navbar customer */}
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/admin-login" element={<LoginAdmin />} />

        {/* GRUP 3: Halaman Auth (Biasanya juga tanpa Navbar/Footer) */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App