
var global_words = [
	// "the",
	// "be",
	// "and",
	// "of",
	// "a",
	// "in",
	// "to",
	// "have",
	// "to",
	// "it",
	// "I",
	// "that",
	// "for",
	// "you",
	// "he",
	// "with",
	// "on",
	// "do",
	// "say",
	// "this",
	// "they",
	// "at",
	// "but",
	// "we",
	// "his",
	// "from",
	// "that",
	// "not",
	// "n't",
	// "by",
	// "she",
	// "or",
	// "as",
	// "what",
	// "go",
	// "their",
	// "can",
	// "who",
	// "get",
	// "if",
	// "would",
	// "her",
	// "all",
	// "my",
	// "make",
	// "about",
	// "know",
	// "will",
	// "as",
	// "up",
	// "one",
	// "time",
	// "there",
	// "year",
	// "so",
	// "think",
	// "when",
	// "which",
	// "them",
	// "some",
	// "me",
	// "people",
	// "take",
	// "out",
	// "into",
	// "just",
	// "see",
	// "him",
	// "your",
	// "come",
	// "could",
	// "now",
	// "than",
	// "like",
	// "other",
	// "how",
	// "then",
	// "its",
	// "our",
	// "two",
	// "more",
	// "these",
	// "want",
	// "way",
	// "look",
	// "first",
	// "also",
	// "new",
	// "because",
	// "day",
	// "more",
	// "use",
	// "no",
	// "man",
	// "find",
	// "here",
	// "thing",
	// "give",
	// "many",
	// "well",
	// "only",
	// "those",
	// "tell",
	// "one",
	// "very",
	// "her",
	// "even",
	// "back",
	// "any",
	// "good",
	// "woman",
	// "through",
	// "us",
	// "life",
	// "child",
	// "there",
	// "work",
	// "down",
	// "may",
	// "after",
	// "should",
	// "call",
	// "world",
	// "over",
	// "school",
	// "still",
	// "try",
	// "in",
	// "as",
	// "last",
	// "ask",
	// "need",
	// "too",
	// "feel",
	// "three",
	// "when",
	// "state",
	// "never",
	// "become",
	// "between",
	// "high",
	// "really",
	// "something",
	// "most",
	// "another",
	// "much",
	// "family",
	// "own",
	// "out",
	// "leave",
	// "put",
	// "old",
	// "while",
	// "mean",
	// "on",
	// "keep",
	// "student",
	// "why",
	// "let",
	// "great",
	// "same",
	// "big",
	// "group",
	// "begin",
	// "seem",
	// "country",
	// "help",
	// "talk",
	// "where",
	// "turn",
	// "problem",
	// "every",
	// "start",
	// "hand",
	// "might"
"Rivoluzione",
"monarchia",
"assoluta",
"abolizione",
"Repubblica",
//"AncienRégime",
"disuguaglianza",
"povertà",
"emanazione",
"aristocrazia",
"moti", 
"rivoluzionari",
"borghesia",
"re",
"nobiltà",
"clero",
//"terzo stato",
"malcontento",
"Presa",
"Bastiglia",
//"prima Repubblica",
"Regina",
"MariaAntonietta",
"uguaglianza",
"democrazia",
"Stato",
"moderno"

];

var intervals = {};
var bulletIntervals = {};
var target = null;
var wordsSort = {};
var monsterCount = 0;

var i = global_words.length;
var tmpWord;
while (i) {
	i -= 1;
	tmpWord = global_words[i];
    if (!wordsSort[tmpWord[0]]) {
		wordsSort[tmpWord[0]] = [];
	}
	wordsSort[tmpWord[0]].push(tmpWord);
}

// custom exception
function ExceptionFail() {}
function ExceptionSuccess() {}
function ExceptionNoTarget() {}
function ExceptionNotMatch() {}

function getRandInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function monsterDown(word) {	//layout pagina
	// return;
	var randomSpeed = getRandInt(400, 6000);
	intervals[word] = setInterval(function(tmpWord) {
		try {
			var tmpObj = $('.monster-col[data-word='+tmpWord+']');
			var top = parseInt(tmpObj.css('top'));
			top += 10;
			tmpObj.css('top', top+'px');
			var gameHeight = parseInt($('.game-top').css('height'));
			var selfHeight = parseInt(tmpObj.css('height'));
			if (top > gameHeight-selfHeight) { //Hit the bottom
				hideMonster(tmpWord);
				if (tmpObj.hasClass('monster-living')) {
					throw new ExceptionFail(); //game over
				}
			}
		} catch (e) {
			handleException(e);
		}
	}, randomSpeed, word);
}

function getRandomWord() {
	var existLetters = {};
	$('.monster-living').each(function(index, el) {
		existLetters[$(el).data('word')[0]] = 1;
	});
	while (true) {
		if (Object.keys(wordsSort).length === 0) {
			alert('Hai vinto! Sali di livello!')
			throw new ExceptionSuccess();
		}
		var isLower = 1; // Control the probability of occurrence of lowercase letters and capital letters
		if (1 == getRandInt(1, 10)) {
			isLower = 0; // Let the probability of a capital letter appear at 1/10
		}
		var letters = [];
		for (index in wordsSort) {
			if (!existLetters[index]) {
				if (isLower && index == index.toLowerCase()) { // A lowercase letter is required, and the index is really a lowercase letter
					letters.push(index); // Required letters
				}
				if (!isLower && index == index.toUpperCase()){
					letters.push(index); // Required letters
				}
			}
		}
		if (!letters.length) {
			continue;
		}

		var letter = letters[getRandInt(0, letters.length - 1)]; // 随机首字母
		if (!wordsSort[letter].length) { // 该组的词用完了!
			delete wordsSort[letter];
			continue;
		}
		var index = getRandInt(0, wordsSort[letter].length - 1);
		var res = wordsSort[letter][index];
		wordsSort[letter].splice(index, 1); //Make sure that the word only appears once!
		return res;
	}
}

function genMonster(monsterNum) {
	try {
		if (!monsterNum) {
			monsterNum = getRandInt(5,12);
		}
		var monsterWord;
		for (var i = 0; i < monsterNum; i++) {
			monsterWord = getRandomWord();
			var offsetStr = '';
			// var offset = getRandInt(0, 1);
			// if (offset != 0) {
			// 	offsetStr = 'col-md-offset-' + offset + ' col-xs-offset-' + offset;
			// }
			monsterObj = $('<div class="' + offsetStr + 'col-md-1 col-xs-1 monster-col monster-living" data-word="'+monsterWord+'" data-index="'+monsterCount+'"><span class="monster"></div>');
			for (var j = 0; j < monsterWord.length; j++) {
				monsterObj.find('.monster').append('<font class="monster-letter undone ' + monsterWord[j] + '" id="word-'+monsterWord+'-'+j+'">' + monsterWord[j] + '</font>');
			}
			$('.game-top').append(monsterObj);
			monsterCount += 1;
			monsterDown(monsterWord);
		}
	} catch (e) {
		handleException(e);
	}
}

function hideMonster(word) {
	var tmpObj = $('.monster-col[data-word='+word+']');
	//Add disappearance effect
	var magics = ['magic', 'puffOut', 'puffOut', 'vanishOut', 'openDownLeftOut', 'openDownRightOut', 'openUpLeftOut', 'openUpRightOut', 'rotateDown', 'rotateUp', 'rotateLeft', 'rotateRight', 'swashOut', 'foolishOut', 'holeOut', 'tinRightOut', 'tinLeftOut', 'tinUpOut', 'tinDownOut', 'bombRightOut', 'bombLeftOut', 'boingOutDown', 'spaceOutUp', 'spaceOutRight', 'spaceOutDown', 'spaceOutLeft'];
	var magic = magics[getRandInt(0, magics.length - 1)];
	tmpObj.addClass('magictime ' + magic);
}

