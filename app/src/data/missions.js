import {
  Leaf,
  School,
  Accessibility,
  Heart,
  Globe,
  ShieldCheck,
  Activity,
  Droplet,
  Dumbbell,
  Gift,
  Recycle,
  Briefcase,
  Cpu,
  Award,
} from "lucide-react";

export const missions = [
  {
    id: "green",
    title: "Mission Green",
    subtitle: "Environmental Impact",
    icon: Leaf,
    description:
      "Afforestation across 314 blocks of Odisha - planting resilience, biodiversity, and climate hope one tree at a time.",
    longDescription:
      "Mission Green is Fularani Foundation's flagship environmental programme spanning 30 districts and 314 blocks of Odisha. It combines plantation, land restoration, school greening, and community stewardship to create long-term ecological impact rooted in local ownership.",
    sections: [
      {
        title: "Programme Components",
        items: [
          "Mass plantation drives across 314 blocks with community participation and survival tracking.",
          "Coverage across all 30 districts of Odisha through site models ranging from 3 to 100 acres.",
          "Community stewardship led by local youth groups and women's self-help groups.",
          "School greening drives that combine plantation with environmental education.",
          "Geo-tagged plantation records, survival monitoring, and annual impact reporting.",
        ],
      },
      {
        title: "Linked Initiatives",
        items: [
          "Waste to Wealth supports Mission Green through composting and circular-economy linkages.",
          "Krishi-Sakha AI connects environmental health with climate-smart agriculture and crop advisory.",
        ],
      },
    ],
    csrOpportunity:
      "CSR support can fund saplings, site preparation, community training, and three years of survival monitoring. A grant of Rs 5 lakh can plant and sustain 5,000+ trees in a named grove.",
    stats: [
      { label: "Blocks Covered", value: "314", icon: Leaf },
      { label: "Districts", value: "30", icon: Globe },
      { label: "Site Size", value: "3-100 Acres", icon: ShieldCheck },
      { label: "Model", value: "Community Owned", icon: Award },
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
    title: "Mission Education For All",
    subtitle: "Reaching the unreached",
    icon: School,
    description:
      "Reaching the unreached - free tuition, scholarships, and life-skills education for 400+ students across Bhadrak and Odisha.",
    longDescription:
      "Mission Education for All is the Foundation's founding programme. Built for first-generation learners, it delivers free tuition, mentorship, scholarships, and a chain teaching model where graduates return to teach the next cohort.",
    sections: [
      {
        title: "What We Deliver",
        items: [
          "Daily tuition support in core subjects for Class 1 to 10 students across 5+ centres.",
          "Scholarships for high-potential students from low-income families pursuing higher education.",
          "A chain teaching model where graduates return as volunteer teachers.",
          "School and community-centre partnerships that strengthen remedial and foundational learning.",
          "Career exposure and life-skills integration through the Jeevan Kaushal model.",
        ],
      },
      {
        title: "Impact and Roadmap",
        items: [
          "400+ active students supported across Bhadrak district.",
          "12+ scholarships awarded for higher education.",
          "5+ school and centre partnerships operational.",
          "Future phases include formalising centres, expanding within Bhadrak, and replicating in neighbouring districts.",
        ],
      },
    ],
    csrOpportunity:
      "CSR funding supports teacher stipends, study materials, digital devices, and scholarships. A grant of Rs 5 lakh can support 50 students for one full academic year.",
    stats: [
      { label: "Students", value: "400+", icon: School },
      { label: "Scholarships", value: "12+", icon: Award },
      { label: "Centres", value: "5+", icon: ShieldCheck },
      { label: "District Focus", value: "1", icon: Globe },
    ],
    galleryCategory: "Mission Education For All",
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
    title: "No Thalassemia Odisha 2035",
    subtitle: "Zero new births by 2035",
    icon: Heart,
    description:
      "A mission to eliminate new thalassemia births in Odisha by 2035 through carrier screening, awareness, registry-building, and policy advocacy.",
    longDescription:
      "No Thalassemia Odisha 2035 is the Foundation's most ambitious public health mission. Starting with Bhadrak as a pilot district, it aims to build the screening, awareness, and policy systems needed to prevent new thalassemia major births across Odisha.",
    sections: [
      {
        title: "Mission Components",
        items: [
          "Free carrier screening camps for youth, students, and pre-marital couples.",
          "Mass awareness campaigns through schools, colleges, health fairs, media, and community events.",
          "Integration of screening pathways into DHH Bhadrak systems and school health programmes.",
          "A district patient registry for better transfusion planning and research.",
          "Policy advocacy with the state government and NHM Odisha for wider screening mandates.",
        ],
      },
      {
        title: "Policy Context",
        items: [
          "Odisha has one of India's highest thalassemia carrier prevalence rates.",
          "There is still no systematic statewide carrier screening programme in Odisha.",
          "The Foundation is pursuing a Bhadrak pilot with a target of zero new major births in Bhadrak by 2030 and statewide by 2035.",
          "A district campaign launch is scheduled for April 10, 2026 at DHH Bhadrak.",
        ],
      },
    ],
    csrOpportunity:
      "Carrier screening costs about Rs 1,500 per person including testing and counselling. A grant of Rs 5 lakh can screen 333 people, while Rs 25 lakh can fund a full district campaign series.",
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
  {
    id: "education-for-all",
    title: "Mission Education For All",
    subtitle: "Reaching the unreached",
    icon: School,
    description:
      "Reaching the unreached — free tuition, scholarships & life-skills education for 400+ students across Bhadrak and Odisha.",
    longDescription:
      "Mission Education For All is Fularani Foundation's founding programme, born from a single act of teaching one child. Today it has grown into a multi-centre model serving 400+ students across 5+ centres in Bhadrak district. We deliver free tuition, mentorship, scholarships, and practical life-skills training for first-generation learners.",
    sections: [
      {
        title: "What We Deliver",
        items: [
          "Daily tuition in core subjects for Class 1 to 10 students across 5+ centres.",
          "Scholarships for high-potential students from low-income families.",
          "A chain teaching model where graduates return as volunteer teachers.",
          "School partnerships, foundational literacy support, and career exposure sessions.",
          "Jeevan Kaushal life-skills training in cooking, finance, self-reliance, and communication.",
        ],
      },
      {
        title: "Impact and Scale",
        items: [
          "400+ active students supported across Bhadrak district.",
          "12+ scholarships awarded for higher education.",
          "5+ school and centre partnerships operational.",
          "A future roadmap focused on consolidation, block expansion, and district replication.",
        ],
      },
    ],
    csrOpportunity:
      "CSR funding supports teacher stipends, study materials, digital devices, and scholarships. A grant of Rs 5 lakh can support 50 students for one academic year.",
    stats: [
      { label: "Students Supported", value: "400+", icon: School },
      { label: "Scholarships Awarded", value: "12+", icon: Award },
      { label: "Centres", value: "5+", icon: ShieldCheck },
      { label: "District Focus", value: "1", icon: Globe },
    ],
    galleryCategory: "Mission Education For All",
    theme: {
      primary: "text-[#1d4ed8]",
      bg: "bg-blue-50",
      accent: "bg-sky-50",
      gradient: "from-blue-50 to-sky-50",
      iconColor: "text-[#1d4ed8]",
      color: "#1d4ed8",
    },
  },
  {
    id: "mission-mobility",
    title: "Mission Mobility",
    subtitle: "Accessible movement",
    icon: Activity,
    description:
      "Free electric vehicle transport for thalassemia patients, dialysis patients, and students - bridging the last mile between communities and care.",
    longDescription:
      "Mission Mobility removes one of the biggest barriers to care and education in rural Odisha: transport cost. The programme operates scheduled, free, and zero-emission mobility support linking vulnerable beneficiaries to hospitals, stations, schools, and tuition centres.",
    sections: [
      {
        title: "Service Areas",
        items: [
          "Daily hospital connectivity between Bhadrak DHH, sub-district hospitals, and remote block headquarters.",
          "Railway station transfers for outstation patients arriving through Bhadrak.",
          "Morning and evening student runs for underserved communities.",
          "EV-based operations that lower cost and environmental impact together.",
          "A beneficiary registry for predictable and regular service access.",
        ],
      },
      {
        title: "Impact and Scale Plan",
        items: [
          "Free transport is already operational for thalassemia patients attending DHH Bhadrak.",
          "Station-to-hospital transfers cut access time for outstation patients by 60%+.",
          "Student transport supports 50+ children attending tuition centres daily.",
          "The roadmap expands from 1-2 vehicles today to 5 vehicles across all 7 blocks of Bhadrak.",
        ],
      },
    ],
    csrOpportunity:
      "One e-rickshaw costing about Rs 1.5-2 lakh can serve 8-12 patients daily for 5+ years. CSR grants can fund vehicle purchase, insurance, branding, and route operations.",
    stats: [
      { label: "Coverage Plan", value: "7 Blocks", icon: Globe },
      { label: "Access Model", value: "Daily Routes", icon: Activity },
      { label: "Fare", value: "Free Rides", icon: ShieldCheck },
      { label: "Fleet", value: "EV Based", icon: Award },
    ],
    galleryCategory: "Mission Mobility",
    theme: {
      primary: "text-[#0f766e]",
      bg: "bg-teal-50",
      accent: "bg-cyan-50",
      gradient: "from-teal-50 to-cyan-50",
      iconColor: "text-[#0f766e]",
      color: "#0f766e",
    },
  },
  {
    id: "mission-period-pride",
    title: "Mission Period Pride",
    subtitle: "Menstrual dignity",
    icon: Droplet,
    description:
      "Breaking silence and building dignity through menstrual health education and sanitary access for women and girls across Odisha.",
    longDescription:
      "Mission Period Pride confronts menstrual health stigma and the lack of sanitary access in rural and semi-urban Odisha through school outreach, frontline worker training, distribution drives, and gender-equity-centred awareness.",
    sections: [
      {
        title: "Programme Pillars",
        items: [
          "School workshops that build factual menstrual health awareness for girls and boys.",
          "Free and subsidised sanitary pad distribution in underserved communities.",
          "ASHA and ANM training to include menstrual counselling in routine outreach.",
          "Transport support to reach remote areas and a gender equity lens in every campaign.",
        ],
      },
      {
        title: "Impact",
        items: [
          "Workshops delivered across multiple schools in Bhadrak district.",
          "Thousands of sanitary products distributed through campaign drives.",
          "Women's self-help groups support sustained distribution and local outreach.",
          "The model is designed to be replicated in other districts of Odisha.",
        ],
      },
    ],
    csrOpportunity:
      "A district campaign cycle of about Rs 2-3 lakh can cover 20 schools, 5,000 sanitary pad packets, ASHA training, and IEC materials with donor acknowledgement.",
    stats: [
      { label: "Campaign Reach", value: "Odisha Wide", icon: Globe },
      { label: "School Cycle", value: "20 Schools", icon: School },
      { label: "Pad Support", value: "5,000 Packets", icon: Droplet },
      { label: "Core Lens", value: "Gender Equity", icon: Heart },
    ],
    galleryCategory: "Mission Period Pride",
    theme: {
      primary: "text-[#db2777]",
      bg: "bg-pink-50",
      accent: "bg-fuchsia-50",
      gradient: "from-pink-50 to-fuchsia-50",
      iconColor: "text-[#db2777]",
      color: "#db2777",
    },
  },
  {
    id: "healthy-bhadrak-gym",
    title: "Healthy Bhadrak Open Gym",
    subtitle: "Fitness for life",
    icon: Dumbbell,
    description:
      "Free outdoor fitness infrastructure at DHH Bhadrak with cardio, rehabilitation, and yoga access for patients, caregivers, and the community.",
    longDescription:
      "Healthy Bhadrak Open Gym is a free, open-access outdoor wellness space located at DHH Bhadrak. It brings preventive fitness, rehabilitation-friendly access, and stress-relief infrastructure directly into a hospital campus.",
    sections: [
      {
        title: "Facilities and Services",
        items: [
          "Outdoor cardio and resistance equipment including cycles, ellipticals, bars, and stretching stations.",
          "A yoga pavilion for open-air sessions for patients, caregivers, and staff.",
          "Accessible rehabilitation-friendly pathways and low-impact support.",
          "Wellness sessions delivered with Foundation volunteers and hospital staff.",
          "100% free access with no fee, membership, or registration.",
        ],
      },
      {
        title: "Why the Hospital Campus Matters",
        items: [
          "The gym naturally reaches high-need users including patients in recovery, people with chronic illness, and stressed caregivers.",
          "It turns the hospital itself into a preventive-health and community-wellness zone.",
        ],
      },
    ],
    csrOpportunity:
      "A grant of Rs 3-5 lakh can fully equip a 10-station outdoor gym with signage, pathways, and landscaping as a permanent public health asset.",
    stats: [
      { label: "Access", value: "100% Free", icon: ShieldCheck },
      { label: "Location", value: "DHH Bhadrak", icon: Globe },
      { label: "Facility", value: "Cardio + Yoga", icon: Dumbbell },
      { label: "Setup", value: "10 Stations", icon: Activity },
    ],
    galleryCategory: "Healthy Bhadrak Gym",
    theme: {
      primary: "text-[#7c3aed]",
      bg: "bg-violet-50",
      accent: "bg-purple-50",
      gradient: "from-violet-50 to-purple-50",
      iconColor: "text-[#7c3aed]",
      color: "#7c3aed",
    },
  },
  {
    id: "donation-wall",
    title: "Donation Wall",
    subtitle: "Support in one place",
    icon: Gift,
    description:
      "A digital showcase of urgent needs where donors can fund targeted, high-impact causes instantly.",
    longDescription:
      "Donation Wall connects supporters directly with urgent community needs. From medical aid to school supplies, each contribution is highlighted transparently so donors know exactly where their support is going.",
    sections: [
      {
        title: "What the Wall Provides",
        items: [
          "Food packets, biscuits, nutrition supplements, and dry rations.",
          "Soap, toothbrushes, toothpaste, combs, sanitary pads, and other hygiene essentials.",
          "Clothes, blankets, and linen for emergency admissions.",
          "Basic OTC items such as ORS, bandages, paracetamol, and similar vetted essentials.",
          "Books, toys, and drawing materials for children in paediatric settings.",
        ],
      },
      {
        title: "How It Works",
        items: [
          "The wall is a permanent installation at New District Hospital, Bhadrak.",
          "Foundation volunteers manage bi-weekly inventory and restocking.",
          "Hospital social workers guide high-need patients and attendants to the wall.",
          "Corporate and individual donors can sponsor categories or full monthly restocking cycles.",
        ],
      },
    ],
    csrOpportunity:
      "Monthly restocking support of Rs 25,000-50,000 can cover 200+ patients. Annual support of Rs 3-5 lakh enables year-round coverage with acknowledgement and reporting.",
    stats: [
      { label: "Campaigns Published", value: "75+", icon: Gift },
      { label: "Funds Raised", value: "₹1.2 Cr+", icon: ShieldCheck },
    ],
    galleryCategory: "Donation Wall",
    theme: {
      primary: "text-[#d97706]",
      bg: "bg-yellow-50",
      accent: "bg-amber-50",
      gradient: "from-yellow-50 to-amber-50",
      iconColor: "text-[#d97706]",
      color: "#d97706",
    },
  },
  {
    id: "waste-to-wealth",
    title: "Waste to Wealth",
    subtitle: "Turning waste into value",
    icon: Recycle,
    description:
      "Circular economy at scale - converting municipal waste into productive resources through community participation and technology.",
    longDescription:
      "Waste to Wealth combines municipal waste systems, e-wallet incentives, processing infrastructure, and women's livelihood pathways to build a circular economy model that creates both environmental and economic value.",
    sections: [
      {
        title: "Programme Architecture",
        items: [
          "An e-wallet platform that awards digital credits for segregated waste deposits.",
          "Processing systems that convert organic waste into compost and dry waste into recycled raw material.",
          "Municipal integration aligned with Bhadrak Municipality and SBM 2.0 goals.",
          "Women's self-help group employment in aggregation, sorting, and local operations.",
          "Compost distribution into Mission Green plantation sites and Krishi-Sakha farming networks.",
        ],
      },
      {
        title: "Foundation Linkages",
        items: [
          "Waste to Wealth feeds compost to Mission Green and Krishi-Sakha farmers.",
          "The model also strengthens women's livelihood pathways linked to other Foundation missions.",
        ],
      },
    ],
    csrOpportunity:
      "An investment of Rs 10-15 lakh can establish a Waste to Wealth hub serving 500+ households, processing 2 tonnes per day, and employing 15-20 SHG members.",
    stats: [
      { label: "Households", value: "500+", icon: Globe },
      { label: "Processing", value: "2 Tonnes/Day", icon: Recycle },
      { label: "Employment", value: "15-20 SHGs", icon: Briefcase },
      { label: "Engine", value: "e-Wallet System", icon: Award },
    ],
    galleryCategory: "Waste to Wealth",
    theme: {
      primary: "text-[#65a30d]",
      bg: "bg-lime-50",
      accent: "bg-emerald-50",
      gradient: "from-lime-50 to-emerald-50",
      iconColor: "text-[#65a30d]",
      color: "#65a30d",
    },
  },
  {
    id: "jeevan-kaushal",
    title: "Jeevan Kaushal",
    subtitle: "Skills for brighter futures",
    icon: Award,
    description:
      "Life skills for the real world - cooking, nutrition, finance, communication, and self-reliance training for rural youth in Odisha.",
    longDescription:
      "Jeevan Kaushal equips students with the everyday competencies formal schooling often misses, helping them move into adulthood with practical confidence, discipline, and financial and social awareness.",
    sections: [
      {
        title: "Curriculum Modules",
        items: [
          "Cooking and nutrition, including hygiene, balanced diets, and practical meal preparation.",
          "Personal finance, including saving, banking, UPI, budgeting, and basic loan awareness.",
          "Self-reliance habits such as time management, emotional regulation, and goal setting.",
          "Communication in spoken Hindi and English, public speaking, writing, interviews, and etiquette.",
          "Household management and civic awareness.",
        ],
      },
      {
        title: "Delivery Model",
        items: [
          "Integrated into Foundation education centres as regular modules.",
          "Delivered by youth volunteers and community resource persons.",
          "Hands-on, activity-based learning with participation certificates.",
        ],
      },
    ],
    csrOpportunity:
      "A full year of Jeevan Kaushal for one centre of 50 students costs about Rs 1.5-2 lakh, including materials, facilitator support, practical kits, and certificates.",
    stats: [
      { label: "Core Domains", value: "4", icon: Award },
      { label: "Centre Size", value: "50 Students", icon: School },
      { label: "Format", value: "Practical Learning", icon: ShieldCheck },
      { label: "Outcome", value: "Life Ready", icon: Globe },
    ],
    galleryCategory: "Jeevan Kaushal",
    theme: {
      primary: "text-[#334155]",
      bg: "bg-slate-50",
      accent: "bg-slate-100",
      gradient: "from-slate-50 to-slate-100",
      iconColor: "text-[#334155]",
      color: "#334155",
    },
  },
  {
    id: "career-connect",
    title: "Career Connect",
    subtitle: "Guiding career journeys",
    icon: Briefcase,
    description:
      "Bridging the aspiration gap by connecting rural students with real careers, real people, and real possibility.",
    longDescription:
      "Career Connect expands what rural students believe is possible by bringing professionals, workplace exposure, admissions guidance, and mentorship directly into the Foundation's education ecosystem.",
    sections: [
      {
        title: "Programme Activities",
        items: [
          "Monthly in-person or virtual speaker sessions with professionals from diverse sectors.",
          "Workplace visits to hospitals, factories, offices, courts, media houses, and universities.",
          "CV writing, interview preparation, and application process workshops.",
          "Higher education guidance on colleges, entrance exams, scholarships, and admissions.",
          "Mentorship pairing for high-potential students with volunteer mentors.",
        ],
      },
      {
        title: "Who Speaks",
        items: [
          "Civil servants, doctors, engineers, entrepreneurs, journalists, lawyers, artists, and other professionals from Odisha and beyond.",
          "A growing volunteer mentor network supports follow-through beyond one-time talks.",
        ],
      },
    ],
    csrOpportunity:
      "A full academic year of 12 Career Connect sessions can be supported with roughly Rs 1-1.5 lakh. Named fellowships can also support one student from admission through employment.",
    stats: [
      { label: "Session Cycle", value: "12 Sessions", icon: Briefcase },
      { label: "Mentorship", value: "6 Months", icon: ShieldCheck },
      { label: "Exposure", value: "Multi-Sector", icon: Award },
      { label: "Audience", value: "Rural Students", icon: School },
    ],
    galleryCategory: "Career Connect",
    theme: {
      primary: "text-[#0f766e]",
      bg: "bg-cyan-50",
      accent: "bg-sky-50",
      gradient: "from-cyan-50 to-sky-50",
      iconColor: "text-[#0f766e]",
      color: "#0f766e",
    },
  },
  {
    id: "krishi-sakha-ai",
    title: "Krishi Sakha AI",
    subtitle: "Smart farming support",
    icon: Cpu,
    description:
      "AI-powered crop diagnostics for Odisha farmers, aligned with Odisha AI Policy 2025 and developed with MITS.",
    longDescription:
      "Krishi Sakha AI is a technology-led agriculture initiative that brings crop diagnosis, treatment advisory, and multilingual support to farmers who lack timely access to agronomic experts.",
    sections: [
      {
        title: "Platform Features",
        items: [
          "Visual crop diagnosis with 90%+ accuracy for diseases, pests, and nutrient deficiencies.",
          "Actionable treatment advisory including affordable and organic options.",
          "Crop calendar support for paddy, vegetables, pulses, and oilseeds in Odisha conditions.",
          "Multilingual support in Odia, Hindi, and English with low-bandwidth readiness.",
          "Alignment with Odisha AI Policy 2025 and future system integration potential.",
        ],
      },
      {
        title: "Development and Ecosystem Role",
        items: [
          "Built with MITS (Devraj Mohapatra) by combining technical AI capability with the Foundation's rural access network.",
          "Designed to integrate with Mission Green and Waste to Wealth through an agroecological support loop.",
        ],
      },
    ],
    csrOpportunity:
      "An investment of Rs 10-25 lakh can fund model training, app completion, pilot deployment across 500 farmers, and government engagement for scale.",
    stats: [
      { label: "Policy", value: "AI Policy 2025", icon: Cpu },
      { label: "Partner", value: "MITS", icon: Award },
      { label: "Pilot Farmers", value: "500+", icon: Globe },
      { label: "Accuracy", value: "90%+", icon: ShieldCheck },
    ],
    galleryCategory: "Krishi Sakha AI",
    theme: {
      primary: "text-[#15803d]",
      bg: "bg-emerald-100",
      accent: "bg-emerald-200",
      gradient: "from-emerald-100 to-emerald-200",
      iconColor: "text-[#15803d]",
      color: "#15803d",
    },
  },
];
