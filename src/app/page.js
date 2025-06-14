// app/page.js
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

// Import Child Components (ตรวจสอบ path ให้ถูกต้อง)
import QuizGate from './components/QuizGate';
import StoryFlow from './components/StoryFlow';
import GiftBoxDisplay from './components/GiftBoxDisplay';
import BirthdayCardDisplay from './components/BirthdayCardDisplay';

// --- DATA CONSTANTS ---
const FRIEND_NAME = "หยก";
const YOUR_NAME = "ริเวอร์";

// <<<< ตรวจสอบ Path และชื่อไฟล์เพลงให้ถูกต้อง (รวม .mp3) >>>>
const PRE_QUIZ_AND_QUIZ_SONG = "/audio/open.mp3";
const INTRO_STORY_SONG = "/audio/sao.mp3";
const GIFT_SONG = "/audio/song2.mp3"; // เพลง/เสียงตอนเปิดกล่อง
const CARD_SONG = "/audio/song3.mp3"; // เพลงสำหรับการ์ด

const storyContentsData = [
    {
        id: 'story-prologue-start',
        title: "บทแรกของ<br>ความทรงจำ",
        text: `พร้อมหรือยัง...
ที่จะออกเดินทางกลับไปยัง
วันเก่า ๆ  
วันที่หัวใจเรายังอบอุ่น
ไปด้วยรอยยิ้ม  
ถ้าพร้อมแล้ว... 
กดปุ่มย้อนวันเวลา
สู่ความทรงจำกัน :)`,
        isPrologue: true,
        hasMusicButton: true,
        reveal: null

    },
    {
        id: 'story-1',
        title: "จุดเริ่มต้นของเรา",
        text: ` ถึงหยกที่น่ารัก
ย้อนกลับไปเมื่อ 2 ปีที่แล้ว 
ตอนที่เราเป็นเด็กปี 1 ใหม่ๆ 
ช่วงนั้นเป็นเฟรชชี่ 
เราตื่นเต้นมากๆ
ที่จะได้รู้จักคนใหม่ๆ 
`,
        reveal: null
    },
    {
        id: 'story-1.1',
        title: "...",
        text: `  
เราเมื่อได้มาใช้ชีวิต
คนเดียวจริงๆเเล้ว
ก็ค่อนข้างยากท้าทาย
เดินไปเดินมาในมอ 
ก็ไปเจอยิมเข้าเเล้ว
ก็พึ่งรู้ว่าที่นี่มี
สนามเเบดอยู่ตรงนี้`,
        reveal: null
    },
    {
        id: 'story-1.2',
        title: "...",
        text: `  
เราได้รู้จักผู้คนเยอะขึ้นมากๆ
จากสนามเเบด 
จนวันนึงเราก็ไปเล่นเเบด
ไปขอพี่ๆที่นั่นเล่นด้วย
ตามปกติ`,
        reveal: null
    },
    {
        id: 'story-1.3',
        title: "...",
        text: `  
ถ้าจำไม่ผิดวันนั้นเเก๊งค์เภสัช
มาเล่นเเบดที่มอ
ไนซ์มาขอ IG 
ริเวอร์ก็ได้
รู้จักกับหยกเเละเเก๊งค์เภสัช
นับตั้งเเต่นั้นมา
`,
        reveal: null
    },
    {
        id: 'story-1.4',
        title: "...",
        text: `  
ช่วงนั้นคณะเรามีการเล่น
"พี่รหัสน้องรหัส"
ของสาขา`,
        reveal: null
    },
    {
        id: 'story-1.5',
        title: "...",
        text: `  
ริเวอร์ทักหยกไปว่าใช่พี่รหัสมั้ย
ครับ ใจคิดว่าใช่เเน่ๆ
ด้วยความโก๊ะๆ เเละ 
มั่นใจว่าคนนี้นี่เเหละ พี่รหัสฉัน
เเต่หน้าเเตก คำตอบคือทั้งไม่ใช่
เเล้วก็อยู่คนละคณะกันอีก55555`,
        reveal: null
    },
    {
        id: 'story-1.6',
        title: "...",
        text: `
        คนละขั้วเลย เเล้วก็ได้คุย
        กันแบบ งงๆ
        เเละนี่ก็เป็นบทสนทนาเเรก  
ของพวกเราที่เราได้คุยกัน`,
        reveal: null
    },
    {
        id: 'story-1.7',
        title: "...",
        text: `  
ต่อมาเมื่อเราได้รู้จักกันมากขึ้น
ได้ไปข้างนอกกันชวนไปฟิวเจอร์
เปิดโลกมากๆที่ได้มีเพื่อนชวนไป
ข้างนอกโดยไม่ได้ร้องขอ
`,
        reveal: null
    },
    {
        id: 'story-1.8',
        title: "...",
        text: `  
วันนั้นเป็นวันที่เราดีใจมากๆ
ทำตัวไม่ถูกไม่เคยไปกับ
เพื่อนกลุ่มใหญ่ๆ
ปกติไปคนเดียวตลอด
เป็นความรู้สึกที่อธิบาย
เป็นคำพูดไม่ถูก`,
        reveal: null
    },
    
    {
        id: 'story-1.81',
        title: "...",
        image: "/picture/pic5.jpg",
        reveal: null
    },
    {
        id: 'story-1.9',
        title: " วันเกิด",
        text: `
        1 สิงหาคม 2023
        เราก็ไม่รู้ด้วยว่า
        เป็นวันเกิดหยก
        วันนั้นมีกิจกรรมหลายอย่างเลย
        ที่คนขี้อายไม่กล้าทำ`,
        reveal: null
    },
    {
        id: 'story-1.99',
        title: "...",
        image: "/picture/habor.jpg",
        text: `เกือบจะได้เล่นฮาเบอร์เเลนด์
        เเต่อายุเกิน 555555  `,
        reveal: null
    },
    {
        id: 'story-2.1',
        title: "...",
        image: "/picture/takepic1.jpg",
        text: `เเล้วเราก็มาถ่ายรูปกัน
        เขินมากๆเเต่เรา
        ว่าเป็นประสบการณ์ที่ดี
        มากๆเลยนะ
        ตั้งเเต่ตอนนั้นถึงตอนนี้
        ก็ไม่เคยได้ไปอีกเลย  `,
        reveal: null
    },
    {
        id: 'story-2.11',
        title: "...",
        image: "/picture/takepic2.jpg",
        reveal: null
    },

    {
        id: 'story-2.2',
        image: "/picture/pic4.jpg",
        title: "...",
        text: `รูปคู่รูปเเรกเลยที่มีในเครื่อง`,
        reveal: null
    },
    {
        id: 'story-2.3',
        title: "...",
        text: ` วันเกิดหยกเลี้ยง ไอติม `,
        reveal: null
    },
    {
        id: 'story-2.31',
        image: "/picture/icecream1.jpg",
        title: "...",
        text: `มายก็อดดด`,
        reveal: null
    },
    {
        id: 'story-2.4',
        image: "/picture/icecream2.jpg",
        title: "...",
        text: `เกรงใจสุดๆ
        ขอบคุณมากนะ
        ไม่เคยมีคนเลี้ยงเลย
        ทำตัวไม่ถูก55555`,
        reveal: null
    },
    {
        id: 'story-2.5',
        title: "...",
        text: `เกรงใจมากๆ `,
        reveal: null
    },
    {
        id: 'story-2.6',
        title: "...",
        text: `เป็นวันที่ได้ออกจากเซฟโซน
        ได้ทำอะไรหลายๆอย่างเลย
        ที่ไม่เคยทำมาก่อน  `,
        reveal: null
    },
    {
        id: 'story-3',
        title: "Concert",
        text: `ตอนนั้นเรายังเรียนปี 1 เหมือนกัน
มีเวลาว่าง
หยกพาไปงานเพลงที่ 
Central World 
"Melody of life"
ไปดู PUN 
`,
        reveal: null
    },
    
    {
        id: 'story-3.1',
        title: "...",
        text: `เเต่ตอนที่เราไปปันยังไม่ขึ้น
        มีศิลปินวงอื่นเเสดงอยู่ 
        ทำให้เราได้รู้จักวงอื่นๆเพิ่ม  `,
        
    },

    {
        id: 'story-3.11',
        title: "...",
        text: `เป็นโอกาสที่ดีมากๆ
        ได้รู้จักกับวงอินดี้ อื่นๆ
        ซึ่งเราชอบฟังเพลงอยู่เเล้ว
        ได้รู้จักกับวง cornboi  `,
         extraMusic: "/audio/cornboi_song.mp3"
    }, 
    {
        id: 'story-3.12',
        image: "/picture/pun1.1.jpg",
        title: "...",
        text: `ระหว่างรอดูPUNก็มานั่งข้างใน
        กันก่อนข้างนอกร้อนมาก`,
        reveal: null
    },
 {
        id: 'story-3.3',
        image: "/picture/pun1.jpg",
        title: "...",
        text: `คนเยอะมากกก`,
        reveal: null
    },

    {
        id: 'story-3.4',
        image: "/picture/pun1.3.jpg",
        title: "...",
        text: `มีความสุขมากๆ 
        เจอปันเล้ว เย่ๆ`,
        reveal: null
    },
    
     {
        id: 'story-3.5',
        title: "...",
        image: "/picture/pun2.jpg",
        text: ` 
หลังจากจบ ปัน
เราก็ออกมาที่นั่นร้อนมาก
เเต่สนุกสุดๆ 
พาเราไปหาของกินต่อ`,
  reveal: null
    },
     {
        id: 'story-3.6',
        title: "...",
        image: "/picture/pun3.jpg",
  reveal: null
    },
     {
        id: 'story-3.7',
        title: "...",
        image: "/picture/pun4.jpg",
        text: ` 
วันนั้นได้เจอเพื่อนเก่าหยก,ไนท์ด้วย
เสียดายเรามีรูปเยอะมากเเต่
อัพลงเเฟลชไดฟ์
ไฟล์เสียเยอะมาก
เหลือที่ใช้ได้นิดเดียวเอง`,
  reveal: null
    },
     {
        id: 'story-3.71',
        title: "...",
        image: "/picture/pun4.jpg",
        reveal: null
    },
     {
        id: 'story-3.72',
        title: "...",
        text: ` 
พอจบเราก็นั่งรถไฟกลับ
ตอนมารู้สึกนานมากๆ
ตอนกลับรู้สึกเร็วมากๆ`,
  reveal: null
    },
     {
        id: 'story-3.81',
        title: "...",
        image: "/picture/pic2.jpg",
        text: ` เป็นการเล่าเรื่องส่วนตัว
        ของกันเเละกัน
        น่าจะเป็น Deeptalk เเรกๆเลย
        คุยสนุกมากๆเวลาผ่านไปเร็วมาก
        อยากจะคุยต่อเเต่
        ก็ถึงสถานีซะเเล้ว
`,
  reveal: null
    },
     {
        id: 'story-3.8',
        title: "...",
        text: ` 
เราชอบมากเเบบนี้ไม่รู้ว่าหยกเปิดใจ
ขนาดไหนเเต่ก็กล้าที่จะเล่า
ให้ฟังอันนี้ขอบคุณมากๆ
หาคนคุยเรื่องลึกๆไม่ค่อยได้
หยกเป็นคนเเรกเลยในรังสิต`,
  reveal: null
    },
    {
        id: 'story-3.82',
        title: "ปีสอง",
        image: "/picture/pic2.jpg",
        text: `  แล้วพอขึ้นปี 2 เราก็เริ่มไม่ค่อยได้เจอกัน
เราเรียนวิทย์คอม ส่วนหยกเรียนเภสัช`,
  reveal: null
    },
  {
        id: 'story-3.9',
        title: "...",
        text: ` 
ต่างคนก็ต่างมีเส้นทางของตัวเอง
มีการบ้าน มีสอบ มีภาระ
มีความยุ่งวุ่นวายของแต่ละคณะ`,
  reveal: null
    },
    {
        id: 'story-4',
        title: "...",
     
        text: `  เภสัชเรียนหนักมากจริงๆ
        ชีวิตเปิดเทอมมีเเต่อ่านสอบ
เเต่ริเวอร์เชื่อนะว่าความพยายาม
มันจะไม่สูญเปล่าเเน่นอน`,

        reveal: null
    },   {
        id: 'story-4.1',
        title: "...",
        text: ` 
เราไม่ได้เจอกันบ่อยเหมือนเดิม
ไม่ได้เจอตัวกันเหมือนเดิมเนอะ`,
reveal: null
    },
    {
        id: 'story-4.2',
        title: "...",
        text: ` 
ริเวอร์เลยอยากส่ง
ผ่านเป็นความทรงจำเเทน
คิดว่ามันเป็นสิ่งที่มีค่ามากๆ
สำหรับเรา`,
reveal: null
    },
    {
        id: 'story-5',
        title: "...",
        text: ` 
อยากให้เป็นของขวัญวันเกิดที่พิเศษ
ที่ไม่มีใครเคยทำให้มาก่อน
เราตั้งใจทำสุดๆ
หวังว่าจะชอบนะ`,
  reveal: null
    },

    {
        id: 'story-6',
        title: "<3",
        text: `  และในวันพิเศษของหยกวันนี้...
เราอยากจะบอกว่าขอบคุณมากๆ 
ขอบคุณสำหรับทุกเสียงหัวเราะ
ทุกๆความทรงจำ
และทุกช่วงเวลาที่เราได้ใช้ด้วยกัน`,
        reveal: null
    },
    {
        id: 'story-7',
        title: "...",

        text: `
ริเวอร์ตามหยกอยู่ใน ig ตลอดๆ 
`,
        reveal: null
    },
    {
        id: 'story-7.1',
        title: "...",
        text: ` 
ไปเที่ยว หรือว่ามีอะไร ถ่ายสตอรี่ลง
เเบ่งมาดูบ้าง เเบ่งเพลงมาบ้าง
55555 เห็นคนอื่นเวลาไปเที่ยว
เเล้วดูน่าสนุกสุดๆ
`,reveal: null

    },
    {
        id: 'story-8',
        title: "สุดท้าย",
        text: `  หยกก็ยังเป็นหยกคนเดิมนั่นเเหละ
        ไว้ว่างๆมานั่งคุยกันเเชร์เรื่องราว
        ช่วงชีวิตที่ผ่านมากันนะ `,
        reveal: {
            buttonTextPart1: "ข้อความพิเศษ...",
            buttonText: "ข้อความพิเศษจากใจ... 💝",
            content: "<p style='text-align: center; font-size: 1.1em; color: #ff6b9d;'><br>ขอบคุณทุกความทรงจำดีๆ<br>ขอบคุณมากๆที่เราได้รู้จักกัน<br><br>ขอบคุณจากหัวใจ</p>"
        }
    }
];

