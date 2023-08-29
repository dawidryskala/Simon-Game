game_status = "off";
console.log("Status game: " + game_status);

round_number = 1;
current_color_class = "";
level_checking_parametr = 0;
color_button_order = [];
key_press_array = [];
all_colors = ["green", "red", "yellow", "blue"];

var sounds = {};
// If the sounds are relatively small, 
// you can also load them into memory at the start of the game 
// to have them ready to play at the start time.
function preloadSounds() {
    all_colors.forEach(function (color) {
        sounds[color] = new Audio("sounds/" + color + ".mp3");
    });
    sounds["wrong"] = new Audio("sounds/wrong.mp3")
}

// Call preloadSounds() at the beginning when the script runs.
preloadSounds();

$(document).keypress(function (event) {
    // Checking if the player press any key to start.
    key_press_array.push(event.key);
    if (key_press_array.length == 1) {
        game_status = "on"; // Change game status to on.
        game()
    }
});

function game() {
    $("h1").text("Level " + String(round_number))
    console.log("Game has stared!");
    next_level();
};

function next_level() {

    setTimeout(function () {
        // Function is waiting one second and after that checks is the game status has changed.
        if (game_status == "on") {
            color_button_order.push(all_colors[random_from_0_to_3()]); // (Array) Chose random color and assign to color_button_order Array.
            current_color_class = color_button_order[round_number - 1]; // (String) Select actuall curret color.
            console.log("current color class: " + current_color_class)
            console.log("color button order: " + color_button_order)
            console.log("--------------------------------------")

            pressed(current_color_class); //  Animation on current pressed button.
            audio_good_choice(current_color_class)
        }
    }, 1000);
};

$(".btn").mouseup(function () {

    // When (player open website || (has lost and strat from begining)) && DO NOT press any key.
    if (game_status == "off") {
        audio_wrong_reaction()
        body_game_over()
    }

    // When (player open website || (has lost and strat from begining)) &&  press any key.
    else if (game_status == "on") {
        if (round_number == 1) { // Checking is it first round number.
            if ($(this).attr("id") == current_color_class) {
                // If actually pressed button is acual to the random color buuton chosen by computer (String == String ).
                good_choice($(this).attr("id"))
            } else {
                game_over($(this).attr("id"))
            }
        }
        else if (round_number > 1) { // Checking is it more than the first round.

            if ((level_checking_parametr == round_number - 1) && $(this).attr("id") == color_button_order.at(level_checking_parametr - round_number)) {
                // Checking is this (current chosen button) is the correct LAST ELEMENT wich we should to chose.
                level_checking_parametr = 0;
                good_choice($(this).attr("id"))
            }
            else if ($(this).attr("id") == color_button_order.at(level_checking_parametr - round_number)) {
                // Checking is this (current chosen button) is the corrct chosen element in the order (but not last) randomized by the computer and saved in "color_button_order".
                audio_good_choice($(this).attr("id"))
                pressed($(this).attr("id"))
                level_checking_parametr += 1;
            }
            else {
                game_over($(this).attr("id"))
            }
        }
    };
});

function pressed(which_color_class) {
    $("." + which_color_class + "").addClass("pressed");
    setTimeout(function () {
        $("." + which_color_class + "").removeClass("pressed");
    }, 200);
};

function random_from_0_to_3() {
    return Math.floor(Math.random() * 4);
};

function audio_wrong_reaction() {
    if (sounds["wrong"]) {
        sounds["wrong"].currentTime = 0;

        // Audio playback is only triggered when the audio is ready to play.
        $(sounds["wrong"]).on("canplaythrough", function () {
            sounds["wrong"].play();
        });
    }
};

function body_game_over() {
    $("body").addClass("game-over");
    setTimeout(function () {
        $("body").removeClass("game-over");
    }, 300);
}

function game_over(id_of_current_button) {
    console.log("Wrong choice");
    body_game_over();
    pressed(id_of_current_button);
    audio_wrong_reaction();
    level_checking_parametr = 0;
    round_number = 1;
    color_button_order = [];
    key_press_array = []
    game_status = "off";
    $("h1").text("Press A Key to Start");
}

function good_choice(this_id) {
    audio_good_choice(this_id)
    pressed(this_id)
    round_number += 1;
    console.log("Right choice! round number: " + round_number);
    $("h1").text("Level " + String(round_number));
    next_level();
};

function audio_good_choice(current_button_id) {
    c_b_i = current_button_id
    if (sounds[c_b_i]) {
        sounds[c_b_i].currentTime = 0;

        // Audio playback is only triggered when the audio is ready to play.
        $(sounds[c_b_i]).on("canplaythrough", function () {
            sounds[c_b_i].play();
        });
    }
}