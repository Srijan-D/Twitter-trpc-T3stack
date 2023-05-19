import InfiniteScroll from "react-infinite-scroll-component"

type Tweet = {
    id: string
    content: string
    createdAt: string
    likeCount: number
    liked: boolean
    user: {
        id: string
        name: string | null
        image: string | null
    }
}


type InfiniteTweetListProps = {
    isLoading: boolean
    isError: boolean
    hasMore: boolean
    fetchNextPage: () => Promise<unknown>
    tweets: Tweet[]
}


export default function ListOFtweets({ tweets, isError, isLoading, fetchNextPage, hasMore }: InfiniteTweetListProps) {

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error...</p>
    if (tweets == null) return null
    if (tweets.length === 0) return <h2 className="my-4 text-center text-2xl text-gray-500">No tweets</h2>
    return <ul>
        <InfiniteScroll
            dataLength={tweets.length}
            next={fetchNextPage}
            hasMore={hasMore}
            loader={<p>Loading...</p>}
        >
            {tweets.map((tweet) => {
                return <div key={tweet.id} className="border-b py-4">
                    {tweet.content}
                </div>
            })}
        </InfiniteScroll>
    </ul>

}