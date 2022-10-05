import { animated, useSpring } from "@react-spring/web";
import { useState, memo } from "react";
import styles from '../styles/History.module.css'

const History = ({ items }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [flip, setFlip] = useState(false)
    const props = useSpring({
        to: {
            translateX: '-100%'
        },
        from: {
            translateX: '0%'
        },
        reset: true,
        reverse: flip,
        onRest: () => {
            if (flip) {
                setIsOpen(false)
                setFlip(false)
            }
        }
    })

    const buttonProps = useSpring({ from: { scale: 0 }, to: { scale: 1 }, reset: true })

    return (
        <>
            {
                isOpen
                    ?
                    <animated.div className={styles.drawer} style={props}>
                        <div>
                            <button onClick={() => setFlip(!flip)} className={styles.closeButton}>
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>
                            <h2 style={{ textAlign: 'center' }}>History</h2>
                        </div>
                        <div className={styles.content}>
                            {
                                items?.length
                                    ?
                                    items.map((value, index) => (
                                        <div className={styles.historyItem} key={index}>{value}</div>
                                    ))
                                    :
                                    <div style={{ height: '100%', display: 'grid', placeItems: 'center' }}>
                                        <h3 style={{ textAlign: 'center', opacity: 0.6 }}>Empty</h3>
                                    </div>
                            }
                        </div>
                    </animated.div>
                    :
                    <animated.button style={buttonProps} className={styles.historyBtn} onClick={() => setIsOpen(true)}>
                        <span className='material-symbols-outlined' style={{ lineHeight: '50px' }}>
                            history
                        </span>
                    </animated.button>
            }
        </>
    );
}

export default memo(History);
