import MissionGreen from "../components/MissionGreen";
import MissionMobility from "../components/MissionMobility";
import MissionEducation from "../components/MissionEducation";
import MissionPeriod from "../components/MissionPeriod";
import MissionThalassemia from "../components/MissionThalassemia";
import { useEffect, useState } from "react";
import headerImg from "../assets/missions1.jpeg"; // same as Banner

const Missions = () => {
  return (
    <main className="pt-32 px-2 md:px-10 lg:px-20 space-y-32">

      {/* PAGE HEADER */}
      <header className="w-full flex flex-col md:flex-row items-start md:items-center gap-10">

        {/* Left: Text content */}
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Our Missions
          </h1>

          <div className="h-1 w-24 md:w-32 bg-red-600 rounded-full"></div>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-full md:max-w-4xl">
            <b>Fularani Foundation</b> is committed to creating lasting social impact through focused initiatives in healthcare, education, environment, and women’s dignity. Our programs, including Mission Thalassemia, Education For All, Period Pride, Mission Green, and Mission Mobility, empower communities, support underprivileged children, raise awareness, and provide essential resources to foster healthier, educated, and resilient societies.
          </p>

          {/* STATS CARDS immediately after text */}
          <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard end={1500} suffix="+" label="Meals Served" color="blue" />
            <StatCard end={10000} suffix="+" label="Trees Planted" color="green" />
            <StatCard end={100} suffix="+" label="Volunteers" color="yellow" />
            <StatCard end={50} suffix="+" label="Awareness Campaigns" color="purple" />
          </section>
        </div>

        {/* Right: SVG logo */}
        <div className="flex-shrink-0">
          <img
            src={headerImg}
            alt="Fularani Foundation Logo"
            className="w-150 h-auto rounded-3xl shadow-xl mx-auto md:mx-0"
          />
        </div>
      </header>

      {/* FEATURED MISSION */}
      <section className="bg-white rounded-3xl shadow-xl p-10 md:p-16 flex flex-col md:flex-row gap-6 md:gap-10 items-center">
        <div className="md:w-2/3 space-y-4">
          <span className="text-sm uppercase tracking-wide text-red-600">
            Featured Mission
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Mission Thalassemia
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Thalassemia remains a critical yet under-addressed public health challenge. Our mission focuses on awareness, early screening, and sustained care support for affected children and families.
          </p>
          <a
            href="/missions/thalassemia"
            className="inline-block mt-4 text-sm font-medium text-red-600 underline underline-offset-4"
          >
            View program details
          </a>
        </div>
        <div className="md:w-1/3 h-48 rounded-2xl bg-gradient-to-br from-red-50 to-red-100" />
      </section>

      {/* ALL MISSIONS */}
      <section className="space-y-10 -mt-20"> {/* negative margin removes extra gap */}
        <MissionEducation />
        <MissionThalassemia />
        <MissionPeriod />
        <MissionGreen />
        <MissionMobility />
      </section>

    </main>
  );
};

// Apple-style Stat Card
const StatCard = ({ end, suffix = "", label, color = "blue" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  const colorMap = {
    blue: "from-blue-50 to-blue-100",
    green: "from-green-50 to-green-100",
    yellow: "from-yellow-50 to-yellow-100",
    purple: "from-purple-50 to-purple-100",
    red: "from-red-50 to-red-100",
  };

  return (
    <div className={`rounded-3xl p-6 bg-gradient-to-br ${colorMap[color]} shadow-lg flex flex-col items-start transition-transform transform hover:-translate-y-2`}>
      <p className="text-3xl font-bold text-gray-900">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-gray-700 mt-1">{label}</p>
    </div>
  );
};

export default Missions;