const quizQuestionText = `${FRIEND_NAME}ที่ฉันรู้จักเรียน คณะอะไร?`;
const quizOptionsData = [
    { text: "ก. คณะหมูกรอบ", value: "คณะหมูกรอบ" },
    { text: "ข. คณะรักษาความสงบแห่งชาติ", value: "คณะรักษาความสงบแห่งชาติ" },
    { text: "ค. คณะตลก", value: "คณะตลก" },
    { text: "ง. คณะเภสัชศาสตร์", value: "คณะเภสัชศาสตร์" }
];
const quizCorrectAnswerValue = "คณะเภสัชศาสตร์";
const WISH_TEXT = `ขอให้วันเกิดหยกปีนี้<br>
เต็มไปด้วยความสุข รอยยิ้ม <br>
และเสียงหัวเราะนะ<br>
สุขภาพแข็งแรง คิดอะไรก็สมหวัง<br>
ขอให้เจอแต่สิ่งดีๆ คนดีๆ  <br>
โอกาสดีๆ ในทุกๆวันของชีวิต<br>
ถ้าเจอเรื่องแย่ๆ <br>
ก็ขอให้ผ่านไปไวๆ <br>
เหมือนตอนไปเที่ยวนะ5555<br> 
อย่าลืมดูแลตัวเองด้วย :)<br>
รักเสมอ❤️`;


