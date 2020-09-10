(() => {
    let yOffset = 0; //window.pageOffset 대신 쓸 수 있는 변수
    let prevScrollHeight = 0 // 현재 스크롤 (yOffset)보다 이전에 위치한 스크롤 높이값의 함
    let currentScene = 0; // 현재 활성화된 (눈앞에 보고 있는) 씬(scroll-section)
    let enterNewScene = false;

    const sceneInfo = [
        {
            // 0
            type: 'sticky',
            heightNum: 5, //브라우저 높이의 5배로 scrollheight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d')
            },
            values: {
                // 글자 구간과 선명도를 지정 하는 역할
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],



                messageA_translate_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageB_translate_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageC_translate_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageD_translate_in: [20, 0, { start: 0.7, end: 0.8 }],



                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],


                messageA_translate_out: [0, -20, { start: 0.25, end: 0.3 }],
                messageA_translate_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageA_translate_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageA_translate_out: [0, -20, { start: 0.85, end: 0.9 }],
            }
        },
        {
            // 1
            type: 'normal',
            // heightNum: 5, //브라우저 높이의 5배로 scrollheight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {
            // 2
            type: 'sticky',
            heightNum: 5, //브라우저 높이의 5배로 scrollheight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 .a'),
                messageB: document.querySelector('#scroll-section-2 .b'),
                messageC: document.querySelector('#scroll-section-2 .c'),
                pinB: document.querySelector('#scroll-section-2 .b .pin'),
                pinC: document.querySelector('#scroll-section-2 .c .pin'),
            },
            values: {
                messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
                messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
                messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
                messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
                messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
                messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
                messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
                messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
                messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
                messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
                messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
                pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
                pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }],
                pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
                pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
                pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
                pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
            }
        },
        {
            // 3
            type: 'sticky',
            heightNum: 5, //브라우저 높이의 5배로 scrollheight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        },
    ];

    function setLayout() {
        // 각 section 의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`
        }

        let totalScrollHeight = 0;
        yOffset = window.pageYOffset;
        // 새로고침 버튼 눌렀을때 그 씬 장면이 유지 될 수 있게 해주는 역할
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`)
    }







    function calcValues(values, currentYOffset) {
        let rv;
        //현재 씬(스크롤 섹션)애서 스크롤된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        if (values.length === 3) {
            // start ~ end 사이에 애니메이션 진행 
            const partStart = values[2].start * scrollHeight
            const partEnd = values[2].end * scrollHeight
            const partScrollHeight = partEnd - partStart;

            if (currentYOffset <= partEnd && currentYOffset >= partStart) {
                rv = (currentYOffset - partStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if (currentYOffset < partStart) {
                rv = values[0];
            } else if (currentYOffset > partEnd) {
                rv = values[1];
            }

        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }

        return rv;

    }






    function playAinmation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        // console.log(currentScene)
        switch (currentScene) {
            case 0:

                // calcValues = (values의 선명도, 현재 스크롤의 위치    

                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0,${calcValues(values.messageA_translate_in, currentYOffset)}%),0`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0,${calcValues(values.messageA_translate_out, currentYOffset)}%),0`;
                }

                if (scrollRatio <= 0.42) {
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0,${calcValues(values.messageB_translate_in, currentYOffset)}%),0`;
                }

                else {
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0,${calcValues(values.messageB_translate_out, currentYOffset)}%),0`;
                }
                if (scrollRatio <= 0.62) {
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0,${calcValues(values.messageC_translate_in, currentYOffset)}%),0`;
                }

                else {
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0,${calcValues(values.messageB_translate_out, currentYOffset)}%),0`;
                }


                break;
            case 1:

                break;
            case 2:

                break;
            case 3:
                break;
        }
    }









    function scrollLoop() {
        enterNewScene = false
        prevScrollHeight = 0
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`)
        }
        if (yOffset < prevScrollHeight) {
            enterNewScene = true
            if (currentScene === 0) // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지
                return
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`)
        }

        // 마이너스 나오는 오류를 잡아주기 위한 역할
        if (enterNewScene) return;
        playAinmation()
    }
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop()
    });











    window.addEventListener('resize', setLayout);
    window.addEventListener('load', setLayout);


})()