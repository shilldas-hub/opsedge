import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, ArrowRight, Send } from "lucide-react";

type Step =
  | "welcome"
  | "crm"
  | "revenue"
  | "budget"
  | "timeline"
  | "breakdown"
  | "impact"
  | "routing"
  | "low-intent"
  | "email-collect"
  | "done";

type Message = {
  from: "bot" | "user";
  text: string;
  options?: string[];
};

const IMPACT_OPTIONS = [
  "Lost deals",
  "Slower sales cycles",
  "Forecasting gaps",
  "Team inefficiency",
  "Revenue stagnation",
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("welcome");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          from: "bot",
          text: "Happy to help. A few quick questions to understand your revenue setup.",
        },
        {
          from: "bot",
          text: "What CRM are you currently using?",
          options: ["Zoho", "HubSpot", "Other", "None"],
        },
      ]);
      setStep("crm");
    }
  }, [open, messages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addUserMsg = (text: string) => {
    setMessages((prev) => [...prev, { from: "user", text }]);
  };

  const addBotMsg = (text: string, options?: string[]) => {
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text, options }]);
    }, 400);
  };

  const handleOption = (option: string) => {
    addUserMsg(option);

    switch (step) {
      case "crm":
        setAnswers((p) => ({ ...p, crm: option }));
        setStep("revenue");
        addBotMsg("What is your approximate annual revenue range?", [
          "Below ₹1Cr",
          "₹1Cr - ₹5Cr",
          "₹5Cr - ₹25Cr",
          "₹25Cr+",
        ]);
        break;

      case "revenue":
        setAnswers((p) => ({ ...p, revenue: option }));
        setStep("budget");
        addBotMsg("What is your budget range for solving this operational issue?", [
          "Under ₹1L",
          "₹1L - ₹5L",
          "₹5L+",
          "Not sure yet",
        ]);
        break;

      case "budget":
        setAnswers((p) => ({ ...p, budget: option }));
        setStep("timeline");
        addBotMsg("When are you looking to implement a solution?", [
          "Immediately",
          "Within 1-3 months",
          "Exploring options",
          "Just researching",
        ]);
        break;

      case "timeline":
        setAnswers((p) => ({ ...p, timeline: option }));
        setStep("breakdown");
        addBotMsg("What is the biggest revenue breakdown right now? Type a brief description.");
        break;

      case "impact":
        setAnswers((p) => ({ ...p, impact: option }));
        evaluateRouting({ ...answers, impact: option });
        break;

      default:
        break;
    }
  };

  const handleTextSubmit = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    addUserMsg(text);

    if (step === "breakdown") {
      setAnswers((p) => ({ ...p, breakdown: text }));
      setStep("impact");
      addBotMsg("How is this problem impacting your business?", IMPACT_OPTIONS);
    } else if (step === "email-collect") {
      setAnswers((p) => ({ ...p, email: text }));
      setStep("done");
      addBotMsg("Thank you. We will send the Revenue Systems Checklist to your email shortly.");
    }
  };

  const evaluateRouting = (data: Record<string, string>) => {
    const highRevenue = ["₹1Cr - ₹5Cr", "₹5Cr - ₹25Cr", "₹25Cr+"].includes(data.revenue);
    const highTimeline = ["Immediately", "Within 1-3 months"].includes(data.timeline);
    const highBudget = ["₹1L - ₹5L", "₹5L+"].includes(data.budget);

    if (highRevenue && highTimeline && highBudget) {
      setStep("routing");
      addBotMsg("This appears to be an operational bottleneck. You should schedule a Revenue Systems Audit.");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "BOOK_AUDIT_BUTTON" },
        ]);
      }, 800);
    } else {
      setStep("low-intent");
      addBotMsg("I can send you a Revenue Systems Checklist for internal review. Would you like that?", [
        "Yes, send the checklist",
        "No thanks",
      ]);
    }
  };

  const handleLowIntentOption = (option: string) => {
    addUserMsg(option);
    if (option === "Yes, send the checklist") {
      setStep("email-collect");
      addBotMsg("Please share your email address and we will send it over.");
    } else {
      setStep("done");
      addBotMsg("No problem. Feel free to reach out anytime at hello@opsedge.online.");
    }
  };

  const scrollToBooking = () => {
    setOpen(false);
    document.getElementById("book-audit")?.scrollIntoView({ behavior: "smooth" });
  };

  const needsTextInput = (step === "breakdown" || step === "email-collect") as boolean;

  return (
    <>
      {/* Toggle */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
          aria-label="Open chat"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[340px] max-h-[480px] bg-background border border-border rounded shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="font-heading text-sm font-semibold text-foreground">OpsEdge</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px]">
            {messages.map((msg, i) => {
              if (msg.text === "BOOK_AUDIT_BUTTON") {
                return (
                  <button
                    key={i}
                    onClick={scrollToBooking}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-xs font-heading font-semibold rounded hover:opacity-90 transition-opacity"
                  >
                    Book Audit Now
                    <ArrowRight className="w-3 h-3" />
                  </button>
                );
              }
              return (
                <div key={i}>
                  <div
                    className={`text-xs leading-relaxed px-3 py-2 rounded max-w-[85%] ${
                      msg.from === "bot"
                        ? "bg-card text-foreground"
                        : "bg-primary text-primary-foreground ml-auto"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.options && step !== "done" && i === messages.length - 1 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            if (step === "low-intent") handleLowIntentOption(opt);
                            else handleOption(opt);
                          }}
                          className="text-xs px-3 py-1.5 border border-border rounded text-foreground hover:bg-card transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Text input */}
          {needsTextInput && step !== "done" && (
            <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
                placeholder="Type your response..."
                className="flex-1 text-xs px-3 py-2 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <button onClick={handleTextSubmit} className="text-primary hover:opacity-70">
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;
