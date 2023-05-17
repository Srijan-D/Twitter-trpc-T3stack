import React, { useEffect, useRef } from 'react'
import Button from './Button'
import ProfilePicture from './ProfilePicture'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

function updateTextAreaHeight(textarea: HTMLTextAreaElement) {
    if (textarea == null) return
    textarea.style.height = "0"
    textarea.style.height = `${textarea.scrollHeight}px`
}

function NewTweet() {
    const session = useSession()
    const [text, setText] = useState('')
    const textAreaRef = useRef<HTMLTextAreaElement>(null)



    useEffect(() => {
        updateTextAreaHeight
    }, [text])

    if (session.status !== 'authenticated' || session.data?.user == null) return null

    return (
        <form className='flex flex-col gap-2 border-b px-4 py-2'>
            <div className='flex gap-4 '>
                <ProfilePicture src={session.data.user.image} />
                {/* text area */}
                <textarea
                    ref={textAreaRef}
                    onChange={e => setText(e.target.value)}
                    value={text}
                    style={{ height: 'max-content' }}
                    className='flex-grow resize-none  overflow-hidden p-4 text-lg outline-none' placeholder='What is happening?!' />
            </div>
            <Button className='self-end' >Tweet</Button>
        </form>
    )
}

export default NewTweet