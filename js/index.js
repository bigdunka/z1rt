function launchtracker() {
    var questflag = overworldquest.options[overworldquest.selectedIndex].value;
    var hintsflag = hints.options[hints.selectedIndex].value;
	var dungeonitemflag = dungeonitemshuffle.options[dungeonitemshuffle.selectedIndex].value;
	var swordsflag = swords.options[swords.selectedIndex].value;
	var whiteswordminflag = whiteswordmin.options[whiteswordmin.selectedIndex].value;
	var whiteswordmaxflag = whiteswordmax.options[whiteswordmax.selectedIndex].value;
	var magicswordminflag = magicswordmin.options[magicswordmin.selectedIndex].value;
	var magicswordmaxflag = magicswordmax.options[magicswordmax.selectedIndex].value;
	var whitesworditemflag = whitesworditem.options[whitesworditem.selectedIndex].value;
	var armositemflag = armositem.options[armositem.selectedIndex].value;
	var coastitemflag = coastitem.options[coastitem.selectedIndex].value;
	var itemin91flag = nineitem1.options[nineitem1.selectedIndex].value;
	var itemin92flag = nineitem2.options[nineitem2.selectedIndex].value;
	var startingheartsflag = startinghearts.options[startinghearts.selectedIndex].value;
	var levelboardflag = levelboard.options[levelboard.selectedIndex].value;

    var trackerWindow = window.open('tracker.html?f={quest}{hints}{dungeonitem}{swords}{whiteswordmin}{whiteswordmax}{magicswordmin}{magicswordmax}{whitesworditem}{coastitem}{armositem}{itemin91}{itemin92}{startinghearts}{levelboard}&r={epoch}'
			.replace('{quest}', questflag)
            .replace('{hints}', hintsflag)
			.replace('{dungeonitem}', dungeonitemflag)
			.replace('{swords}', swordsflag)
			.replace('{whiteswordmin}', whiteswordminflag)
			.replace('{whiteswordmax}', whiteswordmaxflag)
			.replace('{magicswordmin}', magicswordminflag)
			.replace('{magicswordmax}', magicswordmaxflag)
			.replace('{whitesworditem}', whitesworditemflag)
			.replace('{coastitem}', coastitemflag)
			.replace('{armositem}', armositemflag)
			.replace('{itemin91}', itemin91flag)
			.replace('{itemin92}', itemin92flag)
			.replace('{startinghearts}', startingheartsflag)
			.replace('{levelboard}', levelboardflag)
			.replace('{epoch}', Date.now()),
		'',
		'width=980,height=980,titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0');
}

