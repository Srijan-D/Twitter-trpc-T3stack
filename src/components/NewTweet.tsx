import React, { useCallback, useLayoutEffect, useRef } from 'react'
import Button from './Button'
import ProfilePicture from './ProfilePicture'
import { useSession } from 'next-auth/react'
import { useState } from 'react'


function updateTextAreaHeight(textArea?: HTMLTextAreaElement) {
    if (textArea == null) return
    textArea.style.height = '0px'
    textArea.style.height = ` ${textArea.scrollHeight}px`
}


export default function NewTweet() {
    const session = useSession()
    const [text, setText] = useState("")

    const textAreaRef = useRef<HTMLTextAreaElement>()

    const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
        updateTextAreaHeight(textArea)
        textAreaRef.current = textArea
    },[])

    useLayoutEffect(() => {
        updateTextAreaHeight(textAreaRef.current)
    }, [text])


    if (session.status !== 'authenticated' || session.data?.user == null) return null

    return (
        <form className='flex flex-col gap-2 border-b px-4 py-2'>
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


