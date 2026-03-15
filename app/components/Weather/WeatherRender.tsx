'use client'

import { SingleWeatherData, WeatherData } from "@/app/lib/weather/WeatherApi";
import { useMemo } from "react";
import { Granularity } from "./Weather";

interface WeatherRenderProps {
    weatherData: WeatherData | null
    onFetchData: () => void
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
            <table className={`w-full table-fixed text-center ${granularity}`}>
                <thead>
                    <tr className="">
                        <th className="first-col text-sm opacity-75 italic">
                            {weatherData?.city}
                        </th>
                        {
                            hours.map((hour: number) => (
                                <th className="hour">{hour}h</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.entries(weatherDataPerDay).map(([dayString, hourDataList]) => (
                            <tr key={dayString} className="">
                                <th className="first-col">{dayString}</th>
                                {
                                    hourDataList.map((hourData) => (
                                        <td className="">
                                            <span className="flex flex-col items-center gap-3">
                                                <img src={`/weather/white/${hourData.icon}.png`} 
                                                    alt="" 
                                                    className="w-25 inline-block flex-1" />
                                                {hourData.description && 
                                                    <p className="text-sm h-[45px]">{hourData.description}</p>
                                                }
                                            </span>
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </>
    );
};

export default WeatherRender;