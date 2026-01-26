const MissionEducation = () => (
  <section className="group bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] transition-all duration-500">
    <div className="grid md:grid-cols-2 gap-10 p-10 items-center">

      {/* TEXT */}
      <div>
        <span className="text-xs uppercase tracking-widest text-gray-500">
          Education
        </span>

        <h3 className="text-2xl font-semibold text-gray-900 mt-3 mb-4">
          Education For All
        </h3>

        <p className="text-gray-600 leading-relaxed max-w-md">
          Supporting rural schools and underprivileged children in Odisha through
          access to learning materials, mentorship, and safe learning spaces.
        </p>

        <a
          href="/missions/education"
          className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-gray-900"
        >
          Learn more
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>

      {/* VISUAL */}
      <div className="h-56 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200" />
    </div>
  </section>
);

export default MissionEducation;
