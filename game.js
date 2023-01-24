var gamePattern = [];
var userPattern = [];
var buttonColours = ["red", "blue", "green", "yellow"];
var userChosenColour = "";
var level = 1;
var numberOfSequences = 3;
var countDown = 3;
var userClickCount = -1;

function nextSequence() {
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    $("#" + randomChosenColour).animate({ opacity: 0 }, 100, "linear", function () {
        $(this).animate({ opacity: 1 }, 100, "linear", function () {
            var audio = new Audio("sounds/" + randomChosenColour + ".mp3");
            audio.play();
            gamePattern.push(randomChosenColour);
        })
    })
}

function playGame() {
    setTimeout(function () {
        $(".btn").removeClass("disabled");
        $("#level-title").html("Round: " + level);
        new Promise(function (resolve) {
            var gameValID = setInterval(function () {
                nextSequence();
                if ((gamePattern.length + 1) === numberOfSequences) {
                    clearInterval(gameValID);
                    resolve();
                }
            }, 1000)
        }).then(function () {
            $(".btn").click(function () {
                userClickCount++;
                $(this).addClass("pressed");
                setTimeout(function () {
                    $(".btn").removeClass("pressed");
                }, 100);
                userChosenColour = $(this).attr("id");
                userPattern.push(userChosenColour);
                if (userPattern[userClickCount] !== gamePattern[userClickCount]) {
                    var badAudio = new Audio("sounds/wrong.mp3");
                    badAudio.play();
                    $(".btn").off("click");
                    $(".btn").addClass("disabled");
                    $("#start-button").removeClass("hide");
                    $("#start-button").html("GAME OVER!");
                    $("#start-button").css("width", "100%");
                    $("body").addClass("game-over");
                    setTimeout(function () {
                        $("body").removeClass("game-over");
                    }, 200);
                } else if (userPattern[userClickCount] === gamePattern[userClickCount]) {
                    var goodAudio = new Audio("sounds/" + userChosenColour + ".mp3");
                    goodAudio.play();
                    if (userPattern.length === gamePattern.length) {
                        level++;
                        numberOfSequences += 1;
                        gamePattern = [];
                        userPattern = [];
                        userClickCount = -1;
                        $(".btn").off("click");
                        $(".btn").addClass("disabled");
                        playGame();
                    }
                }
            })
        });
    }, 1000);
}


$("#start-button").click(function () {
    $(this).off("click");
    $(this).addClass("hide");

    new Promise(function (resolve) {
        for (i = 0; i < 3; i++) {
            setTimeout(function () {
                $("#level-title").html("The game will begin in " + countDown + " seconds.");
                countDown--;
                if (countDown === 0) {
                    resolve();
                }
            }, i * 1000);
        }
    }).then(playGame);
});