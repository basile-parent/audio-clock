export interface WeatherApi {
    getApiName(): string;
    getWeatherByCity(city: string, options?: WeatherApiOptions): Promise<WeatherData>;
}

export type WeatherApiOptions = Partial<{
    days: number,
    api: "yes" | "no",
    alerts: "yes" | "no",
    lang: "fr" | string,
    tz_id: "Europe/Paris" | string
}>

export type SingleWeatherData = {
    dateTime: Date;
    icon: WeatherIcon;
    temp: number;
    rainRisk?: number;
    snowRisk?: number;
    description?: string;
    moreApiData?: any
}

export type WeatherData = {
    city: string;
    region?: string;
    country?: string;
    weather: SingleWeatherData[];
};

export type WeatherIcon = "_default" | "sunny" | "cloudy" | "clouds" | "covered" | "rainy" | "rainy-sunny" | "storm" | "snow" | "fog"