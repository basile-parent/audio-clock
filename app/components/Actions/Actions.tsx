'use client'

import { useDevContext } from "@/app/context/devContext";
import "./Actions.css"
import { ChangeEvent, useCallback, ViewTransition } from "react";
import RoundButton from "@/app/design-system/RoundButton";
import Image from "next/image"
import RadioIcon from "@/app/assets/images/radio.png"
import AudiobookIcon from "@/app/assets/images/audiobook.svg"
import Link from "next/link";

const Actions = () => {
    const { enabled, onChangeEnabled } = useDevContext()

    const changeDevMode = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        onChangeEnabled(event.target.checked)
    }, [])

    return (
        <div id="actions-container" className="inline-flex flex-col h-full">
            {process.env.NODE_ENV === "development" && (
                <div className="h-[30px] text-center">
                    <label className="switch inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={enabled} onChange={changeDevMode} className="sr-only peer" />
                        <div className="background relative w-9 h-5 bg-neutral-quaternary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[4px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand"></div>
                        <span className="select-none ms-3 text-sm font-medium text-heading">DEV mode</span>
                    </label>
                </div>
            )}
            <div className="flex-1 flex flex-col justify-start gap-16 items-center mt-8">
                <article className="flex justify-center items-center">
                    <RoundButton className="neon-gradient flex justify-center items-center w-[100px] h-[100px]">
                        <Image src={RadioIcon} alt="Allumer la radio" className="drop-shadow-lg/40 block max-w-[80%] max-h-[100%] w-auto h-auto" />
                    </RoundButton>
                </article>
                <article className="flex justify-center items-center">
                    <Link href="/pages/audiobook" transitionTypes={["forward"]}>
                        <ViewTransition name="audiobook-icon">
                            <RoundButton className="neon-gradient flex justify-center items-center w-[100px] h-[100px]" role="presentation">
                                <Image src={AudiobookIcon} alt="Lire un livre audio" className="drop-shadow-lg/40 block max-w-[80%] max-h-[100%] w-auto h-auto" />
                            </RoundButton>
                        </ViewTransition>
                    </Link>
                </article>
            </div>
        </div>
    )
}

export default Actions;