function searchTarget(key) {
	if (target) {
		return target;
	}
	var monsters;
	if (!key) { //Pressing a non-printing character key such as a function key
		throw new ExceptionNoTarget();
	}
	monsters = $('.monster-living[data-word^='+key+']'); // Find monsters with the first letter as key
	if (!monsters.length) {
		throw new ExceptionNoTarget();
	}
	target = $(monsters[0]);
	target.css('z-index', 9999);
	var margetLeft = ((target.data('index') % 12) * (100/12)) + '%';
	$('.game-me').animate({'margin-left': margetLeft}, 1500);	
}

function shoot(targetKey) {
	var key = targetKey.text();
	var word = targetKey.closest('.monster-col').data('word');
	var bulletId = 'bullet-' + word + '-' + targetKey.index();
	var targetKeyId = targetKey.attr('id');

	targetKey.removeClass('undone').addClass('done');
	$('.game-top').append('<div class="bullet" data-word="' + word + '" id="' + bulletId + '" data-target-id="' + targetKeyId + '">' + key + '</div>')
	$('#'+bulletId).css($('.game-me').offset());
	var offset = targetKey.offset();
	offset.left -= 79;

	if (!target.find('.monster-letter.undone').length) {
		target.removeClass('monster-living').addClass('died');
		target = null
	}
	if (!$('.monster-living').length) {
		throw new ExceptionSuccess();
	}

	$('#'+bulletId).animate(offset, {
	    duration: 1000,
	    specialEasing: {
	      width: "linear",
	      height: "easeOutBounce"
	    },
	    complete: function() {
	    	$(this).hide();
      		var obj = $('#' + $(this).data('target-id'));
      		obj.css('color', '#ec3b83').addClass('colored');
      		var tmpTarget = obj.closest('.monster-col');
      		// After all the letters are eliminated, stop the circulator and hide the word
      		if (!tmpTarget.find('.monster-letter.undone').length && tmpTarget.find('.monster-letter.done').length == tmpTarget.find('.monster-letter.colored').length) {
      			$('.bullet[data-word=' + tmpTarget.data('word') + ']').hide();
      			hideMonster(tmpTarget.data('word'))
      			clearInterval(intervals[word]);
      		}
	    },
	    step: function(now, fx) { // Hide the bullet when it is near the target
	    	var obj = $('#' + fx.elem.id);
	    	var tmpTarget = $('#' + obj.data('target-id')).closest('.monster-col');
			if (tmpTarget.position().top >= obj.position().top) {
	    		obj.hide();
			}
		}
	});
}

function attackMonster(key) {
	var targetKey;
	if (!target) {
		throw new ExceptionNoTarget();
	}
	targetKey = target.find('.monster-letter.undone:first'); // Il pulsante è diverso dalla lettera successiva del mostro selezionato
	if (key != targetKey.text()) {
		throw new ExceptionNotMatch();
	}
	shoot(targetKey);
}

function clearAllInterval() {
	$.each(intervals, function(index, val) {
		 clearInterval(val);
	});
}

function handleException(e) {
	if (e instanceof ExceptionNoTarget) {
		console.log(target)
		// do nothing
	} else if (e instanceof ExceptionNotMatch) {
		console.log(target)
		// do nothing
	} else if (e instanceof ExceptionSuccess) {
		alert('You Win!! Wonderful!!!');
		clearAllInterval();
	} else if (e instanceof ExceptionFail) {
		alert('You Die!!!');
		clearAllInterval();
	}
}
//diminuire intervallo per evitare che il browser crashi
$(document).ready(function(){ 	//funzione che genera nuove parole ogni 3sec
	genMonster();
	intervals['___init___'] = setInterval(function() {
		genMonster(1);
	}, 30000);	//modificato da 3000 a 30000
	$(document).on('keypress', function(e) {
		try {
			var key = String.fromCharCode(e.which);
			searchTarget(key);
			attackMonster(key);
		} catch (e) {
			handleException(e);
		}
	});
});
