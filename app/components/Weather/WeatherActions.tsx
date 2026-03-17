import RefreshIcon from "@/app/assets/images/refresh.svg"
import Image from 'next/image'
import { Granularity } from "./Weather"
import { ChangeEvent, useCallback, LabelHTMLAttributes } from "react"
import RoundButton from "@/app/design-system/RoundButton"

interface WeatherActionsProps {
    granularity: Granularity
    onChangeGranularity: (newGranularity: Granularity) => void
    onFetchData: () => void
}
const WeatherActions = ({ onFetchData, granularity, onChangeGranularity }: WeatherActionsProps) => {
    const changeGranularity = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        onChangeGranularity(event.target.value as Granularity)
    }, [])

    return (
        <div className="flex flex-col items-center justify-center">

            <RoundButton className="neon-gradient text-sm"
                onClick={onFetchData}
                aria-label="Rafraichir les données météo"
            >
                <Image src={RefreshIcon} alt="" />
            </RoundButton>

            <fieldset className="m-4">
                <legend className="sr-only">Granularité des informations météo</legend>

                <GranularityLabel htmlFor="radio_work_hours" className={`${granularity === "work_hours" ? "selected" : ""} rounded-b-none`}>
                    Jour
                </GranularityLabel>
                <input type="radio" id="radio_work_hours" value="work_hours" checked={granularity === "work_hours"} onChange={changeGranularity} className="sr-only" />

                <GranularityLabel htmlFor="radio_every_2_hours" className={`${granularity === "every_2_hours" ? "selected" : ""} rounded-none border-t-0`}>
                    2 heures
                </GranularityLabel>
                <input type="radio" id="radio_every_hour" value="every_hour" checked={granularity === "every_hour"} onChange={changeGranularity} className="sr-only" />

                <GranularityLabel htmlFor="radio_every_hour" className={`w-full ${granularity === "every_hour" ? "selected" : ""} rounded-t-none border-t-0`}>
                    1 heure
                </GranularityLabel>
                <input type="radio" id="radio_every_2_hours" value="every_2_hours" checked={granularity === "every_2_hours"} onChange={changeGranularity} className="sr-only" />
            </fieldset>
        </div>
    )
}

const GranularityLabel = ({ className, ...otherProps }: LabelHTMLAttributes<HTMLLabelElement>) => (
    <label className={`w-full m-0 inline-block rounded-md border border-slate-400 bg-transparent px-3.5 py-2.5 text-center text-sm font-medium leading-none transition-all duration-300 ease-in ${className}`}
        {...otherProps}
    />
)

export default WeatherActions;