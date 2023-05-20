import Link from "next/link"
import InfiniteScroll from "react-infinite-scroll-component"
import ProfilePicture from "./ProfilePicture"

type Tweet = {
    id: string
    content: string
    createdAt: Date
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


    return (<ul>
        <InfiniteScroll
            dataLength={tweets.length}
            next={fetchNextPage}
            hasMore={hasMore}
            loader={<p>Loading...</p>}
        >
            {tweets.map((tweet) => {
                return <TweetCard key={tweet.id} {...tweet} />
            })}
        </InfiniteScroll>
    </ul>
    )
}
const dateTimeFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "short" })

function TweetCard({ id, user, content, createdAt, likeCount, liked }: Tweet) {
    return <li className="flex gap-4 border-b px-4 py-4 ">
        <Link href={`/profiles/${user.id}`}>
            <ProfilePicture src={user.image} />
        </Link>
        <div className="flex flex-grow flex-col">
            <div className="flex gap-1 ">
                <Link href={`/profiles/${user.id}`} className="font-bold outline-none hover:underline focus-visible:underline">
                    {user.name}
                </Link>
                <span className="text-gray-500">-</span>
                <span className="text-gray-500">{dateTimeFormatter.format(createdAt)}</span>
            </div>
        </div>
    </li>
}
