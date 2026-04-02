import React from "react";
import { motion } from "motion/react";
import { Users, Linkedin, Mail, Github, ShieldCheck, Code, Calculator } from "lucide-react";

const leadership = [
  {
    name: "Kalinga Biswal",
    designation: "President",
    image: "https://res.cloudinary.com/dnbgja6dx/image/upload/v1774402269/Kalinga_Biswal_nng6y9.jpg",
    icon: ShieldCheck,
    color: "#0071e3",
    linkedin: "https://www.linkedin.com/in/kalingabiswal/",
    email: "fularanifoundation@gmail.com",
  },
  {
    name: "Manoj Kumar Swain",
    designation: "Treasurer",
    image: "https://res.cloudinary.com/dnbgja6dx/image/upload/v1774402075/Manoj_Swain_skag5d.jpg",
    icon: Calculator,
    color: "#ff3b30",
  },
];

const developers = [
  {
    name: "Abhijeet Dutta",
    designation: "Website Developer",
    image: "https://res.cloudinary.com/dnbgja6dx/image/upload/v1774002900/h1xsoyitoj5zevwyvrh7.jpg",
    icon: Code,
    color: "#34c759",
    linkedin: "https://www.linkedin.com/in/abhijeet-dutta-19082005ad/",
    github: "https://github.com/abhijeetdutta-1908",
    email: "abhijeetduttaam@gmail.com",
  },
  {
    name: "Debashish Parida",
    designation: "Website Developer",
    image: "https://res.cloudinary.com/dnbgja6dx/image/upload/v1773989216/nhd7yidigeomxjtcsu2d.jpg",
    icon: Code,
    color: "#34c759",
    linkedin: "https://www.linkedin.com/in/debashish-parida-421496276/",
    github: "https://github.com/DPEDITS",
    email: "debashishparida75@gmail.com",
  },
  {
    name: "Abhijeet Dash",
    designation: "Website Developer",
    image: "https://res.cloudinary.com/dnbgja6dx/image/upload/v1773989749/b6yobhp0l5476j4fbhsq.jpg",
    icon: Code,
    color: "#34c759",
    linkedin: "https://www.linkedin.com/in/abhijeet-dashy/",
    github: "https://github.com/Abhijeet-Dashy",
    email: "abhijeetdashy@gmail.com",
  },
  {
    name: "Pankaj Ghosh",
    designation: "App Developer",
    image: "https://res.cloudinary.com/dnbgja6dx/image/upload/v1774967810/WhatsApp_Image_2026-03-31_at_8.05.05_PM_rzjso9.jpg",
    icon: Code,
    color: "#34c759",
    linkedin: "https://in.linkedin.com/in/pankaj-ghosh",
    github: "https://github.com/pankaj-ghosh",
    email: "ghoshpankaj260@gmail.com",
  }
];

const TeamMemberCard = ({ member, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.8 }}
    className="group relative p-6 md:p-10 bg-muted/20 rounded-[40px] border-2 border-transparent hover:border-primary/10 hover:bg-white hover:shadow-2xl transition-all duration-500 text-center max-w-[320px] mx-auto w-full"
  >
    {/* Icon Badge */}
    <div 
        style={{ backgroundColor: `${member.color}15`, color: member.color }}
        className="absolute top-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12"
    >
        <member.icon size={18} />
    </div>

    {/* Portrait */}
    <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto mb-6">
      <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <img
        src={member.image}
        alt={member.name}
        className="relative z-10 w-full h-full object-cover rounded-full border-4 border-white shadow-xl transition-transform duration-700 group-hover:scale-105"
      />
    </div>

    {/* Info */}
    <h3 className="text-xl md:text-2xl font-black text-secondary leading-tight mb-1 tracking-tighter lowercase group-hover:text-primary transition-colors">
      {member.name}
    </h3>
    <p className="text-[10px] md:text-[11px] font-black text-secondary/40 uppercase tracking-[0.2em] mb-6">
      {member.designation}
    </p>

    {/* Socials */}
    <div className="flex justify-center gap-4 pt-6 border-t border-black/5 opacity-40 group-hover:opacity-100 transition-opacity">
      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-secondary/60 hover:text-primary transition-colors">
        <Linkedin size={16} />
      </a>
      <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-secondary/60 hover:text-primary transition-colors">
        <Github size={16} />
      </a>
      <a href={`mailto:${member.email}`} className="text-secondary/60 hover:text-primary transition-colors">
        <Mail size={16} />
      </a>
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
      <section className="relative pt-24 md:pt-40 pb-12 md:pb-24 px-6 z-10">
        <div className="max-w-[1200px] mx-auto text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-block bg-accent px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest text-secondary mb-8">
              Humanity in Action
            </div>
            <h1 className="text-5xl md:text-8xl lg:text-[100px] font-black text-secondary leading-[0.9] tracking-tighter mb-8 lowercase">
              meet our <br />
              <span className="text-white bg-primary px-4 md:px-6 py-1 md:py-2 inline-block -rotate-1 mt-2">
                passionate team.
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground font-bold max-w-2xl leading-tight">
              A collective of dedicated professionals building a sustainable future for India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[1240px] mx-auto px-6 pb-32 relative z-10 space-y-12 md:space-y-16">
        
        {/* Leadership */}
        <section>
          <div className="text-center md:text-left mb-10 md:mb-12">
             <h2 className="text-3xl md:text-6xl font-black text-secondary tracking-tighter leading-none mb-4 lowercase">
                foundation{" "}
                <span className="text-primary italic underline decoration-accent decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">
                  leadership
                </span>.
             </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {leadership.map((member, index) => (
              <TeamMemberCard key={index} member={member} index={index} />
            ))}
            
            {/* Mission Statement Bento Card */}
            <div className="lg:col-span-2 bg-secondary text-white p-10 md:p-14 rounded-[40px] flex flex-col justify-center relative overflow-hidden shadow-2xl group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/10 transition-colors"></div>
              <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-[0.9] mb-6 lowercase">
                leading with <br /> <span className="text-accent italic">compassion</span>.
              </h3>
              <p className="text-white/60 text-lg font-bold leading-tight max-w-sm">
                Transparency and empathy are the core pillars of our foundation's success.
              </p>
            </div>
          </div>
        </section>

        {/* Development */}
        <section>
          <div className="text-center md:text-left mb-10 md:mb-12">
             <h2 className="text-3xl md:text-6xl font-black text-secondary tracking-tighter leading-none mb-4 lowercase">
                digital{" "}
                <span className="text-primary italic">architects</span>.
             </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {developers.map((member, index) => (
              <TeamMemberCard key={index} member={member} index={index + 2} />
            ))}
          </div>
        </section>

      </main>

      {/* Footer Support Section */}
      <section className="bg-primary p-12 md:p-24 lg:p-32 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 lowercase">
            empower dreams <br />
            <span className="text-white bg-black/20 px-4 md:px-6 py-1 md:py-2 inline-block -rotate-1 mt-2 md:mt-4">
               inspire humanity.
            </span>
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/donor-register" className="bg-accent text-secondary px-8 md:px-12 py-4 md:py-6 rounded-2xl font-black uppercase tracking-tight hover:scale-105 transition-all shadow-2xl shadow-black/20">Donate Now</a>
            <a href="/volunteer-register" className="bg-white/10 backdrop-blur-md text-white border-2 border-white/20 px-8 md:px-12 py-4 md:py-6 rounded-2xl font-black uppercase tracking-tight hover:bg-white hover:text-primary transition-all">Join as Volunteer</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurTeam;
