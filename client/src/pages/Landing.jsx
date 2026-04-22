/**
 * Landing Page
 * ────────────
 * The first page users see. Contains:
 *   - A hero section with a gradient headline and CTA
 *   - A features section explaining CRUD operations
 *   - A bottom CTA bar
 *
 * This page has NO state — it is purely presentational.
 * It demonstrates how React components can be simple
 * "function → JSX" mappings with zero hooks.
 */
import { Link } from "react-router-dom";
import Button from "../components/Button";

const features = [
  {
    icon: "➕",
    title: "Create Students",
    description:
      "Add new student records with name, age, and course information. Data is validated before saving.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: "📖",
    title: "Read & Search",
    description:
      "View all students in a clean table with pagination. Search by name to quickly find records.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: "✏️",
    title: "Update Records",
    description:
      "Edit any student's information with a pre-filled form. Changes are validated and saved instantly.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: "🗑️",
    title: "Delete Records",
    description:
      "Remove students from the system with a single click. Confirmation prevents accidental deletions.",
    color: "from-red-500 to-rose-600",
  },
];

const techStack = [
  { name: "React", desc: "UI Library" },
  { name: "Vite", desc: "Build Tool" },
  { name: "Tailwind", desc: "Styling" },
  { name: "Node.js", desc: "Runtime" },
  { name: "Express", desc: "API Framework" },
  { name: "MongoDB", desc: "Database" },
];

const Landing = () => {
  return (
    <main>
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center max-w-3xl mx-auto animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Full-Stack CRUD Application
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Student{" "}
              <span className="gradient-text">Management</span>{" "}
              System
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              A modern, production-ready application built with React, Node.js,
              Express, and MongoDB. Manage student records with ease using a
              clean, intuitive interface.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button variant="primary" size="lg">
                  🚀 Get Started
                </Button>
              </Link>
              <a
                href="https://github.com/Chirag-HM/Database_management_system"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="lg">
                  ⭐ View on GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Tech Stack ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col items-center gap-1 text-text-muted hover:text-text transition-colors"
            >
              <span className="text-sm font-semibold">{tech.name}</span>
              <span className="text-xs text-text-muted">{tech.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Powerful <span className="gradient-text">CRUD</span> Operations
          </h2>
          <p className="text-text-muted max-w-xl mx-auto">
            Everything you need to manage student records — create, read,
            update, and delete — with validation and error handling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group p-6 rounded-2xl bg-surface-card border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">
                {feature.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
          <div className="absolute inset-0 glass" />
          <div className="relative text-center px-8 py-16 sm:py-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to manage your students?
            </h2>
            <p className="text-text-muted max-w-lg mx-auto mb-8">
              Head to the dashboard to view, add, edit, and delete student
              records with a smooth, modern interface.
            </p>
            <Link to="/dashboard">
              <Button variant="primary" size="lg">
                Open Dashboard →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-text-muted text-sm">
              © {new Date().getFullYear()} StudentManager — Built with ❤️ by Chirag HM
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Chirag-HM"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text text-sm transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Landing;
