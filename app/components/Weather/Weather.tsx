
'use client'

import { useCallback, useEffect, useState } from "react";
import WeatherRender from "./WeatherRender";
import { WeatherData } from "@/app/lib/weather/WeatherApi";
import "./Weather.css";

export type Granularity = "work_hours" | "every_2_hours" | "every_hour"
const WORK_HOURS = [8, 12, 16, 20]

const Weather = () => {
    const [fullWeatherData, setFullWeatherData] = useState<WeatherData | null>(null);
    const [isError, setIsError] = useState<boolean>(false)

    const [granularity, setGranularity] = useState<Granularity>("work_hours")
    const [filteredWeatherData, setFilteredWeatherData] = useState<WeatherData | null>(null);


    const fetchData = useCallback(() => {
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

    return (
        <div id="weather-container" className="">
            <WeatherRender
                weatherData={filteredWeatherData}
                onFetchData={fetchData}
                error={isError}
                granularity={granularity}
            />
        </div>
    );
}

const toWeatherDataFromApi = (apiData: WeatherData): WeatherData => ({
    ...apiData,
    weather: apiData.weather.map((hourData) => ({
        ...hourData,
        dateTime: new Date(hourData.dateTime),
    }))
})

export default Weather;