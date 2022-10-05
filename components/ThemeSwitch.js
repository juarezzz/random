import styles from '../styles/ThemeSwitch.module.css';
import { useSpring, animated } from '@react-spring/web';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const ThemeSwitch = () => {
    const [props, api] = useSpring(() => ({ rotateZ: '0deg' }))
    const [hasRendered, setHasRendered] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setHasRendered(true)
    }, []);

    useEffect(() => {
        if (theme && theme === 'dark') {
            api.start({ rotateZ: '180deg' });
        } else if (theme) {
            api.start({ rotateZ: '0deg' });
        }
    }, [api, theme])

    if (!hasRendered) {
        return null;
    }

    return (
        <animated.div style={props} className={styles.container}>
            <button
                className={`${styles.iconButton} ${styles.lightMode}`}
                onClick={() => setTheme('light')}
            >
                <span className="material-symbols-outlined">
                    light_mode
                </span>
            </button>
            <button
                className={`${styles.iconButton} ${styles.darkMode}`}
                onClick={() => setTheme('dark')}
            >
                <span className="material-symbols-outlined">
                    dark_mode
                </span>
            </button>
        </animated.div>
    );
}

export default ThemeSwitch;
