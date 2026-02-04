"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
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

    return (
        <div className="bg-white min-h-screen pt-32 pb-20 px-6 font-sans">
            <div className="max-w-[640px] mx-auto text-center">
                {/* Clean Header */}
                <h1 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-4 tracking-tight">Contact Us</h1>
                <p className="text-[19px] text-[#86868b] mb-12">We'd love to hear from you. Fill out the form below or reach out directly.</p>

                {/* Vertical Contact Info */}
                <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 mb-12 text-[#1d1d1f] font-medium border-b border-gray-100 pb-12">
                    <a href="mailto:contact@fularani.org" className="flex items-center justify-center gap-2 hover:text-[#0071e3] transition-colors">
                        <Mail size={18} /> contact@fularani.org
                    </a>
                    <a href="tel:+911234567890" className="flex items-center justify-center gap-2 hover:text-[#0071e3] transition-colors">
                        <Phone size={18} /> +91 123 456 7890
                    </a>
                </div>

                {/* Simplest Form */}
                <AnimatePresence mode="wait">
                    {submitStatus === "success" ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-[#f5f5f7] p-8 rounded-3xl"
                        >
                            <CheckCircle2 className="text-green-500 w-10 h-10 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-[#1d1d1f] mb-1">Message Sent</h3>
                            <p className="text-[#86868b]">We'll get back to you shortly.</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="text-left space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <MinimalInput label="Name" name="name" value={form.name} onChange={handleChange} required />
                                <MinimalInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
                            </div>
                            <MinimalInput label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
                            <MinimalInput label="Subject" name="subject" value={form.subject} onChange={handleChange} required />
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#86868b] uppercase ml-1">Message</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full bg-[#f5f5f7] rounded-2xl p-4 text-[16px] outline-none focus:ring-1 focus:ring-[#0071e3] transition-all resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-14 bg-[#0071e3] text-white rounded-full font-bold hover:bg-[#0077ed] transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>
                            {submitStatus === "error" && <p className="text-red-500 text-center text-sm">Error sending message. Please try again.</p>}
                        </form>
                    )}
                </AnimatePresence>

                {/* Secondary Map at Bottom */}
                <div className="mt-20 pt-12 border-t border-gray-100">
                    <h2 className="text-xl font-bold text-[#1d1d1f] mb-6 flex items-center justify-center gap-2">
                        <MapPin size={20} className="text-[#0071e3]" /> Our Location
                    </h2>
                    <div className="rounded-3xl overflow-hidden border border-gray-100">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.863132844295!2d85.80803257523817!3d20.347272081136882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a190916b5b20b17%3A0x45d8edf0190bee95!2sFularani%20Foundation!5e0!3m2!1sen!2sin!4v1769515569356!5m2!1sen!2sin"
                            className="w-full h-48 border-0 grayscale hover:grayscale-0 transition-all duration-700"
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MinimalInput = ({ label, ...props }) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-[#86868b] uppercase ml-1">{label}</label>
        <input
            {...props}
            className="w-full h-14 bg-[#f5f5f7] rounded-2xl px-5 text-[16px] outline-none focus:ring-1 focus:ring-[#0071e3] transition-all"
        />
    </div>
);

export default Contact;
