import { expect, describe, it, vi, afterEach, beforeEach } from 'vitest'
import RestWeatherApi from "./RestWeatherApi"
import { WeatherApi } from "../WeatherApi"
import mockedResponse from "./RestWeatherApi.response"

describe('RestWeatherApi tests', () => {
    const weatherApi: WeatherApi = new RestWeatherApi()

    beforeEach(() => {
        // Here we tell Vitest to mock fetch on the `window` object.
        // @ts-ignore
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockedResponse),
            }),
        );
    })

    afterEach(() => {
        vi.clearAllMocks(); // Reset all mocked calls between tests
    });

    it('should set the city, region and country names', async () => {
        // Given (nothing)
        // When
        const weatherData = await weatherApi.getWeatherByCity("Lille")

        // Then
        expect(weatherData.city).toEqual("Lille MOCKED")
        expect(weatherData.region).toEqual("Nord-Pas-de-Calais")
        expect(weatherData.country).toEqual("France")
    })

    it('should set the last fetch date (current date)', async () => {
        // Given (nothing)
        // When
        const weatherData = await weatherApi.getWeatherByCity("Lille")

        // Then
        expect(weatherData.fetchDate.toLocaleDateString()).toEqual(new Date().toLocaleDateString())
    })

    it('should set the correct date for the first hour data', async () => {
        // Given (nothing)
        // When
        const weatherData = await weatherApi.getWeatherByCity("Lille MOCKED")

        // Then
        expect(weatherData.weather).toBeDefined()
        expect(weatherData.weather.length).toBeGreaterThan(0)

        // 2026-03-15 00:00
        expect(weatherData.weather[0].dateTime.toISOString()).toEqual("2026-03-15T00:00:00.000Z")
    })

    it('should have data for every hour during the given days', async () => {
        // Given (nothing)
        // When
        const weatherData = await weatherApi.getWeatherByCity("Lille MOCKED", { days: 2 })

        // Then
        expect(weatherData.weather).toBeDefined()
        expect(weatherData.weather.length).toEqual(47) // One data for each hour - minus last day at midnight

        expect(weatherData.weather[0].dateTime.toISOString()).toEqual("2026-03-15T00:00:00.000Z")
        expect(weatherData.weather[1].dateTime.toISOString()).toEqual("2026-03-15T01:00:00.000Z")
        expect(weatherData.weather[2].dateTime.toISOString()).toEqual("2026-03-15T02:00:00.000Z")
    })

    it('should set hour weather data', async () => {
        // Given (nothing)
        // When
        const weatherData = await weatherApi.getWeatherByCity("Lille MOCKED")

        // Then
        expect(weatherData.weather).toBeDefined()
        expect(weatherData.weather.length).toBeGreaterThan(0)

        expect(weatherData.weather[0].icon).toEqual("sunny")
        expect(weatherData.weather[0].description).toEqual("Clair")
        expect(weatherData.weather[0].temp).toEqual(4)
        expect(weatherData.weather[0].rainRisk).toEqual(0)
        expect(weatherData.weather[0].snowRisk).toEqual(0)

        expect(weatherData.weather[1].icon).toEqual("cloudy")
        expect(weatherData.weather[1].description).toEqual("Partiellement nuageux")
        expect(weatherData.weather[1].temp).toEqual(3.8)
        expect(weatherData.weather[1].rainRisk).toEqual(25)
        expect(weatherData.weather[1].snowRisk).toEqual(10)
    })

})