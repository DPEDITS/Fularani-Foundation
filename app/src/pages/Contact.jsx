"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import emailjs from "@emailjs/browser";

const Contact = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
                await emailjs.send(SERVICE_ID, REPLY_TEMPLATE_ID, { name: form.name, email: form.email }, PUBLIC_KEY);
            }
            setSubmitStatus("success");
            setForm({ name: "", email: "", phone: "", subject: "", message: "" });
            setTimeout(() => setSubmitStatus(null), 5000);
        } catch (error) {
            console.error(error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <div className="relative min-h-screen pt-32 pb-20 px-6 font-sans overflow-hidden bg-[#fafafa]">
            {/* Animated Aurora Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/40 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-100/40 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-50/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "4s" }} />
            </div>

            <motion.div
                className="relative z-10 max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Left Content - Intro */}
                <div className="md:col-span-5 space-y-8 flex flex-col justify-center">
                    <motion.div variants={itemVariants}>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                            Let's start a <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                                conversation.
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-md">
                            Have questions about our missions or want to collaborate?
                            Our team is here to help you make an impact.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-6 pt-4">
                        <ContactInfoItem
                            icon={<Mail className="w-5 h-5 text-emerald-600" />}
                            label="Email us at"
                            value="contact@fularani.org"
                            href="mailto:contact@fularani.org"
                        />
                        <ContactInfoItem
                            icon={<Phone className="w-5 h-5 text-emerald-600" />}
                            label="Call us anytime"
                            value="+91 123 456 7890"
                            href="tel:+911234567890"
                        />
                        <ContactInfoItem
                            icon={<MapPin className="w-5 h-5 text-emerald-600" />}
                            label="Visit our office"
                            value="Fularani Foundation, Bhubaneswar"
                            href="#location"
                        />
                    </motion.div>
                </div>

                {/* Right Content - Glass Form Card */}
                <motion.div variants={itemVariants} className="md:col-span-7">
                    <div className="relative p-[1px] rounded-[32px] bg-gradient-to-b from-white/80 to-transparent shadow-2xl shadow-emerald-900/5">
                        <div className="bg-white/70 backdrop-blur-xl rounded-[31px] p-8 md:p-10 border border-white/50">
                            <AnimatePresence mode="wait">
                                {submitStatus === "success" ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="py-20 text-center space-y-4"
                                    >
                                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle2 className="text-emerald-600 w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">Message Delivered</h3>
                                        <p className="text-gray-600 max-w-xs mx-auto text-lg">
                                            Thank you for reaching out. We'll get back to you within 24 hours.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <form key="form" onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <PremiumInput
                                                label="FullName"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="John Doe"
                                            />
                                            <PremiumInput
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
                                            <PremiumInput
                                                label="Phone Number"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="+91 00000 00000"
                                            />
                                            <PremiumInput
                                                label="Inquiry Type"
                                                name="subject"
                                                value={form.subject}
                                                onChange={handleChange}
                                                required
                                                placeholder="Volunteer / Donor"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest ml-1">Your Message</label>
                                            <textarea
                                                name="message"
                                                value={form.message}
                                                onChange={handleChange}
                                                required
                                                rows="4"
                                                placeholder="How can we help you?"
                                                className="w-full bg-white/50 border border-gray-100 rounded-2xl p-5 text-[16px] outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none shadow-sm placeholder:text-gray-300"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="group relative w-full h-16 bg-gray-900 text-white rounded-2xl font-bold overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                                                {isSubmitting ? "Sending Connection..." : "Send Message"}
                                                {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                            </span>
                                        </button>
                                        {submitStatus === "error" && (
                                            <p className="text-red-500 text-center text-sm font-medium animate-pulse">
                                                Something went wrong. Please try again.
                                            </p>
                                        )}
                                    </form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Map Section */}
            <motion.div
                id="location"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-[1000px] mx-auto mt-32"
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-gray-900">Discover Our Hub</h2>
                        <p className="text-gray-500">Come visit us or find us on the map.</p>
                    </div>
                    <div className="h-[2px] flex-1 mx-8 bg-gradient-to-r from-emerald-100 to-transparent hidden md:block" />
                </div>

                <div className="relative group rounded-[40px] overflow-hidden border-8 border-white shadow-2xl">
                    <div className="absolute inset-0 bg-emerald-600/5 z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-700" />
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.863132844295!2d85.80803257523817!3d20.347272081136882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a190916b5b20b17%3A0x45d8edf0190bee95!2sFularani%20Foundation!5e0!3m2!1sen!2sin!4v1769515569356!5m2!1sen!2sin"
                        className="w-full h-[450px] border-0 grayscale hover:grayscale-0 transition-all duration-1000"
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>
            </motion.div>
        </div>
    );
};

const ContactInfoItem = ({ icon, label, value, href }) => (
    <a
        href={href}
        className="group flex items-center gap-5 p-4 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300"
    >
        <div className="w-12 h-12 bg-white rounded-xl shadow-md border border-gray-50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            {icon}
        </div>
        <div>
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{label}</p>
            <p className="text-[17px] font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">{value}</p>
        </div>
    </a>
);

const PremiumInput = ({ label, ...props }) => (
    <div className="space-y-2 group">
        <label className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-emerald-600 transition-colors">
            {label}
        </label>
        <input
            {...props}
            className="w-full h-14 bg-white/50 border border-gray-100 rounded-2xl px-5 text-[16px] outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm placeholder:text-gray-300"
        />
    </div>
);

export default Contact;
