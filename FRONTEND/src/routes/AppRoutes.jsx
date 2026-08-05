import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from '../pages/Landing/Landing.jsx'
import Login from '../pages/Auth/Login.jsx'
import Register from '../pages/Auth/Register.jsx'
import JobOffers from '../pages/User/JobOffers.jsx'
import Applications from '../pages/User/Applications.jsx'
import UserProfile from '../pages/User/UserProfile.jsx'
import ProfessionalServices from '../pages/User/ProfessionalServices.jsx'
import CreateService from '../pages/User/CreateService.jsx'
import MyServices from '../pages/User/MyServices.jsx'
import MyQuotations from '../pages/User/MyQuotations.jsx'
import CreateOffer from '../pages/Company/CreateOffer.jsx'
import EditOffer from '../pages/Company/EditOffer.jsx'
import CompanyOffers from '../pages/Company/CompanyOffers.jsx'
import CompanyProfile from '../pages/Company/CompanyProfile.jsx'
import CreateCompanyService from '../pages/Company/CreateCompanyService.jsx'
import AdminDashboard from '../pages/Admin/AdminDashboard.jsx'
import AdminUsers from '../pages/Admin/User.jsx'
import AdminCompanies from '../pages/Admin/Companies.jsx'
import AdminOffers from '../pages/Admin/Offers.jsx'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/ofertas" element={<JobOffers />} />
        <Route path="/mis-postulaciones" element={<Applications />} />
        <Route path="/mi-perfil" element={<UserProfile />} />
        <Route path="/servicios-profesionales" element={<ProfessionalServices />} />
        <Route path="/profesional/publicar-servicio" element={<CreateService />} />
        <Route path="/profesional/mis-servicios" element={<MyServices />} />
        <Route path="/mis-cotizaciones" element={<MyQuotations />} />
        <Route path="/empresa/nueva-oferta" element={<CreateOffer />} />
        <Route path="/empresa/editar-oferta/:id" element={<EditOffer />} />
        <Route path="/empresa/mis-ofertas" element={<CompanyOffers />} />
        <Route path="/empresa/mi-perfil" element={<CompanyProfile />} />
        <Route path="/empresa/publicar-servicio" element={<CreateCompanyService />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/usuarios" element={<AdminUsers />} />
        <Route path="/admin/empresas" element={<AdminCompanies />} />
        <Route path="/admin/ofertas" element={<AdminOffers />} />
      </Routes>
    </BrowserRouter>
  )
}
