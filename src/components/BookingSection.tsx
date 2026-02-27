import { useState } from "react";
import { ArrowRight, Check, Calendar, Clock } from "lucide-react";

const REVENUE_OPTIONS = ["₹1-5Cr", "₹5-25Cr", "₹25Cr+"];
const CRM_OPTIONS = ["Zoho", "HubSpot", "Other", "None"];

const TIME_SLOTS = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM",
];

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const BookingSection = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    websiteUrl: "",
    revenueRange: "",
    crmUsed: "",
    bottleneck: "",
    qualified: false,
    email: "",
    name: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [booked, setBooked] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const detectedTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const isFormValid =
    formData.companyName.trim() &&
    formData.websiteUrl.trim() &&
    formData.revenueRange &&
    formData.crmUsed &&
    formData.bottleneck.trim() &&
    formData.qualified &&
    formData.email.trim() &&
    formData.name.trim();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) setFormSubmitted(true);
  };

  const handleBook = () => {
    if (selectedDate && selectedTime) setBooked(true);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isWeekday = (year: number, month: number, day: number) => {
    const d = new Date(year, month, day).getDay();
    return d !== 0 && d !== 6;
  };

  const daysInMonth = getDaysInMonth(currentMonth.year, currentMonth.month);
  const firstDay = getFirstDayOfMonth(currentMonth.year, currentMonth.month);

  const prevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  if (booked) {
    return (
      <section id="book-audit" className="py-20 md:py-28 bg-foreground text-background">
        <div className="container max-w-2xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            Your session is successfully scheduled.
          </h2>
          <p className="text-background/70 text-base leading-relaxed mb-2">
            A calendar invitation has been sent to your email.
          </p>
          <p className="text-background/60 text-sm leading-relaxed mt-6 border-t border-background/10 pt-6">
            To make the session productive, please have access to your current pipeline and CRM during the call.
          </p>
        </div>
      </section>
    );
  }

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

            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-heading font-semibold text-sm rounded hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue to Schedule
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="max-w-xl mx-auto">
            <p className="text-xs text-background/50 text-center mb-6">
              <Clock className="w-3 h-3 inline mr-1" />
              Time zone: {detectedTZ}
            </p>

            {/* Calendar */}
            <div className="bg-background/5 border border-background/10 rounded p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="text-background/60 hover:text-background text-sm px-2 py-1">&larr;</button>
                <span className="font-heading font-semibold text-sm">
                  {MONTHS[currentMonth.month]} {currentMonth.year}
                </span>
                <button onClick={nextMonth} className="text-background/60 hover:text-background text-sm px-2 py-1">&rarr;</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-background/40 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <span key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateObj = new Date(currentMonth.year, currentMonth.month, day);
                  const isPast = dateObj < today;
                  const isWd = isWeekday(currentMonth.year, currentMonth.month, day);
                  const isAvailable = !isPast && isWd;
                  const isSelected =
                    selectedDate?.getDate() === day &&
                    selectedDate?.getMonth() === currentMonth.month &&
                    selectedDate?.getFullYear() === currentMonth.year;

                  return (
                    <button
                      key={day}
                      disabled={!isAvailable}
                      onClick={() => {
                        setSelectedDate(dateObj);
                        setSelectedTime("");
                      }}
                      className={`py-2 text-sm rounded transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground font-semibold"
                          : isAvailable
                          ? "text-background/80 hover:bg-background/10"
                          : "text-background/20 cursor-not-allowed"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="mb-6">
                <p className="text-sm font-medium text-background/80 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {selectedDate.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </p>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`px-3 py-2 text-xs rounded border transition-colors ${
                        selectedTime === slot
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-background/20 text-background/70 hover:border-background/40"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && selectedTime && (
              <button
                onClick={handleBook}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-heading font-semibold text-sm rounded hover:opacity-90 transition-opacity"
              >
                Confirm Booking
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingSection;
