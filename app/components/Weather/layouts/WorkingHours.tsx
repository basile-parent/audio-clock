import { SingleWeatherData, WeatherData } from "@/app/lib/weather/WeatherApi"
import { useMemo } from "react"
import DropIcon from "@/app/assets/images/drop.svg"
import SnowIcon from "@/app/assets/images/snow.svg"
import Image from "next/image";

const WORK_HOURS = [8, 12, 16, 20]

interface WorkingHoursProps {
    weatherData: WeatherData
}

const WorkingHours = ({ weatherData }: WorkingHoursProps) => {
    const filteredWeaterData = {
        ...weatherData,
        weather: weatherData.weather.filter(hourData => WORK_HOURS.includes(hourData.dateTime.getHours()))
    }

    const weatherDataPerDay = useMemo<Record<string, SingleWeatherData[]>>(() =>
        filteredWeaterData.weather.reduce((acc, hourData) => {
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
            <table className={`w-full table-fixed text-center work_hours`}>
                <thead>
                    <tr className="">
                        <th className="first-col text-sm opacity-75 italic">
                            {weatherData?.city}
                            <span className="sr-only">
                                Date de dernière récupération des données météorologiques
                            </span>
                            <span className="block text-xs">
                                Données:&nbsp;
                                {weatherData?.fetchDate.toLocaleDateString("fr-FR", {
                                    month: "numeric",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric"
                                })}
                            </span>
                        </th>
                        {
                            hours.map((hour: number) => (
                                <th className="hour text-xl" key={hour}>{hour}h</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.entries(weatherDataPerDay).map(([dayString, hourDataList]) => (
                            <tr key={dayString} className="">
                                <th className="first-col text-xl">{dayString}</th>
                                {
                                    hourDataList.map((hourData) => (
                                        <td className={`relative ${isPast(hourData.dateTime) ? "opacity-25" : "" }`} key={hourData.dateTime.toISOString()}>
                                            <span className="flex flex-col items-center gap-3">
                                                <img src={`/weather/white/${hourData.icon}.png`}
                                                    alt=""
                                                    className="h-[65px] w-[65px] inline-block flex-1" />

                                                {hourData.description &&
                                                    <p className="text-sm h-[45px] mt-[-15px]">{hourData.description}</p>
                                                }

                                                <p className="temperature absolute top-[-10px] right-px text-base">{ hourData.temp }°</p>

                                                {!!hourData.rainRisk && (
                                                    <span className="rain-badge absolute bottom-[50px] right-px text-base rounded-xl leading-none p-[3px] pl-[8px] pr-[8px] shadow-lg">
                                                        <Image src={DropIcon} alt="Risques de pluie" width="12" height="12" className="inline-block mr-1" />
                                                        {hourData.rainRisk}%
                                                    </span>
                                                )}
                                                {!!hourData.snowRisk && (
                                                    <span className="snow-badge absolute bottom-[78px] right-px text-base rounded-xl leading-none p-[3px] pl-[8px] pr-[8px] shadow-lg">
                                                        <Image src={SnowIcon} alt="Risques de neige" width="14" height="14" className="inline-block mr-1" />
                                                        {hourData.snowRisk}%
                                                    </span>
                                                )}
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
}

const isPast = (date: Date): boolean => new Date().getTime() > date.getTime()

export default WorkingHours;