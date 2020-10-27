

/*possibile caricare un json con liste di parole differenti in base al livello o al 
contesto della storia*/
var global_words = [
	"the",
	"be",
	"and",
	"of",
	"a",
	"in",
	"to",
	"have",
	"to",
	"it",
	"I",
	"that",
	"for",
	"you",
	"he",
	"with",
	"on",
	"do",
	"say",
	"this",
	"they",
	"at",
	"but",
	"we",
	"his",
	"from",
	"that",
	"not",
	"by",
	"she",
	"or",
	"as",
	"what",
	"go",
	"their",
	"can",
	"who",
	"get",
	"if",
	"would",
	"her",
	"all",
	"my",
	"make",
	"about",
	"know",
	"will",
	"as",
	"up",
	"one",
	"time",
	"there",
	"year",
	"so",
	"think",
	"when",
	"which",
	"them",
	"some",
	"me",
	"people",
	"take",
	"out",
	"into",
	"just",
	"see",
	"him",
	"your",
	"come",
	"could",
	"now",
	"than",
	"like",
	"other",
	"how",
	"then",
	"its",
	"our",
	"two",
	"more",
	"these",
	"want",
	"way",
	"look",
	"first",
	"also",
	"new",
	"because",
	"day",
	"more",
	"use",
	"no",
	"man",
	"find",
	"here",
	"thing",
	"give",
	"many",
	"well",
	"only",
	"those",
	"tell",
	"one",
	"very",
	"her",
	"even",
	"back",
	"any",
	"good",
	"woman",
	"through",
	"us",
	"life",
	"child",
	"there",
	"work",
	"down",
	"may",
	"after",
	"should",
	"call",
	"world",
	"over",
	"school",
	"still",
	"try",
	"in",
	"as",
	"last",
	"ask",
	"need",
	"too",
	"feel",
	"three",
	"when",
	"state",
	"never",
	"become",
	"between",
	"high",
	"really",
	"something",
	"most",
	"another",
	"much",
	"family",
	"own",
	"out",
	"leave",
	"put",
	"old",
	"while",
	"mean",
	"on",
	"keep",
	"student",
	"why",
	"let",
	"great",
	"same",
	"big",
	"group",
	"begin",
	"seem",
	"country",
	"help",
	"talk",
	"where",
	"turn",
	"problem",
	"every",
	"start",
	"hand",
	"might",
	"American",
	"show",
	"part",
	"about",
	"against",
	"place",
	"over",
	"such",
	"again",
	"few",
	"case",
	"most",
	"week",
	"company",
	"where",
	"system",
	"each",
	"right",
	"program",
	"hear",
	"so",
	"question",
	"during",
	"work",
	"play",
	"government",
	"run",
	"small",
	"number",
	"off",
	"always",
	"move",
	"like",
	"night",
	"live",
	"Mr",
	"point",
	"believe",
	"hold",
	"today",
	"bring",
	"happen",
	"next",
	"without",
	"before",
	"large",
	"all",
	"million",
	"must",
	"home",
	"under",
	"water",
	"room",
	"write",
	"mother",
	"area",
	"national",
	"money",
	"story",
	"young",
	"fact",
	"month",
	"different",
	"lot",
	"right",
	"study",
	"book",
	"eye",
	"job",
	"word",
	"though",
	"business",
	"issue",
	"side",
	"kind",
	"four",
	"head",
	"far",
	"black",
	"long",
	"both",
	"little",
	"house",
	// "yes",
	// "after",
	// "since",
	// "long",
	// "provide",
	// "service",
	// "around",
	// "friend",
	// "important",
	// "father",
	// "sit",
	// "away",
	// "until",
	// "power",
	// "hour",
	// "game",
	// "often",
	// "yet",
	// "line",
	// "political",
	// "end",
	// "among",
	// "ever",
	// "stand",
	// "bad",
	// "lose",
	// "however",
	// "member",
	// "pay",
	// "law",
	// "meet",
	// "car",
	// "city",
	// "almost",
	// "include",
	// "continue",
	// "set",
	// "later",
	// "community",
	// "much",
	// "name",
	// "five",
	// "once",
	// "white",
	// "least",
	// "president",
	// "learn",
	// "real",
	// "change",
	// "team",
	// "minute",
	// "best",
	// "several",
	// "idea",
	// "kid",
	// "body",
	// "information",
	// "nothing",
	// "ago",
	// "right",
	// "lead",
	// "social",
	// "understand",
	// "whether",
	// "back",
	// "watch",
	// "together",
	// "follow",
	// "around",
	// "parent",
	// "only",
	// "stop",
	// "face",
	// "anything",
	// "create",
	// "public",
	// "already",
	// "speak",
	// "others",
	// "read",
	// "level",
	// "allow",
	// "add",
	// "office",
	// "spend",
	// "door",
	// "health",
	// "person",
	// "art",
	// "sure",
	// "such",
	// "war",
	// "history",
	// "party",
	// "within",
	// "grow",
	// "result",
	// "open",
	// "change",
	// "morning",
	// "walk",
	// "reason",
	// "low",
	// "win",
	// "research",
	// "girl",
	// "guy",
	// "early",
	// "food",
	// "before",
	// "moment",
	// "himself",
	// "air",
	// "teacher",
	// "force",
	// "offer",
	// "enough",
	// "both",
	// "education",
	// "across",
	// "although",
	// "remember",
	// "foot",
	// "second",
	// "boy",
	// "maybe",
	// "toward",
	// "able",
	// "age",
	// "off",
	// "policy",
	// "everything",
	// "love",
	// "process",
	// "music",
	// "including",
	// "consider",
	// "appear",
	// "actually",
	// "buy",
	// "probably",
	// "human",
	// "wait",
	// "serve",
	// "market",
	// "die",
	// "send",
	// "expect",
	// "home",
	// "sense",
	// "build",
	// "stay",
	// "fall",
	// "oh",
	// "nation",
	// "plan",
	// "cut",
	// "college",
	// "interest",
	// "death",
	// "course",
	// "someone",
	// "experience",
	// "behind",
	// "reach",
	// "local",
	// "kill",
	// "six",
	// "remain",
	// "effect",
	// "use",
	// "yeah",
	// "suggest",
	// "class",
	// "control",
	// "raise",
	// "care",
	// "perhaps",
	// "little",
	// "late",
	// "hard",
	// "field",
	// "else",
	// "pass",
	// "former",
	// "sell",
	// "major",
	// "sometimes",
	// "require",
	// "along",
	// "development",
	// "themselves",
	// "report",
	// "role",
	// "better",
	// "economic",
	// "effort",
	// "up",
	// "decide",
	// "rate",
	// "strong",
	// "possible",
	// "heart",
	// "drug",
	// "show",
	// "leader",
	// "light",
	// "voice",
	// "wife",
	// "whole",
	// "police",
	// "mind",
	// "finally",
	// "pull",
	// "return",
	// "free",
	// "military",
	// "price",
	// "report",
	// "less",
	// "according",
	// "decision",
	// "explain",
	// "son",
	// "hope",
	// "even",
	// "develop",
	// "view",
	// "relationship",
	// "carry",
	// "town",
	// "road",
	// "drive",
	// "arm",
	// "true",
	// "federal",
	// "break",
	// "better",
	// "difference",
	// "thank",
	// "receive",
	// "value",
	// "international",
	// "building",
	// "action",
	// "full",
	// "model",
	// "join",
	// "season",
	// "society",
	// "because",
	// "tax",
	// "director",
	// "early",
	// "position",
	// "player",
	// "agree",
	// "especially",
	// "record",
	// "pick",
	// "wear",
	// "paper",
	// "special",
	// "space",
	// "ground",
	// "form",
	// "support",
	// "event",
	// "official",
	// "whose",
	// "matter",
	// "everyone",
	// "center",
	// "couple",
	// "site",
	// "end",
	// "project",
	// "hit",
	// "base",
	// "activity",
	// "star",
	// "table",
	// "need",
	// "court",
	// "produce",
	// "eat",
	// "American",
	// "teach",
	// "oil",
	// "half",
	// "situation",
	// "easy",
	// "cost",
	// "industry",
	// "figure",
	// "face",
	// "street",
	// "image",
	// "itself",
	// "phone",
	// "either",
	// "data",
	// "cover",
	// "quite",
	// "picture",
	// "clear",
	// "practice",
	// "piece",
	// "land",
	// "recent",
	// "describe",
	// "product",
	// "doctor",
	// "wall",
	// "patient",
	// "worker",
	// "news",
	// "test",
	// "movie",
	// "certain",
	// "north",
	// "love",
	// "personal",
	// "open",
	// "support",
	// "simply",
	// "third",
	// "technology",
	// "catch",
	// "step",
	// "baby",
	// "computer",
	// "type",
	// "attention",
	// "draw",
	// "film",
	// "Republican",
	// "tree",
	// "source",
	// "red",
	// "nearly",
	// "organization",
	// "choose",
	// "cause",
	// "hair",
	// "look",
	// "point",
	// "century",
	// "evidence",
	// "window",
	// "difficult",
	// "listen",
	// "soon",
	// "culture",
	// "billion",
	// "chance",
	// "brother",
	// "energy",
	// "period",
	// "course",
	// "summer",
	// "less",
	// "realize",
	// "hundred",
	// "available",
	// "plant",
	// "likely",
	// "opportunity",
	// "term",
	// "short",
	// "letter",
	// "condition",
	// "choice",
	// "place",
	// "single",
	// "rule",
	// "daughter",
	// "administration",
	// "south",
	// "husband",
	// "Congress",
	// "floor",
	// "campaign",
	// "material",
	// "population",
	// "well",
	// "call",
	// "economy",
	// "medical",
	// "hospital",
	// "church",
	// "close",
	// "thousand",
	// "risk",
	// "current",
	// "fire",
	// "future",
	// "wrong",
	// "involve",
	// "defense",
	// "anyone",
	// "increase",
	// "security",
	// "bank",
	// "myself",
	// "certainly",
	// "west",
	// "sport",
	// "board",
	// "seek",
	// "per",
	// "subject",
	// "officer",
	// "private",
	// "rest",
	// "behavior",
	// "deal",
	// "performance",
	// "fight",
	// "throw",
	// "top",
	// "quickly",
	// "past",
	// "goal",
	// "second",
	// "bed",
	// "order",
	// "author",
	// "fill",
	// "represent",
	// "focus",
	// "foreign",
	// "drop",
	// "plan",
	// "blood",
	// "upon",
	// "agency",
	// "push",
	// "nature",
	// "color",
	// "no",
	// "recently",
	// "store",
	// "reduce",
	// "sound",
	// "note",
	// "fine",
	// "before",
	// "near",
	// "movement",
	// "page",
	// "enter",
	// "share",
	// "than",
	// "common",
	// "poor",
	// "other",
	// "natural",
	// "race",
	// "concern",
	// "series",
	// "significant",
	// "similar",
	// "hot",
	// "language",
	// "each",
	// "usually",
	// "response",
	// "dead",
	// "rise",
	// "animal",
	// "factor",
	// "decade",
	// "article",
	// "shoot",
	// "east",
	// "save",
	// "seven",
	// "artist",
	// "away",
	// "scene",
	// "stock",
	// "career",
	// "despite",
	// "central",
	// "eight",
	// "thus",
	// "treatment",
	// "beyond",
	// "happy",
	// "exactly",
	// "protect",
	// "approach",
	// "lie",
	// "size",
	// "dog",
	// "fund",
	// "serious",
	// "occur",
	// "media",
	// "ready",
	// "sign",
	// "thought",
	// "list",
	// "individual",
	// "simple",
	// "quality",
	// "pressure",
	// "accept",
	// "answer",
	// "hard",
	// "resource",
	// "identify",
	// "left",
	// "meeting",
	// "determine",
	// "prepare",
	// "disease",
	// "whatever",
	// "success",
	// "argue",
	// "cup",
	// "particularly",
	// "amount",
	// "ability",
	// "staff",
	// "recognize",
	// "indicate",
	// "character",
	// "growth",
	// "loss",
	// "degree",
	// "wonder",
	// "attack",
	// "herself",
	// "region",
	// "television",
	// "box",
	// "TV",
	// "training",
	// "pretty",
	// "trade",
	// "deal",
	// "election",
	// "everybody",
	// "physical",
	// "lay",
	// "general",
	// "feeling",
	// "standard",
	// "bill",
	// "message",
	// "fail",
	// "outside",
	// "arrive",
	// "analysis",
	// "benefit",
	// "name",
	// "sex",
	// "forward",
	// "lawyer",
	// "present",
	// "section",
	// "environmental",
	// "glass",
	// "answer",
	// "skill",
	// "sister",
	// "PM",
	// "professor",
	// "operation",
	// "financial",
	// "crime",
	// "stage",
	// "ok",
	// "compare",
	// "authority",
	// "miss",
	// "design",
	// "sort",
	// "one",
	// "act",
	// "ten",
	// "knowledge",
	// "gun",
	// "station",
	// "blue",
	// "state",
	// "strategy",
	// "little",
	// "clearly",
	// "discuss",
	// "indeed",
	// "force",
	// "truth",
	// "song",
	// "example",
	// "democratic",
	// "check",
	// "environment",
	// "leg",
	// "dark",
	// "public",
	// "various",
	// "rather",
	// "laugh",
	// "guess",
	// "executive",
	// "set",
	// "study",
	// "prove",
	// "hang",
	// "entire",
	// "rock",
	// "design",
	// "enough",
	// "forget",
	// "since",
	// "claim",
	// "note",
	// "remove",
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
};

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

