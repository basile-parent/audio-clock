"use client";

import { createContext, PropsWithChildren, useState, useContext, useEffect } from "react";

export type DevContext = {
    enabled: boolean
    onChangeEnabled: (newEnabledValue: boolean) => void
}
const DevContextInstance = createContext<DevContext>({
    enabled: true,
    onChangeEnabled: () => { }
});

export const DevContextProvider = (props: Omit<PropsWithChildren, "value">) => {
    const [enabled, setEnabled] = useState<boolean>(true);

    useEffect(() => {
        const html = document.documentElement;

        if (enabled) {
            html.classList.add("dev");
        } else {
            html.classList.remove("dev");
        }
    }, [enabled])

    return (
        <DevContextInstance.Provider value={{
            enabled,
            onChangeEnabled: setEnabled
        }} {...props} />
    );
}

export const useDevContext = (): DevContext => useContext<DevContext>(DevContextInstance)