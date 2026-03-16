'use client'

import { SingleWeatherData, WeatherData } from "@/app/lib/weather/WeatherApi";
import { useMemo } from "react";
import { Granularity } from "./Weather";
import WorkingHours from "./layouts/WorkingHours";

interface WeatherRenderProps {
    weatherData: WeatherData
    error: boolean
    granularity: Granularity
}
const WeatherRender = ({ weatherData, granularity }: WeatherRenderProps) => {
    const weatherDataPerDay = useMemo<Record<string, SingleWeatherData[]>>(() =>
        weatherData?.weather.reduce((acc, hourData) => {
            const day = hourData.dateTime.toLocaleDateString("fr-FR", {
                weekday: "short",
                day: "numeric",
            }).replaceAll(".", "")
            if (acc[day]) {
                acc[day].push(hourData)
            } else {
                acc[day] = [hourData]
            }
            return acc
        }, {} as Record<string, SingleWeatherData[]>) ?? {},
        [weatherData])

    const hours = Object.keys(weatherDataPerDay).length ? Object.values(weatherDataPerDay)[0].map(hourData => hourData.dateTime.getHours()) : []
    
    return (
        <>
            { granularity === "work_hours" && <WorkingHours weatherData={weatherData} /> }
        </>
    )
};

export default WeatherRender;