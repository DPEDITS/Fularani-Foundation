const MissionThalassemia = () => (
  <section className="group bg-white rounded-3xl shadow-[0_12px_40px_rgba(220,38,38,0.12)] transition-all duration-500">
    <div className="grid md:grid-cols-2 gap-10 p-10 items-center">

      <div>
        <span className="text-xs uppercase tracking-widest text-red-600">
          Priority Healthcare
        </span>

        <h3 className="text-2xl font-semibold text-gray-900 mt-3 mb-4">
          Mission Thalassemia
        </h3>

        <p className="text-gray-600 leading-relaxed max-w-md">
          Raising awareness, enabling early screening, and supporting long-term
          treatment for children and families affected by Thalassemia.
        </p>

        <a
          href="/missions/thalassemia"
          className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-red-600"
        >
          Learn more
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>

      <div className="h-56 rounded-2xl bg-gradient-to-br from-red-50 to-red-100" />
    </div>
  </section>
);

export default MissionThalassemia;
