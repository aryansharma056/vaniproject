import { ChevronLeft, Search } from "lucide-react";

const friends = [
  {
    id: "1002509",
    name: "RAIMA SEAN",
    avatar:
      "https://randomuser.me/api/portraits/women/1.jpg",
  },

  {
    id: "1002723",
    name: "Ca|x 💙",
    avatar:
      "https://randomuser.me/api/portraits/men/2.jpg",
  },

  {
    id: "1009005",
    name: "RaSagulla 🌸",
    avatar:
      "https://randomuser.me/api/portraits/women/3.jpg",
  },

  {
    id: "1009012",
    name: ". reet .",
    avatar:
      "https://randomuser.me/api/portraits/women/4.jpg",
  },

  {
    id: "1009215",
    name: "Nanu",
    avatar:
      "https://randomuser.me/api/portraits/women/5.jpg",
  },

  {
    id: "1009227",
    name: "Ritik",
    avatar:
      "https://randomuser.me/api/portraits/men/6.jpg",
  },
];

export default function FriendsList() {
  return (
    <div className="min-h-screen bg-[#0d0833] text-white">

      {/* Main Container */}
      <div className="w-full max-w-lg mx-auto px-4 py-5 sm:px-6 md:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-7">

          <button className="p-1">
            <ChevronLeft
              size={24}
              className="cursor-pointer"
            />
          </button>

          <h1 className="text-lg sm:text-2xl font-semibold">
            Friends List
          </h1>

          <div className="w-6"></div>

        </div>

        {/* Search Bar */}
        <div className="bg-[#2a2454] rounded-full px-4 py-3 flex items-center mb-7">

          <Search
            size={18}
            className="text-gray-300"
          />

          <input
            type="text"
            placeholder="Search user name or ID"
            className="bg-transparent outline-none ml-3 w-full text-sm sm:text-base text-white placeholder:text-gray-400"
          />

        </div>

        {/* Friends List */}
        <div className="flex flex-col gap-5">

          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center gap-4"
            >

              {/* Avatar */}
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover"
              />

              {/* User Info */}
              <div>

                <h2 className="text-sm sm:text-lg md:text-xl font-medium">
                  {friend.name}
                </h2>

                <p className="text-gray-400 text-xs sm:text-sm md:text-base">
                  ID: {friend.id}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}