"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare, User, Clock, Send, Heart, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from "lucide-react";
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
            await emailjs.send(
                SERVICE_ID,
                ADMIN_TEMPLATE_ID,
                {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    subject: form.subject,
                    message: form.message,
                },
                PUBLIC_KEY
            );

            await emailjs.send(
                SERVICE_ID,
                REPLY_TEMPLATE_ID,
                {
                    name: form.name,
                    email: form.email,
                    subject: form.subject,
                },
                PUBLIC_KEY
            );

            setSubmitStatus("success");
            setForm({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });

            setTimeout(() => setSubmitStatus(null), 5000);
        } catch (error) {
            console.error("EmailJS Error:", error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isNameValid = form.name.length > 2;
    const isEmailValid = form.email.includes("@") && form.email.includes(".");
    const isPhoneValid = form.phone.length >= 10;
    const isSubjectValid = form.subject.length > 3;
    const isMessageValid = form.message.length > 10;

    return (
        <div className="bg-[#fbfbfd] min-h-screen">
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-[1024px] mx-auto text-center">
                    <span className="text-[#0071e3] font-semibold text-[17px] mb-4 block tracking-tight">
                        Contact Support
                    </span>
                    <h1 className="text-[48px] md:text-[64px] font-bold text-[#1d1d1f] leading-[1.1] tracking-tight mb-8">
                        We're here to help. <br />
                        <span className="text-[#86868b]">Connect with our team.</span>
                    </h1>
                    <p className="text-[21px] md:text-[23px] text-[#86868b] leading-relaxed max-w-[700px] mx-auto font-medium">
                        Have questions about our initiatives or want to get involved?
                        We'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* Info Cards */}
            <section className="pb-24 px-6">
                <div className="max-w-[1024px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ContactInfoCard
                        icon={<Mail size={24} />}
                        title="Email Us"
                        value="contact@fularani.org"
                        href="mailto:contact@fularani.org"
                        description="Our team will get back to you within 24 hours."
                    />
                    <ContactInfoCard
                        icon={<Phone size={24} />}
                        title="Call Us"
                        value="+91 123 456 7890"
                        href="tel:+911234567890"
                        description="Available Mon-Fri, 9am - 6pm IST."
                    />
                    <ContactInfoCard
                        icon={<MapPin size={24} />}
                        title="Visit Us"
                        value="Bhubaneswar, Odisha"
                        description="Come say hi at our registered office."
                    />
                </div>
            </section>

            {/* Form & Map Section */}
            <section className="py-24 px-6 bg-white border-t border-black/5">
                <div className="max-w-[1024px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-12 lg:gap-20">
                        {/* Form */}
                        <div>
                            <h2 className="text-[32px] md:text-[40px] font-bold text-[#1d1d1f] tracking-tight mb-4">Send a Message</h2>
                            <p className="text-[19px] text-[#86868b] font-medium mb-12">
                                Fill out the form below and we'll reach out to you shortly.
                            </p>

                            {submitStatus === 'success' && (
                                <div className="mb-8 p-6 rounded-2xl bg-green-50 text-green-800 border border-green-200">
                                    <p className="font-bold flex items-center gap-2">
                                        <Heart size={20} className="text-green-600" />
                                        Message sent successfully!
                                    </p>
                                    <p className="text-sm mt-1">Thank you for reaching out. We'll be in touch soon.</p>
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="mb-8 p-6 rounded-2xl bg-red-50 text-red-800 border border-red-200 font-bold">
                                    Something went wrong. Please try again.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full h-14 px-5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="w-full h-14 px-5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="+91 000 000 0000"
                                            className="w-full h-14 px-5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleChange}
                                            placeholder="How can we help?"
                                            className="w-full h-14 px-5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight ml-1">Message</label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        rows="6"
                                        placeholder="Tell us what's on your mind..."
                                        className="w-full p-5 rounded-2xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] font-medium resize-none"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto px-10 h-14 bg-[#0071e3] text-white rounded-full font-bold hover:bg-[#0077ed] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                                >
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-12">
                            <div>
                                <h3 className="text-[24px] font-bold text-[#1d1d1f] mb-6">Our Location</h3>
                                <div className="apple-card aspect-square rounded-[32px] overflow-hidden border border-black/5 mb-6">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.863132844295!2d85.80803257523817!3d20.347272081136882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a190916b5b20b17%3A0x45d8edf0190bee95!2sFularani%20Foundation%20-%20Bhubaneswar!5e0!3m2!1sen!2sin!4v1769515569356!5m2!1sen!2sin"
                                        className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                                        allowFullScreen=""
                                        loading="lazy"
                                        title="Fularani Foundation Location"
                                    ></iframe>
                                </div>
                                <p className="text-[15px] text-[#86868b] font-medium leading-relaxed">
                                    Fularani Foundation, Bhubaneswar, Odisha, India. <br />
                                    Visit us for collaborations and inquiries.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-[24px] font-bold text-[#1d1d1f] mb-6">Connect</h3>
                                <div className="flex gap-4">
                                    <SocialLink icon={<Facebook size={20} />} href="#" />
                                    <SocialLink icon={<Twitter size={20} />} href="#" />
                                    <SocialLink icon={<Instagram size={20} />} href="#" />
                                    <SocialLink icon={<Linkedin size={20} />} href="#" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const ContactInfoCard = ({ icon, title, value, href, description }) => (
    <div className="apple-card p-8 flex flex-col items-center text-center group">
        <div className="w-12 h-12 rounded-full bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center mb-6 transition-colors group-hover:bg-[#0071e3] group-hover:text-white">
            {icon}
        </div>
        <h3 className="text-[21px] font-bold text-[#1d1d1f] mb-2">{title}</h3>
        <p className="text-[14px] text-[#86868b] font-medium mb-4 leading-relaxed">{description}</p>
        {href ? (
            <a href={href} className="text-[#0066cc] font-bold hover:underline">{value}</a>
        ) : (
            <span className="text-[#1d1d1f] font-bold">{value}</span>
        )}
    </div>
);

const SocialLink = ({ icon, href }) => (
    <a href={href} className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] hover:bg-[#1d1d1f] hover:text-white transition-all">
        {icon}
    </a>
);

export default Contact;
