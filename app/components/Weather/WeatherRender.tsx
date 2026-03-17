'use client'

import { WeatherData } from "@/app/lib/weather/WeatherApi";
import { Granularity } from "./Weather";
import WorkingHours from "./layouts/WorkingHours";
import HourChart from "./layouts/HourChart";

interface WeatherRenderProps {
    weatherData: WeatherData
    error: boolean
    granularity: Granularity
}
const WeatherRender = ({ weatherData, granularity }: WeatherRenderProps) => {
    return (
        <>
            {
                granularity === "work_hours" ?
                    <WorkingHours weatherData={weatherData} />
                    : <HourChart weatherData={weatherData} granularity={granularity} />
            }
        </>
    )
};

export default WeatherRender;