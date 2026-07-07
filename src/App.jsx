import { Routes, Route, Navigate } from "react-router-dom";
import SVIPPage from "./components/svip/SVIPPage";
import VipPage from "./routes/vip";
import Admin from "./pages/admin/AdminCenterPage";
import Agency from "./pages/agency/AgencyPage";
import BD from "./pages/bd/BdCenterPage";
import Seller from "./pages/seller/Seller";
import HostCenter from "./pages/host/HostCenterPage";
import AgentAccountScreen from "./pages/host/AgentAccountScreen";
import HostApplicationRequests from "./pages/agency/HostApplicationRequests";
import AgencyMemberList from "./pages/agency/AgencyMemberList";
import AgencyInvite from "./pages/agency/AgencyInvite";
import MerchantPage from "./pages/merchant/MerchantPage";
import MerchantHistory from "./pages/merchant/MerchantHistory";
import SellerHistory from "./pages/seller/SellerHistory";
import Room from "./pages/room/RoomReward";
import TeamMembers from "./pages/admin/list/TeamMember";
import AgentMembers from "./pages/admin/list/AgentMember";
import Members from "./pages/admin/list/Members";
import TeammateDetail from "./pages/admin/list/TeammateDetail";
import FriendsList from "./pages/admin/invite/FriendList";
import Wallet from "./pages/admin/balance/BalancePage";
import WalletDetails from "./pages/admin/balance/WalletDetails";
import MyWork from "./pages/host/myWork/MyWork";
import Balance from "./pages/host/balance/Balance";
import Exchange from "./pages/host/balance/Exchange"
import ExchangeHistory from "./pages/host/balance/ExchangeHistory";
import Transfer from "./pages/host/balance/Transfer";
import TransferHistory from "./pages/host/balance/TransferHistory";
import Withdraw from "./pages/host/balance/Withdraw";
import WithdrawalHistory from "./pages/host/balance/WithdrawHistory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/svip/1" replace />} />
      <Route path="/svip/:id" element={<SVIPPage />} />
      <Route path="/vip" element={<VipPage />} />

      <Route path="/admin" element={<Admin />} />
      <Route path="/agency" element={<Agency />} />
      <Route path="/agency/requests" element={<HostApplicationRequests />} />
      <Route path="/agency/members" element={<AgencyMemberList />} />
      <Route path="/agency/invite" element={<AgencyInvite />} />
      <Route path="/bd" element={<BD />} />
      <Route path="/seller" element={<Seller />} />
      <Route path="/seller/history" element={<SellerHistory />} />
      <Route path="/host" element={<AgentAccountScreen />} />
      <Route path="/host/dashboard" element={<HostCenter />} />
      <Route path="/merchant" element={<MerchantPage />} />
      <Route path="/merchant/history" element={<MerchantHistory />} />
      <Route path="/room/:id" element={<Room />} />
      <Route path="/team" element={<TeamMembers />} />
      <Route path="/agent/:memberType/:bdId?" element={<AgentMembers />} />

      <Route path="/members/host/:memberType/:agentId" element={<Members />} />
      <Route path="/teammate/:uid" element={<TeammateDetail />} />
      <Route path="/invite/:inviteType?" element={<FriendsList />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/wallet/details" element={<WalletDetails />} />
      <Route path="/host/dashboard/mywork" element={<MyWork />}/>
      <Route path="/host/balance" element={<Balance />}/>
      <Route path="/host/exchange" element={<Exchange />}/>
      <Route path="/host/exchange/history" element={<ExchangeHistory />}/>
      <Route path="/host/transfer" element={<Transfer />}/>
      <Route path="/host/transfer/history" element={<TransferHistory />}/>
      <Route path="/host/withdraw" element={<Withdraw />}/>
      <Route path="/host/withdraw/history" element={<WithdrawalHistory />}/>

      
      <Route path="*" element={<Navigate to="/svip/1" replace />} />
    </Routes>
  );
}

export default App;
