import { useEffect, useState } from "react";
import { ArrowRight, Database, Settings, BarChart, GitMerge } from "lucide-react";
import { Link } from "react-router-dom";
import BookingSection from "@/components/BookingSection";
import ChatBot from "@/components/ChatBot";

const scrollToBooking = (e: React.MouseEvent) => {
  e.preventDefault();
  document.getElementById("book-audit")?.scrollIntoView({ behavior: "smooth" });
};

const StickyHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? "bg-background/95 backdrop-blur border-b border-border shadow-sm" : "bg-transparent"
        }`}
    >
      <div className="container flex items-center justify-between h-16">
        <span className="font-heading text-xl font-bold tracking-tight text-foreground">
          OpsEdge
        </span>
        <a
          href="#book-audit"
          onClick={scrollToBooking}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded transition-all ${scrolled
            ? "bg-primary text-primary-foreground hover:opacity-90"
            : "bg-foreground text-background hover:opacity-90"
            }`}
        >
          Book Audit
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
};

const pillars = [
  {
    title: "Revenue Architecture",
    desc: "Map your full revenue flow from lead to close to expansion. Identify leaks, bottlenecks, and structural gaps that cost you pipeline.",
  },
  {
    title: "CRM Engineering",
    desc: "Rebuild your Zoho or HubSpot setup so it reflects how your business actually sells. Clean data, correct stages, enforced process.",
  },
  {
    title: "Workflow Automation",
    desc: "Automate lead routing, task creation, follow-ups, and handoffs using Make or n8n. Remove manual steps that slow deals.",
  },
  {
    title: "Reporting & Forecast Intelligence",
    desc: "Build dashboards that answer real questions. Pipeline health, conversion rates, rep performance - in minutes, not hours.",
  },
];

const outcomes = [
  "Reduce lead leakage by 20-35%",
  "Cut reporting time by 50%",
  "Clean, kill, or qualify deals faster",
  "Clear forecast visibility",
  "Shorter sales cycles",
];

const hardTruths = [
  "Your pipeline is inflated with deals that will never close",
  "Leads leak because routing is unclear",
  "Forecasting depends on rep optimism",
  "Reporting takes hours and still lacks clarity",
  "Sales decisions are emotional, not systemic",
];

const steps = [
  { num: "01", title: "Diagnose", desc: "We audit your revenue bottlenecks - CRM, pipeline, routing, reporting." },
  { num: "02", title: "Design", desc: "We architect the system - stages, automations, dashboards, workflows." },
  { num: "03", title: "Deploy", desc: "We implement inside your CRM. You go live with a system that works." },
];

const platforms = [
  { name: "CRM", icon: Database },
  { name: "IPaaS Automation", icon: Settings },
  { name: "Reporting Systems", icon: BarChart },
  { name: "Custom Workflows", icon: GitMerge },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StickyHeader />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="container max-w-3xl">
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight">
            Revenue Systems for Scaling B2B Service Companies
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            We design revenue systems for B2B service companies between ₹1Cr-₹25Cr
            that are stuck with messy pipelines, slow lead routing, and unreliable
            forecasting.
          </p>
          <a
            href="#book-audit"
            onClick={scrollToBooking}
            className="inline-flex items-center gap-2 mt-10 px-7 py-4 bg-primary text-primary-foreground font-heading font-semibold text-base rounded hover:opacity-90 transition-opacity"
          >
            Book a Revenue Systems Audit
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Hard Truth */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="container max-w-3xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-10">
            The Hard Truth
          </h2>
          <ul className="space-y-4">
            {hardTruths.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base md:text-lg opacity-90">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-12 text-lg md:text-xl font-heading font-semibold text-primary">
            You don't have a lead problem. You have a system problem.
          </p>
        </div>
      </section>

      {/* What OpsEdge Does */}
      <section className="py-20 md:py-28">
        <div className="container">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-14 max-w-xl">
            What OpsEdge Does
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="p-6 border border-border rounded bg-background hover:border-primary/40 transition-colors"
              >
                <h3 className="font-heading text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="container max-w-3xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-10">
            Outcomes
          </h2>
          <div className="space-y-4">
            {outcomes.map((o) => (
              <div
                key={o}
                className="flex items-center gap-4 py-3 border-b border-border last:border-0"
              >
                <span className="text-primary font-heading font-bold text-lg">↗</span>
                <span className="text-base md:text-lg">{o}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-14">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num}>
                <span className="font-heading text-4xl font-bold text-primary/20">{s.num}</span>
                <h3 className="font-heading text-xl font-semibold mt-3 mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="container max-w-3xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-10">
            Who This Is For
          </h2>
          <ul className="space-y-3 mb-10">
            {[
              "Founder-led B2B service businesses",
              "Teams using Zoho or HubSpot",
              "Companies scaling past ₹1Cr but stuck operationally",
              "Sales teams with inconsistent qualification",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-base md:text-lg">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground text-sm border-l-2 border-border pl-4">
            Not for early-stage startups without structured sales.
          </p>
        </div>
      </section>

      {/* Systems We Work Inside */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="container max-w-3xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-10 text-center">
            Systems We Work Inside
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {platforms.map((p) => (
              <div
                key={p.name}
                className="flex flex-col items-center justify-center p-6 md:p-8 rounded-xl bg-background border border-border shadow-sm hover:border-primary/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <p.icon className="w-6 h-6" />
                </div>
                <span className="text-lg font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
          <div className="text-sm text-background/70 leading-relaxed text-center space-y-3">
            <p>These are platforms we frequently architect and optimize inside.</p>
            <p>However, OpsEdge is not limited to specific tools.</p>
            <p>
              We analyze and optimize your existing technology stack - whether that includes CRM,
              automation tools, reporting systems, or custom workflows.
            </p>
            <p className="font-medium text-background">
              The focus is system performance, not tool preference.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA + Booking */}
      <div>
        <section className="py-16 md:py-20 bg-background text-foreground">
          <div className="container max-w-3xl text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">
              Stop Managing Leads.
              <br />
              Start Managing <span className="text-primary">Systems.</span>
            </h2>
          </div>
        </section>
        <BookingSection />
      </div>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <span className="font-heading font-semibold text-foreground">OpsEdge</span>
              <a href="mailto:hello@opsedge.online" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                hello@opsedge.online
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            © {new Date().getFullYear()} OpsEdge. All rights reserved.
          </p>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
};

export default Index;
