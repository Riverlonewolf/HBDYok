// app/components/StoryPageDisplay.js
'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './StoryPageDisplay.module.css';

const TYPING_SOUND_SRC = '/audio/typing.mp3';

export default function StoryPageDisplay({
    storyData,
    startTyping,
    onNext,
    onTriggerStartFlow,
    isLastStory,
    animationClass
}) {
    // =======================================================================
    // --- STEP 1: เรียกใช้ Hooks ทั้งหมดที่ด้านบนสุด (รวม useEffect) ---
    // ไม่ว่าเงื่อนไขจะเป็นอย่างไร ส่วนนี้จะถูกเรียกใช้เสมอในลำดับเดิม
    // =======================================================================
    const [displayedText, setDisplayedText] = useState('');
    const [isTypingFinished, setIsTypingFinished] = useState(false);
    const [isTypingActive, setIsTypingActive] = useState(false);
    const [showRevealContent, setShowRevealContent] = useState(false);
    const [isImageWrapperVisible, setIsImageWrapperVisible] = useState(false);
    const [isTextAreaVisible, setIsTextAreaVisible] = useState(false);
    const typingAudioRef = useRef(null);
    const pageDisplayRef = useRef(null);

    // ย้าย useEffect ทั้งหมดขึ้นมาที่นี่
    useEffect(() => {
        // Guard clause ภายใน useEffect เพื่อป้องกัน error ถ้า storyData ไม่มีค่า
        if (!storyData) return;

        setIsImageWrapperVisible(false);
        setIsTextAreaVisible(false);
        setDisplayedText('');
        setIsTypingFinished(false);
        setIsTypingActive(false);
        setShowRevealContent(false);

        const pageElement = pageDisplayRef.current;
        if (pageElement) {
            const showElements = () => {
                setIsImageWrapperVisible(true);
                setIsTextAreaVisible(true);
            };
            const handlePageAnimEnd = () => setTimeout(showElements, 50);
            pageElement.addEventListener('animationend', handlePageAnimEnd, { once: true });
            
            const timer = setTimeout(() => {
                if (!animationClass || animationClass.trim() === '') showElements();
            }, 100);

            return () => {
                if (pageElement) pageElement.removeEventListener('animationend', handlePageAnimEnd);
                clearTimeout(timer);
            };
        }
    }, [storyData, animationClass]); // << เพิ่ม storyData ใน dependency array

    useEffect(() => {
        const fullText = storyData?.text || '';
        if (startTyping && isTextAreaVisible && !isTypingFinished && fullText) {
            setIsTypingActive(true);
            let charIndex = 0;
            const intervalId = setInterval(() => {
                if (charIndex < fullText.length) {
                    setDisplayedText(fullText.slice(0, charIndex + 1));
                    charIndex++;
                } else {
                    clearInterval(intervalId);
                    setIsTypingFinished(true);
                    setIsTypingActive(false);
                }
            }, 60);
            return () => clearInterval(intervalId);
        }
    }, [startTyping, isTextAreaVisible, storyData, isTypingFinished]); // << เพิ่ม storyData

    useEffect(() => {
        const audio = typingAudioRef.current;
        if (audio) {
            if (isTypingActive) {
                audio.play().catch(e => console.warn("Typing sound play failed:", e));
            } else {
                audio.pause();
                if (audio.readyState >= 2) audio.currentTime = 0;
            }
        }
    }, [isTypingActive]);

    // ==========================================================================
    // --- STEP 2: ตรวจสอบ props และ return ออกไปก่อนได้ (Guard Clause) ---
    // ส่วนนี้จะอยู่ "หลัง" จากเรียกใช้ Hooks ทั้งหมดแล้ว
    // ==========================================================================
    if (!storyData) {
        return null;
    }

    // ==========================================================================
    // --- STEP 3: Logic และฟังก์ชันอื่นๆ ---
    // ==========================================================================
    const { id, title, text, image, isPrologue, reveal } = storyData;
    const handleRevealClick = () => {
        setShowRevealContent(prev => !prev);
    };
    const showPrimaryStartButton = (isPrologue || storyData?.isFirstStoryWithMusicButton) && onTriggerStartFlow;

    // ==========================================================================
    // --- STEP 4: ส่วนของ JSX ที่จะ Render ---
    // ==========================================================================
    return (
        <div ref={pageDisplayRef} className={`${styles.storyPageContainer} ${animationClass || ''}`}>
            {/* กล่องเนื้อหาหลัก */}
            <div className={`${styles.storyContentBox} ${isPrologue ? styles.prologueContentBox : ''}`}>
                {title && <h1 className={styles.storyTitleText}>{title}</h1>}
                {image && (
                    <div className={`${styles.storyImageWrapper} ${isImageWrapperVisible ? styles.storyImageWrapper_visible : ''}`}>
                        <Image src={image} alt={title || `Story image ${id}`} layout="fill" objectFit="cover" priority={id === 'story-1' || isPrologue} />
                    </div>
                )}
                {text && (
                    <pre className={`${styles.storyTextArea} ${isTextAreaVisible ? styles.storyTextArea_visible : ''}`}>
                        {displayedText}
                    </pre>
                )}
            </div>

            {/* ส่วนของปุ่มทั้งหมด */}
            {isTypingFinished && (
                <div className={styles.actionButtonsContainer}>
                    {showPrimaryStartButton ? (
                        <button onClick={onTriggerStartFlow} className={`${styles.introActionButton} ${styles.prologueButton} animate__animated animate__pulse animate__infinite`}>
                            {isPrologue ? "เริ่มเรื่องราว..." : "เริ่มเรื่องราวและเปิดเพลง"}
                        </button>
                    ) : (
                        <>
                            {!reveal && (
                                <button onClick={onNext} className={`${styles.introActionButton} ${styles.storyNavBtn}`}>
                                    {isLastStory ? 'ถัดไป →' : 'ถัดไป →'}
                                </button>
                            )}
                            {reveal && (
                                <div className={styles.revealSectionWrapper}>
                                    <button onClick={handleRevealClick} className={`${styles.revealBtn} ${showRevealContent ? styles.revealBtn_active : ''}`}>
                                        <span>{reveal.buttonTextPart1 || "ข้อความพิเศษ"}</span>
                                        <span className={styles.revealBtnIcon}>💌</span>
                                    </button>
                                    {reveal.content && (
                                        <div className={`${styles.secretContentDiv} ${showRevealContent ? styles.secretContentDiv_visible : ''}`}>
                                            <div dangerouslySetInnerHTML={{ __html: reveal.content }} />
                                        </div>
                                    )}
                                    {showRevealContent && (
                                        <button onClick={onNext} className={`${styles.introActionButton} ${styles.storyNavBtn}`}>
                                            {isLastStory ? 'ถัดไป →' : 'ถัดไป →'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
            
            <audio ref={typingAudioRef} src={TYPING_SOUND_SRC} loop />
        </div>
    );
}