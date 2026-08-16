import { Link } from "react-router-dom";
import { ArrowLeft, Cpu, Database, LayoutDashboard, BrainCircuit } from "lucide-react";

const stack = [
  { icon: LayoutDashboard, title: "Frontend", text: "React, Vite, Tailwind CSS, React Router, Axios, Lucide React" },
  { icon: Cpu, title: "Backend", text: "Node.js, Express.js, MongoDB, Mongoose" },
  { icon: BrainCircuit, title: "AI Service", text: "Python, FastAPI, Google Gemini API" },
  { icon: Database, title: "Database", text: "MongoDB Atlas" },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <section className="rounded-2xl border border-border bg-surface p-8 shadow-sm sm:p-12">
        <span className="inline-flex items-center rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
          React Router — /about
        </span>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary">
          About Ascenta
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
          Ascenta is an AI-assisted academic project lifecycle management
          platform. This page verifies that React Router navigation works
          end-to-end and that the shared MainLayout renders correctly.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {stack.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-background p-4"
            >
              <Icon size={20} className="text-primary" />
              <p className="mt-3 text-sm font-semibold text-text-primary">
                {title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">
                {text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;