import { SingleWeatherData, WeatherApi, WeatherData, WeatherApiOptions, WeatherIcon } from "../WeatherApi";

// Example : http://api.weatherapi.com/v1/forecast.json?key=...&q=Faches%20Thumesnl&days=2&aqi=no&alerts=no&lang=fr
class RestWeatherApi implements WeatherApi {
    private apiKey: string = process.env.REST_WEATHER_API_KEY;
    private apiUrl: string = process.env.REST_WEATHER_API_URL;

    getApiName() {
        return "WeatherApi";
    }

    async getWeatherByCity(city: string, options?: WeatherApiOptions): Promise<WeatherData> {
        // key=...&q=Lille&days=2&aqi=no&alerts=no&lang=fr
        const params: Record<string, string | number> = {
            days: 2,
            api: "no",
            alerts: "no",
            lang: "fr",
            tz_id: "Europe/Paris",
            ...options,
            key: this.apiKey,
            q: city,
        };
        const url = this.apiUrl + "?" +
            Object.keys(params)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching weather data: ${response.statusText}`);
            }
            return response.json().then((response: RestWeatherApiRawData) => {
                const weather = response.forecast.forecastday
                    .flatMap(dayData => dayData.hour)
                    .map(this.toHourData)

                // Removing the last data corresponding to the next day at midnight
                weather.pop()

                const weatherData: WeatherData = {
                    city: response.location.name,
                    region: response.location.region,
                    country: response.location.country,
                    fetchDate: new Date(),
                    weather
                }
                return weatherData
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    private toHourData = (rawHourData: RestWeatherApiRawHourData): SingleWeatherData => ({
        dateTime: new Date(rawHourData.time + " GMT"),
        icon: this.getWeatherIcon(rawHourData.condition.code),
        description: rawHourData.condition.text,
        temp: rawHourData.temp_c,
        rainRisk: rawHourData.chance_of_rain,
        snowRisk: rawHourData.chance_of_snow,
        moreApiData: {
            iconCode: rawHourData.condition.code,
            iconApiImage: rawHourData.condition.icon
        }
    })

    // https://www.weatherapi.com/docs/weather_conditions.json
    // https://www.weatherapi.com/docs/conditions.json (translations)
    private getWeatherIcon(apiCode: number): WeatherIcon {
        switch (apiCode) {
            case 1000: // Sunny
                return "sunny"

            case 1003: // Partly cloudy
                return "cloudy"

            case 1006: // Cloudy
                return "clouds"

            case 1009: // Overcast
                return "covered"

            case 1030: // Mist
            case 1135: // Fog
            case 1147: // Freezing fog
                return "fog"

            case 1063: // Patchy rain possible
            case 1069: // Patchy sleet possible
            case 1153: // Light drizzle
            case 1180: // Patchy light rain
            case 1183: // Light rain
            case 1240: // Light rain shower
            case 1243: // Moderate or heavy rain shower
            case 1249: // Light sleet showers
                return "rainy-sunny"

            case 1072: // Patchy freezing drizzle possible
            case 1150: // Patchy light drizzle
            case 1168: // Freezing drizzle
            case 1171: // Heavy freezing drizzle
            case 1186: // Moderate rain at times
            case 1189: // Moderate rain
            case 1195: // Heavy rain
            case 1198: // Light freezing rain
            case 1201: // Moderate or heavy freezing rain
            case 1246: // Torrential rain shower
                return "rainy"

            case 1087: // Thundery outbreaks possible
            case 1273: // Patchy light rain with thunder
            case 1276: // Moderate or heavy rain with thunder
            case 1279: // Patchy light snow with thunder
            case 1282: // Moderate or heavy snow with thunder
                return "storm"

            case 1066: // Patchy snow possible
            case 1114: // Blowing snow
            case 1117: // Blizzard
            case 1204: // Light sleet
            case 1207: // Moderate or heavy sleet
            case 1210: // Patchy light snow
            case 1213: // Light snow
            case 1216: // Patchy moderate snow
            case 1219: // Moderate snow
            case 1222: // Patchy heavy snow
            case 1225: // Heavy snow
            case 1237: // Ice pellets
            case 1252: // Moderate or heavy sleet showers
            case 1255: // Moderate or heavy
            case 1258: // Moderate or heavy snow showers
            case 1261: // Light showers of ice pellets
            case 1264: // Moderate or heavy showers of ice pellets
                return "snow"

            // case 1066:
            // case 1210: // Patchy light snow 
            // case 1249: // Light sleet showers
            // case 1255: // Light snow showers
            //     return "snowy-sunny"

            default:
                return "_default"
        }
    }
}

type SingleData = {
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
        text: string;
        icon: string;
        code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    gust_mph: number;
    gust_kph: number;
    uv: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    short_rad: number;
    diff_rad: number;
    dni: number;
    gti: number;
}

export type RestWeatherApiRawHourData = (SingleData & {
    time_epoch: number;
    time: string;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    will_it_rain: number;
    chance_of_rain: number;
    will_it_snow: number;
    chance_of_snow: number;
    snow_cm: number;
})

export type RestWeatherApiRawData = {
    location: {
        name: string;
        region: string;
        country: string;
        lat: number;
        lon: number;
        tz_id: string;
        localtime_epoch: number;
        localtime: string;
    };
    current: SingleData & {
        last_updated_epoch: number;
        last_updated: string;
    };
    forecast: {
        forecastday: {
            date: string;
            date_epoch: number;
            day: {
                maxtemp_c: number;
                maxtemp_f: number;
                mintemp_c: number;
                mintemp_f: number;
                avgtemp_c: number;
                avgtemp_f: number;
                maxwind_mph: number;
                maxwind_kph: number;
                totalprecip_mm: number;
                totalprecip_in: number;
                totalsnow_cm: number;
                avgvis_km: number;
                avgvis_miles: number;
                avghumidity: number;
                daily_will_it_rain: number;
                daily_chance_of_rain: number;
                daily_will_it_snow: number;
                daily_chance_of_snow: number;
                condition: {
                    text: string;
                    icon: string;
                    code: number;
                };
                uv: number;
            };
            astro: {
                sunrise: string;
                sunset: string;
                moonrise: string;
                moonset: string;
                moon_phase: string;
                moon_illumination: number;
                is_moon_up: number;
                is_sun_up: number;
            };
            hour: RestWeatherApiRawHourData[];
        }[];
    };
    alerts?: {
        alert: {
            headline: string;
            msgtype: any;
            severity: any;
            urgency: any;
            areas: any;
            category: string;
            certainty: any;
            event: string;
            note: any;
            effective: string;
            expires: string;
            desc: string;
            instruction: string;
        }[];
    };
};


export default RestWeatherApi;