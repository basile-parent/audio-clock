import { WeatherData } from "@/app/lib/weather/WeatherApi"
import { Granularity } from "../Weather"
import { useMemo } from "react"
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, DotItemDotProps } from 'recharts';
import "./HourChart.css"
import { AxisPropsForCartesianGridTicksGeneration } from "recharts/types/cartesian/CartesianGrid";
import { ChartOffsetInternal } from "recharts/types/util/types";

const DEFAULT_DISPLAYED_DAYS_COUNT = 2

interface HourChartProps {
    weatherData: WeatherData
    granularity: Granularity
    displayedDaysCount?: number
}
const HourChart = ({ granularity, weatherData, displayedDaysCount }: HourChartProps) => {
    const filteredWeatherData = useMemo<WeatherData>(() => {
        return granularity === "every_2_hours" ? {
            ...weatherData,
            weather: weatherData.weather.filter(hourData => !(hourData.dateTime.getHours() % 2)),
        } : weatherData
    }, [weatherData, granularity])

    const chartData = useMemo(() => filteredWeatherData.weather.map((hourData) => {
        const dayIndex = hourData.dateTime.getDay() === new Date().getDay() ? "1" : "2"
        return {
            name: dayIndex + "/" + hourData.dateTime.getHours(),
            temp: hourData.temp,
            rain: hourData.rainRisk,
            snow: hourData.snowRisk,
        }
    }), [filteredWeatherData]);

    const verticalValues = useMemo(() => getEvery2HoursPerDays(displayedDaysCount || DEFAULT_DISPLAYED_DAYS_COUNT), [displayedDaysCount])
    const verticalFill: string[] = ["transparent", ...getDayVerticalFill(displayedDaysCount || DEFAULT_DISPLAYED_DAYS_COUNT)]

    const hasRain = useMemo<boolean>(() => !!chartData.find(hourData => hourData.rain && hourData.rain > 0), [chartData])

    return (
        <div id="hour-chart" className="text-sm">
            <ComposedChart
                style={{
                    width: '100%',
                    maxHeight: '250px',
                    aspectRatio: 1.618
                }}
                responsive
                data={chartData}
                margin={{
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                }}
            >
                <CartesianGrid
                    stroke="transparent"
                    verticalCoordinatesGenerator={verticalCoordinatesGenerator(granularity === "every_2_hours" ? EVERY_2_HOURS_OPTIONS : EVERY_HOURS_OPTIONS)}
                    verticalFill={verticalFill}
                    fillOpacity={0.2}
                />
                <CartesianGrid
                    stroke="var(--text-downlight)"
                    strokeDasharray="3 3"
                    verticalValues={verticalValues}
                    yAxisId="temp"
                    syncWithTicks={false}
                    verticalCoordinatesGenerator={verticalCoordinatesGenerator(granularity === "every_2_hours" ? EVERY_2_HOURS_OPTIONS : EVERY_HOURS_OPTIONS)}
                />

                <XAxis
                    dataKey="name"
                    ticks={verticalValues}
                    tickCount={verticalValues.length}
                    tickFormatter={hourTickFormatter}
                    stroke="var(--text-downlight)"
                    niceTicks="snap125"
                />

                <YAxis
                    dataKey="temp"
                    yAxisId="temp"
                    unit="°"
                    orientation="left"
                    width="auto"
                    stroke="var(--text-downlight)"
                />

                <YAxis
                    dataKey="rain"
                    yAxisId="rain"
                    unit="%"
                    orientation="right"
                    width="auto"
                    stroke="var(--rain-background)"
                    domain={[0, 100]}
                    hide={!hasRain}
                />

                <Bar
                    dataKey="temp"
                    yAxisId="temp"
                    barSize={20}
                    fill="var(--temperature-color)"
                />
                <Line
                    type="monotone"
                    dataKey="rain"
                    stroke="var(--rain-line)"
                    strokeWidth={3}
                    yAxisId="rain"
                    hide={!hasRain}
                    dot={CustomizedRainDot}
                />
            </ComposedChart>
        </div>
    )
}

interface VerticalCoordinatesGeneratorProps {
    xAxis: AxisPropsForCartesianGridTicksGeneration | undefined
    width: number
    height: number
    offset: ChartOffsetInternal
}
type VerticalCoordinatesGeneratorOptions = (props: VerticalCoordinatesGeneratorProps) => {
    leftOffset: number,
    widthBetweenTicksInterval: number
}
const EVERY_2_HOURS_OPTIONS: VerticalCoordinatesGeneratorOptions = ({ offset }: VerticalCoordinatesGeneratorProps) => ({
    leftOffset: offset.left - (offset.width / 50),
    widthBetweenTicksInterval: 23.05
})
const EVERY_HOURS_OPTIONS: VerticalCoordinatesGeneratorOptions = ({ offset }: VerticalCoordinatesGeneratorProps) => ({
    leftOffset: offset.left - (offset.width / 100),
    widthBetweenTicksInterval: 23.54
})
const verticalCoordinatesGenerator = (calculationOptions: VerticalCoordinatesGeneratorOptions) => 
    (props: VerticalCoordinatesGeneratorProps) => {
    const { offset } = props
    const leftOffset = calculationOptions(props).leftOffset
    const availableChartWidth = offset.width;
    const widthBetweenTicks = availableChartWidth / calculationOptions(props).widthBetweenTicksInterval;

    let start = leftOffset;

    const result: number[] = [offset.left - 1];

    for (let i = 0; i < 23; i++) {
        start += widthBetweenTicks;
        result.push(start);
    }

    return result;
}

const getEvery2HoursPerDays = (displayedDaysCount: number) => Array.from({ length: displayedDaysCount },
    (_, dayIndex) => Array.from({ length: 12 }, (_, index) => (dayIndex + 1) + "/" + (index * 2)))
    .flatMap(hourArray => hourArray)

const hourTickFormatter = (tick: string): string => {
    return tick.substring(tick.indexOf("/") + 1) + "h";
};

const CustomizedRainDot = ({ cx, cy, value }: DotItemDotProps) => {
    if (!value) {
        return <></>
    }

    return (
        <circle cx={cx} cy={cy} r={5} stroke="var(--rain-line)" strokeWidth={3} fill="var(--text-primary)" />
    );
}

const getDayVerticalFill = (displayedDaysCount: number): string[] =>
    Array.from({ length: displayedDaysCount },
        () => [
            "var(--text-downlight)",    // 00-02h
            "var(--text-downlight)",    // 02-04h
            "var(--text-downlight)",    // 04-06h
            "var(--text-downlight)",    // 06-08h
            "transparent",              // 08-10h
            "transparent",              // 10-12h
            "transparent",              // 12-14h
            "transparent",              // 15-16h
            "transparent",              // 16-18h
            "transparent",              // 18-20h
            "var(--text-downlight)",    // 20-22h
            "var(--text-downlight)",    // 22-24h
        ]).flatMap(stringArray => stringArray)

export default HourChart