"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare, User, Clock, Send, Heart, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
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
    // 1️⃣ Send email to ADMIN
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

    // 2️⃣ Auto-reply to USER
    await emailjs.send(
      SERVICE_ID,
      REPLY_TEMPLATE_ID,
      {
        name: form.name,
        email: form.email, // must match {{email}} in template
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50 to-rose-50 overflow-auto">

            {/* Hero Section */}
            <section className="relative pt-28 pb-16 px-4 overflow-hidden">
                {/* Decorative Elements */}


                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 rounded-full mb-8 text-sm font-semibold border border-rose-200/50 shadow-sm">
                        <Heart className="w-4 h-4" fill="currentColor" />
                        <span>Ready to Connect</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                        Get In <span className="bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">Touch</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
                        Have questions about our foundation? Looking to collaborate or get involved?
                        Our team is here to assist you every step of the way.
                    </p>
                </div>
            </section>

            {/* Contact Information Cards */}
            <section className="px-4 pb-20">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

                    {/* Email Card */}
                    <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-pink-200/50">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Email Us</h3>
                        <p className="text-gray-500 mb-5 text-sm leading-relaxed">Drop us a message anytime. We typically respond within 24 hours.</p>
                        <a href="mailto:contact@fularani.org" className="text-rose-600 font-semibold hover:text-rose-700 transition-colors inline-flex items-center gap-2 group">
                            contact@fularani.org
                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    {/* Phone Card */}
                    <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-pink-200/50">
                            <Phone className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Call Us</h3>
                        <p className="text-gray-500 mb-5 text-sm leading-relaxed">Speak directly with our team during business hours.</p>
                        <a href="tel:+911234567890" className="text-rose-600 font-semibold hover:text-rose-700 transition-colors inline-flex items-center gap-2 group">
                            +91 123 456 7890
                            <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        </a>
                    </div>

                    {/* Location Card */}
                    <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-pink-200/50">
                            <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Visit Our Office</h3>
                        <p className="text-gray-500 mb-5 text-sm leading-relaxed">Stop by during working hours or schedule a meeting.</p>
                        <address className="text-rose-600 font-semibold not-italic inline-flex items-center gap-2 group">
                            Bhubaneswar, Odisha
                            <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </address>
                    </div>

                </div>
            </section>

            {/* Main Contact Form Section */}
            <section className="px-4 pb-20">
                <div className="max-w-4xl mx-auto">

                    <div className="bg-white rounded-3xl shadow-2xl shadow-gray-300/50 overflow-hidden">

                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-pink-500 to-rose-600 px-8 md:px-12 py-12 text-white">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Send Us a Message</h2>
                            <p className="text-pink-50 text-lg leading-relaxed max-w-2xl">
                                Fill out the form below with your details and inquiry. All fields marked with an asterisk (*) are required.
                                We'll respond to your message within 24-48 hours.
                            </p>
                        </div>

                        {/* Form Body */}
                        <div className="px-8 md:px-12 py-10">

                            {/* Success/Error Messages */}
                            {submitStatus === 'success' && (
                                <div className="mb-6 bg-green-50 border-2 border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Message sent successfully!</p>
                                        <p className="text-sm text-green-700">We'll get back to you soon.</p>
                                    </div>
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl">
                                    <p className="font-semibold">Failed to send message. Please try again.</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Name & Email Row */}
                                <div className="grid md:grid-cols-2 gap-6">

                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1.5">
                                            Full Name
                                            <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <User className={`absolute left-4 top-4 w-5 h-5 transition-colors duration-300
                                                ${form.name
                                                    ? isNameValid ? "text-green-600" : "text-amber-500"
                                                    : "text-gray-400"}`}
                                            />
                                            <input
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter your full name"
                                                aria-label="Full Name"
                                                className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 outline-none
                                                    transition-all duration-300 text-gray-900 placeholder:text-gray-400 font-medium
                                                    ${form.name
                                                        ? isNameValid
                                                            ? "border-green-400 bg-green-50/30 focus:ring-4 focus:ring-green-500/10"
                                                            : "border-amber-400 bg-amber-50/30 focus:ring-4 focus:ring-amber-500/10"
                                                        : "border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 hover:border-gray-300"
                                                    }`}
                                            />
                                        </div>
                                        {form.name && !isNameValid && (
                                            <p className="text-xs text-amber-600 ml-1">Name should be at least 3 characters</p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1.5">
                                            Email Address
                                            <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className={`absolute left-4 top-4 w-5 h-5 transition-colors duration-300
                                                ${form.email
                                                    ? isEmailValid ? "text-green-600" : "text-amber-500"
                                                    : "text-gray-400"}`}
                                            />
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="your.email@example.com"
                                                aria-label="Email Address"
                                                className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 outline-none
                                                    transition-all duration-300 text-gray-900 placeholder:text-gray-400 font-medium
                                                    ${form.email
                                                        ? isEmailValid
                                                            ? "border-green-400 bg-green-50/30 focus:ring-4 focus:ring-green-500/10"
                                                            : "border-amber-400 bg-amber-50/30 focus:ring-4 focus:ring-amber-500/10"
                                                        : "border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 hover:border-gray-300"
                                                    }`}
                                            />
                                        </div>
                                        {form.email && !isEmailValid && (
                                            <p className="text-xs text-amber-600 ml-1">Please enter a valid email address</p>
                                        )}
                                    </div>

                                </div>

                                {/* Phone & Subject Row */}
                                <div className="grid md:grid-cols-2 gap-6">

                                    {/* Phone Field */}
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1.5">
                                            Phone Number
                                            <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Phone className={`absolute left-4 top-4 w-5 h-5 transition-colors duration-300
                                                ${form.phone
                                                    ? isPhoneValid ? "text-green-600" : "text-amber-500"
                                                    : "text-gray-400"}`}
                                            />
                                            <input
                                                id="phone"
                                                type="tel"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter your phone number"
                                                aria-label="Phone Number"
                                                className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 outline-none
                                                    transition-all duration-300 text-gray-900 placeholder:text-gray-400 font-medium
                                                    ${form.phone
                                                        ? isPhoneValid
                                                            ? "border-green-400 bg-green-50/30 focus:ring-4 focus:ring-green-500/10"
                                                            : "border-amber-400 bg-amber-50/30 focus:ring-4 focus:ring-amber-500/10"
                                                        : "border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 hover:border-gray-300"
                                                    }`}
                                            />
                                        </div>
                                        {form.phone && !isPhoneValid && (
                                            <p className="text-xs text-amber-600 ml-1">Please enter a valid phone number (min 10 digits)</p>
                                        )}
                                    </div>

                                    {/* Subject Field */}
                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1.5">
                                            Subject
                                            <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <MessageSquare className={`absolute left-4 top-4 w-5 h-5 transition-colors duration-300
                                                ${form.subject
                                                    ? isSubjectValid ? "text-green-600" : "text-amber-500"
                                                    : "text-gray-400"}`}
                                            />
                                            <input
                                                id="subject"
                                                type="text"
                                                name="subject"
                                                value={form.subject}
                                                onChange={handleChange}
                                                required
                                                placeholder="Subject of your inquiry"
                                                aria-label="Subject"
                                                className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 outline-none
                                                    transition-all duration-300 text-gray-900 placeholder:text-gray-400 font-medium
                                                    ${form.subject
                                                        ? isSubjectValid
                                                            ? "border-green-400 bg-green-50/30 focus:ring-4 focus:ring-green-500/10"
                                                            : "border-amber-400 bg-amber-50/30 focus:ring-4 focus:ring-amber-500/10"
                                                        : "border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 hover:border-gray-300"
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                </div>

                                {/* Message Field */}
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1.5">
                                        Message
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        placeholder="Detailed description of your inquiry"
                                        aria-label="Message"
                                        className={`w-full px-4 py-4 rounded-xl border-2 outline-none
                                            transition-all duration-300 resize-none text-gray-900 placeholder:text-gray-400 font-medium
                                            ${form.message
                                                ? isMessageValid
                                                    ? "border-green-400 bg-green-50/30 focus:ring-4 focus:ring-green-500/10"
                                                    : "border-amber-400 bg-amber-50/30 focus:ring-4 focus:ring-amber-500/10"
                                                : "border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 hover:border-gray-300"
                                            }`}
                                    />
                                    {form.message && !isMessageValid && (
                                        <p className="text-xs text-amber-600 ml-1">Message should be at least 10 characters</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group w-full py-4 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold text-lg
                                        hover:shadow-xl hover:shadow-rose-500/40 hover:-translate-y-1
                                        transition-all duration-300 flex items-center justify-center gap-3
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Sending Message...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                            </form>
                        </div>

                    </div>

                </div>
            </section>

            {/* Additional Info Section */}
            <section className="px-4 pb-20">
                <div className="max-w-6xl mx-auto">

                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl">

                        <div className="relative z-10 grid md:grid-cols-2 gap-12">

                            {/* Left Side - Info */}
                            <div>
                                <h3 className="text-3xl font-bold mb-4">Visit Our Office</h3>
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    Our doors are open for visitors. You can visit our office during working hours or schedule an appointment for a detailed discussion.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 bg-white/5 rounded-2xl p-4 border border-white/10">
                                        <MapPin className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="font-medium text-white">Registered Address</p>
                                            <p className="text-gray-300 text-sm">Fularani Foundation, Bhubaneswar, Odisha, India</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 bg-white/5 rounded-2xl p-4 border border-white/10">
                                        <Clock className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="font-medium text-white">Business Hours</p>
                                            <div className="text-gray-300 text-sm">
                                                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                                                <p>Saturday: 10:00 AM - 4:00 PM</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <p className="text-sm font-semibold mb-4 text-gray-400 uppercase tracking-wider">Connect With Us</p>
                                    <div className="flex gap-3">
                                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                            className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-pink-500 transition-all hover:scale-110">
                                            <Facebook className="w-5 h-5" />
                                        </a>
                                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                                            className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-pink-500 transition-all hover:scale-110">
                                            <Twitter className="w-5 h-5" />
                                        </a>
                                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                                            className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-pink-500 transition-all hover:scale-110">
                                            <Instagram className="w-5 h-5" />
                                        </a>
                                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                                            className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-pink-500 transition-all hover:scale-110">
                                            <Linkedin className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Map Integration */}
                            <div className="relative w-full h-[400px] md:h-full min-h-[350px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.863132844295!2d85.80803257523817!3d20.347272081136882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a190916b5b20b17%3A0x45d8edf0190bee95!2sFularani%20Foundation%20-%20Bhubaneswar!5e0!3m2!1sen!2sin!4v1769515569356!5m2!1sen!2sin"
                                    className="absolute inset-0 w-full h-full"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Fularani Foundation Location"
                                ></iframe>
                            </div>

                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
};

export default Contact;
