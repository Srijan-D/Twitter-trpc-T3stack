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


const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
    id
}) => {
    const { data: profile } = api.profile.getProfile.useQuery({ id })

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
            </div>
            </div>
        </header>
    </>
    )
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