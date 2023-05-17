import Image from "next/image"
type ProfilePictureProps = {
    src: string | null | undefined,
    className?: string
}

function ProfilePicture({ src, className = "" }: ProfilePictureProps) {
    return (
        <div className={`relative overflow-hidden h-12 w-12 rounded-full ${className}`}>{src == null ? null : <Image src={src} alt="Profile picture" quality={100} fill/>}</div>
    )
}

export default ProfilePicture