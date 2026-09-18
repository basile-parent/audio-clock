"use client";

import { createContext, PropsWithChildren, useState, useContext } from "react";

export type AudiobookContext = {
    widgetOpen: boolean
    onChangeWidgetOpen: (newEnabledValue: boolean) => void
    dialogOpen: boolean
    onChangeDialogOpen: (newEnabledValue: boolean) => void
}
const AudiobookContextInstance = createContext<AudiobookContext>({
    widgetOpen: false,
    dialogOpen: false,
    onChangeWidgetOpen: () => { },
    onChangeDialogOpen: () => { },
});

export const AudiobookContextProvider = (props: Omit<PropsWithChildren, "value">) => {
    const [widgetOpen, setWidgetOpen] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    return (
        <AudiobookContextInstance.Provider value={{
            widgetOpen,
            onChangeWidgetOpen: setWidgetOpen,
            dialogOpen,
            onChangeDialogOpen: setDialogOpen
        }} {...props} />
    );
}

export const useAudiobookContext = (): AudiobookContext => useContext<AudiobookContext>(AudiobookContextInstance)