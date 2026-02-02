import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import aboutHero from "../assets/about-hero.png";
import {
  Download,
  Eye,
  HelpCircle,
  Heart,
  Users,
  TrendingUp,
  HandHeart,
  BookOpen,
  Car,
  TreePine,
  Sparkles,
  Target,
  Gift,
} from "lucide-react";

const About = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const missions = [
    {
      title: "#EducationForAll",
      subtitle: "Breaking Boundaries in Education",
      icon: BookOpen,
      color: "rose",
      description:
        "We champion inclusive education that transcends boundaries. Our programs cater to the underprivileged of all age groups, offering basic literacy for adults and comprehensive schooling for children.",
      highlights: [
        "Inclusive education for all age groups",
        "Learning centers in Bhadrak District, Odisha",
        "Vision to expand across all districts in Odisha",
      ],
    },
    {
      title: "#MissionMobility",
      subtitle: "Paving the Path to Healing",
      icon: Car,
      color: "blue",
      description:
        "Our commitment to ensuring inclusivity in healthcare access. We offer free, eco-friendly transportation to patients and their families, alleviating the financial strain of reaching district hospitals.",
      highlights: [
        "Free eco-friendly transportation",
        "Zero-emission electric vehicles",
        "Removing financial barriers to healthcare",
      ],
    },
    {
      title: "#MissionGreen",
      subtitle: "Sponsor Tree Plantings",
      icon: TreePine,
      color: "green",
      description:
        "Every occasion serves as an opportunity to nurture our planet. We've revolutionized celebrations, transforming them into acts of environmental stewardship through tree planting.",
      highlights: [
        "Redefining traditions with tree planting",
        "Community tree planting ceremonies",
        "Fostering environmental preservation",
      ],
    },
    {
      title: "#MissionPeriodPride",
      subtitle: "Support Women's Health and Equality",
      icon: Sparkles,
      color: "purple",
      description:
        "Empowering change through menstrual health awareness, advocating for paid periods, and ensuring accessible healthcare for women's specific health needs.",
      highlights: [
        "Advocating for paid menstrual leave",
        "Menstrual health education programs",
        "Promoting gender equality",
      ],
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      rose: {
        bg: "bg-rose-50",
        text: "text-rose-600",
        border: "border-rose-200",
      },
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
      },
      green: {
        bg: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
      },
    };
    return colors[color] || colors.rose;
  };

  return (
    <div className="bg-[#fbfbfd] min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={aboutHero}
            alt="Community support"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/60 mix-blend-multiply" />
        </div>

        <motion.div
          className="relative z-10 text-center px-4 max-w-5xl mx-auto text-white"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-1 mt-3 inline-block"
          >
            <span className="py-2 px-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wider uppercase ">
              About Fularani Foundation
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Uplifting Lives,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-300">
              Safeguarding Our World
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto">
            Genuine progress extends beyond personal achievements — it lies in
            our capacity to uplift others and protect our cherished planet.
          </p>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="relative -mt-16 z-20 container mx-auto px-4 pb-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {[
            {
              icon: BookOpen,
              value: "#EducationForAll",
              label: "Inclusive Learning",
              color: "rose",
            },
            {
              icon: Car,
              value: "#MissionMobility",
              label: "Healthcare Access",
              color: "blue",
            },
            {
              icon: TreePine,
              value: "#MissionGreen",
              label: "Environmental Care",
              color: "green",
            },
            {
              icon: Sparkles,
              value: "#MissionPeriodPride",
              label: "Women's Health",
              color: "purple",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center gap-4 hover:translate-y-[-5px] transition-transform duration-300"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${getColorClasses(stat.color).bg} flex items-center justify-center ${getColorClasses(stat.color).text}`}
              >
                <stat.icon size={28} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Mission Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-rose-100 rounded-full blur-3xl opacity-60"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-60"></div>
              <img
                src={aboutHero}
                alt="Our Mission"
                className="rounded-3xl shadow-2xl relative z-10 w-full h-[600px] object-cover"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl z-20 max-w-xs hidden md:block">
                <p className="text-gray-800 font-semibold italic">
                  "Genuine progress lies in our capacity to uplift others and
                  safeguard our cherished world."
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Your Impact Begins with{" "}
                <span className="text-rose-600">Fularani Foundation</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  At Fularani Foundation, we stand firm in the belief that{" "}
                  <strong className="text-gray-900">
                    genuine progress extends beyond personal achievements
                  </strong>{" "}
                  — it lies in our capacity to uplift others and safeguard our
                  cherished world.
                </p>
                <p>
                  Our foundation is rooted in compassion and unwavering
                  commitment, propelling us forward on a journey encapsulating
                  four impactful verticals:{" "}
                  <strong className="text-green-600">#MissionGreen</strong>,{" "}
                  <strong className="text-blue-600">#MissionMobility</strong>,{" "}
                  <strong className="text-rose-600">#EducationForAll</strong>,
                  and{" "}
                  <strong className="text-purple-600">
                    #MissionPeriodPride
                  </strong>
                  .
                </p>
                <p>
                  Every contribution, regardless of size, powers our efforts to
                  create accessible transportation, inclusive education,
                  environmental conservation, and menstrual health awareness and
                  empowerment.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/volunteer-register" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl flex items-center gap-3">
                  <HandHeart size={20} />
                  Join Our Mission
                </Link>
                <Link to="/donor-register" className="bg-rose-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-rose-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-3">
                  <Gift size={20} />
                  Donate Now
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Four Missions Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-rose-600 font-bold tracking-wider uppercase text-sm mb-3 block">
              Our Initiatives
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Four Pillars of Change
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our foundation is driven by four impactful verticals, each
              designed to create lasting positive change in communities.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {missions.map((mission, index) => {
              const colorClasses = getColorClasses(mission.color);
              return (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className={`bg-gray-50 rounded-3xl p-8 border ${colorClasses.border} hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-start gap-6">
                    <div
                      className={`w-16 h-16 rounded-2xl ${colorClasses.bg} flex items-center justify-center ${colorClasses.text} flex-shrink-0`}
                    >
                      <mission.icon size={32} />
                    </div>
                    <div>
                      <h3
                        className={`text-2xl font-bold ${colorClasses.text} mb-1`}
                      >
                        {mission.title}
                      </h3>
                      <p className="text-gray-500 font-medium mb-4">
                        {mission.subtitle}
                      </p>
                      <p className="text-gray-600 mb-6">
                        {mission.description}
                      </p>
                      <ul className="space-y-2">
                        {mission.highlights.map((highlight, hIndex) => (
                          <li
                            key={hIndex}
                            className="flex items-center gap-2 text-gray-700"
                          >
                            <Target size={16} className={colorClasses.text} />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Donate & Volunteer Section */}
      <section className="py-20 bg-gradient-to-br from-rose-900 via-rose-800 to-rose-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <pattern
              id="pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="2"
                cy="2"
                r="1"
                fill="currentColor"
                className="text-white"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Donate Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
            >
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Heart className="text-rose-200 w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 text-center">
                Donate and Support
              </h3>
              <ul className="space-y-4 text-rose-100 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-rose-300 font-bold">•</span>
                  <span>
                    Your donations drive the initiatives of all four missions,
                    fueling our collective goal towards positive change.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-300 font-bold">•</span>
                  <span>
                    Every contribution, regardless of size, powers our efforts
                    to create real impact.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-300 font-bold">•</span>
                  <span>
                    Your donation isn't just financial — it's a catalyst for
                    real and impactful change.
                  </span>
                </li>
              </ul>
              <Link to="/donor-register" className="block w-full bg-white text-rose-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-rose-50 transition-colors shadow-xl text-center">
                Donate Now
              </Link>
            </motion.div>

            {/* Volunteer Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
            >
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Users className="text-rose-200 w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 text-center">
                Volunteer and Make a Difference
              </h3>
              <ul className="space-y-4 text-rose-100 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-rose-300 font-bold">•</span>
                  <span>
                    Join our team to provide inclusive transportation and
                    healthcare access support.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-300 font-bold">•</span>
                  <span>
                    Help us with green transportation initiatives producing zero
                    emissions.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-300 font-bold">•</span>
                  <span>
                    Be part of creating a more inclusive and healthier
                    community.
                  </span>
                </li>
              </ul>
              <Link to="/volunteer-register" className="block w-full bg-white text-rose-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-rose-50 transition-colors shadow-xl text-center">
                Become a Volunteer
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Questions Section */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <HelpCircle className="text-gray-300 w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Have Questions?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              We'll help you choose how you want to make a difference. Whether
              it's volunteering, donating, or partnering, we're here to guide
              you.
            </p>
            <Link to="/contact" className="inline-block bg-rose-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-rose-700 transition-colors shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transform duration-200">
              Contact Support
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Reports Section */}
      <section className="py-20 px-4 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-white rounded-3xl p-8 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold mb-6">
                  <TrendingUp size={16} />
                  <span>Annual Reports</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Transparency that Builds Trust
                </h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Explore Fularani Foundation's Annual Reports to see the impact
                  we've created together. Our reports provide a detailed
                  overview of our financials, initiatives, and the lives we've
                  touched.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg">
                    <Eye size={18} />
                    View Report
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-900 transition-colors">
                    <Download size={18} />
                    Download PDF
                  </button>
                </div>
              </div>

              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative w-48 h-64 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-r-2xl border-l-[12px] border-rose-500 overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300 cursor-pointer">
                  <div className="p-6">
                    <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center mb-6">
                      <TrendingUp className="text-rose-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      Annual Report
                    </h4>
                    <p className="text-sm text-gray-500">2024-2025</p>
                  </div>
                  <div className="absolute bottom-0 w-full bg-gray-50 p-4 text-center text-xs font-medium text-gray-500">
                    Fularani Foundation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ArrowRight = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default About;
