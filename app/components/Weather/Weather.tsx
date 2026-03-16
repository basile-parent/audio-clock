'use client'

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import WeatherRender from "./WeatherRender";
import { WeatherData } from "@/app/lib/weather/WeatherApi";
import "./Weather.css";
import RefreshIcon from "@/app/assets/images/refresh.svg"
import LoadingIcon from "@/app/assets/images/loading.gif"
import Image from 'next/image'
import WeatherActions from "./WeatherActions";

export type Granularity = "work_hours" | "every_2_hours" | "every_hour"

const Weather = () => {
    const [fullWeatherData, setFullWeatherData] = useState<WeatherData | null>(null);
    const [isError, setIsError] = useState<boolean>(false)

    const [granularity, setGranularity] = useState<Granularity>("work_hours")

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


    if (!fullWeatherData) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <Image src={LoadingIcon} alt="Chargement en cours" className="max-h-[200px] max-w-[200px]" />
            </div>
        )
    }

    return (
        <div id="weather-container" className="h-full flex">
            <div className="w-[120px] h-full flex items-center justify-center">
                <WeatherActions
                    granularity={granularity}
                    onChangeGranularity={setGranularity}
                    onFetchData={fetchData}
                />
            </div>
            <div className="flex-1">
                <WeatherRender
                    weatherData={fullWeatherData}
                    error={isError}
                    granularity={granularity}
                />
            </div>
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