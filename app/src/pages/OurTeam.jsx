import React from "react";
import { motion } from "motion/react";
import { Users, Heart, Target, Award } from "lucide-react";

const leadership = [
  {
    name: "Manoj Kumar Swain",
    designation: "Founder",
    image: "https://via.placeholder.com/400x400?text=Manoj+Kumar+Swain",
  },
  {
    name: "Kalinga Biswal",
    designation: "CEO",
    image: "https://via.placeholder.com/400x400?text=Kalinga+Biswal",
  },
];

const developers = [
  {
    name: "Abhijeet Dutta",
    designation: "Website Developer",
    image: "https://via.placeholder.com/400x400?text=Abhijeet+Dutta",
  },
  {
    name: "Debashish Parida",
    designation: "Website Developer",
    image: "https://via.placeholder.com/400x400?text=Debashish+Parida",
  },
  {
    name: "Abhijeet Dash",
    designation: "Website Developer",
    image: "https://via.placeholder.com/400x400?text=Abhijeet+Dash",
  },
];

const TeamMemberCard = ({ member, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.6 }}
    className="group relative w-full max-w-[280px] sm:max-w-none sm:w-[240px] md:w-[260px] mb-12 sm:mb-8 mx-auto sm:mx-0"
  >
    {/* Image Container */}
    <div className="aspect-[4/5] overflow-hidden bg-muted grayscale group-hover:grayscale-0 transition-all duration-700 shadow-lg">
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>

    {/* Overlapping Info Label */}
    <div className="absolute -bottom-4 left-0 right-6 sm:right-8 bg-white p-3 sm:p-4 shadow-xl z-20 transition-transform duration-500 group-hover:-translate-y-2">
      <h3 className="text-sm sm:text-base font-black text-secondary leading-tight mb-0.5 sm:mb-1">
        {member.name}
      </h3>
      <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
        {member.designation}
      </p>
    </div>
  </motion.div>
);

const OurTeam = () => {
  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 z-0 hidden lg:block"></div>
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[120px] -translate-x-1/2"></div>

      {/* Hero Section */}
      <div className="relative pt-24 md:pt-32 pb-10 md:pb-16 px-4 md:px-6 z-10">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="text-center lg:text-left"
          >
            <div className="inline-block bg-accent px-3 py-1 rounded-sm text-[9px] md:text-[10px] font-black uppercase tracking-widest text-secondary mb-4 md:mb-6">
              Our Visionaries
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-secondary leading-[1.1] md:leading-[0.95] tracking-tighter mb-4 md:mb-8 lowercase">
              Meet the <br className="hidden sm:block" />
              <span className="text-white bg-primary px-3 md:px-5 py-1 md:py-1.5 inline-block -rotate-1 mt-1 md:mt-2">
                passionate team.
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-muted-foreground leading-tight max-w-[700px] font-bold mb-6 md:mb-10 mx-auto lg:mx-0">
              A dedicated group of professionals working tirelessly to create a sustainable impact in education, healthcare, and the environment.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Team Hierarchy Section */}
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 relative z-10 pb-12 md:pb-20">
        {/* Leadership Row */}
        <div className="mb-12 md:mb-20">
          <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-12">
            <div className="h-px bg-primary/10 flex-grow"></div>
            <h2 className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[0.4em] whitespace-nowrap opacity-60">Leadership</h2>
            <div className="h-px bg-primary/10 flex-grow"></div>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6 md:gap-14">
            {leadership.map((member, index) => (
              <TeamMemberCard key={index} member={member} index={index} />
            ))}
          </div>
        </div>

        {/* Developers Row */}
        <div>
          <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-12">
            <div className="h-px bg-primary/10 flex-grow"></div>
            <h2 className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[0.4em] whitespace-nowrap opacity-60">Development Team</h2>
            <div className="h-px bg-primary/10 flex-grow"></div>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 md:gap-8">
            {developers.map((member, index) => (
              <TeamMemberCard key={index} member={member} index={index + 2} />
            ))}
          </div>
        </div>
      </div>

      {/* Values/Impact Section - Dark for contrast */}
      <section className="py-10 md:py-20 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
        
        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter leading-none mb-3 md:mb-4 lowercase">
              our core <br />
              <span className="text-secondary bg-accent px-4 py-1 inline-block rotate-1 mt-1 md:mt-2">
                philosophy.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
             <div className="flex flex-col items-center group text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl flex items-center justify-center text-accent mb-2 md:mb-4 transition-transform group-hover:scale-110">
                   <Target size={20} className="md:w-6 md:h-6" />
                </div>
                <h4 className="text-lg md:text-xl font-black mb-1 md:mb-2 lowercase tracking-tight">our mission</h4>
                <p className="text-white/60 font-medium leading-tight text-xs md:text-base max-w-[280px] md:max-w-none">To empower marginalized communities through accessible education and quality healthcare services.</p>
             </div>
             <div className="flex flex-col items-center group text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl flex items-center justify-center text-accent mb-2 md:mb-4 transition-transform group-hover:scale-110">
                   <Heart size={20} className="md:w-6 md:h-6" />
                </div>
                <h4 className="text-lg md:text-xl font-black mb-1 md:mb-2 lowercase tracking-tight">core values</h4>
                <p className="text-white/60 font-medium leading-tight text-xs md:text-base max-w-[280px] md:max-w-none">Integrity, Compassion, and Transparency in every action we take for the betterment of society.</p>
             </div>
             <div className="flex flex-col items-center group text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl flex items-center justify-center text-accent mb-2 md:mb-4 transition-transform group-hover:scale-110">
                   <Award size={20} className="md:w-6 md:h-6" />
                </div>
                <h4 className="text-lg md:text-xl font-black mb-1 md:mb-2 lowercase tracking-tight">real impact</h4>
                <p className="text-white/60 font-medium leading-tight text-xs md:text-base max-w-[280px] md:max-w-none">Making a real difference in 20+ districts through grassroots participation and leadership.</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurTeam;