function parsesummarytext() {
    var fullsummarytext = summarytext.value;
    //Remove all double spaces for parsing
    while (fullsummarytext.indexOf('  ') > -1) {
        fullsummarytext = fullsummarytext.replace('  ', ' ');
    }

    //Overworld Quest
    if (fullsummarytext.indexOf('1st Quest Overworld') > -1) {
        overworldquest.value = "1";
    } else if (fullsummarytext.indexOf('2nd Quest Overworld') > -1) {
        overworldquest.value = "2";
    } else if (fullsummarytext.indexOf('Mixed Quest - 1st Overworld') > -1) {
        overworldquest.value = "M";
    } else if (fullsummarytext.indexOf('Mixed Quest - 2nd Overworld') > -1) {
        overworldquest.value = "X";
    } else {
        overworldquest.value = "1";
    }

    //Hints
    if (fullsummarytext.indexOf('Helpful Hints') > -1) {
        hints.value = "H";
    } else if (fullsummarytext.indexOf('Community Hints') > -1) {
        hints.value = "C";
    } else if (fullsummarytext.indexOf('Deception Hints') > -1) {
        hints.value = "D";
    } else if (fullsummarytext.indexOf('Mixed Hints') > -1) {
        hints.value = "M";
    } else {
        hints.value = "H";
    }

    //Dungeon Item Shuffle
    if (fullsummarytext.indexOf('Dungeon Item Shuffle: Dungeon Items') > -1) {
        dungeonitemshuffle.value = "D";
    } else if (fullsummarytext.indexOf('Dungeon Item Shuffle: Items Anywhere, Hearts within Dungeons') > -1) {
        dungeonitemshuffle.value = "H";
    } else if (fullsummarytext.indexOf('Dungeon Item Shuffle: Items + Hearts') > -1) {
        dungeonitemshuffle.value = "F";
    } else {
        dungeonitemshuffle.value = "N";
    }

    //Swords
    if (fullsummarytext.indexOf('Wood Sword State: Normal') > -1) {
        swords.value = "N";
    } else if (fullsummarytext.indexOf('Wood Sword State: Wood Sword Only') > -1) {
        swords.value = "W";
    } else if (fullsummarytext.indexOf('Wood Sword State: No Wood Sword') > -1) {
        swords.value = "O";
    } else if (fullsummarytext.indexOf('Wood Sword State: Swordless') > -1) {
        swords.value = "S";
    } else {
        swords.value = "N";
    }

    //White Sword Hearts - Min/Max
    var tmp = fullsummarytext.substring(fullsummarytext.indexOf('White Sword Range: ') + 19);
    tmp = tmp.substring(0, 3);
    if (tmp.length == 3) {
        whiteswordmin.value = tmp[0];
        whiteswordmax.value = tmp[2];
    }

    //Magic Sword Hearts - Min/Max
    tmp = fullsummarytext.substring(fullsummarytext.indexOf('Magical Sword Range: ') + 21);
    tmp = tmp.substring(0, 5);
    if (tmp.length == 5) {
        magicswordmin.value = tmp[1];
        magicswordmax.value = tmp[4];
    }

    //White Sword Item
    if (fullsummarytext.indexOf('White Sword Cave: Random') > -1) {
        whitesworditem.value = "R";
    } else if (fullsummarytext.indexOf('White Sword Cave: Book') > -1) {
        whitesworditem.value = "B";
    } else if (fullsummarytext.indexOf('White Sword Cave: Boomerang') > -1) {
        whitesworditem.value = "O";
    } else if (fullsummarytext.indexOf('White Sword Cave: Bow') > -1) {
        whitesworditem.value = "W";
    } else if (fullsummarytext.indexOf('White Sword Cave: Heart Container') > -1) {
        whitesworditem.value = "H";
    } else if (fullsummarytext.indexOf('White Sword Cave: Ladder') > -1) {
        whitesworditem.value = "L";
    } else if (fullsummarytext.indexOf('White Sword Cave: Magical Boomerang') > -1) {
        whitesworditem.value = "M";
    } else if (fullsummarytext.indexOf('White Sword Cave: Magical Key') > -1) {
        whitesworditem.value = "A";
    } else if (fullsummarytext.indexOf('White Sword Cave: Power Bracelet') > -1) {
        whitesworditem.value = "P";
    } else if (fullsummarytext.indexOf('White Sword Cave: Raft') > -1) {
        whitesworditem.value = "F";
    } else if (fullsummarytext.indexOf('White Sword Cave: Recorder') > -1) {
        whitesworditem.value = "E";
    } else if (fullsummarytext.indexOf('White Sword Cave: Red Candle') > -1) {
        whitesworditem.value = "D";
    } else if (fullsummarytext.indexOf('White Sword Cave: Red Ring') > -1) {
        whitesworditem.value = "I";
    } else if (fullsummarytext.indexOf('White Sword Cave: Silver Arrow') > -1) {
        whitesworditem.value = "S";
    } else if (fullsummarytext.indexOf('White Sword Cave: Wand') > -1) {
        whitesworditem.value = "N";
    } else if (fullsummarytext.indexOf('White Sword Cave: White Sword') > -1) {
        whitesworditem.value = "T";
    } else {
        whitesworditem.value = "R";
    }

    //Armos Item
    if (fullsummarytext.indexOf('Armos: Random') > -1) {
        armositem.value = "R";
    } else if (fullsummarytext.indexOf('Armos: Book') > -1) {
        armositem.value = "B";
    } else if (fullsummarytext.indexOf('Armos: Boomerang') > -1) {
        armositem.value = "O";
    } else if (fullsummarytext.indexOf('Armos: Bow') > -1) {
        armositem.value = "W";
    } else if (fullsummarytext.indexOf('Armos: Heart Container') > -1) {
        armositem.value = "H";
    } else if (fullsummarytext.indexOf('Armos: Ladder') > -1) {
        armositem.value = "L";
    } else if (fullsummarytext.indexOf('Armos: Magical Boomerang') > -1) {
        armositem.value = "M";
    } else if (fullsummarytext.indexOf('Armos: Magical Key') > -1) {
        armositem.value = "A";
    } else if (fullsummarytext.indexOf('Armos: Power Bracelet') > -1) {
        armositem.value = "P";
    } else if (fullsummarytext.indexOf('Armos: Raft') > -1) {
        armositem.value = "F";
    } else if (fullsummarytext.indexOf('Armos: Recorder') > -1) {
        armositem.value = "E";
    } else if (fullsummarytext.indexOf('Armos: Red Candle') > -1) {
        armositem.value = "D";
    } else if (fullsummarytext.indexOf('Armos: Red Ring') > -1) {
        armositem.value = "I";
    } else if (fullsummarytext.indexOf('Armos: Silver Arrow') > -1) {
        armositem.value = "S";
    } else if (fullsummarytext.indexOf('Armos: Wand') > -1) {
        armositem.value = "N";
    } else if (fullsummarytext.indexOf('Armos: White Sword') > -1) {
        armositem.value = "T";
    } else {
        armositem.value = "R";
    }

    //Coast Item
    if (fullsummarytext.indexOf('Coast: Random') > -1) {
        coastitem.value = "R";
    } else if (fullsummarytext.indexOf('Coast: Book') > -1) {
        coastitem.value = "B";
    } else if (fullsummarytext.indexOf('Coast: Boomerang') > -1) {
        coastitem.value = "O";
    } else if (fullsummarytext.indexOf('Coast: Bow') > -1) {
        coastitem.value = "W";
    } else if (fullsummarytext.indexOf('Coast: Heart Container') > -1) {
        coastitem.value = "H";
    } else if (fullsummarytext.indexOf('Coast: Magical Boomerang') > -1) {
        coastitem.value = "M";
    } else if (fullsummarytext.indexOf('Coast: Magical Key') > -1) {
        coastitem.value = "A";
    } else if (fullsummarytext.indexOf('Coast: Power Bracelet') > -1) {
        coastitem.value = "P";
    } else if (fullsummarytext.indexOf('Coast: Raft') > -1) {
        coastitem.value = "F";
    } else if (fullsummarytext.indexOf('Coast: Recorder') > -1) {
        coastitem.value = "E";
    } else if (fullsummarytext.indexOf('Coast: Red Candle') > -1) {
        coastitem.value = "D";
    } else if (fullsummarytext.indexOf('Coast: Red Ring') > -1) {
        coastitem.value = "I";
    } else if (fullsummarytext.indexOf('Coast: Silver Arrow') > -1) {
        coastitem.value = "S";
    } else if (fullsummarytext.indexOf('Coast: Wand') > -1) {
        coastitem.value = "N";
    } else if (fullsummarytext.indexOf('Coast: White Sword') > -1) {
        coastitem.value = "T";
    } else {
        coastitem.value = "R";
    }

    tmp = fullsummarytext.substring(fullsummarytext.indexOf('Level 9 Items: ') + 15);
    tmp = tmp.substring(0, tmp.indexOf(','));

    //9 Item 1
    if (tmp == 'Random') {
        nineitem1.value = "R";
    } else if (tmp == 'Book') {
        nineitem1.value = "B";
    } else if (tmp == 'Boomerang') {
        nineitem1.value = "O";
    } else if (tmp == 'Bow') {
        nineitem1.value = "W";
    } else if (tmp == 'Heart Container') {
        nineitem1.value = "H";
    } else if (tmp == 'Ladder') {
        armositem.value = "L";
    } else if (tmp == 'Magical Boomerang') {
        nineitem1.value = "M";
    } else if (tmp == 'Magical Key') {
        nineitem1.value = "A";
    } else if (tmp == 'Power Bracelet') {
        nineitem1.value = "P";
    } else if (tmp == 'Raft') {
        nineitem1.value = "F";
    } else if (tmp == 'Recorder') {
        nineitem1.value = "E";
    } else if (tmp == 'Red Candle') {
        nineitem1.value = "D";
    } else if (tmp == 'Red Ring') {
        nineitem1.value = "I";
    } else if (tmp == 'Silver Arrow') {
        nineitem1.value = "S";
    } else if (tmp == 'Wand') {
        nineitem1.value = "N";
    } else if (tmp == 'White Sword') {
        nineitem1.value = "T";
    } else {
        nineitem1.value = "R";
    }


    tmp = fullsummarytext.substring(fullsummarytext.indexOf('Level 9 Items: ') + 15);
    tmp = tmp.substring(tmp.indexOf(',') + 2, tmp.indexOf('\n'));

    //9 Item 2
    if (tmp == 'Random') {
        nineitem2.value = "R";
    } else if (tmp == 'Book') {
        nineitem2.value = "B";
    } else if (tmp == 'Boomerang') {
        nineitem2.value = "O";
    } else if (tmp == 'Bow') {
        nineitem2.value = "W";
    } else if (tmp == 'Heart Container') {
        nineitem2.value = "H";
    } else if (tmp == 'Ladder') {
        armositem.value = "L";
    } else if (tmp == 'Magical Boomerang') {
        nineitem2.value = "M";
    } else if (tmp == 'Magical Key') {
        nineitem2.value = "A";
    } else if (tmp == 'Power Bracelet') {
        nineitem2.value = "P";
    } else if (tmp == 'Raft') {
        nineitem2.value = "F";
    } else if (tmp == 'Recorder') {
        nineitem2.value = "E";
    } else if (tmp == 'Red Candle') {
        nineitem2.value = "D";
    } else if (tmp == 'Red Ring') {
        nineitem2.value = "I";
    } else if (tmp == 'Silver Arrow') {
        nineitem2.value = "S";
    } else if (tmp == 'Wand') {
        nineitem2.value = "N";
    } else if (tmp == 'White Sword') {
        nineitem2.value = "T";
    } else {
        nineitem2.value = "R";
    }
    
    //Starting Hearts
    tmp = fullsummarytext.substring(fullsummarytext.indexOf('Starting Hearts: ') + 17);
    tmp = tmp.substring(0, tmp.indexOf('\n'));

    if (tmp.length == 1) {
        startinghearts.value = tmp;
    } else if (tmp == '10') {
        startinghearts.value = "A";
    } else if (tmp == '11') {
        startinghearts.value = "B";
    } else if (tmp == '12') {
        startinghearts.value = "C";
    } else if (tmp == '13') {
        startinghearts.value = "D";
    } else if (tmp == '14') {
        startinghearts.value = "E";
    } else if (tmp == '15') {
        startinghearts.value = "F";
    } else if (tmp == '16') {
        startinghearts.value = "G";
    }
}

