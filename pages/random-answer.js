import { useSpring, animated } from '@react-spring/web';
import { useRef, useState } from 'react';
import styles from '../styles/RandomAnswer.module.css';
import History from '../components/History'
import useLocalStorage from '../hooks/useLocalStorage'

const answers = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful.",
]

const RandomAnswer = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [value, setValue] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [flip, setFlip] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [history, setHistory] = useLocalStorage('random-answer-history', []);
    const resetButton = useRef(null)
    const questionProps = useSpring({
        from: {
            opacity: 0
        },
        to: {
            opacity: 1
        },
        reset: !showAnswer,
        reverse: flip,
        config: {
            duration: 2000
        },
        pause: !isGenerating,
        onRest: () => {
            flip ?
                setShowAnswer(true)
                :
                setFlip(true)
        }
    })
    const answerProps = useSpring({
        from: {
            opacity: 0,
        },
        to: {
            opacity: 1
        },
        pause: !showAnswer,
        reset: showAnswer,
        config: {
            duration: 2000
        },
        onRest: () => resetButton.current.style.display = 'block'
    })


    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (value.trim()) {
            setValue('')
            setIsGenerating(true);
            setQuestion(value)
            const randomAnswer = answers[Math.floor(Math.random() * answers.length)]
            setAnswer(randomAnswer)
            const answeredQuestion = `Q: ${value}?\nA: ${randomAnswer}`
            setHistory(prev => {
                const newValue = [answeredQuestion, ...prev]
                if (prev.length > 20) {
                    newValue.pop()
                }
                return newValue
            })
        }
    }

    const handleReset = () => {
        setIsGenerating(false)
        setShowAnswer(false)
        setFlip(false)
        resetButton.current.style.display = 'none'
    }

    return (
        <div className={styles.container}>
            {
                !isGenerating
                &&
                <form onSubmit={handleSubmit} className={styles.questionForm}>
                    <label htmlFor='questionInput'>Ask Your Question</label>
                    <div className={styles.questionInputContainer}>
                        <input
                            maxLength={200}
                            id='questionInput'
                            className={styles.questionInput}
                            value={value}
                            onChange={({ target }) => setValue(target.value)}
                        />
                        <span className={styles.questionMark}>?</span>
                    </div>
                </form>
            }
            {
                isGenerating
                &&
                (
                    showAnswer
                        ?
                        <>
                            <animated.div
                                className={styles.answer}
                                style={answerProps}
                            >
                                {answer}
                            </animated.div>
                            <button
                                onClick={handleReset}
                                ref={resetButton}
                                className={styles.resetBtn}
                            >
                                Ask Again
                            </button>
                        </>
                        :
                        <animated.div
                            className={styles.question}
                            style={questionProps}
                        >
                            {question}?
                        </animated.div>
                )
            }
            {
                !isGenerating
                &&
                <History items={history} />
            }
        </div>
    );
}

export default RandomAnswer;