import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/Authcontext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/Forgotpassword";
import Search from "./pages/Search";
import ProviderProfile from "./pages/Providerprofile";
import Booking from "./pages/Booking";
import CustomerDashboard from "./pages/Customerdashboard";
import ProviderDashboard from "./pages/Providerdashboard";
import CreateProviderProfile from "./pages/CreateProviderProfile";
import AIAssistant from "./pages/Aiassistant";
import LeaveReview from "./pages/Leavereview";
import FileComplaint from "./pages/Filecomplaint";
import AdminDashboard from "./pages/AdminDashboard";
import ProviderVerification from "./pages/ProviderVerification";
import Payment from "./pages/Payment";
import AppealSuspension from "./pages/Appealsuspension";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/search" element={<Search />} />
          <Route path="/providers/:id" element={<ProviderProfile />} />
          <Route path="/booking/:providerId" element={<Booking />} />
          <Route path="/dashboard/customer" element={<CustomerDashboard />} />
          <Route path="/dashboard/provider" element={<ProviderDashboard />} />
          <Route path="/provider/create" element={<CreateProviderProfile />} />
          <Route path="/assistant" element={<AIAssistant />} />
          <Route path="/leave-review/:bookingId" element={<LeaveReview />} />
          <Route path="/file-complaint" element={<FileComplaint />} />
          <Route path="/file-complaint/:bookingId" element={<FileComplaint />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/provider/verification" element={<ProviderVerification />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
          <Route path="/appeal-suspension" element={<AppealSuspension />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;