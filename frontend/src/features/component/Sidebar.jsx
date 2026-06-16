import React from "react";
import { RiSunLine ,RiDeleteBin6Line  } from "@remixicon/react";
import { useChat } from "../chat/hooks/useChat.js"

import { useNavigate } from "react-router-dom";

import {
  RiLogoutBoxRLine
} from "react-icons/ri";
const Sidebar = ({
  chats = [],
  currentChatId,
  openChat,
  isSidebarOpen,
  setIsSidebarOpen,
  handleDeleteChat,
}) => {
  const navigate = useNavigate();

  const { handleLogout } = useChat();



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
          h-screen
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
    opacity-0
    group-hover:opacity-100
    text-zinc-500
    hover:text-red-400
    transition
  "
              >
                <RiDeleteBin6Line size={20} />
              </button>
            </div>
          ))}
        </div>


        {/* Footer */}
        <div className="p-4 shrink-0 ">
          <button
            onClick={async () => {
              const confirmLogout = window.confirm(
                "Are you sure you want to logout?"
              );

              if (confirmLogout) {
                try {
                  // console.log("Logout clicked");

                  await handleLogout();

                  // console.log("Logout success");
                  // console.log("Before navigate");

                  navigate("/login");

                  console.log("After navigate");
                } catch (error) {
                  // console.error("Logout failed:", error);
                }
              }
            }}
            className="
                cursor-pointer
                flex items-center gap-3
                text-zinc-400
                hover:text-white
                transition-colors
                text-[15px]
                font-medium
              "
          >

            <span>LOGOUT</span>
            <RiLogoutBoxRLine size={20} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;