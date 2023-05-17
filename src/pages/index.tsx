import { type NextPage } from "next";
import NewTweet from "~/components/NewTweet";

const Home: NextPage = () => {
  return (
    <header className="sticky top-0 z-10 border-b bg-white pt-2">
      <h1 className="
        text-2xl font-bold text-gray-900 mb-2 ml-2
      ">Home</h1>
      <NewTweet />
    </header>
  );
};

export default Home;

