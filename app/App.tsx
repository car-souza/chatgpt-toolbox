"use client";
import createLiveChatCompletion, { LLMType } from "@/utils/liveGptClient";
import { SetStateAction, useEffect, useRef, useState } from "react";
import Markdown from "./components/Markdown";

const ROLE_PRESETS = [
  {
    label: "Translator",
    direction: "Translate any message you received to professional English.",
  },
  {
    label: "Programmer",
    direction:
      "Your are a professional programmer. Answer the question with code example if necessary.",
  },
  {
    label: "Email",
    direction: "Transcript the message into a professional email.",
  },
  {
    label: "Tweet",
    direction: "Transcript the message into a tweet from top influencer.",
  },
];

export default function App({
  parseHTML = true,
  defaultDirection,
}: Readonly<{
  parseHTML?: boolean;
  defaultDirection?: string;
}>) {
  const model: LLMType = "gpt-3.5-turbo";
  const [apiKey, setApiKey] = useState("");
  const [maxTokens, setMaxTokens] = useState("2048");
  const [direction, setDirection] = useState(
    defaultDirection ||
      `Today is ${new Date().toDateString()}.You are a helpful assistant.`
  );
  const [question, setQuestion] = useState("Hello, I am a human.");
  const [answer, setAnswer] = useState("...");

  const [isLoading, setIsLoading] = useState(false);

  const resultRef = useRef("");

  const tailRef = useRef("");

  const storeApiKey = (e: { target: { value: SetStateAction<string> } }) => {
    setApiKey(e.target.value);
    localStorage.setItem("apiKey", String(e.target.value));
  };

  const handleRoleChange = (direction: string) => {
    setDirection(direction);
  };

  const handleSubmitPromptBtnClicked = () => {
    if (question !== "" && !isLoading) {
      setIsLoading(true);
      setAnswer("");
      resultRef.current = "";

      const source = createLiveChatCompletion(
        model,
        apiKey,
        Number(maxTokens),
        direction,
        question
      );

      source.addEventListener("message", (e: { data: string }) => {
        if (e.data != "[DONE]") {
          const payload = JSON.parse(e.data);
          if (
            Object.prototype.hasOwnProperty.call(
              payload.choices[0].delta,
              "content"
            )
          ) {
            const text = payload.choices[0].delta.content;

            if (text.includes("```")) {
              if (tailRef.current === "") {
                tailRef.current = "\n```";
              } else {
                tailRef.current = "";
              }
            }

            if (text === "`") {
              tailRef.current = "";
            }

            resultRef.current = resultRef.current + text;

            setAnswer(resultRef.current);
          }
        } else {
          source.close();
        }
      });

      source.addEventListener(
        "readystatechange",
        (e: { readyState: number }) => {
          if (e.readyState >= 2) {
            tailRef.current = "";
            setIsLoading(false);
          }
        }
      );

      source.stream();
    } else {
      alert("Please insert a prompt!");
    }
  };

  useEffect(() => {
    // Perform localStorage action
    const localKey = localStorage.getItem("apiKey");
    if (localKey) {
      setApiKey(localKey);
    }
    localStorage.setItem("model", model);
  }, []);

  useEffect(() => {
    resultRef.current = answer;
  }, [answer]);

  return (
    <main className="mx-auto flex h-[100svh] w-full max-w-7xl overflow-hidden px-2 py-2 sm:px-4 sm:py-4 lg:h-[100vh] lg:px-8 lg:py-7">
      <div className="glass-panel grid h-full w-full grid-rows-[minmax(0,1.08fr)_minmax(0,0.92fr)] gap-2 p-2 sm:gap-4 sm:p-4 xl:h-[calc(100vh-3.5rem)] xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:grid-rows-1 xl:gap-6 xl:p-5">
        <section className="flex min-h-0 flex-col gap-1.5 sm:gap-3">
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_210px] sm:gap-3">
            <label className="flex flex-col gap-2">
              <span className="badge-label bg-teal-300 text-teal-950">
                API Key
              </span>
              <input
                aria-label="API key"
                className="field-input h-9 sm:h-10"
                name="apiKey"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={storeApiKey}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="badge-label bg-cyan-300 text-cyan-950">
                Model
              </span>
              <input
                aria-label="Model"
                className="field-input h-9 cursor-not-allowed opacity-80 sm:h-10"
                value="GPT-3.5 Turbo"
                readOnly
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 sm:gap-2">
            <span className="badge-label bg-rose-300 text-rose-950">System</span>
            <input
              aria-label="System prompt"
              className="field-input h-9 sm:h-10"
              name="system"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
            />
          </label>

          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
            {ROLE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="action-button h-8 text-[11px] sm:h-9 sm:text-sm"
                onClick={() => handleRoleChange(preset.direction)}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <label className="flex min-h-0 grow flex-col gap-1.5 sm:gap-2">
            <span className="badge-label bg-blue-300 text-blue-950">User</span>
            <textarea
              aria-label="User prompt"
              className="field-input no-scrollbar min-h-0 grow resize-none p-3 text-sm leading-5 sm:p-4 sm:text-base sm:leading-6"
              name="user"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </label>

          <button
            disabled={isLoading}
            className={`h-9 w-full rounded-xl border text-xs font-semibold tracking-wide transition duration-200 sm:h-10 sm:text-sm ${
              isLoading
                ? "cursor-not-allowed border-slate-500/35 bg-slate-700/70 text-slate-300"
                : "border-blue-300/60 bg-blue-500/80 text-white hover:bg-blue-400/90"
            }`}
            onClick={handleSubmitPromptBtnClicked}
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </section>

        <section className="flex min-h-0 flex-col">
          <label className="flex h-full min-h-0 flex-col gap-1.5 sm:gap-2">
            <span className="badge-label w-fit bg-emerald-300 text-emerald-950">
              Assistant
            </span>
            <div className="field-input no-scrollbar h-full min-h-0 overflow-x-hidden overflow-y-auto rounded-2xl p-3 text-sm font-medium leading-6 sm:p-4 sm:text-base sm:leading-7">
              {parseHTML ? (
                <Markdown content={answer} />
              ) : (
                <div className="whitespace-pre-wrap">{answer}</div>
              )}
            </div>
          </label>
        </section>
      </div>
    </main>
  );
}