// --- END DATA CONSTANTS ---

export default function BirthdayPage() {
    const [currentStage, setCurrentStage] = useState('preQuiz'); // หรือ 'quiz' ถ้าไม่ใช้ preQuiz
    const [giftPageTimeoutId, setGiftPageTimeoutId] = useState(null);
    const [isGiftClicked, setIsGiftClicked] = useState(false);
    const [isGiftBoxOpeningProcess, setIsGiftBoxOpeningProcess] = useState(false);


    const audioRef = useRef(null);
    const router = useRouter();

    const clearGiftTimeout = useCallback(() => {
        if (giftPageTimeoutId) {
            clearTimeout(giftPageTimeoutId);
            setGiftPageTimeoutId(null);
        }
    }, [giftPageTimeoutId]);

    const playMusic = useCallback((newSrc, volume = 0.7, loop = true) => {
        if (audioRef.current) {
            const currentAudioSrcPath = audioRef.current.src ? audioRef.current.src.replace(window.location.origin, '') : null;
            if (currentAudioSrcPath !== newSrc || audioRef.current.paused) {
                console.log(`Audio: Setting src to ${newSrc} and attempting to play (loop: ${loop}).`);
                audioRef.current.src = newSrc;
                audioRef.current.loop = loop;
                audioRef.current.load();
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        audioRef.current.volume = volume;
                        console.log(`Audio: Now playing ${newSrc}`);
                    }).catch(error => {
                        console.warn(`Audio: Autoplay prevented for ${newSrc}:`, error);
                    });
                }
            } else if (currentAudioSrcPath === newSrc) {
                audioRef.current.volume = volume; // Adjust volume if same song is playing
                console.log(`Audio: Adjusted volume for already playing ${newSrc}`);
            }
        }
    }, []);

    const pauseMusic = useCallback(() => {
        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
            console.log(`Audio: Paused ${audioRef.current.src}`);
        }
    }, []);

    useEffect(() => {
        console.log("Stage changed to:", currentStage);
        // Music management that happens automatically when a stage loads
        // Excludes music triggered by specific interactions like clicking the gift box
        if (currentStage === 'preQuiz' || currentStage === 'quiz') {
            playMusic(PRE_QUIZ_AND_QUIZ_SONG, 0.6, true);
        } else if (currentStage === 'intro') {
            // If Quiz song was playing and it's different from Intro song, pause it.
            // Intro song itself is started by a button click in StoryFlow/Prologue.
            if (audioRef.current &&
                audioRef.current.src.includes(PRE_QUIZ_AND_QUIZ_SONG.substring(1)) &&
                PRE_QUIZ_AND_QUIZ_SONG !== INTRO_STORY_SONG) {
                pauseMusic();
            }
        } else if (currentStage === 'card') {
            // This logic will play CARD_SONG when card stage is entered
            // It assumes any previous song (like GIFT_SONG) should be stopped.
            if (CARD_SONG) {
                // Ensure GIFT_SONG is paused if it was playing and is different
                if (GIFT_SONG && audioRef.current && audioRef.current.src.includes(GIFT_SONG.substring(1)) && GIFT_SONG !== CARD_SONG) {
                    pauseMusic();
                }
                playMusic(CARD_SONG, 0.7, true);
            } else if (GIFT_SONG && audioRef.current && audioRef.current.src.includes(GIFT_SONG.substring(1))) {
                // If no CARD_SONG, but GIFT_SONG was playing, continue it or adjust volume
                if (audioRef.current) audioRef.current.volume = 0.5;
            }
            // (Else, if no card song and no gift song, music might have been paused from 'gift' stage)
        }
        // Note: Music for 'gift' stage is handled differently (on click, or silence after intro)

    }, [currentStage, playMusic, pauseMusic]);


    const handleProceedToQuiz = () => setCurrentStage('quiz');
    const handleQuizCorrect = () => setCurrentStage('intro');
    const handleQuizIncorrect = () => { pauseMusic(); router.push('/imposter'); };

    const handleStartStoryMusic = () => { // Called from StoryFlow (e.g., Prologue button)
        console.log("Request to start INTRO_STORY_SONG from StoryFlow");
        playMusic(INTRO_STORY_SONG, 0.7, true);
    };

    const handleAllStoriesDone = () => { // Called when "ไปดูคำอวยพรกัน!" is clicked
        console.log("All stories done. Pausing current music (Intro song) and going to gift stage.");
        pauseMusic(); // <<<< หยุดเพลง Intro ทันที
        setCurrentStage('gift');
        setIsGiftClicked(false);
        setIsGiftBoxOpeningProcess(false); // Reset this state
        const timerId = setTimeout(() => {
            if (!isGiftClicked && currentStage === 'gift') {
                clearGiftTimeout();
                setCurrentStage('card'); // If time's up, go to card (useEffect for 'card' will handle music)
            }
        }, 10000); // 10 seconds timeout for gift interaction
        setGiftPageTimeoutId(timerId);
    };

    const handleGiftBoxInteractionStart = () => { // Called when gift box is clicked
        clearGiftTimeout();
        setIsGiftClicked(true);
        setIsGiftBoxOpeningProcess(true); // To trigger .opened class in GiftBoxDisplay CSS

        console.log("Gift box clicked. Playing GIFT_SONG (if defined).");
        if (GIFT_SONG) {
            playMusic(GIFT_SONG, 0.6, false); // Play gift opening sound/music (non-looping if it's an effect)
        } else {
            // If no specific gift song, ensure other music is paused.
            // (It should have been paused when entering 'gift' stage if INTRO_STORY_SONG was playing)
        }
    };

    const handleGiftAnimationFinished = () => { // Called after CSS animation of gift box opening
        console.log("GiftBoxDisplay reported opening animation finished.");
        // GIFT_SONG (if short effect) might have finished.
        // If GIFT_SONG is a BGM, it might still be playing.
        // The useEffect for currentStage === 'card' will handle CARD_SONG.

        setTimeout(() => {
            if (isGiftClicked) { // Proceed only if user initiated
                setCurrentStage('card');
            }
        }, 500); // Short delay before transitioning to card, allows GIFT_SONG to finish if very short
    };

    useEffect(() => { // Gift timeout cleanup
        if (currentStage !== 'gift') {
            clearGiftTimeout();
        }
        return clearGiftTimeout;
    }, [currentStage, clearGiftTimeout]);

    let pageContent = null;
    // --- RENDER LOGIC ---
    switch (currentStage) {
        case 'preQuiz':
            pageContent = (
                <div className="page-stage-wrapper pre-quiz-wrapper animate__animated animate__fadeIn">
                    <div className="pre-quiz-content-box animate__animated animate__zoomIn">
                        <h1 className="pre-quiz-title">การเดินทางกำลังจะเริ่ม!</h1>
                        <p className="pre-quiz-text">
                            ก่อนที่เราจะดำดิ่งไป
                            ในความทรงจำ<br />
                            มีบททดสอบเล็กๆน้อยๆรออยู่...
                        </p>
                        <p className="pre-quiz-subtext">
                            (แต่ไม่ต้องคิดมากนะตอบมั่วๆได้ 😉)
                        </p>
                        <button
                            onClick={handleProceedToQuiz}
                            className="pre-quiz-button animate__animated animate__pulse animate__infinite"
                        >
                            เริ่มการทดสอบ! →
                        </button>
                    </div>
                </div>
            );
            break;
        case 'quiz':
            pageContent = (
                <QuizGate
                    question={quizQuestionText}
                    options={quizOptionsData}
                    correctAnswer={quizCorrectAnswerValue}
                    onCorrect={handleQuizCorrect}
                    onIncorrect={handleQuizIncorrect}
                    friendName={FRIEND_NAME}
                    initialAnimation="animate__animated animate__fadeIn"
                />
            );
            break;
        case 'intro':
            pageContent = <StoryFlow
                stories={storyContentsData}
                onAllStoriesDone={handleAllStoriesDone}
                mainSong={INTRO_STORY_SONG} // <<<< ส่ง prop นี้
            />;
            break;
        case 'gift':
            pageContent = (
                <GiftBoxDisplay
                    onGiftClick={handleGiftBoxInteractionStart}
                    onGiftOpened={handleGiftAnimationFinished}
                    initialAnimation="animate__animated animate__fadeIn"
                    // Pass isOpening prop if GiftBoxDisplay needs to trigger CSS animation via class
                    isOpening={isGiftBoxOpeningProcess}
                />
            );
            break;
        case 'card':
            pageContent = (
                <BirthdayCardDisplay
                    friendName={FRIEND_NAME}
                    yourName={YOUR_NAME}
                    wishText={WISH_TEXT}
                    animationClass="animate__animated animate__fadeIn"
                    cardSpecificAnimation="animate__animated animate__jackInTheBox"
                />
            );
            break;
        default:
            pageContent = <div>Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>สุขสันต์วันเกิดนะหยก!</title>
                <meta name="description" content={`เว็บอวยพรวันเกิดสุดพิเศษสำหรับ ${FRIEND_NAME}`} />
            </Head>
            <audio ref={audioRef} preload="auto" /> {/* loop is now controlled by playMusic */}
            {pageContent}
        </>
    );
}