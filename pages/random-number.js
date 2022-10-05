import { useState, useRef } from 'react'
import History from '../components/History'
import useLocalStorage from '../hooks/useLocalStorage'
import styles from '../styles/RandomNumber.module.css'

const RandomNumber = () => {
    const [max, setMax] = useState(100)
    const [min, setMin] = useState(1)
    const [isGenerating, setIsGenerating] = useState(false)
    const [history, setHistory] = useLocalStorage('random-number-history', [])
    const numberDisplay = useRef(null)

    const handleGenerateRandomNum = () => {
        setIsGenerating(true)
        let i = 0;
        let [maxNum, minNum] = [max, min]
        if (minNum > maxNum) {
            setMax(minNum)
            setMin(maxNum)
            let temp;
            temp = maxNum
            maxNum = minNum
            minNum = temp
        }
        const interval = setInterval(() => {
            const newRandomNum = Math.floor(Math.random() * (maxNum - minNum + 1) + minNum)
            numberDisplay.current.textContent = newRandomNum
            if (++i > 30) {
                clearInterval(interval)
                setIsGenerating(false)
                setHistory(prev => {
                    const newValue = [newRandomNum, ...prev]
                    if (newValue.length > 20) {
                        newValue.pop()
                    }
                    return newValue
                })
            }
        }, 50)
    }

    const handleMaxInput = ({ target }) => {
        const re = /^-?\d{0,10}$/
        const match = target.value.match(re)
        if (match) {
            const newMax = match[0]
            setMax(newMax)
        }
    }

    const handleSetMax = () => {
        const maxNum = parseInt(max)
        if (!isNaN(maxNum)) {
            setMax(maxNum)
        } else {
            setMax(100)
        }
    }

    const handleMinValue = ({ target }) => {
        const re = /^-?\d{0,10}$/
        const match = target.value.match(re)
        if (match) {
            const newMin = match[0]
            setMin(newMin)
        }
    }

    const handleSetMin = () => {
        const minNum = parseInt(min)
        if (!isNaN(minNum)) {
            setMin(minNum)
        } else {
            setMin(1)
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.randomNum} ref={numberDisplay}>Generate a number</h2>
            <div className={styles.rangeContainer}>
                <div className={styles.inputContainer}>
                    <input
                        className={styles.rangeInput}
                        id='min'
                        value={min}
                        onChange={handleMinValue}
                        onBlur={handleSetMin}
                    />
                    <label htmlFor='min' className={styles.inputLabel}>Min</label>
                </div>
                <div className={styles.inputContainer}>
                    <input
                        className={styles.rangeInput}
                        id='max'
                        value={max}
                        onChange={handleMaxInput}
                        onBlur={handleSetMax}
                    />
                    <label htmlFor='max' className={styles.inputLabel}>Max</label>
                </div>
            </div>
            <button
                disabled={isGenerating}
                className={styles.randomNumBtn}
                onClick={handleGenerateRandomNum}
            >
                Generate Random Number
            </button>
            {
                !isGenerating
                &&
                <History items={history} />

            }
        </div>
    )
}

export default RandomNumber;