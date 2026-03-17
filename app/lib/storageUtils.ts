import { Granularity } from "../components/Weather/Weather";

interface StorageInstance {
    getItem(key: string): string | null
    setItem(key: string, value: string | null): void
    removeItem(key: string): void
}

const STORAGE_PREFIX = process.env.STORAGE_PREFIX ?? "internal"

const _buildStorageKey = (key: string): string => `${STORAGE_PREFIX}-${key}`

const _setStorageValue = (storageMethod: StorageInstance, key: string, value: string | null) => {
    if (value === null) {
        storageMethod.removeItem(_buildStorageKey(key))
    } else {
        storageMethod.setItem(_buildStorageKey(key), value)
    }
}

const _getStorageValue = (storageMethod: StorageInstance, key: string): string | null => {
    return storageMethod.getItem(_buildStorageKey(key))
}

const getWeatherGranularity = (): Granularity | null => {
    const storageValue = _getStorageValue(localStorage, "weather-granularity")
    return storageValue ? storageValue as Granularity : null
}
const saveWeatherGranularity = (newGranularity: Granularity | null) => {
    _setStorageValue(localStorage, "weather-granularity", newGranularity)
}

export default {
    getWeatherGranularity,
    saveWeatherGranularity,
}