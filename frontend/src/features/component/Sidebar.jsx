import React, { useState, useEffect, useRef, useCallback } from "react";
import { RiUserSmileLine, RiSunLine, RiDeleteBin6Line, RiSearchLine, RiCloseLine, RiBrain2Fill, RiUserSettingsLine } from "@remixicon/react";
import { useChat } from "../chat/hooks/useChat.js";
import { useNavigate } from "react-router-dom";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useSelector } from "react-redux";

const MIN_WIDTH = 220;
const MAX_WIDTH = 380;
const DEFAULT_WIDTH = 260;
const STORAGE_KEY = "sidebar-width";

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
  const [openSettings, setOpenSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((state) => state.auth.user);

  // ---- Resizable width ----
  const [width, setWidth] = useState(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    return saved >= MIN_WIDTH && saved <= MAX_WIDTH ? saved : DEFAULT_WIDTH;
  });
  const isResizing = useRef(false);

  const startResizing = useCallback((e) => {
    if (!isDesktop()) return; // resizing is a desktop-only affordance
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const stopResizing = useCallback(() => {
    if (!isResizing.current) return;
    isResizing.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    setWidth((w) => {
      localStorage.setItem(STORAGE_KEY, String(w));
      return w;
    });
  }, []);

  const resize = useCallback((e) => {
    if (!isResizing.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, clientX));
    setWidth(next);
  }, []);

  // Only matters on desktop — mobile always uses a fixed drawer width,
  // so we never bother reading/writing the resize state there.
  const isDesktop = () =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    window.addEventListener("touchmove", resize);
    window.addEventListener("touchend", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      window.removeEventListener("touchmove", resize);
      window.removeEventListener("touchend", stopResizing);
    };
  }, [resize, stopResizing]);

  // ---- Settings dropdown outside-click handling ----
  useEffect(() => {
    const closeMenu = () => setOpenSettings(false);
    if (openSettings) {
      window.addEventListener("click", closeMenu);
    }
    return () => window.removeEventListener("click", closeMenu);
  }, [openSettings]);

  const initial = (user?.username || "U").charAt(0).toUpperCase();

  const filteredChats = Object.values(chats).filter((chat) =>
    (chat.title || "").toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <>
      {/* Mobile Overlay */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`
          md:hidden
          fixed inset-0
          bg-black/60
          backdrop-blur-sm
          z-40
          transition-opacity duration-300
          ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      {/* Publishes the current desktop width so other elements (e.g. main
          content margin) can stay in sync without prop-drilling. Mobile
          ignores this entirely and uses a fixed drawer width below. */}
      <style>{`:root { --sidebar-width: ${width}px; }`}</style>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:fixed
          top-0 left-0
          h-dvh
          w-[260px] md:w-[var(--sidebar-width,260px)]
          flex flex-col
          bg-[#050505]
          border-r border-white/10
          z-50

          transform
          transition-transform
          duration-300
          ease-out

          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 shrink-0 border-b border-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <RiBrain2Fill />
            <span className="text-[20px] font-light tracking-tight text-white truncate">
              Neural<span className="font-medium">Search</span>
            </span>
          </div>

          {/* Mobile Close */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-zinc-500 hover:text-white text-xl leading-none transition-colors"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pt-4 pb-2 shrink-0">
          <div className="relative">
            <RiSearchLine
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="
                w-full
                bg-white/5
                border border-white/10
                rounded-lg
                pl-9 pr-8 py-2
                text-sm text-white
                placeholder:text-zinc-500
                outline-none
                focus:border-white/25
                transition-colors
              "
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="
                  absolute right-2 top-1/2 -translate-y-1/2
                  text-zinc-500 hover:text-white
                  p-0.5 rounded-md
                  transition-colors
                "
              >
                <RiCloseLine size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Recent */}
        <div className="px-5 pt-5 pb-2 shrink-0">
          <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
            Recent
          </span>
        </div>

        {/* Chat List */}
        <div
          className="flex-1 overflow-y-auto px-2 space-y-0.5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filteredChats.length === 0 && (
            <p className="px-3 py-2 text-sm text-zinc-600">
              {searchQuery ? "No matching chats" : "No chats yet"}
            </p>
          )}

          {filteredChats.map((chat) => {
            const isActive = currentChatId === chat.id;
            return (
              <div key={chat.id} className="group flex items-center gap-1 px-1">
                <button
                  onClick={() => {
                    openChat(chat.id);
                    setIsSidebarOpen(false);
                  }}
                  title={chat.title}
                  className={`
                    cursor-pointer
                    flex-1 min-w-0
                    text-left
                    py-2.5 px-3
                    rounded-lg
                    truncate
                    text-[14px]
                    transition-colors
                    ${isActive
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                    }
                  `}
                >
                  {chat.title}
                </button>

                <button
                  onClick={() => {
                    const confirmDelete = window.confirm("Delete this chat?");
                    if (confirmDelete) {
                      handleDeleteChat(chat.id);
                    }
                  }}
                  aria-label="Delete chat"
                  className="
                    cursor-pointer
                    p-1.5
                    rounded-md
                    opacity-100
                    md:opacity-0
                    md:group-hover:opacity-100
                    text-zinc-500
                    hover:text-red-400
                    hover:bg-red-400/10
                    transition
                    shrink-0
                  "
                >
                  <RiDeleteBin6Line size={17} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="relative border-t border-white/5 p-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenSettings(!openSettings);
            }}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-white/5 transition-all"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white text-sm font-medium">
              {initial}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">
                {user?.username || "User"}
              </p>
              <p className="text-xs text-zinc-500">
                Profile
              </p>
            </div>

            <RiUserSettingsLine
              size={18}
              className="text-zinc-500"
            />
          </button>

          {openSettings && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-16 left-3 right-3 rounded-2xl border border-white/10 bg-[#111111] shadow-2xl backdrop-blur-xl overflow-hidden"
            >
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 transition">
                <RiSunLine size={18} />
                <span>Light Mode</span>
              </button>

              <div className="h-px bg-white/5" />

              <button
                onClick={async () => {
                  if (window.confirm("Are you sure you want to logout?")) {
                    await handleLogout();
                    navigate("/login");
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 transition"
              >
                <RiLogoutBoxRLine size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
        {/* Resize handle (desktop only) */}
        <div
          onMouseDown={startResizing}
          onTouchStart={startResizing}
          className="
            hidden md:block
            absolute top-0 right-0
            h-full w-1
            cursor-col-resize
            group
          "
        >
          <div className="h-full w-px bg-transparent group-hover:bg-white/20 transition-colors mx-auto" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;