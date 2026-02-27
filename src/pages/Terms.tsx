import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => (
  <div className="min-h-screen bg-background text-foreground">
    <div className="container max-w-3xl py-20">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <h1 className="font-heading text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p><strong className="text-foreground">Effective Date:</strong> February 2026</p>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">1. Services</h2>
          <p>OpsEdge provides revenue operations consulting, CRM architecture design, workflow automation, and related advisory services for B2B service companies. The scope of work is defined individually for each engagement.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">2. Booking and Scheduling</h2>
          <p>Revenue Systems Audits are scheduled through our website. By booking an audit, you confirm that the information provided in the qualification form is accurate and that your company meets the stated criteria.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">3. Intellectual Property</h2>
          <p>All frameworks, methodologies, and deliverables shared during engagements remain the intellectual property of OpsEdge unless explicitly stated otherwise in a written agreement.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">4. Limitation of Liability</h2>
          <p>OpsEdge provides advisory and implementation services based on best practices. Results may vary based on implementation, team adoption, and business conditions. OpsEdge is not liable for indirect, incidental, or consequential damages.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">5. Modifications</h2>
          <p>We reserve the right to update these terms at any time. Continued use of our website or services constitutes acceptance of the updated terms.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">6. Contact</h2>
          <p>For questions about these terms, contact us at <a href="mailto:hello@opsedge.online" className="text-primary hover:underline">hello@opsedge.online</a>.</p>
        </section>
      </div>
    </div>
  </div>
);

export default Terms;
