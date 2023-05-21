import { GetStaticPaths, GetStaticPathsContext, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import React from 'react'
import { NextPage } from 'next'
import { ssgHelper } from '~/server/api/ssgHelper'
import { api } from "~/utils/api";
import ErrorPage from 'next/error'
import Link from 'next/link'
import { IconHoverEffect } from '~/components/IconHoverEffect'
import { VscArrowLeft } from 'react-icons/vsc'
import ProfilePicture from '~/components/ProfilePicture'
import ListOFtweets from "~/components/ListOFtweets";
import { useSession } from 'next-auth/react'
import Button from '~/components/Button'


const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
    id
}) => {
    const { data: profile } = api.profile.getProfile.useQuery({ id })
    const tweets = api.tweet.infiniteProfileTweets.useInfiniteQuery({ userId: id }, {
        getNextPageParam: (lastPage) => { lastPage.nextCursor }
    })

    if (profile == null || profile.name == null) return <ErrorPage statusCode={404} />

    return (<>
        <Head>
            <title>{`Twitter-T3 ${profile.name}`}</title>
        </Head>
        <header className='sticky flex items-center border-b bg-white px-3 py-2 top-0 z-10'>
            <Link href=".." className='mr-2'>
                <IconHoverEffect>
                    <VscArrowLeft size={24} />
                </IconHoverEffect>
            </Link>
            <ProfilePicture src={profile.image} className='w-10 h-10 rounded-full' />
            <div className='ml-2 flex-grow'>
                <h1 className='text-lg font-bold'>{profile.name}</h1>
                <div className=' text-gray-500'>
                    {profile.tweetsCount}
                    {pluralRules(profile.tweetsCount, " Tweet", " Tweets")}
                    {" • "}
                    {profile.followersCount}
                    {pluralRules(profile.followersCount, " Follower", " Followers")}
                    {" • "}
                    {profile.followsCount} Follows
                </div>
            </div>
            <FollowButton userId={id} isFollowing={profile.isFollowing} />
        </header>
        <main><ListOFtweets
            tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
            isLoading={tweets.isLoading}
            isError={tweets.isError}
            hasMore={tweets.hasNextPage}
            fetchNextPage={tweets.fetchNextPage}
        /></main>

    </>
    )
}
function FollowButton({ userId, isFollowing, onClick }: { userId: string, isFollowing: boolean, onClick?: () => void }) {
    const session = useSession()
    if (session.status !== "authenticated" || session.data.user.id === userId) return null
    return <Button onClick={onClick} small gray={isFollowing} >{isFollowing ? "Unfollow" : "Follow"}</Button>
}
const Intlplural = new Intl.PluralRules()

function pluralRules(number: number, singular: string, plural: string) {
    return Intlplural.select(number) === "one" ? singular : plural
}

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking"
    }
}

export async function getStaticProps(context: GetStaticPropsContext<{ id: string }>) {
    const id = context.params?.id

    if (id == null) {
        return {
            redirect: {
                destination: "/"
            }
        }
    }
    const ssg = ssgHelper()
    await ssg.profile.getProfile.prefetch({ id })

    return {
        props: {
            id,
            trpcState: ssg.dehydrate()
        }
    }
}

export default ProfilePage