import {
  Leaf,
  School,
  Accessibility,
  Heart,
  Globe,
  ShieldCheck,
} from "lucide-react";

export const missions = [
  {
    id: "green",
    title: "Mission Green",
    subtitle: "Environmental Impact",
    icon: Leaf,
    description:
      "Dedicating efforts to preserve our ecosystem through massive tree planting drives, sustainable waste management, and community awareness programs. We believe that a greener planet is the foundation for a healthier future.",
    longDescription:
      "Our Mission Green initiative is a comprehensive approach to environmental stewardship. We organize community-led tree planting events, educational workshops on waste reduction, and partnerships with local governments to improve waste management infrastructure. By involving youth and local communities, we ensure that these changes are sustainable and deeply rooted in the culture.",
    stats: [
      { label: "Trees Planted", value: "500+", icon: Leaf },
      { label: "Volunteers", value: "100+", icon: Globe },
    ],
    galleryCategory: "Mission Green",
    theme: {
      primary: "text-[#34c759]",
      bg: "bg-green-50",
      accent: "bg-emerald-50",
      gradient: "from-green-50 to-emerald-50",
      iconColor: "text-[#34c759]",
      color: "#34c759",
    },
  },
  {
    id: "education",
    title: "Mission Education",
    subtitle: "Sustainability & Knowledge",
    icon: School,
    description:
      "Empowering the next generation in rural Odisha by providing essential learning materials, dedicated mentorship, and safe educational environments.",
    longDescription:
      "Mission Education focuses on bridging the gap in educational access for rural children. We provide scholarships, distribute textbooks and stationery, and organize after-school tutoring programs. Our goal is to ensure that every child, regardless of their background, has the opportunity to learn, grow, and achieve their dreams.",
    stats: [
      { label: "Students Supported", value: "1,200+", icon: School },
      { label: "Schools Partnered", value: "15", icon: ShieldCheck },
    ],
    galleryCategory: "Mission Education",
    theme: {
      primary: "text-[#0071e3]",
      bg: "bg-blue-50",
      accent: "bg-indigo-50",
      gradient: "from-blue-50 to-indigo-50",
      iconColor: "text-[#0071e3]",
      color: "#0071e3",
    },
  },
  {
    id: "healthcare",
    title: "Mission Healthcare",
    subtitle: "Dignity & Health",
    icon: Heart,
    description:
      "Providing essential healthcare services, promoting menstrual hygiene, and supporting individuals with physical challenges — restoring independence and dignity.",
    longDescription:
      "Healthcare is a fundamental human right. Through Mission Healthcare, we provide wheelchairs, crutches, and prosthetics along with physiotherapy support. We also break menstrual hygiene taboos through education, distribute sanitary pads to women and girls in need, and conduct workshops on menstrual health management — empowering communities to live with dignity.",
    stats: [
      {
        label: "Healthcare Aids Distributed",
        value: "300+",
        icon: Accessibility,
      },
      { label: "Lives Impacted", value: "500+", icon: Heart },
      { label: "Pads Distributed", value: "50,000+", icon: Heart },
      { label: "Workshops Held", value: "100+", icon: Globe },
    ],
    galleryCategory: "Mission Healthcare",
    theme: {
      primary: "text-[#ff3b30]",
      bg: "bg-red-50",
      accent: "bg-rose-50",
      gradient: "from-red-50 to-rose-50",
      iconColor: "text-[#ff3b30]",
      color: "#ff3b30",
    },
  },

  {
    id: "thalassemia",
    title: "Mission Thalassemia",
    subtitle: "Urgent Appeal: Save Little Lives",
    icon: Heart,
    description:
      "Every day, innocent children battle the silent agony of Thalassemia. We are setting up a dedicated care unit to provide life-saving treatment.",
    longDescription:
      "Thalassemia is a genetic blood disorder that requires regular blood transfusions. Our Mission Thalassemia is establishing a state-of-the-art care unit equipped with advanced machinery to provide safe and free transfusions to affected children. We also organize blood donation camps to ensure a steady supply of blood for these patients.",
    stats: [
      { label: "Funds Needed", value: "₹90 Lakhs", icon: ShieldCheck },
      { label: "Children Awaiting Care", value: "200+", icon: Heart },
    ],
    galleryCategory: "Mission Thalassemia",
    theme: {
      primary: "text-[#ff3b30]",
      bg: "bg-red-50",
      accent: "bg-orange-50",
      gradient: "from-red-100 via-white to-orange-50",
      iconColor: "text-[#ff3b30]",
      color: "#ff3b30",
    },
  },
];
