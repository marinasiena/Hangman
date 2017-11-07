var winCount = 0;
var loseCount = 0;
var timeOut;

var hangman = {
    words: ['Mouse',
        'Bamboo',
        'Seashell',
        'Ballerina',
        'Telephone',
        'Magnificent',
        'Antelope',
        'Woodpecker',
        'Bisque',
        'Chicken',
        'Pronghorn',
        'Penguin',
        'Grasshopper',
        'Banjo',
        'Mosquito',
    ],
    letters: ['A', 'B', 'C', 'D', 'E',
        'F', 'G', 'H', 'I', 'J', 'K',
        'L', 'M', 'N', 'O', 'P', 'Q',
        'R', 'S', 'T', 'U', 'V', 'W',
        'X', 'Y', 'Z'
    ],
    lives: 10,
    userInputs: [],
    userInput: "",
    computerWord: "",
    wordWithMatchedLetters: "",
    computerWordLength: 0,
    matchedLettersCount: 0,
    gameOver: false,
    winOrLose: false,

  
    init: function() {
        this.lives = 10;
        this.userInputs = [];
        this.matchedLettersCount = 0;
        this.userInput = "";
        this.wordWithMatchedLetters = "";
        this.gameOver = false;
        this.winOrLose = false;
        this.computerWord = this.guessAWord();
        this.computerWordLength = this.calculateWordLength();

        var initialWordToPrint = this.createInitialWordToPrint();
        this.printWord(initialWordToPrint);

        document.querySelector("#lives").innerHTML = this.lives;
        document.querySelector("#winCount").innerHTML = winCount;
        document.querySelector("#loseCount").innerHTML = loseCount;
        document.querySelector("#winLose").style.display = 'inline-block';
        document.querySelector("#hangman-img").src = 'assets/images/animals.png';
    },

    // proceed to hangman rules if user input is an alphabet
    startGmae: function() {
        if (this.gameOver === false && this.isAlphabet()) {
            this.checkRules();
        }
    },

    // validate against game rules
    checkRules: function() {
        if (!this.checkInputAlreadyTried()) { // if letter is not tried
            this.disableLetterBtn();
            this.pushToTriedValues(); // array for tried values
            //this.printUserTriedInputs(); // prit user input

            if (!this.checkWordContainsUserInput()) { // if user entered letter is not in the word
                this.printLivesLeft();
                this.showHangmanImage();
                this.winLoseCountAndAudioOnGameEnd(); //if lives zero set audio and winCount                
                this.startNewOnGameOver();

            } else { // if user entered letter is in the word
                this.createWordWithMatchedLetters();
                this.winLoseCountAndAudioOnGameEnd(); // if user answer is correct
                this.startNewOnGameOver();
                document.querySelector("#word").innerHTML = this.wordWithMatchedLetters;
            }
        }
    },

  
    guessAWord: function() {
        var computerRandomNumber = Math.floor(Math.random() * this.words.length);
        return this.words[computerRandomNumber];
        console.log(this.computerWord);
    },

    calculateWordLength: function() {
        return this.computerWord.length;
    },

    createInitialWordToPrint: function() {
        var word = "";
        for (var i = 0; i < this.computerWordLength; i++) {
            word += '_ ';
        }
        this.wordWithMatchedLetters = word;
        return word;
    },

    // check to see if user already tried the input
    checkInputAlreadyTried: function() {
        if (this.userInputs.length !== 0) {
            var result = this.userInputs.indexOf(this.userInput) < 0 ? false : true;
            return result;
        } else {
            return false;
        }
    },

    // array for tried values
    pushToTriedValues: function() {
        this.userInputs.push(this.userInput);
    },

    //check if input is a letter
    isAlphabet: function() {
        var pattern = /[a-z]/i;
        return this.userInput.match(pattern);
    },

    //check if word contains the letter user entered
    checkWordContainsUserInput: function() {
        var contains = false;
        for (var i = 0; i < this.computerWordLength; i++) {
            if (this.computerWord.charAt(i).toUpperCase() == this.userInput) {
                contains = true;
            }
        }
        return contains;
    },

    //replace dashes with letters
    createWordWithMatchedLetters: function() {
        for (var i = 0; i < this.computerWordLength; i++) {
            if (this.computerWord.charAt(i).toUpperCase() == this.userInput) {
                if (i === 0) {
                    this.wordWithMatchedLetters = this.wordWithMatchedLetters.substring(0, i * 2) +
                        this.userInput.toUpperCase() + this.wordWithMatchedLetters.substring((i * 2 + 1));
                } else {
                    this.wordWithMatchedLetters = this.wordWithMatchedLetters.substring(0, i * 2) +
                        this.userInput.toLowerCase() + this.wordWithMatchedLetters.substring((i * 2 + 1));
                }
                this.matchedLettersCount++;
            }
        }
    },

    // print word
    printWord: function(word) {
        document.querySelector("#word").innerHTML = word;
    },

    printLivesLeft: function() {
        this.lives--;
        document.querySelector("#lives").innerHTML = this.lives;
    },

    winLoseCountAndAudioOnGameEnd: function() {
        if (this.lives === 0) {
            this.gameOver = true;
            this.winOrLose = false;
        }

        if (this.matchedLettersCount == this.computerWordLength) {
            this.winOrLose = true;
            this.gameOver = true;
        }
    },
    startNewOnGameOver: function() {
        if (this.gameOver === true) {
            var html = "";
            document.querySelector("#winLose").style.display = 'none';

            if (this.winOrLose) {
                html += '<div class="message">You is win win.</div>';
            } else {
                html += '<div class="message">Must suck to be a loser.</div>';
            }

            document.querySelector("#loadingMessage").innerHTML = html;
            timeOut = setTimeout(this.loadGame.bind(this), 4000);
        }
    },

 

    showHangmanImage: function() {
        if (this.lives != 10) {
            document.querySelector("#hangman-img").src = "assets/images/hangman-" + (9 - this.lives) + ".png";
        } else {
            document.querySelector("#hangman-img").src = "assets/images/animals.png";
        }
    },
 
    letterClick: function(letter) {
        this.userInput = letter.toUpperCase();
        this.disableLetterBtn();
        this.startGmae();
    },

    disableLetterBtn: function() {
        var id = "#li-" + this.userInput;
        document.querySelector(id).className = "liDisabled"
    },

    addLetterButtons: function() {

        var html = "<ul>";
        for (var i = 0; i < this.letters.length; i++) {
            html += '<li id="li-' + this.letters[i] + '" class="liActive"';
            html += 'onclick="hangman.letterClick(\'' + this.letters[i] + '\')">';
            html += this.letters[i] + "</li>";
        };
        html += "</ul>";
        document.querySelector("#letterBtn").innerHTML = html;
    },

}

window.onload = function(event) {
        hangman.addLetterButtons();
        hangman.init();

        document.onkeyup = function(e) {
            hangman.userInput = String.fromCharCode(e.keyCode).toUpperCase();
            hangman.startGmae();
        }        
    }
