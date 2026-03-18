import { ArrowRight, Heart, Users } from "lucide-react";
import { safeLocationRedirect } from "../utils/safeNavigate";

const CTASection = () => {
  return (
    <section className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-16 md:mb-24 text-center max-w-2xl mx-auto">
          <h2 className="text-5xl md:text-8xl font-black text-secondary tracking-tighter leading-none lowercase mb-8">
            ready to <br />{" "}
            <span className="text-accent underline decoration-primary decoration-8 underline-offset-4">
              act?
            </span>
          </h2>
          <p className="text-xl font-bold text-muted-foreground leading-tight">
            Together, we can build a resilient India. Choose your way of making
            an impact today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Volunteer CTA */}
          <div className="relative overflow-hidden rounded-[2rem] bg-secondary p-8 md:p-10 flex flex-col items-start justify-between min-h-[300px] group shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-700">
              <Users size={200} className="text-white" />
            </div>

            <div className="relative z-10 w-full">
              <span className="inline-block bg-primary px-2 md:px-3 py-1 rounded-sm text-[8px] md:text-[10px] font-black uppercase tracking-widest text-secondary mb-4 md:mb-6">
                Partnership
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-black text-white leading-none mb-4 md:mb-6 tracking-tighter lowercase">
                join as a <br />{" "}
                <span className="text-primary">volunteer.</span>
              </h2>
              <p className="text-white/50 text-sm md:text-base lg:text-lg font-bold leading-tight mb-6 md:mb-8 max-w-sm">
                Use your professional skills or local knowledge to drive our
                missions on the ground.
              </p>
            </div>

            <button
              onClick={() =>
                safeLocationRedirect("/donor-register?role=volunteer")
              }
              className="relative z-10 w-full md:w-auto bg-white text-secondary px-4 py-2 md:px-8 md:py-4 rounded-xl text-md md:text-base font-black uppercase tracking-tight hover:bg-primary transition-all flex items-center justify-center gap-2 md:gap-3 group/btn shadow-xl"
            >
              Apply to Join{" "}
              <ArrowRight
                size={22}
                className="group-hover/btn:translate-x-2 transition-transform"
              />
            </button>
          </div>

          {/* Donor CTA */}
          <div className="relative overflow-hidden rounded-[2rem] bg-accent p-8 md:p-10 flex flex-col items-start justify-between min-h-[300px] group shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700">
              <Heart size={220} className="text-white" />
            </div>

            <div className="relative z-10 w-full">
              <span className="inline-block bg-white px-2 md:px-3 py-1 rounded-sm text-[8px] md:text-[10px] font-black uppercase tracking-widest text-accent mb-4 md:mb-6">
                Financial Support
              </span>
              <h2 className="text-xl md:text-3xl lg:text-5xl font-black text-secondary leading-none mb-4 md:mb-6 tracking-tighter lowercase">
                make a <br />{" "}
                <span className="text-secondary underline decoration-white decoration-4 underline-offset-4">
                  donation.
                </span>
              </h2>
              <p className="text-secondary/70 text-sm md:text-base lg:text-lg font-bold leading-tight mb-6 md:mb-8 max-w-sm">
                Every rupee goes directly into our education, healthcare, and
                green missions.
              </p>
            </div>

            <button
              onClick={() => safeLocationRedirect("/donor-register")}
              className="relative z-10 w-full md:w-auto bg-secondary text-white px-4 py-2 md:px-8 md:py-4 rounded-xl text-md md:text-base font-black uppercase tracking-tight hover:bg-black transition-all flex items-center justify-center gap-2 md:gap-3 group/btn shadow-2xl shadow-black/20"
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
