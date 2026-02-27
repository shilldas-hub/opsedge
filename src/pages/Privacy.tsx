import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => (
  <div className="min-h-screen bg-background text-foreground">
    <div className="container max-w-3xl py-20">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <h1 className="font-heading text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p><strong className="text-foreground">Effective Date:</strong> February 2026</p>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">1. Information We Collect</h2>
          <p>We collect information you provide directly, including your name, company name, email address, website URL, and details about your revenue operations when you submit forms or book an audit through our website.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
          <p>We use the information collected to schedule and conduct Revenue Systems Audits, communicate with you about our services, and improve our offerings. We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">3. Data Storage and Security</h2>
          <p>Your data is stored securely and accessed only by authorized personnel. We implement industry-standard security measures to protect your information from unauthorized access, alteration, or destruction.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">4. Cookies</h2>
          <p>Our website may use essential cookies to ensure proper functionality. We do not use tracking cookies or third-party advertising cookies.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">5. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at hello@opsedge.online.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">6. Contact</h2>
          <p>For questions about this Privacy Policy, contact us at <a href="mailto:hello@opsedge.online" className="text-primary hover:underline">hello@opsedge.online</a>.</p>
        </section>
      </div>
    </div>
  </div>
);

export default Privacy;
