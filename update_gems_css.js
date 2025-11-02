// Universal CSS update for all gem files
const gemFiles = [
    'strategy-architect-gem.html',
    'plan-generator-gem.html', 
    'operations-architect-gem.html',
    'fit-analyst-gem.html',
    'value-proposition-gem.html'
];

const universalCSS = `        /* Gemini Interactive Header */
        .gemini-header {
            position: relative;
            padding: 4rem 0;
            overflow: hidden;
            background: transparent;
        }

        .gemini-constellation {
            position: relative;
            display: inline-block;
            margin-bottom: 2rem;
        }

        .gemini-diamond {
            font-size: 4rem;
            position: relative;
            z-index: 10;
            animation: gentle-pulse 3s ease-in-out infinite;
        }

        /* Constellation dots around diamond */
        .constellation-dot {
            position: absolute;
            width: 4px;
            height: 4px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            opacity: 0.7;
            animation: twinkle 2s ease-in-out infinite;
        }

        .constellation-dot:nth-child(2) {
            top: -20px;
            left: -30px;
            animation-delay: 0.2s;
        }

        .constellation-dot:nth-child(3) {
            top: -15px;
            right: -25px;
            animation-delay: 0.4s;
        }

        .constellation-dot:nth-child(4) {
            bottom: -20px;
            left: -20px;
            animation-delay: 0.6s;
        }

        .constellation-dot:nth-child(5) {
            bottom: -15px;
            right: -30px;
            animation-delay: 0.8s;
        }

        .constellation-dot:nth-child(6) {
            top: 10px;
            left: -40px;
            animation-delay: 1s;
        }

        .constellation-dot:nth-child(7) {
            top: 15px;
            right: -35px;
            animation-delay: 1.2s;
        }

        /* Connecting lines */
        .constellation-line {
            position: absolute;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent);
            animation: line-pulse 3s ease-in-out infinite;
        }

        .line-1 {
            top: -10px;
            left: -25px;
            width: 50px;
            transform: rotate(25deg);
            animation-delay: 0.5s;
        }

        .line-2 {
            bottom: -10px;
            right: -25px;
            width: 45px;
            transform: rotate(-30deg);
            animation-delay: 1s;
        }

        .line-3 {
            top: 20px;
            left: -35px;
            width: 40px;
            transform: rotate(60deg);
            animation-delay: 1.5s;
        }

        /* Floating particles */
        .floating-particle {
            position: absolute;
            font-size: 1rem;
            opacity: 0.6;
            animation: float 6s ease-in-out infinite;
            pointer-events: none;
        }

        .particle-1 {
            top: 20%;
            left: 10%;
            animation-delay: 0s;
        }

        .particle-2 {
            top: 30%;
            right: 15%;
            animation-delay: 1s;
        }

        .particle-3 {
            bottom: 40%;
            left: 20%;
            animation-delay: 2s;
        }

        .particle-4 {
            bottom: 20%;
            right: 25%;
            animation-delay: 3s;
        }

        .particle-5 {
            top: 60%;
            left: 5%;
            animation-delay: 4s;
        }

        .particle-6 {
            top: 15%;
            right: 8%;
            animation-delay: 5s;
        }

        /* Animations */
        @keyframes gentle-pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }

        @keyframes twinkle {
            0%, 100% {
                opacity: 0.3;
                transform: scale(1);
            }
            50% {
                opacity: 1;
                transform: scale(1.2);
            }
        }

        @keyframes line-pulse {
            0%, 100% {
                opacity: 0.2;
            }
            50% {
                opacity: 0.6;
            }
        }

        @keyframes float {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.6;
            }
            25% {
                transform: translateY(-10px) rotate(90deg);
                opacity: 0.8;
            }
            50% {
                transform: translateY(-5px) rotate(180deg);
                opacity: 0.4;
            }
            75% {
                transform: translateY(-15px) rotate(270deg);
                opacity: 0.9;
            }
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .gemini-diamond {
                font-size: 3rem;
            }

            .constellation-dot {
                width: 3px;
                height: 3px;
            }

            .floating-particle {
                font-size: 0.8rem;
            }
            
            .content-section {
                padding: 1.5rem;
            }
            
            .prompt-container {
                padding: 1.5rem;
                font-size: 0.8rem;
            }
            
            .copy-prompt-btn {
                position: relative;
                top: auto;
                right: auto;
                margin-top: 1rem;
                width: 100%;
            }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            .gemini-diamond,
            .constellation-dot,
            .constellation-line,
            .floating-particle {
                animation: none;
            }
        }`;

console.log('Universal CSS ready for all gems');