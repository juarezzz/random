import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Navbar.module.css';
import { useSpring, animated } from '@react-spring/web'

const titleHeight = 31
const pathNames = {
    '/': 0,
    '/random-number': 0,
    '/random-pick': -1,
    '/random-group': -2,
    '/random-answer': -3,
    '/404': -4,
}
export default function Navbar() {
    const { pathname } = useRouter()
    const [props, api] = useSpring(() => ({ from: { top: titleHeight * pathNames[pathname] } }))

    return (
        <nav className={styles.navbar}>
            <div className={styles.title}>
                <span>Random&nbsp;</span>
                <span className={styles.changingTitle}>
                    <animated.div style={props} className={styles.titleNames}>
                        <span>Number</span>
                        <span>Pick</span>
                        <span>Groups</span>
                        <span>Answer</span>
                        <span>Page</span>
                    </animated.div>
                </span>
            </div>
            <div className={styles.linksContainer}>
                <Link href='/random-number'>
                    <a
                        onClick={() => api.start({ top: titleHeight * 0 })}
                        className={`${styles.link} ${pathname === '/random-number' ? styles.active : ''}`}
                    >
                        Number
                    </a>
                </Link>
                <Link href='/random-pick'>
                    <a
                        onClick={() => api.start({ top: titleHeight * -1 })}
                        className={`${styles.link} ${pathname === '/random-pick' ? styles.active : ''}`}
                    >
                        Pick
                    </a>
                </Link>
                <Link href='/random-group'>
                    <a
                        onClick={() => api.start({ top: titleHeight * -2 })}
                        className={`${styles.link} ${pathname === '/random-group' ? styles.active : ''}`}
                    >
                        Groups
                    </a>
                </Link>
                <Link href='/random-answer'>
                    <a
                        onClick={() => api.start({ top: titleHeight * -3 })}
                        className={`${styles.link} ${pathname === '/random-answer' ? styles.active : ''}`}
                    >
                        Answer
                    </a>
                </Link>
            </div>
        </nav>
    )
}