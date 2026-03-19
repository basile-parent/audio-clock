import RoundButton from "@/app/design-system/RoundButton"
import Image from "next/image"
import Link from "next/link"
import AudiobookIcon from "@/app/assets/images/audiobook.svg"
import { ViewTransition } from "react"

const Audiobook = () => {
    return (
        <>
            <Link href="/" transitionTypes={["backward"]}>
                Retour
            </Link>
            <h1 className="mt-4 leading-[50px] h-[50px] text-2xl font-bold">
                <ViewTransition name="audiobook-icon">
                    <RoundButton className="neon-gradient inline-block w-[50px] h-[50px] mr-4" role="presentation">
                        <Image src={AudiobookIcon} alt="" className="drop-shadow-lg/40 block w-full h-full w-auto h-auto" />
                    </RoundButton>
                    <span className="align-top">
                    Lire un livre audio
                    </span>
                </ViewTransition>
            </h1>
        </>
    )
}

export default Audiobook