import { ArrowRight, Droplets, Leaf, Accessibility, GraduationCap, Heart } from "lucide-react";

const missions = [
    {
        title: "Mission Thalassemia",
        description: "Providing comprehensive care and support for Thalassemia patients across the region.",
        icon: <Droplets className="text-red-500" size={32} />,
        link: "/missions",
        color: "bg-red-50"
    },
    {
        title: "Mission Green",
        description: "Dedicated to environmental conservation and sustainable living through mass plantation.",
        icon: <Leaf className="text-green-500" size={32} />,
        link: "/missions",
        color: "bg-green-50"
    },
    {
        title: "Mission Mobility",
        description: "Empowering differently-abled individuals with mobility aids and accessible resources.",
        icon: <Accessibility className="text-blue-500" size={32} />,
        link: "/missions",
        color: "bg-blue-50"
    },
    {
        title: "Education for All",
        description: "Bridging the educational gap for underprivileged children through resources and coaching.",
        icon: <GraduationCap className="text-orange-500" size={32} />,
        link: "/missions",
        color: "bg-orange-50"
    },
    {
        title: "Mission Period Pride",
        description: "Promoting menstrual hygiene and awareness to empower women and girls with dignity.",
        icon: <Heart className="text-pink-500" size={32} />,
        link: "/missions",
        color: "bg-pink-50"
    }
];

const FeaturedMissions = () => {
    return (
        <section className="py-24 bg-white" id="missions">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-[36px] md:text-[48px] font-bold text-[#1d1d1f] mb-4">Our Core Missions</h2>
                    <p className="text-[19px] text-[#86868b] max-w-[700px] mx-auto">
                        We focus our efforts on five key areas to create sustainable and meaningful impact in society.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {missions.map((mission, index) => (
                        <div
                            key={index}
                            className="p-8 rounded-3xl border border-[#f5f5f7] hover:border-[#d2d2d7] transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 bg-[#fbfbfd]"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${mission.color} flex items-center justify-center mb-6`}>
                                {mission.icon}
                            </div>
                            <h3 className="text-[24px] font-semibold text-[#1d1d1f] mb-3">{mission.title}</h3>
                            <p className="text-[#86868b] leading-relaxed mb-6">
                                {mission.description}
                            </p>
                            <a
                                href={mission.link}
                                className="text-[#0066cc] font-medium flex items-center gap-1 group/link"
                            >
                                Learn more <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedMissions;
