import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Loader2,
  ArrowLeft,
  Bot,
  Send,
  User as UserIcon,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { getProject } from "../../store/slices/projectSlice";
import { askAssistant } from "../../services/aiService";
import ProjectTabs from "../../components/ProjectTabs";
import PageLoader from "../../components/PageLoader";
import { notifyErrorFrom } from "../../utils/toast";

const SUGGESTIONS = [
  "Suggest a database structure for this project",
  "Explain how authentication should work here",
  "Which APIs will I need?",
  "Suggest an architecture for this project",
];

const buildContext = (project) => ({
  title: project?.title,
  description: project?.description,
  domain: project?.domain,
  technologies: Array.isArray(project?.technologies)
    ? project.technologies.join(", ")
    : project?.technologies,
  features: Array.isArray(project?.features)
    ? project.features.map((f) => f.name || f)
    : undefined,
  methodology: project?.methodology,
});

function ProjectAssistantPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject, isLoading: projectLoading, error: projectError } = useSelector(
    (state) => state.project
  );

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (id) dispatch(getProject(id));
  }, [dispatch, id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const send = async (text) => {
    const question = (text ?? input).trim();
    if (!question || sending) return;

    setError(null);
    setInput("");
    const nextMessages = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setSending(true);

    try {
      const res = await askAssistant({
        question,
        history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        context: buildContext(currentProject),
      });
      const answer = res?.data?.answer || res?.answer;
      if (!answer) throw new Error("Empty response from AI");
      setMessages([...nextMessages, { role: "assistant", content: answer }]);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "The AI assistant is unavailable right now. Please try again in a moment.";
      setError(message);
      notifyErrorFrom(message, "The AI assistant is unavailable right now.");
      // Restore the prior conversation so the question can be retried.
      setMessages(messages);
      setInput(question);
    } finally {
      setSending(false);
    }
  };

  if (projectLoading && !currentProject) {
    return <PageLoader label="Loading assistant…" />;
  }

  if (projectError || !currentProject) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="text-error">{projectError || "Project not found"}</p>
        <Link to="/teams" className="mt-4 text-primary hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to={`/project/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={16} />
          Back to Project
        </Link>
      </div>

      <ProjectTabs id={id} />

      <div
        className="mx-auto flex max-w-3xl flex-col"
        style={{ height: "calc(100vh - 300px)", minHeight: "480px" }}
      >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
          <Bot size={20} />
        </span>
        <div>
          <h1 className="text-xl font-bold text-text-primary">AI Technical Assistant</h1>
          <p className="text-sm text-text-secondary">
            Project-aware guidance for “{currentProject.title}”
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="mt-4 flex-1 space-y-4 overflow-y-auto rounded-2xl border border-border bg-surface/50 p-4">
        {messages.length === 0 && (
          <div className="py-8 text-center">
            <Sparkles size={28} className="mx-auto text-primary" />
            <p className="mt-3 text-sm font-medium text-text-primary">
              Ask anything about building your project
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Explanations, APIs, database design, auth, architecture, debugging — the assistant
              knows your project context. Responses are guidance, not guaranteed correctness.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-text-secondary hover:border-primary hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                m.role === "user" ? "bg-primary text-white" : "bg-primary-light text-primary"
              }`}
            >
              {m.role === "user" ? <UserIcon size={15} /> : <Bot size={15} />}
            </span>
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-tr-sm bg-primary text-white"
                  : "rounded-tl-sm border border-border bg-surface text-text-primary"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex items-start gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Bot size={15} />
            </span>
            <div className="rounded-xl rounded-tl-sm border border-border bg-surface px-4 py-3">
              <Loader2 size={16} className="animate-spin text-primary" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-error-light bg-error-light px-3 py-2 text-sm text-error">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="mt-4 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a technical question…"
          disabled={sending}
          className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary-dark disabled:opacity-50"
        >
          <Send size={17} />
        </button>
      </form>
      </div>
    </div>
  );
}

export default ProjectAssistantPage;