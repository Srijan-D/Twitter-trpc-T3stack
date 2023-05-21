import { type NextPage } from "next";
import NewTweet from "~/components/NewTweet";
import ListOFtweets from "~/components/ListOFtweets";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useState } from "react";

const pages = ["Recent", "Following"]

const Home: NextPage = () => {

  const [selectedPage, setSelectedPage] = useState<(typeof pages)[number]>("Recent")
  const session = useSession();

  return (<>
    <header className="sticky top-0 z-10 border-b bg-white pt-2">
      <h1 className="
        text-2xl font-bold text-gray-900 mb-2 ml-2
        ">Home</h1>
      {session.status === 'authenticated' && (
        <div className="flex">
          {pages}
        </div>
      )}
    </header>
    <NewTweet />
    <RecentTweets />
  </>);
};
function RecentTweets() {
  const tweets = api.tweet.infiniteScroll.useInfiniteQuery({},
    { getNextPageParam: (lastPage) => lastPage.nextCursor })

  return <ListOFtweets
    tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
    isLoading={tweets.isLoading}
    isError={tweets.isError}
    hasMore={tweets.hasNextPage}
    fetchNextPage={tweets.fetchNextPage}
  />;
}

export default Home;

