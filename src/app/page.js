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
const PRE_QUIZ_AND_QUIZ_SONG = "/audio/song0.mp3";
const INTRO_STORY_SONG = "/audio/song1.mp3";
const GIFT_SONG = "/audio/song2.mp3"; // เพลง/เสียงตอนเปิดกล่อง
const CARD_SONG = "/audio/song3.mp3"; // เพลงสำหรับการ์ด

const storyContentsData = [
    {
        id: 'story-prologue-start',
        title: "การเดินทางแห่งความทรงจำกำลังจะเริ่มต้น",
        image: null,
        text: `เอาล่ะ!
        เรื่องราวความทรงจำ
        ระหว่างเรากำลังจะเริ่มต้นขึ้น
        เตรียมตัวให้พร้อม 
        แล้วกดปุ่มเพื่อย้อนวันวานกันเลย!`,
        isPrologue: true,
        hasMusicButton: true, // Prologue จะมีปุ่มเริ่มเพลง Intro
        reveal: null
    },
    {
        id: 'story-1',
        title: "จุดเริ่มต้นของเรา",
       
        text: `  ถึงหยกที่น่ารัก
ย้อนกลับไปเมื่อ 2 ปีที่แล้ว 
ตอนที่เราเป็นเด็กปี 1 ใหม่ๆ 
ช่วงนั้นเป็นเฟรชชี่ เราตื่นเต้นมากๆ
ที่จะได้รู้จักคนใหม่ๆในต่างจังหวัด
`,
        reveal: null
    },
        {
        id: 'story-1.1',
        title: "...",
        text: `  
เราเมื่อได้ลองมาใช้ชีวิต
ก็หาที่ออกกำลังกาย
เดินไปเดินมาในมอ ก็ไปเจอยิมเข้า
เเล้วก็พึ่งรู้ว่าที่นี่มีสนามเเบดอยู่ตรงนี้`,
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
ถ้าจำไม่ผิดวันนั้นเเก๊งค์เภสัชมาเล่นเเบด
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
ริเวอร์ทักหยกไปว่าใช่พี่รหัสมั้ยครับ
ด้วยความโก๊ะๆ เเละ มั่นใจว่าคนนี้นี่เเหละ
เเต่หน้าเเตก คำตอบคือทั้งไม่ใช่
เเล้วก็อยู่ต่างคณะกันอีก55555`,
        reveal: null
    },
     {
        id: 'story-1.6',
        title: "...",
        text: `
        เเละนี่ก็เป็นบทสนทนาเเรก  
ของพวกเราที่เราได้คุยกัน`,
        reveal: null
    },
     {
        id: 'story-1.7',
        title: "...",
        text: `  
ต่อมาเมื่อเราได้รู้จักกันมากขึ้นได้ไป
ข้างนอกกันชวนไปฟิวเจอร์
โคตรเปิดโลกมากๆที่ได้มีเพื่อนชวนไป
ข้างนอกโดยไม่ได้ร้องขอ
`,
        reveal: null
    },
     {
        id: 'story-1.8',
        title: "...",
        text: `  
เป็นเพื่อนกลุ่มเเรกที่ชวนออกไปข้างนอก
วันนั้นเป็นวันที่เราดีใจมากๆ
เป็นความรู้สึกที่อธิบายเป็นคำพูดไม่ถูก`,
        reveal: null
    },
     {
        id: 'story-1.9',
        title: "...",
        text: `
        1 สิงหาคม 
        ไอเราก็ไม่รู้ด้วยว่าเป็นวันเกิดหยก
        วันนั้นมีกิจกรรมหลายอย่างเลย
        ที่คนขี้อายไม่กล้าทำ`,
        reveal: null
    },
     {
        id: 'story-2',
        title: "...",
        image: "/picture/habor.jpg",
        text: `เกือบได้เล่นฮาเบอร์เเลนด์
        เเต่อายุเกิน  `,
        reveal: null
    },
    {
        id: 'story-2.1',
        title: "...",
        image: "/picture/takepic1.jpg",
        text: `เเล้วเราก็มาถ่ายรูปกัน
        เขินมากๆเเต่เราต้องเก็บทรง5555  `,
        reveal: null
    },
    
     {
        id: 'story-2.2',
        image: "/picture/pic4.jpg",
        title: "...",
        text: `  `,
        reveal: null
    },
    {
        id: 'story-1',
        title: "วันเวลาที่ผ่านมา",
        image: "/picture/pic1.jpg", 
        text: `  ตอนนั้นเรายังเรียนปี 1 เหมือนกัน
มีเวลาว่างให้ไปเล่นแบด ไปกินข้าวด้วยกัน
ได้มีโอกาสที่หยกพาไปงานเพลงที่ Central World ไปดู PUN
มันน่าตื่นตาตื่นใจมากๆสำหรับเราได้ใช้ชีวิตในกรุงเทพจริงๆ
ช่วงเวลาเหล่านั้นเป็นช่วงเวลาที่ดีจริงๆ `,
        reveal: null
    },
    {
        id: 'story-2',
        title: "เมื่อเราต้องเดินไปตามทางของตัวเอง",
        image: "/picture/pic2.jpg",
        text: `  แล้วพอขึ้นปี 2 เราก็เริ่มไม่ค่อยได้เจอกัน
เราเรียนวิทย์คอม ส่วนหยกเรียนเภสัช
ต่างคนก็ต่างมีเส้นทางของตัวเอง
มีการบ้าน มีสอบ มีความยุ่งวุ่นวายของแต่ละสาขา

แม้เราจะไม่ได้เจอกันบ่อยเหมือนเดิม
แต่ทุกครั้งที่ได้เจอกัน มันยังคงเป็นช่วงเวลาที่อบอุ่นเหมือนเดิม`,
       
    },
    {
        id: 'story-2b',
        title: "...",
        image: "/picture/pic3.jpg",
        text: `  เภสัชเรียนหนักจริงๆ ส่วนวิทย์คอมก็มีโค้ดให้เขียนไม่รู้จบ
แต่ ทุกครั้งที่เราได้คุยกัน ไม่ว่าจะเดินผ่านกัน
หรือมีโอกาสที่เพื่อนชวนไปตีเเบดเเล้วได้เจอกัน
มันทำให้รู้สึกว่าเรายังสนิทเหมือนเดิมเลย`,
        
        reveal: null
    },
    {
        id: 'story-3',
        title: "ขอบคุณสำหรับทุกอย่าง",
        image: "/picture/pic3.jpg",
        text: `  และในวันพิเศษของหยกวันนี้...
เราอยากจะบอกว่าขอบคุณมากๆ 
ขอบคุณสำหรับทุกเสียงหัวเราะ ทุกความทรงจำ
และทุกช่วงเวลาที่เราได้ใช้ด้วยกัน

ถึงแม้เราจะไม่ได้เจอกันบ่อยเหมือนเดิม
แต่อยากให้หยกรู้ว่า... เรายังคิดถึงเสมอ 💙`,
        reveal: null
    },
    {
        id: 'story-4',
        title: "...",
        image: null,
        text: `  ถึงนานๆ ทีเราถึงจะได้เจอกัน
แต่ทุกครั้งที่เจอ มันยังคงเป็นหยกคนเดิมที่พึ่งพาเเละไว้ใจได้เสมอ`,
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
const WISH_TEXT = `ขอให้วันเกิดปีนี้เป็นวันที่พิเศษสุดๆ<br>
เต็มไปด้วยความสุข รอยยิ้ม และเสียงหัวเราะนะ<br>
สุขภาพแข็งแรง คิดอะไรก็สมหวัง<br>
ขอให้เจอแต่สิ่งดีๆ คนดีๆ โอกาสดีๆ <br>
ในทุกๆวันของชีวิต<br>
ถ้าเจอเรื่องแย่ๆ <br>
ก็ขอให้ผ่านไปไวๆเหมือนตอนไปเที่ยวนะ5555<br>
ขอบคุณที่อยู่ข้างตลอดไม่หายไปไหน <br>
อย่าลืมดูแลตัวเองด้วยนะ :)<br>
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
                if(audioRef.current) audioRef.current.volume = 0.5;
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
                            ในความทรงจำ<br/>
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
            pageContent = (
                <StoryFlow
                    stories={storyContentsData}
                    onStartMusic={handleStartStoryMusic}
                    onAllStoriesDone={handleAllStoriesDone}
                    initialAnimationClass="animate__animated animate__fadeIn"
                />
            );
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