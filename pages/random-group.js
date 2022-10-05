import { useCallback, useEffect, useState, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import styles from '../styles/RandomGroup.module.css'
import { v4 as uuid } from 'uuid'
import { toPng } from 'html-to-image';

const RandomGroup = () => {
    const [hasRendered, setHasRendered] = useState(false)
    const [value, setValue] = useState('')
    const [numGroups, setNumGroups] = useState(1)
    const [names, setNames] = useLocalStorage('random-group-names', [])
    const [groups, setGroups] = useState(null)
    const groupsTable = useRef(null)
    const createButton = useCallback((el) => {
        if (el) {
            el.disabled = !(names.length > 0)
        }
    }, [names.length])

    const namePerGroup = useCallback((el) => {
        if (el && typeof numGroups === 'number') {
            if (names.length === 0) {
                return el.textContent = ''
            }
            const averageNamesPerGroup = names.length / numGroups
            if (averageNamesPerGroup % 1 !== 0) {
                const minValue = Math.floor(averageNamesPerGroup)
                const maxValue = minValue + 1
                return el.textContent = `${minValue} - ${maxValue} per group`
            }
            el.textContent = `${averageNamesPerGroup} per group`
        }
    }, [numGroups, names])

    useEffect(() => {
        setHasRendered(true)
    }, []);

    const handleSubmit = (evt) => {
        evt.preventDefault()
        if (value.trim() && names.length < 100) {
            setNames(prev => [{ key: uuid(), value }, ...prev])
            setValue('')
        }
    }

    const handleRemoveName = (id) => {
        setNames(prev => prev.filter(({ key }) => key !== id))
    }

    const handleNumGroups = ({ target }) => {
        const re = /^\d{0,2}$/
        const match = target.value.match(re)
        if (match) {
            setNumGroups(match[0])
        }
    }

    const handleSetNumGroups = () => {
        const groupsNum = parseInt(numGroups)
        if (isNaN(groupsNum) || groupsNum <= 0) {
            return setNumGroups(1)
        }
        if (groupsNum > names.length) {
            return setNumGroups(names.length || 1)
        }
        setNumGroups(groupsNum)
    }

    const handleCreateGroups = async () => {
        const namesToDistribute = [...names]
        //Create an array of empty subarrays of length equal to the number of groups
        const groups = Array.from(Array(numGroups), () => []);
        while (namesToDistribute.length > 0) {
            //Create an array to pick random groups to assign a name to, but never to the same group in a row
            const groupsLeft = [...groups.keys()]
            for (let i = 0; i < numGroups; i++) {
                const randomGroupIndex = groupsLeft.splice(Math.floor(Math.random() * groupsLeft.length), 1)[0]
                const randomGroup = groups[randomGroupIndex]
                const randomNameIndex = Math.floor(Math.random() * namesToDistribute.length)
                const randomName = namesToDistribute.splice(randomNameIndex, 1)[0]
                //Prevent undefined from being pushed to array
                randomName && randomGroup.push(randomName)
            }
        }
        setGroups(groups)
    }

    const handleClearAll = () => {
        setNames([])
        setNumGroups(1)
    }

    const handleDownload = async () => {
        try {
            const downloadURL = await toPng(groupsTable.current)
            const link = document.createElement('a')
            link.download = 'groups-table.png'
            link.href = downloadURL
            link.click()
        } catch (e) {
            return
        }
    }

    return (
        <div className={styles.container}>
            {
                !groups
                &&
                <div className={styles.createGroupContainer}>
                    <div className={styles.inputsContainer}>
                        <form
                            className={styles.nameForm}
                            onSubmit={handleSubmit}
                        >
                            <input
                                placeholder='Add new name'
                                className={styles.nameInput}
                                value={value}
                                onChange={({ target }) => setValue(target.value)}
                                maxLength={50}
                            />
                            <button
                                className={`${styles.btn} ${styles.addBtn}`}
                                type='submit'>
                                Add Name
                            </button>
                            <button
                                type='button'
                                className={`${styles.btn} ${styles.clearBtn}`}
                                onClick={handleClearAll}
                            >
                                Clear all
                            </button>
                        </form>
                        <div className={styles.groupInputContainer}>
                            <label htmlFor='groupInput'>
                                Number of groups:
                            </label>
                            <input
                                id='groupInput'
                                className={styles.groupInput}
                                value={numGroups}
                                onChange={handleNumGroups}
                                onBlur={handleSetNumGroups}
                            />
                            <span ref={namePerGroup} style={{ display: 'block', textAlign: 'center', fontSize: '14px' }} />
                        </div>
                    </div>
                    <button
                        ref={createButton}
                        onClick={handleCreateGroups}
                        className={`${styles.btn} ${styles.createBtn}`}
                    >
                        Create Groups
                    </button>
                </div>
            }
            {
                groups
                &&
                <div className={styles.resetButtonContainer}>
                    <button className={styles.btn} onClick={() => setGroups(null)}>Reset</button>
                    <button className={styles.btn} onClick={handleDownload}>Download Groups Table</button>
                </div>
            }
            {
                (hasRendered && names.length > 0 && !groups)
                &&
                <div className={styles.namesTable}>
                    <div className={styles.namesTableHeader}>Names ({names.length})</div>
                    <div className={styles.namesTableContent}>
                        {
                            names.map(({ key, value }) => (
                                <div className={styles.nameItem} key={key}>
                                    <span className={styles.nameText}>{value}</span>
                                    <button onClick={() => handleRemoveName(key)}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px', lineHeight: '20px' }}>
                                            close
                                        </span>
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            }
            {
                groups
                &&
                <div className={styles.groupsTableContainer}>
                    <div ref={groupsTable} className={styles.groupsTable}>
                        {groups.map((group, index) => (
                            <div key={index} className={styles.group}>
                                <div className={styles.groupHeader}>{`Group ${index + 1}`}</div>
                                <div className={styles.groupContent}>
                                    {group.map(name => (
                                        <div className={styles.groupItem} key={name.key}>{name.value}</div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
}

export default RandomGroup;