"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowUpRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const ADMIN_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID;
  const REPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_REPLY_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, form, PUBLIC_KEY);
      if (REPLY_TEMPLATE_ID) {
        await emailjs.send(
          SERVICE_ID,
          REPLY_TEMPLATE_ID,
          { name: form.name, email: form.email },
          PUBLIC_KEY,
        );
      }
      setSubmitStatus("success");
      
      // Track Contact Form Submission in Meta Pixel
      if (window.fbq) {
        window.fbq('track', 'Contact', {
          content_name: form.subject || 'General Inquiry'
        });
      }

      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-muted min-h-screen pt-28 pb-20 px-6 md:px-10">
      <div className="max-w-[1440px] mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-accent px-4 py-1 rounded-sm text-[15px] font-black uppercase tracking-widest text-secondary mb-6 shadow-lg shadow-accent/20">
            Get In Touch
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-secondary tracking-tighter leading-[0.9] lowercase mb-6">
            let's start a <br />
            <span className="text-white bg-primary px-4 py-2 inline-block -rotate-1 shadow-xl shadow-primary/30">
              conversation.
            </span>
          </h1>
          <p className="text-secondary/60 text-lg md:text-xl font-bold max-w-xl mx-auto">
            Have questions about our programs? Want to partner with us? We'd love to hear from you.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Email Card */}
            <a
              href="mailto:contact@fularani.org"
              className="block bg-secondary p-8 rounded-3xl shadow-2xl group hover:-translate-y-1 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-accent/20">
                    <Mail size={22} className="text-secondary" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Email Us</p>
                  <p className="text-xl font-black text-white">connect@fularanifoundation.org</p>
                </div>
                <ArrowUpRight className="text-white/30 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={24} />
              </div>
            </a>

            {/* Phone Card */}
            <a
              href="tel:+919439665220"
              className="block bg-primary p-8 rounded-3xl shadow-xl shadow-primary/20 group hover:-translate-y-1 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6">
                    <Phone size={22} className="text-primary" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-2">Call Us</p>
                  <p className="text-xl font-black text-white">+91 94396 65220</p>
                </div>
                <ArrowUpRight className="text-white/50 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={24} />
              </div>
            </a>

            {/* Location Card */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-secondary/10">
              <div className="flex items-start gap-5 mb-6">
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={22} className="text-secondary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40 mb-2">Visit Us</p>
                  <p className="text-lg font-black text-secondary leading-snug">
                    Fularani Foundation, <br />Bhubaneswar, Odisha, India
                  </p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-secondary/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.863132844295!2d85.80803257523817!3d20.347272081136882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a190916b5b20b17%3A0x45d8edf0190bee95!2sFularani%20Foundation!5e0!3m2!1sen!2sin!4v1769515569356!5m2!1sen!2sin"
                  className="w-full h-40 border-0 transition-all duration-700"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {submitStatus === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-secondary p-12 rounded-3xl shadow-2xl h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-green-500/30">
                    <CheckCircle2 className="text-white" size={40} />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3 tracking-tight lowercase">message sent.</h3>
                  <p className="text-white/60 font-bold text-lg">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmit}
                  className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-secondary/10"
                >
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                      <Sparkles size={20} className="text-secondary" />
                    </div>
                    <h3 className="text-2xl font-black text-secondary tracking-tighter lowercase">send us a message.</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Your Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                      <FormInput
                        label="Email Address"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Phone Number"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                      />
                      <FormInput
                        label="Subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        placeholder="Partnership Inquiry"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 mb-2 block">
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows="5"
                        placeholder="Tell us how we can help..."
                        className="w-full bg-muted/50 border-2 border-transparent focus:border-primary rounded-2xl p-5 text-base font-bold text-secondary focus:outline-none transition-all resize-none placeholder:text-secondary/30"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 bg-secondary text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all disabled:opacity-50 shadow-2xl shadow-secondary/20 flex items-center justify-center gap-3 group"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message
                          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>

                    {submitStatus === "error" && (
                      <p className="text-red-500 text-center text-sm font-bold">
                        Something went wrong. Please try again.
                      </p>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormInput = ({ label, ...props }) => (
  <div>
    <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 mb-2 block">
      {label}
    </label>
    <input
      {...props}
      className="w-full h-14 bg-muted/50 border-2 border-transparent focus:border-primary rounded-xl px-5 text-base font-bold text-secondary focus:outline-none transition-all placeholder:text-secondary/30"
    />
  </div>
);

export default Contact;
