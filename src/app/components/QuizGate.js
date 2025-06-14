// app/components/QuizGate.js
'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './QuizGate.module.css';

export default function QuizGate({
    question,
    options,
    correctAnswer,
    onCorrect,
    onIncorrect,
    friendName,
    initialAnimation
}) {
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const quizGateWrapperRef = useRef(null);

    const handleOptionClick = (userAnswer) => {
        if (buttonsDisabled) return;
        setButtonsDisabled(true);
        setShowFeedback(true);

        if (userAnswer === correctAnswer) {
            setFeedback(
                <>
                    สุดยอดคุณเป็นหยกตัวจริง!<br />
                    ถูกต้อง! 🎉
                </>
            );
            setFeedbackType(styles.correct);
            setTimeout(() => { if (onCorrect) onCorrect(); }, 1800);
        } else {
            setFeedback(
                <>
                    อุ๊ย... ผิดซะแล้ว!<br />
                    คุณคือ...ตัวปลอม!!!
                </>
            );
            // [แก้ไข 1] ย้ายโค้ด 2 บรรทัดนี้เข้ามาใน else block
            setFeedbackType(styles.incorrect);
            setTimeout(() => { if (onIncorrect) onIncorrect(); }, 2000);
        }
    }; // สิ้นสุดฟังก์ชัน handleOptionClick

    // [แก้ไข 2] ลบวงเล็บปีกกา '}' ที่เกินมาตรงนี้ออกไป

    useEffect(() => {
        if (quizGateWrapperRef.current && initialAnimation) {
            const pageElement = quizGateWrapperRef.current;
            const animationClasses = initialAnimation.split(' ').filter(cls => cls.startsWith('animate__'));
            const handlePageAnimEnd = () => {
                animationClasses.forEach(cls => pageElement.classList.remove(cls));
                pageElement.classList.remove('animate__animated');
            };
            pageElement.addEventListener('animationend', handlePageAnimEnd, { once: true });
            return () => { if (pageElement) pageElement.removeEventListener('animationend', handlePageAnimEnd); };
        }
    }, [initialAnimation]);

    return (
        <div ref={quizGateWrapperRef} className={`${styles.quizGateWrapper} ${initialAnimation || ''}`}>
            <div className={`${styles.quizContentBox} animate__animated animate__fadeInUp animate__faster`}>
                <h2 className={styles.quizTitleText}>
                    <span className={styles.quizTitleIcon}></span>
                    เดี๋ยวก่อน!!!
                </h2>
                <p className={styles.quizQuestionP}>{question}</p>
                <div className={styles.quizOptionsDiv}>
                    {options.map((option) => (
                        <button
                            key={option.value}
                            className={`${styles.quizOptionBtn} ${buttonsDisabled ? styles.disabled : ''}`}
                            onClick={() => handleOptionClick(option.value)}
                            disabled={buttonsDisabled}
                            aria-label={`ตัวเลือก: ${option.text}`}
                        >
                            {option.text}
                        </button>
                    ))}
                </div>
                {showFeedback && (
                    <p className={`${styles.quizFeedbackP} ${feedbackType} ${styles.visible}`}>
                        {feedback}
                    </p>
                )}
            </div>
        </div>
    );
} // สิ้นสุด Component QuizGate