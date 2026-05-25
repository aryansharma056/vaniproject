import { Routes, Route, Navigate } from 'react-router-dom'
import SVIPPage from './components/svip/SVIPPage'
import VipPage from './routes/vip'
import Admin from "./pages/admin/AdminCenterPage";
import Agency from "./pages/agency/AgencyPage";
import BD from "./pages/bd/BdCenterPage";
import Seller from "./pages/seller/Seller";
import HostCenter from "./pages/host/HostCenterPage"
import MerchantPage from "./Pages/Merchant/MerchantPage";
import Room from "./pages/room/RoomReward"
import TeamMembers from "./pages/admin/TeamMember";
import AgentMembers from "./pages/admin/AgentMember";
import Members from "./pages/admin/Members";
import TeammateDetail from './pages/admin/Teammatedetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/svip/1" replace />} />
      <Route path="/svip/:id" element={<SVIPPage />} />
      <Route path="/vip" element={<VipPage />} />
      <Route path="*" element={<Navigate to="/svip/1" replace />} />
    
    <Route path="/admin" element={<Admin />} />
    <Route path="/agency" element={<Agency />} />
    <Route path="/bd" element={<BD />} />
    <Route path="/seller" element={<Seller />} />
    <Route path="/host" element={<HostCenter />} />
   <Route path="/merchant" element={<MerchantPage />} />
    <Route path="/room/:id" element={<Room />} />
    <Route path="/team" element={<TeamMembers />} />
    <Route path="/agent" element={<AgentMembers />} />
    <Route path ="/members" element={<Members />} />
    <Route path="/teammate/:uid" element={<TeammateDetail />} />
  </Routes>
  )
}

export default App