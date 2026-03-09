import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { InlineWidget } from "react-calendly";

const REVENUE_OPTIONS = ["₹1-5Cr", "₹5-25Cr", "₹25Cr+"];
const CRM_OPTIONS = ["Zoho", "HubSpot", "Other", "None"];

const BookingSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    email: "",
    companyLinkedin: "",
    companyName: "",
    websiteUrl: "",
    companySize: "",
    revenueRange: "",
    crmUsed: "",
    bottleneck: "",
    qualified: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const isFormValid =
    formData.name.trim() &&
    formData.designation.trim() &&
    formData.email.trim() &&
    formData.companyLinkedin.trim() &&
    formData.companyName.trim() &&
    formData.websiteUrl.trim() &&
    formData.companySize.trim() &&
    formData.revenueRange &&
    formData.crmUsed &&
    formData.bottleneck.trim() &&
    formData.qualified;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch('/api/zoho', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setFormSubmitted(true);
    } catch (err) {
      setSubmitError("There was an error saving your details. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="book-audit" className="py-20 md:py-28 bg-foreground text-background">
      <div className="container max-w-4xl">
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 text-center">
          Book Your Revenue Systems Audit
        </h2>
        <p className="text-center text-background/60 text-sm mb-12">
          30-Minute Revenue Systems Audit - Monday to Friday, 10:00 AM to 5:00 PM
        </p>

        {!formSubmitted ? (
          <form onSubmit={handleFormSubmit} className="max-w-xl mx-auto space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-background/80">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-background/10 border border-background/20 rounded text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-primary"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-background/80">Designation / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) => setFormData((p) => ({ ...p, designation: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-background/10 border border-background/20 rounded text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-primary"
                  placeholder="e.g. Founder, VP of Sales"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-background/80">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-background/10 border border-background/20 rounded text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-primary"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-background/80">Company LinkedIn *</label>
                <input
                  type="url"
                  required
                  value={formData.companyLinkedin}
                  onChange={(e) => setFormData((p) => ({ ...p, companyLinkedin: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-background/10 border border-background/20 rounded text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-primary"
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-background/80">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData((p) => ({ ...p, companyName: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-background/10 border border-background/20 rounded text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-primary"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-background/80">Website URL *</label>
                <input
                  type="url"
                  required
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData((p) => ({ ...p, websiteUrl: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-background/10 border border-background/20 rounded text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-primary"
                  placeholder="https://yourcompany.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-background/80">Company Size *</label>
                <input
                  type="text"
                  required
                  value={formData.companySize}
                  onChange={(e) => setFormData((p) => ({ ...p, companySize: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-background/10 border border-background/20 rounded text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-primary"
                  placeholder="e.g. 10-50, 50-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-background/80">Revenue Range *</label>
                <div className="space-y-2">
                  {REVENUE_OPTIONS.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer text-background/80 hover:text-background">
                      <input
                        type="radio"
                        name="revenue"
                        value={opt}
                        checked={formData.revenueRange === opt}
                        onChange={() => setFormData((p) => ({ ...p, revenueRange: opt }))}
                        className="accent-primary"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-background/80">CRM Used *</label>
                <div className="space-y-2">
                  {CRM_OPTIONS.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer text-background/80 hover:text-background">
                      <input
                        type="radio"
                        name="crm"
                        value={opt}
                        checked={formData.crmUsed === opt}
                        onChange={() => setFormData((p) => ({ ...p, crmUsed: opt }))}
                        className="accent-primary"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-background/80">Primary Revenue Bottleneck *</label>
              <textarea
                required
                rows={3}
                value={formData.bottleneck}
                onChange={(e) => setFormData((p) => ({ ...p, bottleneck: e.target.value }))}
                className="w-full px-3 py-2.5 bg-background/10 border border-background/20 rounded text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-primary resize-none"
                placeholder="Briefly describe the biggest bottleneck in your revenue process"
              />
            </div>

            <label className="flex items-start gap-3 text-sm cursor-pointer text-background/70 hover:text-background/90 py-2">
              <input
                type="checkbox"
                checked={formData.qualified}
                onChange={(e) => setFormData((p) => ({ ...p, qualified: e.target.checked }))}
                className="accent-primary mt-0.5"
              />
              <span>This session is intended for B2B service companies with an active sales process and annual revenue above ₹1Cr.</span>
            </label>

            {submitError && (
              <p className="text-destructive text-sm font-medium mt-2">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-heading font-semibold text-sm rounded hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Continue to Schedule"}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        ) : (
          <div className="max-w-4xl mx-auto h-[700px] w-full bg-white rounded-lg overflow-hidden">
            {/* 
              IMPORTANT: Replace the URL below with your actual Calendly event link!
              Pre-filling happens automatically with the prefill prop.
            */}
            <InlineWidget
              url="https://calendly.com/admin-calendly-opsedge/meeting"
              styles={{
                height: '100%',
                width: '100%'
              }}
              prefill={{
                email: formData.email,
                name: formData.name,
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingSection;
