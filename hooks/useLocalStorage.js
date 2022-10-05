import { useEffect, useState } from 'react'

const useLocalStorage = (key, defaultVal) => {
    const [value, setValue] = useState(() => {
        let value
        try {
            value = JSON.parse(localStorage.getItem(key)) ?? defaultVal;
            return value
        } catch (error) {
            return defaultVal
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (e) {
            return
        }
    }, [key, value]);

    return [value, setValue]

}

export default useLocalStorage;