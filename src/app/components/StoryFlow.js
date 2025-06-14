// app/components/StoryFlow.js
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import StoryPageDisplay from './StoryPageDisplay';
import styles from './StoryFlow.module.css';

// เพลงหลัก - ย้ายไปเป็น prop เพื่อความยืดหยุ่น หรือจะคงไว้ที่นี่ก็ได้
// const INTRO_STORY_SONG = "/audio/song1.mp3";

export default function StoryFlow({
    stories,
    onAllStoriesDone,
    mainSong, // รับ path เพลงหลักมาจาก page.js เพื่อความยืดหยุ่น
    initialAnimationClass
}) {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [startTyping, setStartTyping] = useState(false);
    const [previousStoryIndex, setPreviousStoryIndex] = useState(-1);
    const storyFlowWrapperRef = useRef(null);

    const currentStoryData = stories[currentStoryIndex];
    const isPrologue = currentStoryData?.isPrologue === true;

    const mainAudioRef = useRef(null);
    const extraAudioRef = useRef(null); // Ref สำหรับเพลงเสริม

    // ===== MUSIC CONTROLS =====
    const playMainMusic = () => {
        if (mainAudioRef.current) {
            mainAudioRef.current.volume = 1;
            mainAudioRef.current.play().catch(() => {});
        }
    };
    
    // [START] ADD: ฟังก์ชันจัดการเพลงเสริม
    const manageExtraMusic = useCallback(() => {
       const musicSrc = currentStoryData.extraMusic;

        // หยุดเพลงเสริมเก่า (ถ้ามี) และคืนเสียงเพลงหลัก
        if (extraAudioRef.current) {
            extraAudioRef.current.pause();
            extraAudioRef.current.onended = null;
            extraAudioRef.current = null;
        }
        if (mainAudioRef.current) mainAudioRef.current.volume = 1;

        // ถ้า story ปัจจุบันมี extraMusic ให้เล่น
        if (musicSrc) {
             if (mainAudioRef.current) mainAudioRef.current.volume = 0.2; // ลดเสียงเพลงหลัก
             extraAudioRef.current = new Audio(musicSrc);
             extraAudioRef.current.play().catch(() => {});
             
             // เมื่อเพลงเสริมเล่นจบ ให้เสียงเพลงหลักกลับมาดังเท่าเดิม
             extraAudioRef.current.onended = () => {
                if (mainAudioRef.current) mainAudioRef.current.volume = 1;
             };
        }
    }, [currentStoryData]);
    // [END] ADD

    // ===== NEXT STORY HANDLER =====
    const handleNext = () => {
        setStartTyping(false);
        setPreviousStoryIndex(currentStoryIndex);

        if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
        } else if (onAllStoriesDone) {
            // หยุดเพลงทั้งหมดก่อนออกจาก StoryFlow
            if (mainAudioRef.current) mainAudioRef.current.pause();
            if (extraAudioRef.current) extraAudioRef.current.pause();
            onAllStoriesDone();
        }
    };

    const handleTriggerStart = () => {
        playMainMusic(); // เริ่มเพลงหลัก
        // ไม่ต้องเช็ค isPrologue ที่นี่แล้ว เพราะปุ่มนี้จะพาไปหน้าถัดไปเสมอ
        handleNext();
    };

    // ===== ANIMATION CLASS =====
    let storyPageDisplayAnimation = 'animate__animated animate__fast ';
    if (currentStoryIndex === 0 && isPrologue) {
        storyPageDisplayAnimation += 'animate__fadeIn';
    } else if (currentStoryIndex > previousStoryIndex) {
        storyPageDisplayAnimation += 'animate__fadeInRight';
    } else if (currentStoryIndex < previousStoryIndex) {
        storyPageDisplayAnimation += 'animate__fadeInLeft';
    } else {
        storyPageDisplayAnimation += (currentStoryIndex === 0 ? 'animate__zoomIn' : 'animate__fadeIn');
    }

    // ===== EFFECTS =====
    useEffect(() => {
        // จัดการเรื่องการพิมพ์และเพลงเมื่อ story เปลี่ยน
        const typingTimer = setTimeout(() => {
            setStartTyping(true);
        }, 500); // หน่วงเวลาให้เข้ากับ animation

        manageExtraMusic();

        return () => clearTimeout(typingTimer);
    }, [currentStoryIndex, manageExtraMusic]);


    if (!currentStoryData) {
        return <div>Loading stories...</div>;
    }

    return (
        <div ref={storyFlowWrapperRef} className={`${styles.storyFlowWrapper} ${initialAnimationClass || ''}`}>
            <StoryPageDisplay
                key={currentStoryData.id}
                storyData={currentStoryData}
                startTyping={startTyping}
                onTriggerStartFlow={handleTriggerStart}
                onNext={handleNext}
                isLastStory={currentStoryIndex === stories.length - 1}
                isFirstStory={currentStoryIndex === 0 && !isPrologue} // ส่ง prop นี้เพื่อให้ priority ของรูปภาพทำงานถูกต้อง
                animationClass={storyPageDisplayAnimation}
            />

            {/* เพลงหลัก: ไม่ต้อง autoPlay แล้ว เราจะควบคุมเอง */}
            <audio ref={mainAudioRef} src={mainSong} loop preload="auto" />
        </div>
    );
}