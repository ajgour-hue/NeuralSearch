import React from "react";
import { RiUserSmileLine, RiSunLine, RiDeleteBin6Line, RiSettings3Line } from "@remixicon/react";
import { useChat } from "../chat/hooks/useChat.js"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useEffect } from "react";
const Sidebar = ({ chats = [], currentChatId, openChat, isSidebarOpen, setIsSidebarOpen, handleDeleteChat, }) => {


  const navigate = useNavigate();

  const { handleLogout } = useChat();

  const [openSettings, setOpenSettings] = useState(false);

  const user = useSelector(state => state.auth.user)



  useEffect(() => {
    const closeMenu = () => setOpenSettings(false);

    if (openSettings) {
      window.addEventListener("click", closeMenu);
    }

    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, [openSettings]);

  return (
    <>
      {/* Mobile Overlay */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`
          md:hidden
          fixed inset-0
          bg-black/50
          backdrop-blur-sm
          z-40
          transition-all duration-300
          ${isSidebarOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
          }
        `}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed md:fixed
          top-0 left-0
         h-dvh
         
          w-[260px] md:w-[210px]
          flex flex-col
          bg-[#050505]
          border-r border-white/10
          z-50

          transform
          transition-transform
          duration-300
          ease-out

          ${isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-3 shrink-0">
          <div className="flex items-center">
            <img
              src="/perplexity.svg"
              alt="Perplexity"
              className="h-8 w-auto brightness-0 invert"
            />

            <span className="ml-3 text-[34px] font-extralight text-white">
              Perplexity
            </span>
          </div>

          {/* Mobile Close */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-zinc-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Recent */}
        <div className="px-6 pt-5 pb-2 shrink-0">
          <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-500 font-semibold">
            Recent
          </span>
        </div>

        {/* Chat List */}
        <div
          className="flex-1 overflow-y-auto px-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {Object.values(chats).map((chat) => (
            <div
              key={chat.id}
              className="group flex items-center gap-2 px-2"
            >
              <button
                onClick={() => {
                  openChat(chat.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  cursor-pointer
                  flex-1
                  text-left
                  py-3
                  px-3
                  rounded-lg
                  truncate
                  text-[15px]
                  transition
                  ${currentChatId === chat.id
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                {chat.title}
              </button>

              <button
                onClick={() => {
                  const confirmDelete = window.confirm(
                    "Delete this chat?"
                  );

                  if (confirmDelete) {
                    handleDeleteChat(chat.id);
                  }
                }}
                className="
  cursor-pointer
  opacity-100
  md:opacity-0
  md:group-hover:opacity-100
  text-zinc-500
  hover:text-red-400
  transition
  shrink-0
"
              >
                <RiDeleteBin6Line size={20} />
              </button>
            </div>
          ))}
        </div>


        {/* Footer */}


        <div className="relative p-4 flex gap-3">
          {/* Settings Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenSettings(!openSettings);
            }}
            className="cursor-pointer text-zinc-400 hover:text-white transition-colors"
          >

            <RiUserSmileLine size={24} />
          </button>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">
              {user?.username || "User"}

            </span>
            <span className="text-xs text-zinc-500">
              Profile
            </span>
          </div>


          {/* Dropdown */}
          {openSettings && (
            <div className="absolute bottom-14 left-4 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden">

              {/* Theme */}
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800"
              >
                <RiSunLine size={18} />
                <span>Light Mode</span>
              </button>

              {/* Logout */}
              <button
                onClick={async () => {
                  const confirmLogout = window.confirm(
                    "Are you sure you want to logout?"
                  );

                  if (confirmLogout) {
                    await handleLogout();
                    navigate("/login");
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-zinc-800"
              >
                <RiLogoutBoxRLine size={18} />
                <span>Logout</span>
              </button>

            </div>
          )}
        </div>


      </aside>
    </>
  );
};

export default Sidebar;