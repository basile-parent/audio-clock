'use client'

import { useAudiobookContext } from "@/app/context/audiobookContext";
import { Audiobook } from "./types";

interface AudiobookRenderProps {
    audiobooks: Audiobook[];
}

const AudiobooksRender = ({ audiobooks }: AudiobookRenderProps) => {
    const { dialogOpen, onChangeDialogOpen } = useAudiobookContext();

    return (
        <>
            {/* <dialog id="dialog-backdrop" className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-grey"> */}
            <dialog     
                id="audiobook-dialog" 
                aria-labelledby="audiobook-dialog-title" 
                aria-modal="true"
                className="fixed top-[10%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-4 backdrop:bg-transparent"
                open={dialogOpen}
            >
                
                <button onClick={() => onChangeDialogOpen(false)} 
                        className="absolute top-0 right-0 p-2 w-[50px] h-[50px] line-height-[50px] rounded-full bg-red text-blue hover:bg-gray-300 hover:text-black transition-colors text-2xl font-bold cursor-pointer"
                        aria-label="Fermer"
                >
                    X
                </button>
                <h1 id="audiobook-dialog-title">Audiobooks disponibles</h1>
            </dialog>
        </>
    )
}

export default AudiobooksRender;