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
    if (!storyData) {
        return null;
    }

    const { id, title, text, image, isPrologue, hasMusicButton, reveal } = storyData;
    const fullText = text || '';

    const [displayedText, setDisplayedText] = useState('');
    const [isTypingFinished, setIsTypingFinished] = useState(false);
    const [isTypingActive, setIsTypingActive] = useState(false);
    const [showRevealContent, setShowRevealContent] = useState(false);
    const [isImageWrapperVisible, setIsImageWrapperVisible] = useState(false);
    const [isTextAreaVisible, setIsTextAreaVisible] = useState(false);

    const typingAudioRef = useRef(null);
    const pageDisplayRef = useRef(null);

    // Effect for visibility animations (เหมือนเดิม)
    useEffect(() => {
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
            
            // Fallback if no animation
            const timer = setTimeout(() => {
                if(!animationClass || animationClass.trim() === '') showElements();
            }, 100);

            return () => {
                pageElement.removeEventListener('animationend', handlePageAnimEnd);
                clearTimeout(timer);
            };
        }
    }, [id, animationClass]);

    // Typewriter Effect (เหมือนเดิม)
    useEffect(() => {
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
    }, [startTyping, isTextAreaVisible, fullText, isTypingFinished]);

    // Typing Sound Effect (เหมือนเดิม)
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

    const handleRevealClick = () => {
        setShowRevealContent(prev => !prev);
    };

    const showPrimaryStartButton = (isPrologue || storyData?.isFirstStoryWithMusicButton) && onTriggerStartFlow;

    return (
        <div ref={pageDisplayRef} className={`${styles.storyPageContainer} ${animationClass || ''}`}>
            <div className={`${styles.storyContentBox} ${isPrologue ? styles.prologueContentBox : ''}`}>
                
                {title && <h1 className={styles.storyTitleText}>{title}</h1>}
                
                {image && (
                    <div className={`${styles.storyImageWrapper} ${isImageWrapperVisible ? styles.storyImageWrapper_visible : ''}`}>
                        <Image
                            src={image}
                            alt={title || `Story image ${id}`}
                            layout="fill"
                            objectFit="cover"
                            priority={id === 'story-1' || isPrologue}
                        />
                    </div>
                )}
                
                {fullText && (
                    <pre className={`${styles.storyTextArea} ${isTextAreaVisible ? styles.storyTextArea_visible : ''}`}>
                        {displayedText}
                    </pre>
                )}

                {/***************************************************************/}
                {/*          ส่วนของปุ่มที่แก้ไขแล้ว (อยู่ภายใน Content Box)          */}
                {/***************************************************************/}
             
                {/***************************************************************/}
                {/*                         จบส่วนของปุ่ม                         */}
                {/***************************************************************/}

            </div>   {isTypingFinished && (
                    <div className={styles.actionButtonsContainer}>
                        {showPrimaryStartButton ? (
                            // --- Case 1: ปุ่มเริ่มเรื่องราว (Prologue) ---
                            <button
                                onClick={onTriggerStartFlow}
                                className={`${styles.introActionButton} ${styles.prologueButton} animate__animated animate__pulse animate__infinite`}
                            >
                                {isPrologue ? "เริ่มเรื่องราว..." : "เริ่มเรื่องราวและเปิดเพลง"}
                            </button>
                        ) : (
                            // --- Case 2 & 3: ไม่ใช่ปุ่มเริ่ม (เป็นหน้าปกติหรือหน้าที่มี Reveal) ---
                            <>
                                {/* ถ้าไม่มีปุ่ม Reveal ให้แสดงปุ่ม Next ทันที */}
                                {!reveal && (
                                    <button
                                        onClick={onNext}
                                        className={`${styles.introActionButton} ${styles.storyNavBtn}`}
                                    >
                                        {isLastStory ? 'ไปดูของขวัญกัน!' : 'ถัดไป →'}
                                    </button>
                                )}

                                {/* ถ้ามีปุ่ม Reveal ให้แสดง Section ของมัน */}
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
                                        {/* ปุ่ม Next จะแสดงก็ต่อเมื่อกดเปิด Reveal แล้วเท่านั้น */}
                                        {showRevealContent && (
                                             <button
                                                onClick={onNext}
                                                className={`${styles.introActionButton} ${styles.storyNavBtn}`}
                                            >
                                                {isLastStory ? 'ไปดูของขวัญกัน!' : 'ถัดไป →'}
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