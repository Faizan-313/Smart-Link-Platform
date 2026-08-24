import Home from "./pages/Home"
import Login from "./pages/Authentication/Login"
import Navbar from "./components/Navbar"
import Register from "./pages/Authentication/Register"
import { Toaster } from "react-hot-toast"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Footer from "./components/Footer"
import UserLayout from "./layout/UserLayout"
import Dashboard from "./pages/user/Dashboard"
import CreateLink from "./pages/user/components/CreateLink"
import MyLinks from "./pages/user/MyLinks"
import PublicLinks from "./pages/user/PublicLinks"

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/create-link" element={<CreateLink />} />
        <Route path="/dashboard/my-links" element={<MyLinks />} />
        <Route path="/dashboard/public-links" element={<PublicLinks />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <AppContent />
      <Footer />
    </Router>
  )
}

export default App
