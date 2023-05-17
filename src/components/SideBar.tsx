import Link from 'next/link'
import React, { use } from 'react'
import { useSession, signOut, signIn } from 'next-auth/react'


function SideBar() {
    const session = useSession()
    const user = session.data?.user

    return (
        <nav className="sticky top-0 self-start px-2 py-4 ml-28">

            <ul className='flex  flex-col items-start gap-2 whitespace-nowrap '>
                <li>
                    <Link href="/" >Home</Link>
                </li>
                {user != null && (<li>
                    <Link href={`/profiles/${user.id}`} >Profile</Link>
                </li>)}

                {user == null ? (

                    <li>
                        <button onClick={() => void signIn()}> Log In</button>
                    </li>
                ) : (
                    <li>
                        <button onClick={() => void signOut()}> Log out</button>
                    </li>
                )}
            </ul>
        </nav>
    )
}

export default SideBar