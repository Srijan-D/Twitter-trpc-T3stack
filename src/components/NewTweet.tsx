import React from 'react'
import Button from './Button'

function NewTweet() {
    return (
        <form className='flex flex-col gap-2 border-b px-4 py-2'>
            <div className='flex gap-4 '>
                {/* <ProfilePicture /> */}
                {/* text area */}
                <textarea  className='flex-grow resize-none overflow-hidden p-4 text-lg outline-none' placeholder='What is happening?!'/>
            </div>
            <Button className='self-end' >Tweet</Button>
        </form>
    )
}

export default NewTweet