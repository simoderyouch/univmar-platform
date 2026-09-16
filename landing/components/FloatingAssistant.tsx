"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const labels = {
  fr: {
    title: "Assistant UNIVMAR",
    status: "Conseil produits et devis",
    greeting: "Bonjour, comment puis-je vous aider a choisir votre pierre naturelle ?",
    placeholder: "Posez votre question...",
    send: "Envoyer",
    open: "Ouvrir le chat",
    close: "Fermer",
    error: "Le chat est indisponible pour le moment. Contactez UNIVMAR directement.",
  },
  en: {
    title: "UNIVMAR Assistant",
    status: "Products and quote guidance",
    greeting: "Hello, how can I help you choose natural stone?",
    placeholder: "Ask your question...",
    send: "Send",
    open: "Open chat",
    close: "Close",
    error: "Chat is unavailable right now. Please contact UNIVMAR directly.",
  },
  ar: {
    title: "مساعد UNIVMAR",
    status: "استشارة المنتجات والعروض",
    greeting: "مرحبا، كيف يمكنني مساعدتك في اختيار الحجر الطبيعي؟",
    placeholder: "اكتب سؤالك...",
    send: "إرسال",
    open: "فتح المحادثة",
    close: "إغلاق",
    error: "الدردشة غير متوفرة حاليا. يرجى التواصل مع UNIVMAR مباشرة.",
  },
} as const;

type ChatLang = keyof typeof labels;

function getLang() {
  if (typeof window === "undefined") return "fr";
  const firstPathSegment = window.location.pathname.split("/").filter(Boolean)[0];
  return firstPathSegment === "en" || firstPathSegment === "ar" ? firstPathSegment : "fr";
}

function ChatIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.3 9.5 9.5 0 0 1-4.2-.9L3 20l1.2-4.2a8.2 8.2 0 0 1-.9-3.8A8.4 8.4 0 0 1 12 3.7a8.5 8.5 0 0 1 9 7.8Z" />
      <path d="M8.2 10.2h7.6" />
      <path d="M8.2 13.5h5.2" />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

function SendIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m4 12 16-7-7 16-2-7-7-2Z" />
      <path d="m11 13 5-5" />
    </svg>
  );
}

function renderInlineMarkdown(text: string, keyPrefix: string) {
  return text
    .split(/(\*\*[^*]+?\*\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      const key = `${keyPrefix}-${index}`;

      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={key}>{part.slice(2, -2)}</strong>;
      }

      return <span key={key}>{part}</span>;
    });
}

function renderParagraph(lines: string[], key: string) {
  return (
    <p key={key} className="assistant-message-paragraph">
      {lines.map((line, index) => (
        <span key={`${key}-line-${index}`}>
          {index > 0 ? <br /> : null}
          {renderInlineMarkdown(line, `${key}-inline-${index}`)}
        </span>
      ))}
    </p>
  );
}

function renderList(items: string[], key: string) {
  return (
    <ul key={key} className="assistant-message-list">
      {items.map((item, index) => (
        <li key={`${key}-item-${index}`}>
          {renderInlineMarkdown(item, `${key}-item-inline-${index}`)}
        </li>
      ))}
    </ul>
  );
}

function renderMessageContent(content: string): ReactNode[] {
  const blocks: ReactNode[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  function flushParagraph() {
    if (paragraphLines.length === 0) return;
    blocks.push(renderParagraph(paragraphLines, `paragraph-${blocks.length}`));
    paragraphLines = [];
  }

  function flushList() {
    if (listItems.length === 0) return;
    blocks.push(renderList(listItems, `list-${blocks.length}`));
    listItems = [];
  }

  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    const bullet = trimmed.match(/^[-*]\s+(.+)$/);

    if (bullet) {
      flushParagraph();
      listItems.push(bullet[1]);
      return;
    }

    flushList();
    paragraphLines.push(line);
  });

  flushParagraph();
  flushList();

  return blocks;
}


export default function FloatingAssistant() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<ChatLang>("fr");
  const copy = labels[lang];
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: labels.fr.greeting },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nextLang = getLang();
    setMounted(true);
    setLang(nextLang);
    setMessages((current) => {
      if (current.length !== 1 || current[0]?.content !== labels.fr.greeting) {
        return current;
      }
      return [{ role: "assistant", content: labels[nextLang].greeting }];
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: question },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, lang }),
      });
      const data = await response.json();

      if (!response.ok || typeof data.answer !== "string") {
        throw new Error(data.error ?? "Assistant error");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.answer },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: copy.error },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function toggleOpen() {
    setOpen((value) => {
      const nextOpen = !value;
      if (nextOpen) {
        window.setTimeout(() => inputRef.current?.focus(), 160);
      }
      return nextOpen;
    });
  }

  if (!mounted) return null;

  return (
    <div className="assistant-root">
      {open ? (
        <section
          className="assistant-panel"
          aria-label={copy.title}
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          <header className="assistant-header">
            <div className="assistant-heading">
              <span className="assistant-avatar">
                <ChatIcon className="assistant-avatar-icon" />
              </span>
              <div className="assistant-heading-copy">
                <h2 className="assistant-title">{copy.title}</h2>
                <p className="assistant-status">
                  <span className="assistant-status-dot" />
                  <span>{copy.status}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleOpen}
              className="assistant-icon-button"
              aria-label={copy.close}
              title={copy.close}
            >
              <CloseIcon className="assistant-button-icon" />
            </button>
          </header>

          <div className="assistant-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`assistant-message-row assistant-message-row-${message.role}`}
              >
                <div className={`assistant-message assistant-message-${message.role}`}>
                  {renderMessageContent(message.content)}
                </div>
              </div>
            ))}
            {loading ? (
              <div className="assistant-message-row assistant-message-row-assistant">
                <div className="assistant-typing" aria-label="Assistant is typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={submit} className="assistant-form">
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="assistant-input"
              placeholder={copy.placeholder}
              aria-label={copy.placeholder}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="assistant-send-button"
              aria-label={copy.send}
              title={copy.send}
            >
              <SendIcon className={lang === "ar" ? "assistant-button-icon assistant-send-icon-rtl" : "assistant-button-icon"} />
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        onClick={toggleOpen}
        className="assistant-fab"
        aria-label={open ? copy.close : copy.open}
        title={open ? copy.close : copy.open}
        aria-expanded={open}
      >
        {open ? <CloseIcon className="assistant-fab-icon" /> : <ChatIcon className="assistant-fab-icon" />}
      </button>
    </div>
  );
}
