import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import {
  RiGlobalLine,
  RiBarChartBoxLine,
  RiSparklingLine,
  RiCompass3Line,
  RiMicLine,
  RiBrainLine,
  RiBrain2Fill
} from "@remixicon/react";
import Sidebar from '../../component/Sidebar';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const chat = useChat()
  const inputRef = useRef();
  const user = useSelector((state) => state.auth.user);
  const [chatInput, setChatInput] = useState('')
  const [isThinking, setIsThinking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  // const [showLoginModal, setShowLoginModal] = useState(false);

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector(
    (state) => state.chat.currentChatId
  )

  const currentChat = chats[currentChatId];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId)
  }


  useEffect(() => {
    if (!user) return;

    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, [user]);


  useEffect(() => {
    // focus the input field only if the screen width is greater than or equal to 768px (desktop view)  
    if (window.innerWidth >= 768) {
      inputRef.current?.focus();
    }


    // update the document title on favicon site
    if (currentChat?.title) {
      document.title = `${currentChat.title}`;
    } else {
      document.title = "neuralsearch";
    }
  }, [currentChatId]);


  useEffect(() => {
    const pendingMessage = sessionStorage.getItem("pendingMessage");

    if (pendingMessage) {
      setChatInput(pendingMessage);
      sessionStorage.removeItem("pendingMessage");
    }
  }, []);


  // hardcoded suggestions and sources for the demo, can be made dynamic in the future
  const suggestions = [
    "How close are we to room-temperature superconductors?",
    "Explain quantum computing like I'm a curious 12-year-old",
    "What did we miss while doomscrolling this week?",
    "Which startups are quietly eating Big Tech's lunch?",
    "Show me the weirdest scientific discovery of 2026",
    "What's actually inside a Mars rover's brain?",
  ];

  // these sources are just for demo purposes, we can make them dynamic in the future as well.
  const sources = [
    {
      title: "Inside the AI Chip Race Nobody's Talking About",
      site: "DEEP DIVE · WIRED.COM",
    },
    {
      title: "The Quiet Return of Nuclear Power",
      site: "ANALYSIS · MIT TECHNOLOGY REVIEW",
    },
    {
      title: "Why Space Junk Is Becoming a Trillion-Dollar Problem",
      site: "EXPLAINER · BLOOMBERG.COM",
    },
    {
      title: "The Startups Building Tech's Next Boring Revolution",
      site: "FEATURE · THE VERGE",
    },
  ];


  // handling the message submission
  const handleSubmitMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();

    if (!trimmedMessage) return;

    // if(!user){
    //   setShowLoginModal(true);
    //   return;
    // }


    if (!user) {
      sessionStorage.setItem("pendingMessage", trimmedMessage);
      navigate("/login");
      return;
    }

    setIsThinking(true);

    await chat.handleSendMessage({
      message: trimmedMessage,
      chatId: currentChatId,
    });

    setIsThinking(false);

    setChatInput("");

    inputRef.current?.focus();
  };

  //  handling the search input phone
  const handleSearch = async (query) => {

    if (!user) {
      sessionStorage.setItem("pendingMessage", query);
      navigate("/login");
      return;
    }

    setChatInput(query);
    setIsThinking(true);

    try {
      await chat.handleSendMessage({
        message: query,
        chatId: currentChatId,
      });

      setChatInput("");
    } finally {
      setIsThinking(false);
    }
  };


  return (
  <div className="flex h-dvh bg-[#050505] text-zinc-100 overflow-hidden">
      {/* Sidebar */}


      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        openChat={openChat}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleDeleteChat={chat.handleDeleteChat}
      />

      {/* Main Area
          md:ml follows the sidebar's live width via the --sidebar-width CSS
          variable that Sidebar publishes, so it stays in sync while you
          drag-resize on desktop. On mobile the sidebar is an overlay, not
          part of the flow, so there is intentionally no margin there. */}
   <div className="flex-1 md:ml-[var(--sidebar-width,260px)] flex flex-col h-dvh overflow-hidden">

        {/* hamburger menu */}
        <div className="md:hidden h-14 flex items-center px-4 border-b border-white/10 bg-[#050505]">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="
      text-white
      text-2xl
      cursor-pointer
      transition-transform
      hover:scale-110
    "
          >
            ☰
          </button>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-hidden flex flex-col">

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-3 md:px-12 py-4 md:py-6 space-y-6"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {currentChatId ? (
              <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">
                {chats[currentChatId]?.messages?.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-6 flex ${message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                      }`}
                  >
                    <div
                      className={`max-w-3xl rounded-3xl px-6 py-4 text-base leading-relaxed ${message.role === "user"
                        ? "bg-[#1c1c1c] text-white"
                        : "text-zinc-200"
                        }`}
                    >
                      {message.role === "ai" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          className="
    prose
    prose-invert
    max-w-none
    prose-headings:text-white
    prose-p:text-zinc-200
    prose-strong:text-white
    prose-li:text-zinc-200
    prose-code:text-green-400
    prose-pre:bg-zinc-900
    prose-pre:border
    prose-pre:border-zinc-700
  "
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                ))}
                {isThinking && (
                  <div className="px-6 py-4">
                    <span className="animate-pulse text-zinc-400">
                      Thinking...
                    </span>
                  </div>
                )}
              </div>
            ) : (

              <div className="h-full">
                <div className="max-w-6xl mx-auto px-4 md:px-8 pt-4 md:pt-16 pb-32 md:pb-24">
                  {/* Logo */}
              <div className="flex items-center justify-center gap-3 md:gap-5 mb-8 md:mb-12">
                  <RiBrain2Fill 
                    className="text-white text-4xl md:text-6xl"
                    size={50}
                  />
  <h1 className="text-4xl md:text-7xl font-light tracking-tight text-white">
    NeuralSearch
  </h1>
</div>


                  {/* Category Buttons */}
                  <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12 px-2">

                    <button
                      onClick={() => handleSearch("Latest Trending Technology News")}
                      className="flex items-center gap-2 px-4 md:px-6 py-2 text-sm md:text-base rounded-full border border-zinc-800 text-zinc-300 hover:bg-zinc-900 transition"
                    >
                      <RiGlobalLine size={16} />
                      <span>Trending Tech</span>
                    </button>

                    <button
                      onClick={() => handleSearch("Top Startup Companies 2025")}
                      className="flex items-center gap-2 px-4 md:px-6 py-2 text-sm md:text-base rounded-full border border-zinc-800 text-zinc-300 hover:bg-zinc-900 transition"
                    >
                      <RiBarChartBoxLine size={16} />
                      <span>Startups</span>
                    </button>

                    <button
                      onClick={() => handleSearch("Best AI Tools in 2025")}
                      className="flex items-center gap-2 px-4 md:px-6 py-2 text-sm md:text-base rounded-full border border-zinc-800 text-zinc-300 hover:bg-zinc-900 transition"
                    >
                      <RiSparklingLine size={16} />
                      <span>AI Tools</span>
                    </button>

                    <button
                      onClick={() => handleSearch("Latest Gadgets and Tech Products")}
                      className="flex items-center gap-2 px-4 md:px-6 py-2 text-sm md:text-base rounded-full border border-zinc-800 text-zinc-300 hover:bg-zinc-900 transition"
                    >
                      <RiCompass3Line size={16} />
                      <span>Gadgets</span>
                    </button>

                  </div>



                  {/* Suggestions */}
                  <div className="space-y-0 mb-6 md:mb-12 max-w-5xl mx-auto w-full">
                    {suggestions.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleSearch(item)}
                        className="w-full text-left py-4 border-b border-white/10 text-zinc-400 hover:text-white transition"
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  {/* Source Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {sources.map((source) => (
                      <button
                        key={source.title}
                        onClick={() => handleSearch(source.title)}
                        className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 text-left hover:bg-[#111] transition"
                      >
                        <h3 className="text-lg font-semibold text-white">
                          {source.title}
                        </h3>

                        <p className="mt-2 text-sm text-zinc-500 uppercase">
                          {source.site}
                        </p>
                      </button>
                    ))}
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="shrink-0 px-3 md:px-8 pb-4 md:pb-5">
            <form
              onSubmit={handleSubmitMessage}
              className="max-w-4xl mx-auto w-full"
            >
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 shadow-lg">

                <div className="relative">


                  {/* email tool */}
                  <button
                    type="button"
                    onClick={() => setShowMenu(!showMenu)}
                    className="text-zinc-400 hover:text-white transition"
                  >
                    +
                  </button>

                  {showMenu && (
                    <div className="absolute bottom-14 left-0 w-52 rounded-2xl bg-[#111] border border-white/10 shadow-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setShowMenu(false);
                          console.log("Send Email");
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center gap-3"
                      >
                        📧
                        <span>Send Email</span>
                      </button>
                    </div>
                  )}

                </div>


                <input
                  type="text"
                  ref={inputRef}
                  value={chatInput}
                  onChange={(e) =>
                    setChatInput(e.target.value)
                  }
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-zinc-500"
                />

                <button
                  type="button"
                  className="text-zinc-700 hover:text-zinc-100 cursor-pointer mr-3"
                >
                  <RiMicLine size={22} />
                </button>


                <button
                  type="submit"
                  disabled={!chatInput.trim() || isThinking}
                  className="cursor-pointer rounded-2xl bg-white text-black px-5 py-2 font-medium transition hover:opacity-90 disabled:opacity-40 flex items-center justify-center min-w-[80px]"
                >
                  {isThinking ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Dashboard