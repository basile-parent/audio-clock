'use client'

import { useAudiobookContext } from "@/app/context/audiobookContext";
import { useAudioPlayer } from "@/app/context/audioPlayerContext";
import { Audiobook } from "./types";
import "./AudiobooksRender.css";

interface AudiobookRenderProps {
    audiobooks: Audiobook[];
}

const AudiobooksRender = ({ audiobooks }: AudiobookRenderProps) => {
    const { dialogOpen, onChangeDialogOpen } = useAudiobookContext();
    const { current, play, stop } = useAudioPlayer();

    const selectedId =
        current?.kind === "audiobook" ? current.id : null;

    return (
        <>
            <div className={`absolute inset-0 bg-black/50 ${dialogOpen ? " block" : " hidden"}`} aria-hidden> {/* backdrop */} </div>
            <dialog
                id="audiobook-dialog"
                aria-labelledby="audiobook-dialog-title"
                aria-modal="true"
                className="absolute top-[10%] left-[10%] z-50 w-[80%] h-[80%] overflow-y-auto p-4 backdrop:bg-transparent"
                open={dialogOpen}
            >
                <button
                    type="button"
                    onClick={() => onChangeDialogOpen(false)}
                    className="absolute top-0 right-0 p-2 w-[50px] h-[50px] line-height-[50px] rounded-full bg-red text-blue hover:bg-gray-300 hover:text-black transition-colors text-2xl font-bold cursor-pointer"
                    aria-label="Fermer"
                >
                    X
                </button>
                <h1 id="audiobook-dialog-title" className="mb-4 pr-12 text-xl font-semibold">
                    Audiobooks disponibles
                </h1>
                {audiobooks.length === 0 ? (
                    <p className="text-sm text-[var(--text-downlight)]">
                        Aucun audiobook disponible.
                    </p>
                ) : (
                    <ul
                        role="listbox"
                        aria-label="Liste des audiobooks"
                        className="audiobook-list"
                    >
                        {audiobooks.map((book) => {
                            const isSelected = selectedId === book.id;

                            return (
                                <li
                                    key={book.id}
                                    role="presentation"
                                    className="audiobook-list__item"
                                >
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={isSelected}
                                        className={`audiobook-list__select${isSelected ? " is-selected" : ""}`}
                                        onClick={() =>
                                            play({
                                                id: book.id,
                                                title: book.title,
                                                url: book.audioUrl,
                                                kind: "audiobook",
                                            })
                                        }
                                    >
                                        <span className="audiobook-list__title">{book.title}</span>
                                        {book.author ? (
                                            <span className="audiobook-list__author">
                                                {book.author}
                                            </span>
                                        ) : null}
                                    </button>
                                    {isSelected ? (
                                        <button
                                            type="button"
                                            className="audiobook-list__stop"
                                            aria-label={`Stop ${book.title}`}
                                            onClick={stop}
                                        >
                                            <span
                                                aria-hidden
                                                className="audiobook-list__stop-icon"
                                            />
                                        </button>
                                    ) : null}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </dialog>
        </>
    );
};

export default AudiobooksRender;
