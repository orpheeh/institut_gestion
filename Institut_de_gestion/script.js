
const questions = document.querySelectorAll(".question");

let currentIndex = 0;

function hideAllQuestion() {
    for (let i = 0; i < questions.length; i++) {
        questions[i].classList.remove('current-question');
    }
}

function showQuestion(index) {
    questions[index].classList.add('current-question');
}

function displayCurrent(){
    hideAllQuestion();
    showQuestion(currentIndex);
}

function next() {
    currentIndex++;
    if (currentIndex >= questions.length) {
        currentIndex = questions.length-1;
        finish();
    } else {
        displayCurrent();
    }
}

function previous() {
    currentIndex--;
    if (currentIndex < 0 ) {
        currentIndex = 0;
    }
    displayCurrent();
}

async function finish() {
    const bac = document.querySelector('#bac-oui').checked;
    const concour = document.querySelector('#concour-oui').checked;
    const frais = document.querySelector('#frais-oui').checked;
    
    const message = await fetchData({ bac, concour, frais });
    
    hideAllQuestion();
    const messageElement = document.querySelector('.message');
    messageElement.classList.add('show-result');
    messageElement.innerHTML = message;
}

async function fetchData(data){
    const res = await fetch('http://igs.orpheenve.xyz', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    if(res.status == 200){
        console.log('OK');
        const json = await res.json();
        return json.message;
    } else {
        return "Il y'a eu un probleme du cote du serveur !";
    }
}
