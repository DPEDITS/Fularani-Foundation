"use client";
import headerImg from "../assets/fularani.svg";

// sample images (replace with real ones later)
import edu1 from "../assets/missions1.jpeg";
import edu2 from "../assets/missions1.jpeg";
import thal1 from "../assets/missions1.jpeg";
import thal2 from "../assets/missions1.jpeg";
import period1 from "../assets/missions1.jpeg";
import green1 from "../assets/missions1.jpeg";
import mobility1 from "../assets/missions1.jpeg";

const Gallery = () => {
  return (
    <main className="pt-32 px-6 md:px-10 lg:px-20 space-y-32">

      {/* PAGE HEADER */}
      <section className="flex flex-col md:flex-row items-start gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Gallery
          </h1>

          <div className="h-1 w-28 bg-red-600 rounded-full" />

          <p className="text-lg md:text-xl text-gray-600 max-w-4xl leading-relaxed">
            A visual record of Fularani Foundation’s work across healthcare, education,
            environmental action, and social dignity. Each image reflects real people,
            real communities, and real impact created through our missions.
          </p>
        </div>

        <div className="flex-shrink-0">
          <img
            src={headerImg}
            alt="Fularani Foundation"
            className="w-150 h-auto rounded-3xl shadow-xl"
          />
        </div>
      </section>

      {/* EDUCATION */}
      <GallerySection
        title="Education For All"
        description="Supporting rural schools and underprivileged children through access to learning materials, mentorship, and safe educational spaces."
        images={[edu1, edu2]}
      />

      {/* THALASSEMIA */}
      <GallerySection
        title="Mission Thalassemia"
        description="Awareness programs, screening camps, and continued care support for children and families affected by thalassemia."
        images={[thal1, thal2]}
      />

      {/* PERIOD PRIDE */}
      <GallerySection
        title="Period Pride"
        description="Promoting menstrual health awareness and dignity through education, sanitary support, and community engagement."
        images={[period1]}
      />

      {/* MISSION GREEN */}
      <GallerySection
        title="Mission Green"
        description="Environmental initiatives focused on tree plantation, cleanliness drives, and sustainable community practices."
        images={[green1]}
      />

      {/* MISSION MOBILITY */}
      <GallerySection
        title="Mission Mobility"
        description="Enhancing mobility and independence for individuals with physical challenges through assistive support."
        images={[mobility1]}
      />

    </main>
  );
};

const GallerySection = ({ title, description, images }) => (
  <section className="space-y-8">
    <div className="space-y-4 max-w-4xl">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
        {title}
      </h2>
      <p className="text-gray-700 leading-relaxed">
        {description}
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {images.map((img, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl bg-gray-100 shadow-md hover:shadow-xl transition-shadow"
        >
          <img
            src={img}
            alt={title}
            className="w-full h-64 object-cover"
          />
        </div>
      ))}
    </div>
  </section>
);

export default Gallery;
