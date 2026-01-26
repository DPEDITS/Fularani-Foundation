import Navbar from "../components/Navbar";
import {Banner} from "../components/Banner";
const Home = () => {
  return (
    <>
      <Navbar />
      <main className="px-5 text-center text-4xl font-bold">
        <Banner />
      </main>
    </>
  );
};

export default Home;
