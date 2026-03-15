export declare global {
    namespace NodeJS {
        interface ProcessEnv {
            REST_WEATHER_API_URL: string;
            REST_WEATHER_API_KEY: string;
            REST_WEATHER_API_QUERY: string;
        }
    }
}