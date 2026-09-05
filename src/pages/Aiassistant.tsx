import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import { providers } from "../data/providers";
import { nairaRange } from "../utils/Format";
import { diagnoseProblem, hasGeminiKey } from "../services/Geminiservice";
import type { ChatMessage, Provider } from "../types";

const KEYWORDS: Record<string, string> = {
  generator: "Generator repair",
  smoke: "Generator repair",
  "won't start": "Generator repair",
  light: "Electrical",
  socket: "Electrical",
  wiring: "Electrical",
  spark: "Electrical",
  leak: "Plumbing",
  drain: "Plumbing",
  pipe: "Plumbing",
  tank: "Plumbing",
  roof: "Roofing",
  ceiling: "Roofing",
  gutter: "Roofing",
  ac: "AC repair",
  cooling: "AC repair",
  fridge: "AC repair",
  door: "Carpentry",
  cabinet: "Carpentry",
  furniture: "Carpentry",
  paint: "Painting",
  clean: "Cleaning",
};

function matchCategory(text: string): string | null {
  const lower = text.toLowerCase();
  for (const key of Object.keys(KEYWORDS)) {
    if (lower.includes(key)) return KEYWORDS[key];
  }
  return null;
}

function matchedProviders(category: string): Provider[] {
  return providers
    .filter((p) => p.service === category)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 2);
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m0",
      role: "assistant",
      text: "Tell me what's wrong \u2014 in your own words \u2014 and I'll work out who can fix it.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);

    const respond = (category: string | null, reply: string) => {
      const found = category ? matchedProviders(category) : [];
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", text: reply },
        ...(found.length > 0
          ? [
              {
                id: crypto.randomUUID(),
                role: "assistant" as const,
                text: `__PROVIDERS__:${found.map((p) => p.id).join(",")}`,
              },
            ]
          : []),
      ]);
      setThinking(false);
    };

    diagnoseProblem(text)
      .then((result) => respond(result.category, result.reply))
      .catch(() => {
        // Falls back to local keyword matching if there's no API key yet
        // or the Gemini request fails for any reason \u2014 the assistant
        // still works, just with less nuanced diagnosis.
        const category = matchCategory(text);
        const reply = category
          ? `That sounds like a job for ${category.toLowerCase()}. Here are the closest matches:`
          : "I couldn't quite place that one  could you mention what's affected? For example \"my sink is leaking\" or \"the generator won't start\".";
        respond(category, reply);
      });
  };

  return (
    <Layout>
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-2xl flex-col px-6 py-10">
        <div className="mb-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
            AI Assistant
          </span>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Describe your problem
          </h1>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink/35">
            {hasGeminiKey()
              ? "Powered by Gemini"
              : "Local matching  add VITE_GEMINI_API_KEY for live AI diagnosis"}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl border border-line bg-white p-5">
          <div className="flex flex-col gap-4">
            {messages.map((m) => {
              if (m.text.startsWith("__PROVIDERS__:")) {
                const ids = m.text.replace("__PROVIDERS__:", "").split(",");
                const list = providers.filter((p) => ids.includes(p.id));
                return (
                  <div key={m.id} className="flex flex-col gap-2 self-start">
                    {list.map((p) => (
                      <Link
                        key={p.id}
                        to={`/providers/${p.id}`}
                        className="flex items-center justify-between gap-4 rounded-lg border border-line bg-paper-dim/50 px-4 py-3 transition hover:border-primary/30"
                      >
                        <div>
                          <p className="font-display text-sm font-semibold text-ink">
                            {p.name}
                          </p>
                          <p className="mt-0.5 font-body text-xs text-ink/50">
                            {p.distanceKm}km &middot; {p.rating.toFixed(1)}{" "}
                            &middot; {nairaRange(p.priceFrom, p.priceTo)}
                          </p>
                        </div>
                        <span className="font-mono text-xs text-primary">
                          View &rarr;
                        </span>
                      </Link>
                    ))}
                  </div>
                );
              }

              return (
                <div
                  key={m.id}
                  className={
                    "max-w-[85%] rounded-xl px-4 py-2.5 font-body text-sm leading-relaxed " +
                    (m.role === "user"
                      ? "self-end bg-primary text-paper"
                      : "self-start bg-paper-dim text-ink/80")
                  }
                >
                  {m.text}
                </div>
              );
            })}

            {thinking && (
              <div className="self-start rounded-xl bg-paper-dim px-4 py-2.5 font-mono text-xs text-ink/40">
                Thinking&hellip;
              </div>
            )}
          </div>
        </div>

        <form
          className="mt-4 flex gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. My kitchen sink is leaking under the counter"
            className="w-full flex-1 rounded-lg border border-line bg-white px-4 py-3 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary"
          />
          <button
            type="submit"
            disabled={thinking}
            className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 font-body text-sm font-semibold text-primary-deep shadow-sm shadow-accent/30 transition hover:bg-accent/90 disabled:opacity-70"
          >
            {thinking && <Spinner className="text-primary-deep" />}
            {thinking ? "Thinking..." : "Send"}
          </button>
        </form>
      </div>
    </Layout>
  );
}