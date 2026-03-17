'use client'

import { useCallback, useEffect, useState, useRef } from "react";
import WeatherRender from "./WeatherRender";
import { WeatherData } from "@/app/lib/weather/WeatherApi";
import "./Weather.css";
import LoadingIcon from "@/app/assets/images/loading.gif"
import Image from 'next/image'
import WeatherActions from "./WeatherActions";
import storageUtils from "@/app/lib/storageUtils";

export type Granularity = "work_hours" | "every_2_hours" | "every_hour"

const Weather = () => {
    const [fullWeatherData, setFullWeatherData] = useState<WeatherData | null>(null);
    const [isError, setIsError] = useState<boolean>(false)

    const [granularity, setGranularity] = useState<Granularity>(storageUtils.getWeatherGranularity() ?? "work_hours")
    const updateGranularity = useCallback((newGranularity: Granularity) => {
        setGranularity(newGranularity);
        storageUtils.saveWeatherGranularity(newGranularity)
    }, [storageUtils, setGranularity])

    const fetchIntervalIdRef = useRef<NodeJS.Timeout | null>(null)
    const initFetchInterval = useCallback((): void => {
        if (fetchIntervalIdRef.current) {
            clearInterval(fetchIntervalIdRef.current)
        }

        fetchIntervalIdRef.current = setInterval(() => {
            fetchData()
        }, 1000 * 60 * 20) // Every 20 minutes
    }, [fetchIntervalIdRef.current])

    const fetchData = useCallback(() => {
        console.log("Fetch weather data", new Date().toLocaleString())

        setFullWeatherData(null)

        fetch("/api/weather")
            .then(r => r.json())
            .then(toWeatherDataFromApi)
            .then(setFullWeatherData)
            .then(initFetchInterval)
            .catch((e) => {
                console.group("Error while fetching weather data")
                console.error(e)
                console.groupEnd()

                setIsError(true)
            })
    }, [initFetchInterval]);

    useEffect(() => {
        fetchData()

        initFetchInterval()

        return () => {
            if (fetchIntervalIdRef.current) {
                clearInterval(fetchIntervalIdRef.current)
            }
        }
    }, [])

    if (!fullWeatherData) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <Image src={LoadingIcon} alt="Chargement en cours" className="max-h-[200px] max-w-[200px]" />
            </div>
        )
    }

    return (
        <div id="weather-container" className="h-full w-full flex gap-[5px]">
            <div className="w-[90px] h-full flex items-center justify-center">
                <WeatherActions
                    granularity={granularity}
                    onChangeGranularity={updateGranularity}
                    onFetchData={fetchData}
                />
            </div>
            <div className="flex-1 h-full">
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