import { useState } from "react";
import { MessageCircle, Send, Headphones, Clock } from "lucide-react";
import PrimaryNav from "../components/PrimaryNav";

const initialMessages = [
  {
    id: "m-1",
    sender: "user",
    name: "You",
    avatar: "🙋",
    timestamp: "Today • 09:45",
    text: "Hello! I need some help with my recent deposit.",
  },
  {
    id: "m-2",
    sender: "agent",
    name: "Ava • Super Admin",
    avatar: "🧑‍💼",
    timestamp: "Today • 09:46",
    text: "Hi there! I'm happy to assist. Can you share the transaction ID or amount so I can check the status?",
  },
];

export default function Support() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    if (!draft.trim()) {
      return;
    }

    const newMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      name: "You",
      avatar: "🙋",
      timestamp: new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
      }).format(new Date()),
      text: draft.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setDraft("");
  };

  return (
    <div className="min-h-screen bg-momondo-purple text-white">
      <PrimaryNav />
      <div className="px-4 py-6">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[2fr_1fr]">
          <section className="bg-white/10 border border-white/15 rounded-3xl shadow-lg shadow-black/20 flex flex-col">
            <header className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-lg">
                  <MessageCircle className="h-5 w-5 text-pink-200" />
                </span>
                <div>
                  <h1 className="text-lg font-semibold text-white">Live Support</h1>
                  <p className="text-xs text-purple-200">Chat with an agent or super admin in real time.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-purple-200">
                <Clock className="h-4 w-4" />
                <span>Average response • 2 min</span>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 max-h-[60vh]">
              {messages.map((message) => {
                const isUser = message.sender === "user";
                const alignment = isUser ? "items-end text-right" : "items-start text-left";
                const bubbleColor = isUser ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white" : "bg-white/10 text-white";

                return (
                  <div key={message.id} className={`flex flex-col ${alignment} gap-1`}>
                    <div className="flex items-center gap-2 text-xs text-purple-200">
                      {!isUser && <span>{message.avatar}</span>}
                      <span>{message.name}</span>
                      <span>•</span>
                      <span>{message.timestamp}</span>
                      {isUser && <span>{message.avatar}</span>}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${bubbleColor}`}>
                      {message.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-6 pb-5 border-t border-white/10 bg-white/5">
              <div className="flex items-end gap-3 bg-white border border-[#E5E7EB] rounded-3xl px-4 py-2 shadow-inner shadow-black/10">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={1}
                  placeholder="Type a message..."
                  className="flex-1 resize-none bg-transparent text-sm text-momondo-purple placeholder:text-[#9CA3AF] focus:outline-none py-2 max-h-32 min-h-[40px] leading-relaxed overflow-y-auto"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white transition shadow-md shadow-pink-500/40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="bg-white/10 border border-white/15 rounded-3xl p-6 shadow-lg shadow-black/20 space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-12 w-12 rounded-full bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-200">
                  <Headphones className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-white">Our Support Team</h2>
                  <p className="text-xs text-purple-200">Agents and Super Admins ready to assist 10:00 – 22:00 daily</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-purple-100 space-y-2">
                <p>• Agents resolve account, reservation, and wallet queries. Super Admins handle escalations and policy questions.</p>
                <p>• Share screenshots or transaction IDs for faster verification.</p>
                <p>• Keep messages concise for quicker responses.</p>
              </div>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-3xl p-6 shadow-lg shadow-black/20 space-y-4 text-sm text-purple-100">
              <h3 className="text-white text-base font-semibold">Helpful Links</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-400" />
                  <a href="/faq" className="hover:text-white transition">
                    Review the FAQ before starting a chat.
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-400" />
                  <a href="/deposit" className="hover:text-white transition">
                    Need to deposit funds? Jump to the deposit page.
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-400" />
                  <a href="/records" className="hover:text-white transition">
                    Track pending and completed submissions in Records.
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

