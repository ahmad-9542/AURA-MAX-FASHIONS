import { FormEvent, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { BRAND_CONTACT } from '../data/catalog';
import { AuraMaxLogo } from './AuraMaxLogo';
import { MagneticButton } from './MagneticButton';

interface ContactPageProps {
  onBackToStorefront: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactPage({ onBackToStorefront }: ContactPageProps) {
  const prefersReducedMotion = useReducedMotion();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [preparedInquiry, setPreparedInquiry] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name (at least 2 characters).';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (subject.trim().length < 3) {
      nextErrors.subject = 'Please specify a subject (at least 3 characters).';
    }
    if (message.trim().length < 10) {
      nextErrors.message = 'Please enter a message of at least 10 characters.';
    }
    return nextErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    setPreparedInquiry({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
    setCopied(false);
  };

  const buildMailtoHref = () => {
    if (!preparedInquiry) return BRAND_CONTACT.emailHref;
    const mailBody = `Name: ${preparedInquiry.name}\nEmail: ${preparedInquiry.email}\n\n${preparedInquiry.message}`;
    return `mailto:${BRAND_CONTACT.email}?subject=${encodeURIComponent(
      `[AURA MAX Concierge] ${preparedInquiry.subject}`
    )}&body=${encodeURIComponent(mailBody)}`;
  };

  const buildWhatsAppHref = () => {
    if (!preparedInquiry) return BRAND_CONTACT.whatsappHref;
    const waText = `Hello AURA MAX,\nName: ${preparedInquiry.name}\nEmail: ${preparedInquiry.email}\nSubject: ${preparedInquiry.subject}\n\n${preparedInquiry.message}`;
    return `${BRAND_CONTACT.whatsappHref}?text=${encodeURIComponent(waText)}`;
  };

  const handleCopyMessage = async () => {
    if (!preparedInquiry || typeof navigator === 'undefined' || !navigator.clipboard) {
      return;
    }
    const text = `Subject: ${preparedInquiry.subject}\nFrom: ${preparedInquiry.name} (${preparedInquiry.email})\n\n${preparedInquiry.message}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="contact-page"
      aria-label="Contact AURA MAX"
      className="bg-[#F8F6F2] text-[#0B0B0A] min-h-[80vh]"
    >
      {/* Top Dark Architectural Banner */}
      <div className="bg-[#0B0B0A] text-[#F8F6F2] border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-20">
          <button
            type="button"
            onClick={onBackToStorefront}
            className="inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase text-[#C4C8CE] hover:text-white transition-colors mb-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Storefront</span>
          </button>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="mb-5">
              <AuraMaxLogo size="sm" />
            </div>
            <p className="text-xs tracking-[0.22em] uppercase text-[#C4C8CE] mb-3">
              OWN YOUR AURA. · Private Client Concierge
            </p>
            <h1 className="font-display text-4xl sm:text-6xl font-medium text-white leading-[1.02] text-balance mb-4">
              Connect With AURA MAX
            </h1>
            <p className="text-sm sm:text-base text-[#C4C8CE]/90 leading-relaxed max-w-xl">
              Reach our Indian client concierge for bespoke sizing advice, private styling appointments, express order assistance, or press inquiries.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Contact Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left: Interactive Contact Cards */}
          <div className="lg:col-span-5 space-y-5">
            <h2 className="font-display text-3xl font-medium text-[#0B0B0A] mb-2">
              Direct Channels
            </h2>
            <p className="text-sm text-[#64676E] mb-6">
              Connect immediately by telephone, WhatsApp, email, or Instagram.
            </p>

            {/* Phone + WhatsApp Contact Card */}
            <div className="p-6 bg-white border border-[#0B0B0A]/12 hover:border-[#0B0B0A]/40 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0B0B0A] text-[#F8F6F2] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="block text-[11px] tracking-[0.14em] uppercase text-[#64676E]">
                      Phone &amp; Concierge Line
                    </span>
                    <a
                      href={BRAND_CONTACT.phoneHref}
                      className="text-base font-semibold text-[#0B0B0A] hover:underline underline-offset-4 tabular-nums"
                    >
                      {BRAND_CONTACT.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#0B0B0A]/10">
                <a
                  href={BRAND_CONTACT.phoneHref}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B0B0A] text-[#F8F6F2] text-xs tracking-[0.12em] uppercase font-medium hover:bg-[#222326] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Call Now</span>
                </a>

                <a
                  href={BRAND_CONTACT.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#0B0B0A]/25 text-[#0B0B0A] text-xs tracking-[0.12em] uppercase font-medium hover:border-[#0B0B0A] hover:bg-[#ECEBE8] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Email Contact Card */}
            <a
              href={BRAND_CONTACT.emailHref}
              className="group block p-6 bg-white border border-[#0B0B0A]/12 hover:border-[#0B0B0A] transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-[#0B0B0A] text-[#F8F6F2] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] tracking-[0.14em] uppercase text-[#64676E]">
                      Business Email
                    </span>
                    <span className="block text-base font-semibold text-[#0B0B0A] truncate group-hover:underline underline-offset-4">
                      {BRAND_CONTACT.email}
                    </span>
                  </div>
                </div>
                <ArrowUpRight
                  className="w-4 h-4 text-[#64676E] group-hover:text-[#0B0B0A] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                  aria-hidden="true"
                />
              </div>
            </a>

            {/* Instagram Contact Card */}
            <a
              href={BRAND_CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 bg-white border border-[#0B0B0A]/12 hover:border-[#0B0B0A] transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-[#0B0B0A] text-[#F8F6F2] flex items-center justify-center shrink-0">
                    <Instagram className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] tracking-[0.14em] uppercase text-[#64676E]">
                      Instagram
                    </span>
                    <span className="block text-base font-semibold text-[#0B0B0A] truncate group-hover:underline underline-offset-4">
                      {BRAND_CONTACT.instagramHandle}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ECEBE8] text-[#0B0B0A] text-[10px] tracking-[0.14em] uppercase font-semibold group-hover:bg-[#0B0B0A] group-hover:text-white transition-colors shrink-0">
                  <span>Follow</span>
                  <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                </span>
              </div>
            </a>

            {/* Business Location Card */}
            <div className="p-6 bg-[#ECEBE8]/75 border border-[#0B0B0A]/10 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#222326] text-[#F8F6F2] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <span className="block text-[11px] tracking-[0.14em] uppercase text-[#64676E]">
                  Business Location
                </span>
                <span className="block text-base font-semibold text-[#0B0B0A]">
                  {BRAND_CONTACT.location}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Validated Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#0B0B0A]/12 p-6 sm:p-10">
              <p className="text-xs tracking-[0.18em] uppercase text-[#64676E] mb-2">
                Client Inquiry
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#0B0B0A] mb-2">
                Send a Message
              </h2>
              <p className="text-sm text-[#64676E] mb-8">
                Complete the form below to compose your inquiry for our client team.
              </p>

              {preparedInquiry ? (
                <div className="p-6 bg-[#ECEBE8]/70 border border-[#0B0B0A]/15 space-y-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className="w-5 h-5 text-[#0B0B0A] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-semibold text-[#0B0B0A]">
                        Inquiry Ready to Send — Choose Your Dispatch Method
                      </h3>
                      <p className="text-xs text-[#222326] leading-relaxed">
                        This storefront runs directly in your browser without a backend mail server, so your message has not been automatically transmitted yet. Dispatch your pre-filled inquiry right now using your email app or WhatsApp:
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-[#0B0B0A]/10 text-xs space-y-1.5">
                    <p>
                      <strong className="text-[#0B0B0A]">From:</strong>{' '}
                      {preparedInquiry.name} ({preparedInquiry.email})
                    </p>
                    <p>
                      <strong className="text-[#0B0B0A]">Subject:</strong>{' '}
                      {preparedInquiry.subject}
                    </p>
                    <p className="text-[#64676E] pt-1 whitespace-pre-wrap">
                      {preparedInquiry.message}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={buildMailtoHref()}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-[#0B0B0A] text-[#F8F6F2] text-xs tracking-[0.14em] uppercase font-semibold hover:bg-[#222326] transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Open in Email App</span>
                    </a>

                    <a
                      href={buildWhatsAppHref()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 border border-[#0B0B0A] text-[#0B0B0A] text-xs tracking-[0.14em] uppercase font-semibold hover:bg-[#0B0B0A] hover:text-white transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Send via WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="inline-flex items-center gap-1.5 px-4 py-3 border border-[#0B0B0A]/25 text-xs text-[#0B0B0A] hover:border-[#0B0B0A] transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copy Message</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPreparedInquiry(null);
                      setName('');
                      setEmail('');
                      setSubject('');
                      setMessage('');
                    }}
                    className="text-xs underline underline-offset-4 text-[#64676E] hover:text-[#0B0B0A]"
                  >
                    Compose another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-[11px] tracking-[0.14em] uppercase text-[#64676E] mb-2"
                      >
                        Customer Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        placeholder="Your full name"
                        className={`w-full px-4 py-3 bg-[#F8F6F2] border text-sm text-[#0B0B0A] placeholder:text-[#64676E] focus:outline-none ${
                          errors.name
                            ? 'border-red-700 focus:border-red-700'
                            : 'border-[#0B0B0A]/20 focus:border-[#0B0B0A]'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-xs text-red-700">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-[11px] tracking-[0.14em] uppercase text-[#64676E] mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        placeholder="you@example.com"
                        className={`w-full px-4 py-3 bg-[#F8F6F2] border text-sm text-[#0B0B0A] placeholder:text-[#64676E] focus:outline-none ${
                          errors.email
                            ? 'border-red-700 focus:border-red-700'
                            : 'border-[#0B0B0A]/20 focus:border-[#0B0B0A]'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-red-700">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-[11px] tracking-[0.14em] uppercase text-[#64676E] mb-2"
                    >
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => {
                        setSubject(e.target.value);
                        if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                      }}
                      placeholder="Sizing consultation, order update, or styling request"
                      className={`w-full px-4 py-3 bg-[#F8F6F2] border text-sm text-[#0B0B0A] placeholder:text-[#64676E] focus:outline-none ${
                        errors.subject
                          ? 'border-red-700 focus:border-red-700'
                          : 'border-[#0B0B0A]/20 focus:border-[#0B0B0A]'
                      }`}
                    />
                    {errors.subject && (
                      <p className="mt-1.5 text-xs text-red-700">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-[11px] tracking-[0.14em] uppercase text-[#64676E] mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                      }}
                      placeholder="Share your garment reference, preferred size, or question..."
                      className={`w-full px-4 py-3 bg-[#F8F6F2] border text-sm text-[#0B0B0A] placeholder:text-[#64676E] focus:outline-none resize-y ${
                        errors.message
                          ? 'border-red-700 focus:border-red-700'
                          : 'border-[#0B0B0A]/20 focus:border-[#0B0B0A]'
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-red-700">{errors.message}</p>
                    )}
                  </div>

                  <MagneticButton>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#0B0B0A] text-[#F8F6F2] text-xs tracking-[0.16em] uppercase font-semibold hover:bg-[#222326] transition-colors whitespace-nowrap"
                    >
                      <Send className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Submit Inquiry</span>
                    </button>
                  </MagneticButton>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
