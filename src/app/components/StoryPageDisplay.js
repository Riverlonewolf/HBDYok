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
    const [displayedText, setDisplayedText] = useState('');
    const [isTypingFinished, setIsTypingFinished] = useState(false);
    const [isTypingActive, setIsTypingActive] = useState(false);
    const [showRevealContent, setShowRevealContent] = useState(false);
    const [isImageWrapperVisible, setIsImageWrapperVisible] = useState(false);
    const [isTextAreaVisible, setIsTextAreaVisible] = useState(false);
    const typingAudioRef = useRef(null);
    const pageDisplayRef = useRef(null);

    useEffect(() => {
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
    }, [storyData, animationClass]);

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
    }, [startTyping, isTextAreaVisible, storyData, isTypingFinished]);

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

    if (!storyData) {
        return null;
    }

    const { id, title, text, image, isPrologue, reveal } = storyData;

    const handleRevealClick = () => {
        setShowRevealContent(prev => !prev);
    };

    const handleNavigationClick = () => {
        if (isTypingActive) {
            setDisplayedText(text || '');
            setIsTypingFinished(true);
            setIsTypingActive(false);
        } else {
            onNext();
        }
    };

    const showPrimaryStartButton = (isPrologue || storyData?.isFirstStoryWithMusicButton) && onTriggerStartFlow;

    return (
        <div ref={pageDisplayRef} className={`${styles.storyPageContainer} ${animationClass || ''}`}>
            <div className={`${styles.storyContentBox} ${isPrologue ? styles.prologueContentBox : ''}`}>
                {title && (
                    <h1
                        className={styles.storyTitleText}
                        dangerouslySetInnerHTML={{ __html: title }}
                    />
                )}

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
                {text && (
                    <pre className={`${styles.storyTextArea} ${isTextAreaVisible ? styles.storyTextArea_visible : ''}`}>
                        {displayedText}
                    </pre>
                )}
            </div>

            {isTextAreaVisible && (
                <div className={styles.actionButtonsContainer}>
                    {showPrimaryStartButton ? (
                        <button
                            onClick={onTriggerStartFlow}
                            className={`${styles.introActionButton} ${styles.prologueButton} animate__animated animate__pulse animate__infinite`}
                        >
                            {isPrologue ? "เริ่มเรื่องราว..." : "เริ่มเรื่องราวและเปิดเพลง"}
                        </button>
                    ) : (
                        <>
                            {!reveal && (
                                <button onClick={handleNavigationClick} className={`${styles.introActionButton} ${styles.storyNavBtn}`}>
                                    {isLastStory ? 'จบการผจญภัย!' : 'ถัดไป →'}
                                </button>
                            )}
                            {reveal && (
                                <div className={styles.revealSectionWrapper}>
                                    <button
                                        onClick={handleRevealClick}
                                        className={`${styles.revealBtn} ${showRevealContent ? styles.revealBtn_active : ''}`}
                                    >
                                        <span>{reveal.buttonTextPart1 || "ข้อความพิเศษ"}</span>
                                        <span className={styles.revealBtnIcon}>💌</span>
                                    </button>
                                    {reveal.content && (
                                        <div className={`${styles.secretContentDiv} ${showRevealContent ? styles.secretContentDiv_visible : ''}`}>
                                            <div dangerouslySetInnerHTML={{ __html: reveal.content }} />
                                        </div>
                                    )}
                                    {showRevealContent && (
                                        <button onClick={handleNavigationClick} className={`${styles.introActionButton} ${styles.storyNavBtn}`}>
                                            {isLastStory ? 'จบการผจญภัย!' : 'ถัดไป →'}
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