function monsterDown(word) {
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
			alert('Perfect! You have beating all words!')
			throw new ExceptionSuccess();
		}
		var isLower = 1; //Control the probability of occurrence of lowercase letters and capital letters
		if (1 == getRandInt(1, 10)) {
			isLower = 0; //Let the probability of a capital letter appear at 1/10
		}
		var letters = [];
		for (index in wordsSort) {
			if (!existLetters[index]) {
				if (isLower && index == index.toLowerCase()) { //A lowercase letter is required, and the index is really a lowercase letter
					letters.push(index); //Required letters
				}
				if (!isLower && index == index.toUpperCase()){
					letters.push(index); //Required letters
				}
			}
		}
		if (!letters.length) {
			continue;
		}

		var letter = letters[getRandInt(0, letters.length - 1)]; //
Random initials
		if (!wordsSort[letter].length) { //
Out of words in this group!
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
	targetKey = target.find('.monster-letter.undone:first'); // 按键和选定monster的下一个字母不一样
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
		alert('Hai vinto!! La parola nascosta è:!!!');
		clearAllInterval();
	} else if (e instanceof ExceptionFail) {
		alert('Hai perso!!!');
		clearAllInterval();
	}
}

//diminuire intervallo per evitare che il browser crashi
$(document).ready(function(){	//funzione che genera nuove parole ogni 3sec
	genMonster();
	intervals['___init___'] = setInterval(function() {
		genMonster(1);
	}, 30000); //modificato da 3000 a 30000
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
