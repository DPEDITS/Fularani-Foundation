import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import ImpactStats from "./ImpactStats";

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(150);

  const toRotate = [
    "Mission Thalassemia",
    "Mission Green",
    "Mission Mobility",
    "Education for All",
    "Mission Period Pride",
  ];

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => clearInterval(ticker);
  }, [text, delta]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(100);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(300);
    }
  };

  return (
    <section className="banner bg-[#fbfbfd]" id="home">
      <div className="max-w-[980px] mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          <span className="text-orange-600 font-semibold text-sm mb-4 tracking-tight uppercase px-4 py-1.5 bg-orange-50 rounded-full">
            Impact in Action
          </span>

          <h1 className="text-[48px] md:text-[64px] font-bold tracking-tight text-[#1d1d1f] leading-[1.1] mb-6">
            Empowering Lives. <br />
            <span className="text-[#0071e3] transition-all duration-300">
              {text}<span className="border-r-2 border-[#0071e3] ml-1 animate-pulse"></span>
            </span>
          </h1>

          <p className="text-[19px] md:text-[21px] text-[#86868b] leading-relaxed max-w-[700px] mb-10 font-medium">
            Dedicated to creating meaningful social impact through healthcare,
            education, and dignity for all. Together, we build a healthier,
            educated, and empowered future.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-20">
            <button
              onClick={() => {
                window.location.href = "/volunteer-login";
              }}
              className="bg-[#0071e3] text-white px-8 py-3 rounded-full text-[17px] font-medium hover:bg-[#0077ed] transition-all shadow-sm flex items-center gap-2 group"
            >
              Join the Mission <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="/about" className="text-[#0066cc] text-[17px] hover:underline flex items-center gap-1 group">
              Learn more <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="w-full max-w-4xl opacity-90">
            <ImpactStats />
          </div>
        </div>
      </div>
    </section>
  );
};
