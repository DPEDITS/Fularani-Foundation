const FeaturedMission = () => (
  <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-50 to-rose-100 px-8 py-10 mb-20">

    <span className="inline-block mb-3 text-xs font-semibold tracking-widest text-red-600">
      FEATURED MISSION
    </span>

    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
      Thalassemia Awareness & Support
    </h2>

    <p className="max-w-xl text-gray-700 leading-relaxed mb-6">
      Building awareness, enabling blood donation drives, and supporting
      patients with long-term medical care.
    </p>

    <a
      href="/missions/thalassemia"
      className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-red-600 px-5 py-3 rounded-full hover:bg-red-700 transition"
    >
      Support this mission →
    </a>

    {/* subtle background accent */}
    <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-red-200/40 blur-3xl" />
  </section>
);

export default FeaturedMission;
