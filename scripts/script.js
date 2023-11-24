window.onload = function () {
    let storyContainer = document.getElementById('story-container');
    let choiceContainer = document.getElementById('choice-container');
    // let backgroundContainer = document.getElementById('background');

    let canvas = document.getElementById('picture');
    let context = canvas.getContext('2d');
    let image = new Image();

    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition);
    recognition.lang = "en-US";
    recognition.start();

    recognition.onend = function () {
        recognition.start();
    }

    let storyData = [
        {
            text: 'You are in Night City, the heart of cyberpunk. You stand at a crossroads: on your left,' +
                'the imposing silhouette of Arasaka Tower, a realm where diplomacy thrives; on your right, the underground of the city, ' +
                'where every mercenary gambles their life to fulfill contracts. Choose your way wisely. Left or right?',
            choices: [
                { text: 'Left', next: 1 },
                { text: 'Right', next: 10 },
            ]
        },
        {   // next: 1
            text: 'You enter the building and go to your office, on the 7th floor. You have been working here for 10 years already, but have not seen any of your colleagues.',
            choices: [
                { text: 'Continue working', next: 2 },
                { text: 'Search for them in their offices', next: 3 },
            ]
        },
        {   // next: 2
            text: 'You work until 2PM. For the lunch break you can go eat or walk through the building.',
            choices: [
                { text: 'Explore the building', next: 4 },
                { text: 'Eat your lunch', next: 5 }
            ]
        },
        {   // next: 3
            text: 'The floor is packed with bodyguards.',
            choices: [
                { text: 'Enter quickly in an office', next: 6 },
                { text: 'Go back to work', next: 2 },
            ]
        },
        {   // next: 4
            text: 'A weird person bumps into you. "A colleague?", you ask yourself. She asks you to hide her in your office for a while.',
            choices: [
                { text: 'Hide her', next: 7 },
                { text: 'Tell the security', next: 8 }
            ]
        },
        {   // next: 5
            text: 'You have a plain sandwich, then head home feeling bored.',
            choices: [
                { text: 'Next', next: 9 }
            ]
        },
        {   // next: 6
            text: 'Your reflexes were too slow. A bodyguard saw you and decided to terminate your system, as the rules taught him to do.',
            choices: [
                { text: 'Play again', next: 0 }
            ]
        },
        {   // next: 7
            text: 'The bodyguards saw you sneaking her in your office and terminated your system for disobeying the rules.',
            choices: [
                { text: 'Play again', next: 0 }
            ]
        },
        {   // next: 8
            text: 'As a reward for your loyalty,  you earned a promotion and a little extra cash on the side.',
            choices: [
                { text: 'Play again', next: 0 }
            ]
        },
        {   // next: 9
            text: 'Trapped in the daily grind, the monotony swallows you whole. Your life becomes a bland script.',
            choices: [
                { text: 'Play again', next: 0 }
            ]
        },
        {   // next: 10
            text: 'You end up in a dark alley. Suddenly, a mysterious woman approaches you.',
            choices: [
                { text: 'Talk to her', next: 11 },
                { text: 'Ignore her', next: 12 }
            ]
        },
        {   // next: 11
            text: '"I have a risky job for you. You need to go to the Arasaka Tower, hack into their system and retreive some important data. That is all you need to know for now. Hurry up and get there!"',
            choices: [
                { text: 'Accept the job', next: 13 },
                { text: 'Refuse her offer', next: 12 }
            ]
        },
        {   // next: 12
            text: 'She did not like that. You angered her, and now, fueled by rage, her knife flashed, ending your story in the neon-lit city.',
            choices: [
                { text: 'Play again', next: 0 }
            ]
        },
        {   // next: 13
            text: 'You arrive at the Arasaka Tower.',
            choices: [
                { text: 'Try the main entrance', next: 14 },
                { text: 'Sneak into the building through the ventilation', next: 15 }
            ]
        },
        {   // next: 14
            text: 'What were you thinking? A mercenary like you cannot go unnoticed. The bodyguards noticed you and terminated your vital system.',
            choices: [
                { text: 'Play again', next: 0 }
            ]
        },
        {   // next: 15
            text: 'You are at the main server now. You plug in your USB and retrieve the data. After this, you search the area for an escape route.',
            choices: [
                { text: 'Try to blend in with the employees and exit through the main door', next: 14 },
                { text: 'Escape through the ventilation', next: 16 }
            ]
        },
        {   // next: 16
            text: 'You got out in one piece. You rush back to the mysterious woman. You see her at the bar, on the same alley you left her.',
            choices: [
                { text: 'Next', next: 17 }
            ]
        },
        {   // next: 17
            text: '"Thanks for the data, here is your cash. It was nice working with you!"',
            choices: [
                { text: 'Play again', next: 0 }
            ]
        }
    ];

    function getBackground(index) {
        switch (index) {
            case 0:
                return '../img/nc.png';
            case 1:
                return '../img/office.png';
            case 2:
                return '../img/clock.png';
            case 3:
                return '../img/bodyguards.png';
            case 4:
                return '../img/angelina-talking.png';
            case 5:
                return '../img/sandwich.png';
            case 6:
                return '../img/bad-ending.png';
            case 7:
                return '../img/bad-ending.png';
            case 8:
                return '../img/good-ending.png';
            case 9:
                return '../img/boring-ending.png';
            case 10:
                return '../img/alley.png';
            case 11:
                return '../img/angelina-talking.png';
            case 12:
                return '../img/bad-ending.png';
            case 13:
                return '../img/arasaka-tower.png';
            case 14:
                return '../img/bad-ending.png';
            case 15:
                return '../img/servers.png';
            case 16:
                return '../img/angelina-bar.png';
            case 17:
                return '../img/good-ending.png';
            default:
                return '../img/black.png';
        }
    }

    let sceneIndex = 0;

    function renderScene() {
        let scene = storyData[sceneIndex];
        storyContainer.innerHTML = `<p>${scene.text}</p>`;

        // document.body.style.backgroundImage = `url('${getBackground(sceneIndex)}')`;
        // document.body.style.backgroundSize = 'cover';
        image.src = `${getBackground(sceneIndex)}`;

        storyContainer.style.fontWeight = "700";

        choiceContainer.innerHTML = '';

        scene.choices.forEach(choice => {
            let choiceButton = document.createElement('button');
            choiceButton.textContent = choice.text;

            choiceButton.style.textAlign = 'left';
            choiceButton.style.display = 'block';
            choiceButton.style.width = '100%';
            choiceButton.style.backgroundColor = '#05d9e800';
            choiceButton.style.color = '#d1f7ff';
            choiceButton.style.fontStyle = 'italic';
            choiceButton.style.border = 'none';
            choiceButton.style.cursor = 'pointer';
            choiceButton.style.fontWeight = "500";

            choiceButton.addEventListener('click', () => {
                sceneIndex = choice.next;
                renderScene();
            });

            choiceContainer.appendChild(choiceButton);
        });

        recognition.onresult = function (event) {
            let command = event.results[0][0].transcript;
            
            function matchesWord(command, keyword) {
                let keywords = keyword.split(" ");
                let regex = new RegExp(`.*\\b(${keywords.join("|")})\\b.*`, 'i');
                return regex.test(command);
            }

            try {
                let choiceOne = scene.choices[0].text.split(" ", 2);
                let choiceTwo = scene.choices[1].text.split(" ", 2);

                console.log(command);
                // console.log(choiceOne);
                // console.log(choiceTwo);
                // console.log(scene.choices[0].text.toLowerCase());
                if (command.toLowerCase() === choiceOne[0].toLowerCase() || matchesWord(command, choiceOne[0])) {
                    sceneIndex = scene.choices[0].next;
                    console.log(scene.choices[0].next);
                } else if (command.toLowerCase() === choiceTwo[0].toLowerCase() || matchesWord(command,  choiceTwo[0])) {
                    sceneIndex = scene.choices[1].next;
                    console.log(scene.choices[1].next);
                }
            } catch (error) {
                // console.log(error);
                let singleChoice = scene.choices[0].text.split(" ", 2);
                if (command.toLowerCase() === singleChoice[0].toLowerCase() || matchesWord(command,  singleChoice[0])) {
                    sceneIndex = scene.choices[0].next;
                    console.log(scene.choices[0].next);
                }
            }

            renderScene();
        }

    }

    renderScene();

    image.onload = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (window.innerWidth <= 600) {
            let centralWidth = 300 * (image.width / image.height);
            context.drawImage(image, 0, 0, image.width, image.height, (canvas.width - centralWidth) / 2, (canvas.height - 300) / 2, centralWidth, 300);
            document.body.style.backgroundColor = 'black';
        } else {
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
    }

    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (window.innerWidth <= 600) {
            let centralWidth = 300 * (image.width / image.height);
            context.drawImage(image, 0, 0, image.width, image.height, (canvas.width - centralWidth) / 2, (canvas.height - 300) / 2, centralWidth, 300);
            document.body.style.backgroundColor = 'black';
        } else {
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
    });
}