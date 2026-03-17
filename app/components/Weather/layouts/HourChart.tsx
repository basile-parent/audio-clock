import { WeatherData } from "@/app/lib/weather/WeatherApi"
import { Granularity } from "../Weather"
import { useMemo } from "react"
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { RechartsDevtools, RECHARTS_DEVTOOLS_PORTAL_ID } from '@recharts/devtools';
import "./HourChart.css"

interface HourChartProps {
    weatherData: WeatherData
    granularity: Granularity
}
const HourChart = ({ granularity, weatherData }: HourChartProps) => {
    const filteredWeatherData = useMemo<WeatherData>(() => {
        return granularity === "every_2_hours" ? {
            ...weatherData,
            weather: weatherData.weather.filter(hourData => !(hourData.dateTime.getHours() % 2)),
        } : weatherData
    }, [weatherData, granularity])

    const data = filteredWeatherData.weather.map((hourData) => {
        const dayIndex = hourData.dateTime.getDay() === new Date().getDay() ? "1" : "2"
        return {
            name: dayIndex + "/" + hourData.dateTime.getHours(),
            temp: hourData.temp,
            rain: hourData.rainRisk,
            snow: hourData.snowRisk,
        }
    });

    const verticalValues = [
        ...Array.from({ length: 12 }, (_, index) => "1/" + (index * 2)),
        ...Array.from({ length: 12 }, (_, index) => "2/" + (index * 2)),
    ]

    const hasRain = useMemo<boolean>(() => !!data.find(hourData => hourData.rain && hourData.rain > 0), [data])

    return (
        <div id="hour-chart" className="text-sm">
            <ComposedChart
                style={{
                    width: '100%',
                    maxHeight: '250px',
                    aspectRatio: 1.618
                }}
                responsive
                data={data}
                margin={{
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                }}
            >
                <CartesianGrid
                    stroke="#f5f5f5"
                    strokeDasharray="3 3"
                    verticalValues={verticalValues}
                />
                <XAxis
                    dataKey="name"
                    name="Température"
                    allowDuplicatedCategory
                    ticks={verticalValues}
                    tickFormatter={hourTickFormatter} />

                <YAxis
                    width="auto"
                    niceTicks="snap125"
                    stroke="lightgray"
                />
                <YAxis
                    yAxisId="rain"
                    type="number"
                    dataKey="rain"
                    unit="%"
                    name="rain"
                    orientation="right"
                    stroke="#bad8ff"
                    width="auto"
                    domain={[0, 100]}
                    allowDataOverflow
                    hide={!hasRain}
                />

                <Bar dataKey="temp" barSize={20} fill="#413ea0" />
                <Line 
                    type="monotone" 
                    dataKey="rain" 
                    stroke="#3d38c2" 
                    strokeWidth={3}
                    yAxisId="rain" 
                    hide={!hasRain}
                />
                <RechartsDevtools />
            </ComposedChart>
            <div id={RECHARTS_DEVTOOLS_PORTAL_ID} />
        </div>
    )
}

const hourTickFormatter = (tick: string): string => {
    return tick.substring(tick.indexOf("/") + 1) + "h";
};

export default HourChart