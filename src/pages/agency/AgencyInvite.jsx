import { ChevronLeft, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import AVATAR_IMG from "../../assets/ht heaven place.webp";

export default function AgencyInvite() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [friends, setFriends] = useState([]);

  const [loading, setLoading] = useState(true);

  const [visibleCount, setVisibleCount] = useState(10);

  // Popup
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [inviteLoading, setInviteLoading] = useState(false);

  // Fetch Friends
  const fetchFriends = async () => {
    try {
      setLoading(true);

      const result = await api.get("/message/get-friend-list");

      console.log(result);

      if (result?.status) {
        setFriends(result.data);
      }
    } catch (error) {
      console.error("Friends list error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // Send Invite
  const sendInvite = async () => {
    if (!selectedFriend) return;

    try {
      setInviteLoading(true);

      const result = await api.post("/agency/invite-host", {
        user_id: selectedFriend.id,
      });

      console.log(result);

      if (result?.status) {
        alert(result.message);

        // Update pending state
        setFriends((prev) =>
          prev.map((friend) =>
            friend.id === selectedFriend.id
              ? {
                  ...friend,
                  invite_status: result.data?.invite_status || "pending",
                }
              : friend,
          ),
        );

        setSelectedFriend(null);
      }
    } catch (error) {
      console.error("Invite error:", error);

      alert(error?.response?.data?.message || "Failed to send invite");
    } finally {
      setInviteLoading(false);
    }
  };

  // Search Filter
  const searchedFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(search.toLowerCase()) ||
      String(friend.uid).includes(search),
  );

  // Pagination
  const filteredFriends = searchedFriends.slice(0, visibleCount);

  const totalFilteredFriends = searchedFriends.length;

  return (
    <div className="min-h-screen bg-[#0d0833] text-white">
      <div className="w-full max-w-lg mx-auto px-4 py-5 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <button onClick={() => navigate("/agency")} className="p-1">
            <ChevronLeft size={24} className="cursor-pointer" />
          </button>

          <h1 className="text-lg sm:text-2xl font-semibold">
            Invite Host
          </h1>

          <div className="w-6"></div>
        </div>

        {/* Search */}
        <div className="bg-[#2a2454] rounded-full px-4 py-3 flex items-center mb-7">
          <Search size={18} className="text-gray-300" />

          <input
            type="text"
            placeholder="Search user name or ID"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(10);
            }}
            className="bg-transparent outline-none ml-3 w-full text-sm sm:text-base text-white placeholder:text-gray-400"
          />
        </div>

        {/* Friend List */}
        <div className="flex flex-col gap-5">
          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => (
              <div
                key={friend.id}
                onClick={() => setSelectedFriend(friend)}
                className="flex items-center gap-4 min-w-0 cursor-pointer active:scale-[0.98] transition"
              >
                {/* Avatar */}
                <img
                  src={friend.image || AVATAR_IMG}
                  alt={friend.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.src = AVATAR_IMG;
                  }}
                />

                {/* User */}
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm sm:text-lg md:text-xl font-medium truncate">
                    {friend.name}
                  </h2>

                  <p className="text-gray-400 text-xs sm:text-sm md:text-base">
                    ID: {friend.uid}
                  </p>
                </div>

                {/* Pending */}
                {friend.invite_status === "pending" ? (
                  <span className="text-xs text-yellow-400 font-medium">
                    Pending
                  </span>
                ) : null}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No friends found</p>
          )}
        </div>

        {/* Load More */}
        <div className="text-center pt-6 pb-4">
          {visibleCount < totalFilteredFriends && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="text-violet-300 font-semibold text-sm hover:opacity-70 active:opacity-50"
            >
              Load More
            </button>
          )}
        </div>
      </div>

      {/* Invite Popup */}
      {selectedFriend && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-5">
          <div className="bg-[#1b1642] rounded-[28px] p-6 w-full max-w-sm shadow-2xl">
            {/* Avatar */}
            <div className="flex justify-center">
              <img
                src={selectedFriend.image || AVATAR_IMG}
                alt={selectedFriend.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-violet-500"
                onError={(e) => {
                  e.target.src = AVATAR_IMG;
                }}
              />
            </div>

            {/* User */}
            <div className="text-center mt-4">
              <h2 className="text-xl font-bold text-white">
                {selectedFriend.name}
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                ID: {selectedFriend.uid}
              </p>
            </div>

            {/* Text */}
            <p className="text-center text-gray-300 text-sm mt-5">
              Do you want to send a{" "}
              <span className="font-semibold text-violet-300">
                Host
              </span>{" "}
              invite to this friend?
            </p>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedFriend(null)}
                className="flex-1 bg-gray-600 text-white py-3 rounded-full font-medium active:scale-95 transition"
              >
                Cancel
              </button>

              <button
                onClick={sendInvite}
                disabled={inviteLoading}
                className="flex-1 bg-violet-600 text-white py-3 rounded-full font-medium active:scale-95 transition disabled:opacity-50"
              >
                {inviteLoading ? "Sending..." : "Send Invite"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
