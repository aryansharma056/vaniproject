import { useState, useEffect } from "react";
import api from "../../../services/api";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import AVATAR_IMG from "../../../assets/ht heaven place.webp";

function CoinIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 flex-shrink-0"
      viewBox="0 0 22 22"
      fill="none"
    >
      <ellipse
        cx="11"
        cy="6"
        rx="7"
        ry="3.2"
        fill="#f59e0b"
      />
      <rect
        x="4"
        y="6"
        width="14"
        height="3"
        fill="#f59e0b"
      />
      <ellipse
        cx="11"
        cy="9"
        rx="7"
        ry="3.2"
        fill="#fbbf24"
      />
      <rect
        x="4"
        y="9"
        width="14"
        height="3"
        fill="#f59e0b"
      />
      <ellipse
        cx="11"
        cy="12"
        rx="7"
        ry="3.2"
        fill="#fcd34d"
      />
    </svg>
  );
}

function MemberCard({
  member,
  memberType,
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl px-3.5 py-3 shadow-sm w-full">

      {/* Top Row */}
      <div className="flex items-start gap-2.5">

        {/* Avatar */}
        <div className="w-12 h-12 sm:w-[62px] sm:h-[62px] rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
          <img
            src={
              member.image ||
              AVATAR_IMG
            }
            alt={member.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                AVATAR_IMG;
            }}
          />
        </div>

        {/* Name + ID */}
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-extrabold text-gray-900 break-words leading-tight">
            {member.name}
          </p>

          <p className="text-[12px] sm:text-[13px] font-semibold text-gray-400 mt-0.5">
            ID: {member.uid}
          </p>
        </div>

        {/* Right badges */}
        <div className="flex items-center justify-end gap-1.5 mb-8 flex-shrink-0">

          {/* Host */}
          <div
            className="border border-violet-400 rounded-full px-2.5 sm:px-3.5 py-0.5 text-[11px] sm:text-[13px] font-bold text-violet-500 whitespace-nowrap cursor-pointer active:opacity-70"
            onClick={() =>
navigate(
  `/members/host/${memberType}/${member.id}`
)
}
          >
            Host:{" "}
            {member.host_count ??
              member.hosts_count ??
              0}
          </div>

          {/* Coins */}
          <div className="border border-amber-400 rounded-full px-2.5 sm:px-3 py-0.5 text-[11px] sm:text-[13px] font-bold text-amber-500 whitespace-nowrap flex items-center gap-1">
            <CoinIcon />
            0
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex items-center justify-end gap-4 sm:gap-7 -mt-3">
        <div className="border border-amber-400 rounded-full px-2.5 sm:px-3.5 py-0.5 text-[11px] sm:text-[13px] font-bold text-amber-500 whitespace-nowrap">
          <span className="text-gray-800 font-bold">
            Total:
          </span>{" "}
          0
        </div>

        <p className="text-[12px] sm:text-[13px] font-semibold text-gray-400">
          {member.created_at
            ? new Date(
                member.created_at
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )
            : ""}
        </p>
      </div>
    </div>
  );
}

export default function AgentMembers() {
const navigate =
  useNavigate();

const {
  memberType,
  bdId,
} = useParams();

  const [search, setSearch] =
    useState("");

  const [members, setMembers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [visibleCount,
    setVisibleCount] =
    useState(10);

  const fetchAgentList =
    async () => {
      try {
        setLoading(true);
let endpoint =
  "/admin-center/agent-list";

// Admin → BD list
if (
  memberType === "bd" &&
  bdId
) {
  endpoint =
    `/admin-center/bd-agent-list/${bdId}`;
}

// BD Center → Agent list
if (
  memberType ===
  "bd-center"
) {
  endpoint =
    "/bd/agent-list";
}

const result =
  await api.get(
    endpoint
  );

        console.log(
          result
        );

        if (
          result?.status
        ) {
          setMembers(
            result.data
          );
        }
      } catch (error) {
        console.error(
          "Agent list error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAgentList();
  }, []);

  const filtered =
    members
      .filter(
        (m) =>
          m.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          String(
            m.uid
          ).includes(
            search
          )
      )
      .slice(
        0,
        visibleCount
      );

  return (
    <div className="min-h-screen w-full bg-[#dce6f5] flex flex-col">

      {/* Header */}
      <div className="bg-white flex items-center justify-center px-4 py-4 relative border-b border-gray-100">

        <button
        onClick={() => {
 if (
  memberType ===
  "bd"
) {
  navigate("/team");
} else if (
  memberType ===
  "bd-center"
) {
  navigate("/bd");
} else {
  navigate("/admin");
}
}}  
          className="absolute left-4 text-3xl text-gray-800 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 active:bg-gray-200 leading-none"
        >
          ‹
        </button>

        <h1 className="text-[18px] font-bold text-gray-900 tracking-wide">
          {memberType ===
          "bd"
            ? "BD Agent Members"
            : "Agent Members"}
        </h1>
      </div>

      {/* Body */}
      <div className="flex-1 w-full max-w-lg mx-auto px-3.5 py-4 flex flex-col gap-3">

        {/* Search */}
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#bbb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />
              <line
                x1="16.5"
                y1="16.5"
                x2="22"
                y2="22"
              />
            </svg>
          </span>

          <input
            type="text"
            placeholder="Please enter an account"
            value={search}
            onChange={(
              e
            ) =>
              setSearch(
                e.target
                  .value
              )
            }
            className="w-full bg-white rounded-full py-3 sm:py-3.5 pl-11 pr-5 text-[14px] text-gray-700 placeholder-gray-300 outline-none shadow-sm"
          />
        </div>

        {/* Cards */}
        {loading ? (
          <p className="text-center text-gray-400 mt-10">
            Loading...
          </p>
        ) : filtered.length >
          0 ? (
         filtered.map(
  (m) => (
    <MemberCard
      key={m.id}
      member={m}
      memberType={
        memberType
      }
    />
  )
)
        ) : (
          <p className="text-center text-gray-400 text-sm mt-10">
            No members found
          </p>
        )}

        {/* Load More */}
        <div className="text-center pt-1 pb-4">
          {visibleCount <
            members.length && (
            <button
              onClick={() =>
                setVisibleCount(
                  (
                    prev
                  ) =>
                    prev +
                    10
                )
              }
              className="text-sky-400 font-bold text-[15px] hover:opacity-70 active:opacity-50"
            >
              Load more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}