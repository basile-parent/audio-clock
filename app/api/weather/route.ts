import RestWeatherApi from "@/app/lib/weather/RestWeatherApi/RestWeatherApi";
import { WeatherApi } from "@/app/lib/weather/WeatherApi";
import { NextResponse } from "next/server"

const weatherApiInstance: WeatherApi = new RestWeatherApi();

export async function GET(request: Request) {
    try {
        const data = await weatherApiInstance.getWeatherByCity(process.env.REST_WEATHER_API_QUERY)
        return NextResponse.json(data)
        // return new Response(JSON.stringify(data), {
        //     headers: { 'Content-Type': 'application/json' },
        // });
    } catch (error) {
        return NextResponse.json({
            error: "Récupération des données impossible",
            stack: JSON.stringify(error),
        },
            { status: 500 })
        // return new Response(JSON.stringify(error), {
        //     headers: { 'Content-Type': 'application/json' },
        //     status: 500,
        // });
    }
}