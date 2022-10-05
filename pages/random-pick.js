import styles from '../styles/RandomPick.module.css';
import History from '../components/History';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage'
import RandomPickItem from '../components/RandomPickItem';
import { v4 as uuid } from 'uuid';
import { useSpring, animated } from '@react-spring/web';

const RandomPick = () => {
    const [disabled, setDisabled] = useState(true)
    const [isGenerating, setIsGenerating] = useState(false)
    const [hasRendered, setHasRendered] = useState(false)
    const [props, api] = useSpring(() => ({ translateY: '0%' }))
    const [value, setValue] = useState('')
    const [items, setItems] = useLocalStorage('random-pick-items', [])
    const [history, setHistory] = useLocalStorage('random-pick-history', []);
    const pickedItem = useRef(null)
    const resetButton = useRef(null)
    const pickButton = useCallback((el) => {
        if (el) {
            el.disabled = !(items.length > 1);
        }
    }, [items.length])

    useEffect(() => {
        //prevent hydration error
        setHasRendered(true)
    }, []);

    const handleAddItem = (evt) => {
        evt.preventDefault()
        if (value.trim() && !isGenerating && items.length < 100) {
            setItems(prev => [{ key: uuid(), value }, ...prev])
            setValue('')
        }
    }

    const handleRemoveItem = (id) => {
        setItems(prev => prev.filter(({ key }) => key !== id))
    }

    const handlePickItem = () => {
        setIsGenerating(true)
        api.start({ translateY: '100%' })
        const randomIndex = Math.floor(Math.random() * items.length)
        const result = items[randomIndex].value
        pickedItem.current.textContent = result
        pickedItem.current.classList.add(styles.reveal)
        setHistory(prev => {
            const newValue = [result, ...prev]
            if (newValue.length > 20) {
                newValue.pop()
            }
            return newValue
        })
    }

    const handleReset = () => {
        pickedItem.current.classList.remove(styles.reveal)
        api.start({ translateY: '0%' })
        setIsGenerating(false)
        setDisabled(true)
    }

    return (
        <div className={styles.container}>
            <form
                onSubmit={handleAddItem}
                className={styles.inputContainer}
            >
                <input
                    className={styles.itemInput}
                    placeholder='Add new item'
                    value={value}
                    maxLength={100}
                    onChange={({ target }) => setValue(target.value)}
                />
                <div className={styles.btnContainer}>
                    {
                        isGenerating
                            ?
                            <button
                                type='button'
                                onClick={handleReset}
                                className={`${styles.btn} ${styles.pickBtn}`}
                                style={{ margin: 'auto' }}
                                ref={resetButton}
                                disabled={disabled}
                            >
                                Reset
                            </button>
                            :
                            <>
                                <button
                                    onClick={handlePickItem}
                                    ref={pickButton}
                                    type="button"
                                    className={`${styles.btn} ${styles.pickBtn}`}
                                >
                                    Pick One
                                </button>
                                <button
                                    onClick={handleAddItem}
                                    type="submit"
                                    className={`${styles.btn} ${styles.addBtn}`}>
                                    Add Item
                                </button>
                                <button
                                    onClick={() => setItems([])}
                                    type="button"
                                    className={`${styles.btn} ${styles.clearBtn}`}
                                >
                                    Clear All
                                </button>
                            </>
                    }
                </div>
            </form>
            <animated.ul style={props} className={styles.itemsList}>
                {
                    //Only render after initial page render to prevent hydration error
                    hasRendered
                    &&
                    items.map(({ key, value }) => (
                        <RandomPickItem key={key} id={key} value={value} handleRemove={handleRemoveItem} />
                    ))}
            </animated.ul>
            <div
                ref={pickedItem}
                className={styles.chosenItem}
                onAnimationEnd={() => { setDisabled(false) }}
            />
            {
                !isGenerating
                &&
                <History items={history} />
            }
        </div>
    );
}

export default RandomPick;
