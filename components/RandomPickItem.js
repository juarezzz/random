import { useSpring, animated } from '@react-spring/web';
import styles from '../styles/RandomPickItem.module.css';

const RandomPickItem = ({ id, value, handleRemove }) => {
    const props = useSpring({
        from: { scale: 0 },
        to: { scale: 1 }
    });

    return (
        <animated.li className={styles.listItem} style={props}>
            <button onClick={() => handleRemove(id)} className={styles.removeItemBtn}>
                <span className="material-symbols-outlined">
                    close
                </span>
            </button>
            {value}
        </animated.li>
    );
}

export default RandomPickItem;
