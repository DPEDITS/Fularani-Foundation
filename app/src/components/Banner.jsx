import { useState, useEffect } from "react";
// import { Container, Row, Col } from "react-bootstrap";
import { ArrowRightCircle } from "react-bootstrap-icons";
import headerImg from "../assets/fularani.svg"; // replace with foundation image/logo later

export const Banner = () => {
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
const toRotate = [
      "MISSION THALASSEMIA",
      "MISSION GREEN",
      "MISSION MOBILITY",
      "EDUCATION FOR ALL",
      "MISSION PERIOD PRIDE",
];

    const [text, setText] = useState("");
    const [delta, setDelta] = useState(200);
    const period = 100;

    useEffect(() => {
        const ticker = setInterval(() => {
            tick();
        }, delta);

        return () => clearInterval(ticker);
    }, [text]);

    const tick = () => {
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting
            ? fullText.substring(0, text.length - 1)
            : fullText.substring(0, text.length + 1);

        setText(updatedText);

        if (!isDeleting && updatedText === fullText) {
            setIsDeleting(true);
            setDelta(period);
        } else if (isDeleting && updatedText === "") {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setDelta(300);
        }
    };

    return (
        <section className="banner" id="home">
            <div className="mx-auto px-4 container">
                <div className="items-center grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="col-span-1 xl:col-span-1">
                        <span className="tagline">Fularani Foundation</span>

                        <h1>
                            Empowering Lives Through <br />
                            <span className="wrap">{text}</span>
                        </h1>

                        <p>
                            Fularani Foundation is a non-profit organization dedicated to
                            creating meaningful social impact by supporting healthcare,
                            education, and dignity for women and children. Together, we work
                            towards a healthier, educated, and empowered society.
                        </p>

<button
  onClick={() => {
    window.location.href = "/donor-login";
  }}
  className="flex items-center gap-2"
>
  Donate <ArrowRightCircle size={25} />
</button>
                    </div>

                    <div className="col-span-1 xl:col-span-1 flex justify-center md:justify-end">
                        <img
                            src={headerImg}
                            alt="Fularani Foundation - Empowering Communities"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
