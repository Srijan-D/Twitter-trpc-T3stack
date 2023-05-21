import { type NextPage } from "next";
import NewTweet from "~/components/NewTweet";
import ListOFtweets from "~/components/ListOFtweets";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useState } from "react";

const pages = ["Recent", "Following"] as const

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
          {pages.map((page) => {
            return <button key={page} className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200 ${page === selectedPage ?
              "border-b-4 border-b-blue-500 font-bold" : ""}`} onClick={() => setSelectedPage(page)}>{page}</button>
          })}
        </div>
      )}
    </header>
    <NewTweet />
    {selectedPage === "Recent" ? <RecentTweets /> : <FollowingTweets />}
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
function FollowingTweets() {
  const tweets = api.tweet.infiniteScroll.useInfiniteQuery({
    onlyFollowing: true
  },
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

