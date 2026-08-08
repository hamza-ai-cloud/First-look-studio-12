'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/sections/page-header';
import { services, pricingPlans } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Check, Calendar, Clock, User, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const photographers = [
  { id: '1', name: 'Alexandra Reed', specialty: 'Wedding & Portrait' },
  { id: '2', name: 'Marcus Chen', specialty: 'Events & Videography' },
  { id: '3', name: 'Sofia Martinez', specialty: 'Fashion & Design' },
  { id: '4', name: 'James Okoye', specialty: 'Product & Printing' },
];

const timeSlots = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({
    service: '',
    package: '',
    date: '',
    time: '',
    photographer: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const steps = [
    { num: 1, label: 'Service', icon: Calendar },
    { num: 2, label: 'Package', icon: CreditCard },
    { num: 3, label: 'Schedule', icon: Clock },
    { num: 4, label: 'Photographer', icon: User },
    { num: 5, label: 'Confirm', icon: CheckCircle2 },
  ];

  const update = (key: string, value: string) => setBooking((b) => ({ ...b, [key]: value }));

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to submit booking.');
      }

      toast.success(data.message || 'Booking confirmed! A confirmation email has been sent.');
      setStep(1);
      setBooking({ service: '', package: '', date: '', time: '', photographer: '', name: '', email: '', phone: '', notes: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to submit booking.');
    }
  };

  const canProceed = () => {
    if (step === 1) return !!booking.service;
    if (step === 2) return !!booking.package;
    if (step === 3) return !!booking.date && !!booking.time;
    if (step === 4) return !!booking.photographer;
    if (step === 5) return !!booking.name && !!booking.email;
    return false;
  };

  return (
    <>
      <PageHeader
        eyebrow="Book a Session"
        title="Booking System"
        subtitle="Reserve your session in 5 easy steps. Choose your service, package, schedule, and photographer."
      />

      <section className="pb-20">
        <div className="container-luxury max-w-3xl">
          {/* Progress steps */}
          <div className="flex items-center justify-between mb-10 overflow-x-auto scrollbar-hide">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      step >= s.num
                        ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black'
                        : 'glass text-muted-foreground'
                    }`}
                  >
                    {step > s.num ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium ${step >= s.num ? 'text-gold-400' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${step > s.num ? 'bg-gold-400/50' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="glass-card p-6 md:p-8 rounded-3xl min-h-[400px]">
            <AnimatePresence mode="wait">
              {/* Step 1: Service */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">Choose a Service</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.slice(0, 8).map((s) => (
                      <button
                        key={s.slug}
                        onClick={() => update('service', s.title)}
                        className={`p-4 rounded-xl text-left transition-all ${
                          booking.service === s.title
                            ? 'glass gold-border ring-1 ring-gold-400/30'
                            : 'glass hover:bg-white/5'
                        }`}
                      >
                        <div className="text-sm font-medium text-foreground">{s.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">From {s.price ?? 'Custom quote'}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Package */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">Select a Package</h3>
                  <div className="space-y-3">
                    {pricingPlans.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => update('package', p.name)}
                        className={`w-full p-5 rounded-xl text-left transition-all flex items-center justify-between ${
                          booking.package === p.name
                            ? 'glass gold-border ring-1 ring-gold-400/30'
                            : 'glass hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <div className="font-display text-lg font-semibold text-foreground">{p.name}</div>
                          <div className="text-sm text-muted-foreground">{p.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-2xl font-bold gold-text">${p.price}</div>
                          <div className="text-xs text-muted-foreground">/{p.period}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Schedule */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">Pick Date & Time</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Select Date</label>
                      <input
                        type="date"
                        value={booking.date}
                        onChange={(e) => update('date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-foreground focus:outline-none focus:border-gold-400/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Select Time</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {timeSlots.map((t) => (
                          <button
                            key={t}
                            onClick={() => update('time', t)}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                              booking.time === t
                                ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black'
                                : 'glass text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Photographer */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">Choose Your Photographer</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {photographers.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => update('photographer', p.name)}
                        className={`p-4 rounded-xl text-left flex items-center gap-3 transition-all ${
                          booking.photographer === p.name
                            ? 'glass gold-border ring-1 ring-gold-400/30'
                            : 'glass hover:bg-white/5'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-black font-display font-bold">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.specialty}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 5: Confirm */}
              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">Confirm Your Booking</h3>
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="glass rounded-xl p-4 space-y-2">
                      {[
                        { label: 'Service', value: booking.service },
                        { label: 'Package', value: booking.package },
                        { label: 'Date', value: booking.date },
                        { label: 'Time', value: booking.time },
                        { label: 'Photographer', value: booking.photographer },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{row.label}</span>
                          <span className="text-foreground font-medium">{row.value || '—'}</span>
                        </div>
                      ))}
                    </div>
                    {/* Contact info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={booking.name}
                        onChange={(e) => update('name', e.target.value)}
                        className="px-4 py-3 rounded-xl glass border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-400/50"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={booking.email}
                        onChange={(e) => update('email', e.target.value)}
                        className="px-4 py-3 rounded-xl glass border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-400/50"
                      />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={booking.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-400/50"
                    />
                    <textarea
                      placeholder="Special requests or notes (optional)"
                      value={booking.notes}
                      onChange={(e) => update('notes', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-400/50 resize-none"
                    />
                    <div className="glass rounded-xl p-4 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Advance Payment (30%)</span>
                      <span className="font-display text-xl font-bold gold-text">
                        ${pricingPlans.find((p) => p.name === booking.package)?.price ? Math.round(pricingPlans.find((p) => p.name === booking.package)!.price * 0.3) : 0}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              <Button
                variant="outline"
                onClick={back}
                disabled={step === 1}
                className="glass gold-border text-foreground hover:bg-gold-400/10 disabled:opacity-40"
              >
                Back
              </Button>
              {step < 5 ? (
                <Button
                  onClick={next}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-gold-500 to-gold-400 text-black hover:from-gold-400 hover:to-gold-300 disabled:opacity-40"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-gold-500 to-gold-400 text-black hover:from-gold-400 hover:to-gold-300 disabled:opacity-40"
                >
                  <CreditCard className="w-4 h-4 mr-1" />
                  Pay & Confirm
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
