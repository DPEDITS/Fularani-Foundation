import { ArrowRight, Heart, Users } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 md:py-48 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-16 md:mb-24 text-center max-w-2xl mx-auto">
          <h2 className="text-5xl md:text-8xl font-black text-secondary tracking-tighter leading-none lowercase mb-8">
            ready to <br />{" "}
            <span className="text-accent underline decoration-primary decoration-8 underline-offset-4">
              act?
            </span>
          </h2>
          <p className="text-xl font-bold text-muted-foreground leading-tight">
            Together, we can build a resilient Bhadrak. Choose your way of
            making an impact today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Volunteer CTA */}
          <div className="relative overflow-hidden bg-secondary p-12 md:p-16 flex flex-col items-start justify-between min-h-[500px] group shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-700">
              <Users size={300} className="text-white" />
            </div>

            <div className="relative z-10 w-full">
              <span className="inline-block bg-primary px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest text-secondary mb-6">
                Partnership
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-none mb-8 tracking-tighter lowercase">
                join as a <br />{" "}
                <span className="text-primary">volunteer.</span>
              </h2>
              <p className="text-white/50 text-xl font-bold leading-tight mb-12 max-w-sm">
                Use your professional skills or local knowledge to drive our
                missions on the ground.
              </p>
            </div>

            <button
              onClick={() =>
                (window.location.href = "/donor-register?role=volunteer")
              }
              className="relative z-10 w-full md:w-auto bg-white text-secondary px-10 py-5 rounded-xl text-lg font-black uppercase tracking-tight hover:bg-primary transition-all flex items-center justify-center gap-3 group/btn shadow-xl"
            >
              Apply to Join{" "}
              <ArrowRight
                size={22}
                className="group-hover/btn:translate-x-2 transition-transform"
              />
            </button>
          </div>

          {/* Donor CTA */}
          <div className="relative overflow-hidden bg-accent p-12 md:p-16 flex flex-col items-start justify-between min-h-[500px] group shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700">
              <Heart size={300} className="text-white" />
            </div>

            <div className="relative z-10 w-full">
              <span className="inline-block bg-white px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest text-accent mb-6">
                Financial Support
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-secondary leading-none mb-8 tracking-tighter lowercase">
                make a <br />{" "}
                <span className="text-secondary underline decoration-white decoration-8 underline-offset-4">
                  donation.
                </span>
              </h2>
              <p className="text-secondary/70 text-xl font-bold leading-tight mb-12 max-w-sm">
                Every rupee goes directly into our education, healthcare, and
                green missions.
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/donor-register")}
              className="relative z-10 w-full md:w-auto bg-secondary text-white px-10 py-5 rounded-xl text-lg font-black uppercase tracking-tight hover:bg-black transition-all flex items-center justify-center gap-3 group/btn shadow-2xl shadow-black/20"
            >
              Donate Now{" "}
              <ArrowRight
                size={22}
                className="group-hover/btn:translate-x-2 transition-transform"
              />
            </button>
          </div>
        </div>

        {/* Accountability Note */}
        <div className="mt-20 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center justify-center gap-3">
            <span className="w-12 h-px bg-muted"></span>
            100% Transparency & Direct Benefit
            <span className="w-12 h-px bg-muted"></span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
