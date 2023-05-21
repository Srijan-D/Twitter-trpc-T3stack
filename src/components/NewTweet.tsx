import React, { FormEvent, useCallback, useLayoutEffect, useRef } from 'react'
import Button from './Button'
import ProfilePicture from './ProfilePicture'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { api } from '~/utils/api'


function updateTextAreaHeight(textArea?: HTMLTextAreaElement) {
    if (textArea == null) return
    textArea.style.height = '0px'
    textArea.style.height = ` ${textArea.scrollHeight}px`
}
export default function NewTweet() {
    const session = useSession()
    if (session.status !== 'authenticated') return null
    return (
        <Form />
    )

}


function Form() {
    const session = useSession()
    const [text, setText] = useState("")

    const textAreaRef = useRef<HTMLTextAreaElement>()

    const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
        updateTextAreaHeight(textArea)
        textAreaRef.current = textArea
    }, [])

    useLayoutEffect(() => {
        updateTextAreaHeight(textAreaRef.current)
    }, [text])

    const trpcUtils = api.useContext()
    const createTweet = api.tweet.create.useMutation({
        onSuccess: (data) => {
            setText('')
            if (session.status !== 'authenticated') return
            trpcUtils.tweet.infiniteScroll.setInfiniteData({}, (oldData) => {

                if (oldData == null || oldData.pages[0] == null) return

                const cacheTweet = {
                    ...data,
                    likeCount: 0,
                    likedByMe: false,
                    user: {
                        id: session.data.user.id,
                        name: session.data.user.name || null,
                        image: session.data.user.image || null,
                    },
                };
                return {
                    ...oldData,
                    pages: [
                        {
                            ...oldData.pages[0],
                            tweets: [cacheTweet, ...oldData.pages[0].tweets]
                        },
                        ...oldData.pages.slice(1)
                    ],
                }
            })
        }
    })

    if (session.status !== 'authenticated' || session.data?.user == null) return null


    function handleSubmit(e: FormEvent) {
        e.preventDefault()

        createTweet.mutate({ content: text })

    }

    return (
        <form className='flex flex-col gap-2 border-b px-4 py-2' onSubmit={handleSubmit}>
            <div className='flex gap-4 '>
                <ProfilePicture src={session.data.user.image} />
                {/* text area */}
                <textarea
                    ref={inputRef}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    style={{ height: 0 }}
                    className='flex-grow resize-none  overflow-hidden p-4 text-lg outline-none' placeholder='What is happening?!' />
            </div>
            <Button className='self-end' >Tweet</Button>
        </form>
    )

}



