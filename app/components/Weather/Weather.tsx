'use client'

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import WeatherRender from "./WeatherRender";
import { WeatherData } from "@/app/lib/weather/WeatherApi";
import "./Weather.css";
import RefreshIcon from "@/app/assets/images/refresh.svg"
import Image from 'next/image'

export type Granularity = "work_hours" | "every_2_hours" | "every_hour"
const WORK_HOURS = [8, 12, 16, 20]

const Weather = () => {
    const [fullWeatherData, setFullWeatherData] = useState<WeatherData | null>(null);
    const [isError, setIsError] = useState<boolean>(false)

    const [granularity, setGranularity] = useState<Granularity>("work_hours")
    const [filteredWeatherData, setFilteredWeatherData] = useState<WeatherData | null>(null);


    const fetchData = useCallback(() => {
        setFullWeatherData(null)

        fetch("/api/weather")
            .then(r => r.json())
            .then(toWeatherDataFromApi)
            .then(setFullWeatherData)
            .catch((e) => {
                console.group("Error while fetching weather data")
                console.error(e)
                console.groupEnd()

                setIsError(true)
            })
    }, []);

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (!fullWeatherData) {
            setFilteredWeatherData(null)
            return;
        }
        if (granularity === "work_hours") {
            setFilteredWeatherData({
                ...fullWeatherData,
                weather: fullWeatherData.weather.filter(hourData => WORK_HOURS.includes(hourData.dateTime.getHours()))
            })
        } else if (granularity === "every_2_hours") {
            setFilteredWeatherData({
                ...fullWeatherData,
                weather: fullWeatherData.weather.filter(hourData => hourData.dateTime.getHours() % 2)
            })
        } else {
            setFilteredWeatherData(fullWeatherData)
        }
    }, [granularity, fullWeatherData])

    const changeGranularity = (event: ChangeEvent<HTMLInputElement>) => {
        setGranularity(event.target.value as Granularity)
    }

    return (
        <div id="weather-container" className="">
            <div className="flex">
                <fieldset className="inline-flex flex-row h-[35px] ml-4">
                    <legend className="sr-only">Granularité des informations météo</legend>

                    <label htmlFor="radio_work_hours" className={`${granularity === "work_hours" ? "selected" : ""} inline-flex rounded-md rounded-r-none border border-slate-400 bg-transparent px-3.5 py-2.5 text-center text-sm font-medium leading-none transition-all duration-300 ease-in`}>
                        Heures du jour
                    </label>
                    <input type="radio" id="radio_work_hours" value="work_hours" checked={granularity === "work_hours"} onChange={changeGranularity} className="sr-only" />

                    <label htmlFor="radio_every_2_hours" className={`${granularity === "every_2_hours" ? "selected" : ""} inline-flex rounded-none border border-l-0 border-slate-400 bg-transparent px-3.5 py-2.5 text-center text-sm font-medium leading-none transition-all duration-300 ease-in`}>
                        2 heures
                    </label>
                    <input type="radio" id="radio_every_hour" value="every_hour" checked={granularity === "every_hour"} onChange={changeGranularity} className="sr-only" />

                    <label htmlFor="radio_every_hour" className={`${granularity === "every_hour" ? "selected" : ""} inline-flex rounded-md rounded-l-none border border-l-0 border-slate-400 bg-transparent px-3.5 py-2.5 text-center text-sm font-medium leading-none transition-all duration-300 ease-in`}>
                        1 heure
                    </label>
                    <input type="radio" id="radio_every_2_hours" value="every_2_hours" checked={granularity === "every_2_hours"} onChange={changeGranularity} className="sr-only" />
                </fieldset>

                <span className="flex-1" aria-hidden></span>

                <button className="neon-gradient rounded-full p-2.5 border-transparent text-center text-sm cursor-pointer"
                    onClick={fetchData}
                    aria-label="Rafraichir les données météo"
                >
                    <Image src={RefreshIcon} alt="" />
                </button>
            </div>
            <WeatherRender
                weatherData={filteredWeatherData}
                error={isError}
                granularity={granularity}
            />
        </div>
    );
}

const toWeatherDataFromApi = (apiData: WeatherData): WeatherData => ({
    ...apiData,
    fetchDate: new Date(apiData.fetchDate),
    weather: apiData.weather.map((hourData) => ({
        ...hourData,
        dateTime: new Date(hourData.dateTime),
    }))
})

export default Weather;