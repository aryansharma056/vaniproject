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
import TeamMembers from "./pages/admin/list/TeamMember";
import AgentMembers from "./pages/admin/list/AgentMember";
import Members from "./pages/admin/list/Members";
import TeammateDetail from './pages/admin/list/TeammateDetail';
import FriendsList from './pages/admin/invite/FriendList';
import Wallet from './pages/admin/balance/BalancePage';
import WalletDetails from './pages/admin/balance/WalletDetails';

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
    <Route path="/invite" element={<FriendsList />} />
    <Route path="/wallet" element={<Wallet />} />
    <Route path= "/wallet/details" element={<WalletDetails />} />
  </Routes>
  )
}

export default App