(function(window) {
    'use strict';

	var buildstring = '10101';
	window.availablechecks = 0;
	window.remainingchecks = 0;

	window.activepanel = '';
	window.activepanelid = 0;
	window.activepanelid2 = 0;
	window.currentdungeon = 0;

	window.coordx = 0;
	window.coordy = 0;

	document.addEventListener("click", detectLeftClick);
	document.addEventListener("contextmenu", detectRightClick);

	window.addEventListener('wheel', function(event) {
  		if (event.deltaY < 0) {
    		detectUpWheel(event); 
  		} else if (event.deltaY > 0) {
    		detectDownWheel(event);
  		}
	});

	var query = uri_query();

	window.flags = {
		quest: query.f.charAt(0),
		dungeonquest: 'S',
		hints: query.f.charAt(1) != 'C',
		heartshuffle: query.f.charAt(2) != 'D' && query.f.charAt(2) != 'N',
		swordless: query.f.charAt(3) == 'S',
		whiteswordmin: parseInt(query.f.charAt(4)),
		whiteswordmax: parseInt(query.f.charAt(5)),
		magicswordmin: parseInt("1" + query.f.charAt(6)),
		magicswordmax: parseInt("1" + query.f.charAt(7)),
		startingextrahearts: 3,
		unknowndungeons: false,
		showboard: query.f.charAt(14) == 'B'
	}

	//Starting Hearts
	if (query.f.charAt(13) == 'A') window.flags.startingextrahearts = 7;
	else if (query.f.charAt(13) == 'B') window.flags.startingextrahearts = 8;
	else if (query.f.charAt(13) == 'C') window.flags.startingextrahearts = 9;
	else if (query.f.charAt(13) == 'D') window.flags.startingextrahearts = 10;
	else if (query.f.charAt(13) == 'E') window.flags.startingextrahearts = 11;
	else if (query.f.charAt(13) == 'F') window.flags.startingextrahearts = 12;
	else if (query.f.charAt(13) == 'G') window.flags.startingextrahearts = 13;
	else window.flags.startingextrahearts = parseInt(query.f.charAt(13)) - window.flags.startingextrahearts;

	window.items = {
		woodsword: false,
		whitesword: false,
		magicsword: false,
		boomerang: false,
		magicboomerang: false,
		bomb: false,
		woodarrow: false,
		silverarrow: false,
		bow: false,
		bluecandle: false,
		redcandle: false,
		recorder: false,
		meat: false,
		manuscript: false,
		bluepotion: false,
		redpotion: false,
		wand: false,
		raft: false,
		book: false,
		bluering: false,
		redring: false,
		ladder: false,
		anykey: false,
		bracelet: false,
		heartcontainers: [false, false, false, false, false, false, false, false, false],
		maxhearts: 3,
		anyheart: [0, 0, 0, 0],  //0: Unchecked; 1: Obtained; 2: Skipped
		triforce: [false, false, false, false, false, false, false, false],
		hints: ['', '', '', '', '', '', '' ,'' ,''],
		unknowndungeon: ['', '', '', '', '', '', '' ,''],
		owitems: [ { item: '', obtained: false}, { item: '', obtained: false}, { item: '', obtained: false} ]
	};

	//White Sword Item
	if (query.f.charAt(8) == 'B') window.items.owitems[0].item = 'book';
	else if (query.f.charAt(8) == 'O') window.items.owitems[0].item = 'boomerang';
	else if (query.f.charAt(8) == 'W') window.items.owitems[0].item = 'bow';
	else if (query.f.charAt(8) == 'H') window.items.owitems[0].item = 'heartcontainer';
	else if (query.f.charAt(8) == 'L') window.items.owitems[0].item = 'ladder';
	else if (query.f.charAt(8) == 'M') window.items.owitems[0].item = 'magicboomerang';
	else if (query.f.charAt(8) == 'A') window.items.owitems[0].item = 'anykey';
	else if (query.f.charAt(8) == 'P') window.items.owitems[0].item = 'bracelet';
	else if (query.f.charAt(8) == 'F') window.items.owitems[0].item = 'raft';
	else if (query.f.charAt(8) == 'E') window.items.owitems[0].item = 'recorder';
	else if (query.f.charAt(8) == 'D') window.items.owitems[0].item = 'redcandle';
	else if (query.f.charAt(8) == 'I') window.items.owitems[0].item = 'redring';
	else if (query.f.charAt(8) == 'S') window.items.owitems[0].item = 'silverarrow';
	else if (query.f.charAt(8) == 'N') window.items.owitems[0].item = 'wand';
	else if (query.f.charAt(8) == 'T') window.items.owitems[0].item = 'whitesword';

	//Coast Item
	if (query.f.charAt(9) == 'B') window.items.owitems[1].item = 'book';
	else if (query.f.charAt(9) == 'O') window.items.owitems[1].item = 'boomerang';
	else if (query.f.charAt(9) == 'W') window.items.owitems[1].item = 'bow';
	else if (query.f.charAt(9) == 'H') window.items.owitems[1].item = 'heartcontainer';
	else if (query.f.charAt(9) == 'L') window.items.owitems[1].item = 'ladder';
	else if (query.f.charAt(9) == 'M') window.items.owitems[1].item = 'magicboomerang';
	else if (query.f.charAt(9) == 'A') window.items.owitems[1].item = 'anykey';
	else if (query.f.charAt(9) == 'P') window.items.owitems[1].item = 'bracelet';
	else if (query.f.charAt(9) == 'F') window.items.owitems[1].item = 'raft';
	else if (query.f.charAt(9) == 'E') window.items.owitems[1].item = 'recorder';
	else if (query.f.charAt(9) == 'D') window.items.owitems[1].item = 'redcandle';
	else if (query.f.charAt(9) == 'I') window.items.owitems[1].item = 'redring';
	else if (query.f.charAt(9) == 'S') window.items.owitems[1].item = 'silverarrow';
	else if (query.f.charAt(9) == 'N') window.items.owitems[1].item = 'wand';
	else if (query.f.charAt(9) == 'T') window.items.owitems[1].item = 'whitesword';

	//Armos Item
	if (query.f.charAt(10) == 'B') window.items.owitems[2].item = 'book';
	else if (query.f.charAt(10) == 'O') window.items.owitems[2].item = 'boomerang';
	else if (query.f.charAt(10) == 'W') window.items.owitems[2].item = 'bow';
	else if (query.f.charAt(10) == 'H') window.items.owitems[2].item = 'heartcontainer';
	else if (query.f.charAt(10) == 'L') window.items.owitems[2].item = 'ladder';
	else if (query.f.charAt(10) == 'M') window.items.owitems[2].item = 'magicboomerang';
	else if (query.f.charAt(10) == 'A') window.items.owitems[2].item = 'anykey';
	else if (query.f.charAt(10) == 'P') window.items.owitems[2].item = 'bracelet';
	else if (query.f.charAt(10) == 'F') window.items.owitems[2].item = 'raft';
	else if (query.f.charAt(10) == 'E') window.items.owitems[2].item = 'recorder';
	else if (query.f.charAt(10) == 'D') window.items.owitems[2].item = 'redcandle';
	else if (query.f.charAt(10) == 'I') window.items.owitems[2].item = 'redring';
	else if (query.f.charAt(10) == 'S') window.items.owitems[2].item = 'silverarrow';
	else if (query.f.charAt(10) == 'N') window.items.owitems[2].item = 'wand';
	else if (query.f.charAt(10) == 'T') window.items.owitems[2].item = 'whitesword';

	window.locations = [];

	for (var i = 0; i < 8; i++) {
		window.locations.push([]);
		for (var j = 0; j < 16; j++) {
			window.locations[i].push( { status: 'U', startingstatus: 'U', tag: '', requirements: '', shopitems: ['', '', ''] } );
		}
	}

	window.dungeons = [];

	var dungeonletter = 'A';

	for (var i = 0; i < 9; i++) {
		//If mystery, use letters instead of numbers
		if (window.flags.unknowndungeons && i != 8) {
			window.dungeons.push( { name: dungeonletter, discovered: false, started: false, items: [], blockers: [], rooms: [], doorsns: [], doorsew: [] });
			dungeonletter = String.fromCharCode(dungeonletter.charCodeAt() + 1)
		} else {
			window.dungeons.push( { name: i + 1, discovered: false, started: false, items: [], blockers: [], rooms: [], doorsns: [], doorsew: [] });
		}

		//If heart shuffle is not live, put the heart in as item 1
		if (!window.flags.heartshuffle && i != 8) {
			window.dungeons[i].items.push( { item: 'heartcontainer', obtained: false } );
		} else {
			window.dungeons[i].items.push( { item: '', obtained: false } );
		}
		window.dungeons[i].items.push( { item: '', obtained: false } );
		if (i == 0 || i == 7) {
			window.dungeons[i].items.push( { item: '', obtained: false } );
		}

		window.dungeons[i].blockers.push( { item: '', hardblock: false }, { item: '', hardblock: false }, { item: '', hardblock: false } );

		for (var j = 0; j < 64; j++) {
			window.dungeons[i].rooms.push( { tile: '', cleared: false, monster: '', item: '' } );
			if (j < 56) {
				window.dungeons[i].doorsns.push( { tile: '' } );
				window.dungeons[i].doorsew.push( { tile: '' } );
			}
		}
	}

	//9 Item 1
	if (query.f.charAt(11) == 'B') window.dungeons[8].items[0] .item = 'book';
	else if (query.f.charAt(11) == 'O') window.dungeons[8].items[0] .item = 'boomerang';
	else if (query.f.charAt(11) == 'W') window.dungeons[8].items[0] .item = 'bow';
	else if (query.f.charAt(11) == 'H') window.dungeons[8].items[0] .item = 'heartcontainer';
	else if (query.f.charAt(11) == 'L') window.dungeons[8].items[0] .item = 'ladder';
	else if (query.f.charAt(11) == 'M') window.dungeons[8].items[0] .item = 'magicboomerang';
	else if (query.f.charAt(11) == 'A') window.dungeons[8].items[0] .item = 'anykey';
	else if (query.f.charAt(11) == 'P') window.dungeons[8].items[0] .item = 'bracelet';
	else if (query.f.charAt(11) == 'F') window.dungeons[8].items[0] .item = 'raft';
	else if (query.f.charAt(11) == 'E') window.dungeons[8].items[0] .item = 'recorder';
	else if (query.f.charAt(11) == 'D') window.dungeons[8].items[0] .item = 'redcandle';
	else if (query.f.charAt(11) == 'I') window.dungeons[8].items[0] .item = 'redring';
	else if (query.f.charAt(11) == 'S') window.dungeons[8].items[0] .item = 'silverarrow';
	else if (query.f.charAt(11) == 'N') window.dungeons[8].items[0] .item = 'wand';
	else if (query.f.charAt(11) == 'T') window.dungeons[8].items[0] .item = 'whitesword';

	//9 Item 2
	if (query.f.charAt(12) == 'B') window.dungeons[8].items[1] .item = 'book';
	else if (query.f.charAt(12) == 'O') window.dungeons[8].items[1] .item = 'boomerang';
	else if (query.f.charAt(12) == 'W') window.dungeons[8].items[1] .item = 'bow';
	else if (query.f.charAt(12) == 'H') window.dungeons[8].items[1] .item = 'heartcontainer';
	else if (query.f.charAt(12) == 'L') window.dungeons[8].items[1] .item = 'ladder';
	else if (query.f.charAt(12) == 'M') window.dungeons[8].items[1] .item = 'magicboomerang';
	else if (query.f.charAt(12) == 'A') window.dungeons[8].items[1] .item = 'anykey';
	else if (query.f.charAt(12) == 'P') window.dungeons[8].items[1] .item = 'bracelet';
	else if (query.f.charAt(12) == 'F') window.dungeons[8].items[1] .item = 'raft';
	else if (query.f.charAt(12) == 'E') window.dungeons[8].items[1] .item = 'recorder';
	else if (query.f.charAt(12) == 'D') window.dungeons[8].items[1] .item = 'redcandle';
	else if (query.f.charAt(12) == 'I') window.dungeons[8].items[1] .item = 'redring';
	else if (query.f.charAt(12) == 'S') window.dungeons[8].items[1] .item = 'silverarrow';
	else if (query.f.charAt(12) == 'N') window.dungeons[8].items[1] .item = 'wand';
	else if (query.f.charAt(12) == 'T') window.dungeons[8].items[1] .item = 'whitesword';


	setdefaultstatus(window.flags.quest);
	//updateow();

	//Set default statuses
	function setdefaultstatus(quest)  {
		if (quest == "1") {
			window.locations[0][1].status = 'A';
			window.locations[0][1].startingstatus = 'A';
			window.locations[0][1].requirements = 'B';
			window.locations[0][3].status = 'A';
			window.locations[0][3].startingstatus = 'A';
			window.locations[0][3].requirements = 'B';
			window.locations[0][4].status = 'A';
			window.locations[0][4].startingstatus = 'A';
			window.locations[0][5].status = 'A';
			window.locations[0][5].startingstatus = 'A';
			window.locations[0][5].requirements = 'B';
			window.locations[0][7].status = 'A';
			window.locations[0][7].startingstatus = 'A';
			window.locations[0][7].requirements = 'B';
			window.locations[0][10].status = 'A';
			window.locations[0][10].startingstatus = 'A';
			window.locations[0][11].status = 'A';
			window.locations[0][11].startingstatus = 'A';
			window.locations[0][12].status = 'A';
			window.locations[0][12].startingstatus = 'A';
			window.locations[0][13].status = 'A';
			window.locations[0][13].startingstatus = 'A';
			window.locations[0][13].requirements = 'B';
			window.locations[0][14].status = 'A';
			window.locations[0][14].startingstatus = 'A';
			window.locations[0][15].status = 'A';
			window.locations[0][15].startingstatus = 'A';
			window.locations[1][0].status = 'A';
			window.locations[1][0].startingstatus = 'A';
			window.locations[1][0].requirements = 'B';
			window.locations[1][2].status = 'A';
			window.locations[1][2].startingstatus = 'A';
			window.locations[1][2].requirements = 'B';
			window.locations[1][3].status = 'A';
			window.locations[1][3].startingstatus = 'A';
			window.locations[1][3].requirements = 'B';
			window.locations[1][4].status = 'A';
			window.locations[1][4].startingstatus = 'A';
			window.locations[1][4].requirements = 'B';
			window.locations[1][6].status = 'A';
			window.locations[1][6].startingstatus = 'A';
			window.locations[1][6].requirements = 'B';
			window.locations[1][10].status = 'A';
			window.locations[1][10].startingstatus = 'A';
			window.locations[1][12].status = 'A';
			window.locations[1][12].startingstatus = 'A';
			window.locations[1][13].status = 'A';
			window.locations[1][13].startingstatus = 'A';
			window.locations[1][13].requirements = 'P';
			window.locations[1][14].status = 'A';
			window.locations[1][14].startingstatus = 'A';
			window.locations[1][14].requirements = 'B';
			window.locations[1][15].status = 'A';
			window.locations[1][15].startingstatus = 'A';
			window.locations[2][1].status = 'A';
			window.locations[2][1].startingstatus = 'A';
			window.locations[2][2].status = 'A';
			window.locations[2][2].startingstatus = 'A';
			window.locations[2][3].status = 'A';
			window.locations[2][3].startingstatus = 'A';
			window.locations[2][3].requirements = 'P';
			window.locations[2][4].status = 'A';
			window.locations[2][4].startingstatus = 'A';
			window.locations[2][5].status = 'A';
			window.locations[2][5].startingstatus = 'A';
			window.locations[2][6].status = 'A';
			window.locations[2][6].startingstatus = 'A';
			window.locations[2][6].requirements = 'B';
			window.locations[2][7].status = 'A';
			window.locations[2][7].startingstatus = 'A';
			window.locations[2][7].requirements = 'B';
			window.locations[2][8].status = 'A';
			window.locations[2][8].startingstatus = 'A';
			window.locations[2][8].requirements = 'C';
			window.locations[2][12].status = 'A';
			window.locations[2][12].startingstatus = 'A';
			window.locations[2][12].requirements = 'B';
			window.locations[2][13].status = 'A';
			window.locations[2][13].startingstatus = 'A';
			window.locations[2][13].requirements = 'B';
			window.locations[2][15].status = 'A';
			window.locations[2][15].startingstatus = 'A';
			window.locations[2][15].requirements = 'R';
			window.locations[3][3].status = 'A';
			window.locations[3][3].startingstatus = 'A';
			window.locations[3][3].requirements = 'B';
			window.locations[3][4].status = 'A';
			window.locations[3][4].startingstatus = 'A';
			window.locations[3][7].status = 'A';
			window.locations[3][7].startingstatus = 'A';
			window.locations[3][12].status = 'A';
			window.locations[3][12].startingstatus = 'A';
			window.locations[3][13].status = 'A';
			window.locations[3][13].startingstatus = 'A';
			window.locations[4][2].status = 'A';
			window.locations[4][2].startingstatus = 'A';
			window.locations[4][2].requirements = 'F';
			window.locations[4][4].status = 'A';
			window.locations[4][4].startingstatus = 'A';
			window.locations[4][5].status = 'A';
			window.locations[4][5].startingstatus = 'A';
			window.locations[4][5].requirements = 'R';
			window.locations[4][6].status = 'A';
			window.locations[4][6].startingstatus = 'A';
			window.locations[4][6].requirements = 'C';
			window.locations[4][7].status = 'A';
			window.locations[4][7].startingstatus = 'A';
			window.locations[4][7].requirements = 'C';
			window.locations[4][8].status = 'A';
			window.locations[4][8].startingstatus = 'A';
			window.locations[4][8].requirements = 'C';
			window.locations[4][9].status = 'A';
			window.locations[4][9].startingstatus = 'A';
			window.locations[4][9].requirements = 'P';
			window.locations[4][10].status = 'A';
			window.locations[4][10].startingstatus = 'A';
			window.locations[4][11].status = 'A';
			window.locations[4][11].startingstatus = 'A';
			window.locations[4][11].requirements = 'C';
			window.locations[4][13].status = 'A';
			window.locations[4][13].startingstatus = 'A';
			window.locations[4][13].requirements = 'C';
			window.locations[4][14].status = 'A';
			window.locations[4][14].startingstatus = 'A';
			window.locations[5][1].status = 'A';
			window.locations[5][1].startingstatus = 'A';
			window.locations[5][1].requirements = 'C';
			window.locations[5][6].status = 'A';
			window.locations[5][6].startingstatus = 'A';
			window.locations[5][6].requirements = 'C';
			window.locations[5][11].status = 'A';
			window.locations[5][11].startingstatus = 'A';
			window.locations[5][11].requirements = 'C';
			window.locations[5][14].status = 'A';
			window.locations[5][14].startingstatus = 'A';
			window.locations[6][2].status = 'A';
			window.locations[6][2].startingstatus = 'A';
			window.locations[6][2].requirements = 'C';
			window.locations[6][3].status = 'A';
			window.locations[6][3].startingstatus = 'A';
			window.locations[6][3].requirements = 'C';
			window.locations[6][4].status = 'A';
			window.locations[6][4].startingstatus = 'A';
			window.locations[6][6].status = 'A';
			window.locations[6][6].startingstatus = 'A';
			window.locations[6][7].status = 'A';
			window.locations[6][7].startingstatus = 'A';
			window.locations[6][7].requirements = 'B';
			window.locations[6][8].status = 'A';
			window.locations[6][8].startingstatus = 'A';
			window.locations[6][8].requirements = 'C';
			window.locations[6][10].status = 'A';
			window.locations[6][10].startingstatus = 'A';
			window.locations[6][10].requirements = 'C';
			window.locations[6][11].status = 'A';
			window.locations[6][11].startingstatus = 'A';
			window.locations[6][11].requirements = 'C';
			window.locations[6][13].status = 'A';
			window.locations[6][13].startingstatus = 'A';
			window.locations[6][13].requirements = 'C';
			window.locations[6][15].status = 'A';
			window.locations[6][15].startingstatus = 'A';
			window.locations[7][0].status = 'A';
			window.locations[7][0].startingstatus = 'A';
			window.locations[7][1].status = 'A';
			window.locations[7][1].startingstatus = 'A';
			window.locations[7][1].requirements = 'B';
			window.locations[7][4].status = 'A';
			window.locations[7][4].startingstatus = 'A';
			window.locations[7][5].status = 'A';
			window.locations[7][5].startingstatus = 'A';
			window.locations[7][6].status = 'A';
			window.locations[7][6].startingstatus = 'A';
			window.locations[7][6].requirements = 'B';
			window.locations[7][7].status = 'A';
			window.locations[7][7].startingstatus = 'A';
			window.locations[7][8].status = 'A';
			window.locations[7][8].startingstatus = 'A';
			window.locations[7][8].requirements = 'C';
			window.locations[7][9].status = 'A';
			window.locations[7][9].startingstatus = 'A';
			window.locations[7][9].requirements = 'P';
			window.locations[7][11].status = 'A';
			window.locations[7][11].startingstatus = 'A';
			window.locations[7][11].requirements = 'B';
			window.locations[7][12].status = 'A';
			window.locations[7][12].startingstatus = 'A';
			window.locations[7][12].requirements = 'B';
			window.locations[7][13].status = 'A';
			window.locations[7][13].startingstatus = 'A';
			window.locations[7][13].requirements = 'B';
		} else if (quest == "M") {
			window.locations[0][0].status = 'M';
			window.locations[0][0].startingstatus = 'M';
			window.locations[0][0].requirements = 'B';
			window.locations[0][1].status = 'A';
			window.locations[0][1].startingstatus = 'A';
			window.locations[0][1].requirements = 'B';
			window.locations[0][2].status = 'M';
			window.locations[0][2].startingstatus = 'M';
			window.locations[0][2].requirements = 'B';
			window.locations[0][3].status = 'A';
			window.locations[0][3].startingstatus = 'A';
			window.locations[0][3].requirements = 'B';
			window.locations[0][4].status = 'A';
			window.locations[0][4].startingstatus = 'A';
			window.locations[0][5].status = 'M';
			window.locations[0][5].startingstatus = 'M';
			window.locations[0][5].requirements = 'B';
			window.locations[0][6].status = 'M';
			window.locations[0][6].startingstatus = 'M';
			window.locations[0][6].requirements = 'F';
			window.locations[0][7].status = 'A';
			window.locations[0][7].startingstatus = 'A';
			window.locations[0][7].requirements = 'B';
			window.locations[0][9].status = 'M';
			window.locations[0][9].startingstatus = 'M';
			window.locations[0][9].requirements = 'P';
			window.locations[0][10].status = 'A';
			window.locations[0][10].startingstatus = 'A';
			window.locations[0][11].status = 'A';
			window.locations[0][11].startingstatus = 'A';
			window.locations[0][12].status = 'A';
			window.locations[0][12].startingstatus = 'A';
			window.locations[0][13].status = 'A';
			window.locations[0][13].startingstatus = 'A';
			window.locations[0][13].requirements = 'B';
			window.locations[0][14].status = 'A';
			window.locations[0][14].startingstatus = 'A';
			window.locations[0][15].status = 'A';
			window.locations[0][15].startingstatus = 'A';
			window.locations[1][0].status = 'A';
			window.locations[1][0].startingstatus = 'A';
			window.locations[1][0].requirements = 'B';
			window.locations[1][1].status = 'M';
			window.locations[1][1].startingstatus = 'M';
			window.locations[1][1].requirements = 'P';
			window.locations[1][2].status = 'A';
			window.locations[1][2].startingstatus = 'A';
			window.locations[1][2].requirements = 'B';
			window.locations[1][3].status = 'A';
			window.locations[1][3].startingstatus = 'A';
			window.locations[1][3].requirements = 'B';
			window.locations[1][4].status = 'A';
			window.locations[1][4].startingstatus = 'A';
			window.locations[1][4].requirements = 'B';
			window.locations[1][5].status = 'M';
			window.locations[1][5].startingstatus = 'M';
			window.locations[1][5].requirements = 'B';
			window.locations[1][6].status = 'A';
			window.locations[1][6].startingstatus = 'A';
			window.locations[1][6].requirements = 'B';
			window.locations[1][8].status = 'M';
			window.locations[1][8].startingstatus = 'M';
			window.locations[1][8].requirements = 'L';
			window.locations[1][9].status = 'M';
			window.locations[1][9].startingstatus = 'M';
			window.locations[1][9].requirements = 'L';
			window.locations[1][10].status = 'A';
			window.locations[1][10].startingstatus = 'A';
			window.locations[1][11].status = 'M';
			window.locations[1][11].startingstatus = 'M';
			window.locations[1][11].requirements = 'P';
			window.locations[1][12].status = 'A';
			window.locations[1][12].startingstatus = 'A';
			window.locations[1][13].status = 'A';
			window.locations[1][13].startingstatus = 'A';
			window.locations[1][13].requirements = 'P';
			window.locations[1][14].status = 'A';
			window.locations[1][14].startingstatus = 'A';
			window.locations[1][14].requirements = 'B';
			window.locations[1][15].status = 'A';
			window.locations[1][15].startingstatus = 'A';
			window.locations[2][0].status = 'M';
			window.locations[2][0].startingstatus = 'M';
			window.locations[2][1].status = 'M';
			window.locations[2][1].startingstatus = 'M';
			window.locations[2][2].status = 'A';
			window.locations[2][2].startingstatus = 'A';
			window.locations[2][3].status = 'A';
			window.locations[2][3].startingstatus = 'A';
			window.locations[2][3].requirements = 'P';
			window.locations[2][4].status = 'A';
			window.locations[2][4].startingstatus = 'A';
			window.locations[2][5].status = 'A';
			window.locations[2][5].startingstatus = 'A';
			window.locations[2][6].status = 'A';
			window.locations[2][6].startingstatus = 'A';
			window.locations[2][6].requirements = 'B';
			window.locations[2][7].status = 'M';
			window.locations[2][7].startingstatus = 'M';
			window.locations[2][7].requirements = 'B';
			window.locations[2][8].status = 'A';
			window.locations[2][8].startingstatus = 'A';
			window.locations[2][8].requirements = 'C';
			window.locations[2][9].status = 'M';
			window.locations[2][9].startingstatus = 'M';
			window.locations[2][9].requirements = 'F';
			window.locations[2][11].status = 'M';
			window.locations[2][11].startingstatus = 'M';
			window.locations[2][11].requirements = 'F';
			window.locations[2][12].status = 'M';
			window.locations[2][12].startingstatus = 'M';
			window.locations[2][12].requirements = 'B';
			window.locations[2][13].status = 'A';
			window.locations[2][13].startingstatus = 'A';
			window.locations[2][13].requirements = 'B';
			window.locations[2][15].status = 'A';
			window.locations[2][15].startingstatus = 'A';
			window.locations[2][15].requirements = 'R';
			window.locations[3][0].status = 'M';
			window.locations[3][0].startingstatus = 'M';
			window.locations[3][0].requirements = 'F';
			window.locations[3][3].status = 'A';
			window.locations[3][3].startingstatus = 'A';
			window.locations[3][3].requirements = 'B';
			window.locations[3][4].status = 'A';
			window.locations[3][4].startingstatus = 'A';
			window.locations[3][7].status = 'A';
			window.locations[3][7].startingstatus = 'A';
			window.locations[3][10].status = 'M';
			window.locations[3][10].startingstatus = 'M';
			window.locations[3][10].requirements = 'F';
			window.locations[3][12].status = 'A';
			window.locations[3][12].startingstatus = 'A';
			window.locations[3][12].requirements = 'F';
			window.locations[3][13].status = 'A';
			window.locations[3][13].startingstatus = 'A';
			window.locations[4][2].status = 'A';
			window.locations[4][2].startingstatus = 'A';
			window.locations[4][2].requirements = 'F';
			window.locations[4][4].status = 'A';
			window.locations[4][4].startingstatus = 'A';
			window.locations[4][5].status = 'A';
			window.locations[4][5].startingstatus = 'A';
			window.locations[4][5].requirements = 'R';
			window.locations[4][6].status = 'A';
			window.locations[4][6].startingstatus = 'A';
			window.locations[4][6].requirements = 'C';
			window.locations[4][7].status = 'M';
			window.locations[4][7].startingstatus = 'M';
			window.locations[4][7].requirements = 'C';
			window.locations[4][8].status = 'A';
			window.locations[4][8].startingstatus = 'A';
			window.locations[4][8].requirements = 'C';
			window.locations[4][9].status = 'A';
			window.locations[4][9].startingstatus = 'A';
			window.locations[4][9].requirements = 'P';
			window.locations[4][10].status = 'A';
			window.locations[4][10].startingstatus = 'A';
			window.locations[4][11].status = 'A';
			window.locations[4][11].startingstatus = 'A';
			window.locations[4][11].requirements = 'C';
			window.locations[4][13].status = 'A';
			window.locations[4][13].startingstatus = 'A';
			window.locations[4][13].requirements = 'C';
			window.locations[4][14].status = 'A';
			window.locations[4][14].startingstatus = 'A';
			window.locations[5][1].status = 'A';
			window.locations[5][1].startingstatus = 'A';
			window.locations[5][1].requirements = 'C';
			window.locations[5][3].status = 'M';
			window.locations[5][3].startingstatus = 'M';
			window.locations[5][3].requirements = 'C';
			window.locations[5][6].status = 'A';
			window.locations[5][6].startingstatus = 'A';
			window.locations[5][6].requirements = 'C';
			window.locations[5][8].status = 'M';
			window.locations[5][8].startingstatus = 'M';
			window.locations[5][8].requirements = 'F';
			window.locations[5][11].status = 'A';
			window.locations[5][11].startingstatus = 'A';
			window.locations[5][11].requirements = 'C';
			window.locations[5][14].status = 'A';
			window.locations[5][14].startingstatus = 'A';
			window.locations[6][0].status = 'M';
			window.locations[6][0].startingstatus = 'M';
			window.locations[6][0].requirements = 'F';
			window.locations[6][2].status = 'M';
			window.locations[6][2].startingstatus = 'M';
			window.locations[6][2].requirements = 'C';
			window.locations[6][3].status = 'A';
			window.locations[6][3].startingstatus = 'A';
			window.locations[6][3].requirements = 'C';
			window.locations[6][4].status = 'A';
			window.locations[6][4].startingstatus = 'A';
			window.locations[6][6].status = 'A';
			window.locations[6][6].startingstatus = 'A';
			window.locations[6][7].status = 'M';
			window.locations[6][7].startingstatus = 'M';
			window.locations[6][7].requirements = 'B';
			window.locations[6][8].status = 'A';
			window.locations[6][8].startingstatus = 'A';
			window.locations[6][8].requirements = 'C';
			window.locations[6][10].status = 'A';
			window.locations[6][10].startingstatus = 'A';
			window.locations[6][10].requirements = 'C';
			window.locations[6][11].status = 'M';
			window.locations[6][11].startingstatus = 'M';
			window.locations[6][11].requirements = 'C';
			window.locations[6][12].status = 'M';
			window.locations[6][12].startingstatus = 'M';
			window.locations[6][12].requirements = 'C';
			window.locations[6][13].status = 'M';
			window.locations[6][13].startingstatus = 'M';
			window.locations[6][13].requirements = 'C';			
			window.locations[6][14].status = 'M';
			window.locations[6][14].startingstatus = 'M';
			window.locations[6][14].requirements = 'F';
			window.locations[6][15].status = 'A';
			window.locations[6][15].startingstatus = 'A';
			window.locations[7][0].status = 'A';
			window.locations[7][0].startingstatus = 'A';
			window.locations[7][1].status = 'M';
			window.locations[7][1].startingstatus = 'M';
			window.locations[7][1].requirements = 'B';
			window.locations[7][2].status = 'M';
			window.locations[7][2].startingstatus = 'M';
			window.locations[7][2].requirements = 'F';
			window.locations[7][4].status = 'A';
			window.locations[7][4].startingstatus = 'A';
			window.locations[7][5].status = 'A';
			window.locations[7][5].startingstatus = 'A';
			window.locations[7][6].status = 'A';
			window.locations[7][6].startingstatus = 'A';
			window.locations[7][6].requirements = 'B';
			window.locations[7][7].status = 'A';
			window.locations[7][7].startingstatus = 'A';
			window.locations[7][8].status = 'A';
			window.locations[7][8].startingstatus = 'A';
			window.locations[7][8].requirements = 'C';
			window.locations[7][9].status = 'A';
			window.locations[7][9].startingstatus = 'A';
			window.locations[7][9].requirements = 'P';
			window.locations[7][11].status = 'M';
			window.locations[7][11].startingstatus = 'M';
			window.locations[7][11].requirements = 'B';
			window.locations[7][12].status = 'A';
			window.locations[7][12].startingstatus = 'A';
			window.locations[7][12].requirements = 'B';
			window.locations[7][13].status = 'A';
			window.locations[7][13].startingstatus = 'A';
			window.locations[7][13].requirements = 'B';
		} else if (quest == "2") {
			window.locations[0][0].status = 'A';
			window.locations[0][0].startingstatus = 'A';
			window.locations[0][0].requirements = 'B';
			window.locations[0][1].status = 'A';
			window.locations[0][1].startingstatus = 'A';
			window.locations[0][1].requirements = 'B';
			window.locations[0][2].status = 'A';
			window.locations[0][2].startingstatus = 'A';
			window.locations[0][2].requirements = 'B';
			window.locations[0][3].status = 'A';
			window.locations[0][3].startingstatus = 'A';
			window.locations[0][3].requirements = 'B';
			window.locations[0][4].status = 'A';
			window.locations[0][4].startingstatus = 'A';
			window.locations[0][6].status = 'A';
			window.locations[0][6].startingstatus = 'A';
			window.locations[0][6].requirements = 'F';
			window.locations[0][7].status = 'A';
			window.locations[0][7].startingstatus = 'A';
			window.locations[0][7].requirements = 'B';
			window.locations[0][9].status = 'A';
			window.locations[0][9].startingstatus = 'A';
			window.locations[0][9].requirements = 'P';
			window.locations[0][10].status = 'A';
			window.locations[0][10].startingstatus = 'A';
			window.locations[0][12].status = 'A';
			window.locations[0][12].startingstatus = 'A';
			window.locations[0][13].status = 'A';
			window.locations[0][13].startingstatus = 'A';
			window.locations[0][13].requirements = 'B';
			window.locations[0][14].status = 'A';
			window.locations[0][14].startingstatus = 'A';
			window.locations[0][15].status = 'A';
			window.locations[0][15].startingstatus = 'A';
			window.locations[1][0].status = 'A';
			window.locations[1][0].startingstatus = 'A';
			window.locations[1][0].requirements = 'B';
			window.locations[1][1].status = 'A';
			window.locations[1][1].startingstatus = 'A';
			window.locations[1][1].requirements = 'P';
			window.locations[1][2].status = 'A';
			window.locations[1][2].startingstatus = 'A';
			window.locations[1][2].requirements = 'B';
			window.locations[1][3].status = 'A';
			window.locations[1][3].startingstatus = 'A';
			window.locations[1][3].requirements = 'B';
			window.locations[1][4].status = 'A';
			window.locations[1][4].startingstatus = 'A';
			window.locations[1][4].requirements = 'B';
			window.locations[1][5].status = 'A';
			window.locations[1][5].startingstatus = 'A';
			window.locations[1][5].requirements = 'B';
			window.locations[1][6].status = 'A';
			window.locations[1][6].startingstatus = 'A';
			window.locations[1][6].requirements = 'B';
			window.locations[1][8].status = 'A';
			window.locations[1][8].startingstatus = 'A';
			window.locations[1][8].requirements = 'L';
			window.locations[1][9].status = 'A';
			window.locations[1][9].startingstatus = 'A';
			window.locations[1][9].requirements = 'L';
			window.locations[1][10].status = 'A';
			window.locations[1][10].startingstatus = 'A';
			window.locations[1][11].status = 'A';
			window.locations[1][11].startingstatus = 'A';
			window.locations[1][11].requirements = 'p';
			window.locations[1][12].status = 'A';
			window.locations[1][12].startingstatus = 'A';
			window.locations[1][13].status = 'A';
			window.locations[1][13].startingstatus = 'A';
			window.locations[1][13].requirements = 'P';
			window.locations[1][14].status = 'A';
			window.locations[1][14].startingstatus = 'A';
			window.locations[1][14].requirements = 'B';
			window.locations[1][15].status = 'A';
			window.locations[1][15].startingstatus = 'A';
			window.locations[2][0].status = 'A';
			window.locations[2][0].startingstatus = 'A';
			window.locations[2][2].status = 'A';
			window.locations[2][2].startingstatus = 'A';
			window.locations[2][3].status = 'A';
			window.locations[2][3].startingstatus = 'A';
			window.locations[2][3].requirements = 'P';
			window.locations[2][4].status = 'A';
			window.locations[2][4].startingstatus = 'A';
			window.locations[2][5].status = 'A';
			window.locations[2][5].startingstatus = 'A';
			window.locations[2][6].status = 'A';
			window.locations[2][6].startingstatus = 'A';
			window.locations[2][6].requirements = 'B';
			window.locations[2][8].status = 'A';
			window.locations[2][8].startingstatus = 'A';
			window.locations[2][8].requirements = 'C';
			window.locations[2][9].status = 'A';
			window.locations[2][9].startingstatus = 'A';
			window.locations[2][9].requirements = 'F';
			window.locations[2][11].status = 'A';
			window.locations[2][11].startingstatus = 'A';
			window.locations[2][11].requirements = 'F';
			window.locations[2][13].status = 'A';
			window.locations[2][13].startingstatus = 'A';
			window.locations[2][13].requirements = 'B';
			window.locations[2][15].status = 'A';
			window.locations[2][15].startingstatus = 'A';
			window.locations[2][15].requirements = 'R';
			window.locations[3][0].status = 'A';
			window.locations[3][0].startingstatus = 'A';
			window.locations[3][0].requirements = 'F';
			window.locations[3][3].status = 'A';
			window.locations[3][3].startingstatus = 'A';
			window.locations[3][3].requirements = 'B';
			window.locations[3][4].status = 'A';
			window.locations[3][4].startingstatus = 'A';
			window.locations[3][7].status = 'A';
			window.locations[3][7].startingstatus = 'A';
			window.locations[3][10].status = 'A';
			window.locations[3][10].startingstatus = 'A';
			window.locations[3][10].requirements = 'F';
			window.locations[3][12].status = 'A';
			window.locations[3][12].startingstatus = 'A';
			window.locations[3][12].requirements = 'F';
			window.locations[3][13].status = 'A';
			window.locations[3][13].startingstatus = 'A';
			window.locations[4][4].status = 'A';
			window.locations[4][4].startingstatus = 'A';
			window.locations[4][5].status = 'A';
			window.locations[4][5].startingstatus = 'A';
			window.locations[4][5].requirements = 'R';
			window.locations[4][6].status = 'A';
			window.locations[4][6].startingstatus = 'A';
			window.locations[4][6].requirements = 'C';
			window.locations[4][8].status = 'A';
			window.locations[4][8].startingstatus = 'A';
			window.locations[4][8].requirements = 'C';
			window.locations[4][9].status = 'A';
			window.locations[4][9].startingstatus = 'A';
			window.locations[4][9].requirements = 'P';
			window.locations[4][10].status = 'A';
			window.locations[4][10].startingstatus = 'A';
			window.locations[4][11].status = 'A';
			window.locations[4][11].startingstatus = 'A';
			window.locations[4][11].requirements = 'C';
			window.locations[4][13].status = 'A';
			window.locations[4][13].startingstatus = 'A';
			window.locations[4][13].requirements = 'C';
			window.locations[4][14].status = 'A';
			window.locations[4][14].startingstatus = 'A';
			window.locations[5][1].status = 'A';
			window.locations[5][1].startingstatus = 'A';
			window.locations[5][1].requirements = 'C';
			window.locations[5][3].status = 'A';
			window.locations[5][3].startingstatus = 'A';
			window.locations[5][3].requirements = 'C';
			window.locations[5][6].status = 'A';
			window.locations[5][6].startingstatus = 'A';
			window.locations[5][6].requirements = 'C';
			window.locations[5][8].status = 'A';
			window.locations[5][8].startingstatus = 'A';
			window.locations[5][8].requirements = 'F';
			window.locations[5][11].status = 'A';
			window.locations[5][11].startingstatus = 'A';
			window.locations[5][11].requirements = 'C';
			window.locations[5][14].status = 'A';
			window.locations[5][14].startingstatus = 'A';
			window.locations[6][0].status = 'A';
			window.locations[6][0].startingstatus = 'A';
			window.locations[6][0].requirements = 'F';
			window.locations[6][3].status = 'A';
			window.locations[6][3].startingstatus = 'A';
			window.locations[6][3].requirements = 'C';
			window.locations[6][4].status = 'A';
			window.locations[6][4].startingstatus = 'A';
			window.locations[6][6].status = 'A';
			window.locations[6][6].startingstatus = 'A';
			window.locations[6][8].status = 'A';
			window.locations[6][8].startingstatus = 'A';
			window.locations[6][8].requirements = 'C';
			window.locations[6][10].status = 'A';
			window.locations[6][10].startingstatus = 'A';
			window.locations[6][10].requirements = 'C';
			window.locations[6][11].status = 'A';
			window.locations[6][11].startingstatus = 'A';
			window.locations[6][11].requirements = 'C';
			window.locations[6][12].status = 'A';
			window.locations[6][12].startingstatus = 'A';
			window.locations[6][12].requirements = 'C';
			window.locations[6][14].status = 'A';
			window.locations[6][14].startingstatus = 'A';
			window.locations[6][14].requirements = 'F';
			window.locations[6][15].status = 'A';
			window.locations[6][15].startingstatus = 'A';
			window.locations[7][0].status = 'A';
			window.locations[7][0].startingstatus = 'A';
			window.locations[7][2].status = 'A';
			window.locations[7][2].startingstatus = 'A';
			window.locations[7][2].requirements = 'F';
			window.locations[7][4].status = 'A';
			window.locations[7][4].startingstatus = 'A';
			window.locations[7][5].status = 'A';
			window.locations[7][5].startingstatus = 'A';
			window.locations[7][6].status = 'A';
			window.locations[7][6].startingstatus = 'A';
			window.locations[7][6].requirements = 'B';
			window.locations[7][7].status = 'A';
			window.locations[7][7].startingstatus = 'A';
			window.locations[7][8].status = 'A';
			window.locations[7][8].startingstatus = 'A';
			window.locations[7][8].requirements = 'C';
			window.locations[7][9].status = 'A';
			window.locations[7][9].startingstatus = 'A';
			window.locations[7][9].requirements = 'P';
			window.locations[7][12].status = 'A';
			window.locations[7][12].startingstatus = 'A';
			window.locations[7][12].requirements = 'B';
			window.locations[7][13].status = 'A';
			window.locations[7][13].startingstatus = 'A';
			window.locations[7][13].requirements = 'B';
		}
	};

	window.initialize = function() {
		document.getElementById("owstyle").href = "css/owq" + window.flags.quest + ".css?v=" + buildstring;
	
		//Hide the blocks that we don't want there, but not including throws off formatting
		//Use visibility hidden and not display none because of floats
		document.getElementById('dungeonitem_2_3').style.visibility = 'hidden';
		document.getElementById('dungeonitem_3_3').style.visibility = 'hidden';
		document.getElementById('dungeonitem_4_3').style.visibility = 'hidden';
		document.getElementById('dungeonitem_5_3').style.visibility = 'hidden';
		document.getElementById('dungeonitem_6_3').style.visibility = 'hidden';
		document.getElementById('dungeonitem_7_3').style.visibility = 'hidden';

		if (!window.flags.unknowndungeons) {
			document.getElementById('unknowndungeonheader').style.visibility = 'hidden';
			document.getElementById('unknowndungeonscolumn').style.visibility = 'hidden';
		}

		if (!window.flags.hints) {
			document.getElementById('dungeonhintheader').style.visibility = 'hidden';
			document.getElementById('hintdungeonscolumn').style.visibility = 'hidden';
		}

		if (window.flags.swordless) {
			document.getElementById('item_woodsword').style.visibility = 'hidden';
			document.getElementById('item_whitesword').classList.remove('whitesword');
			document.getElementById('item_whitesword').classList.add('bombupgrade');
			document.getElementById('item_magicsword').classList.remove('magicsword');
			document.getElementById('item_magicsword').classList.add('bombupgrade');
			document.getElementById('itemselectwhitesword').classList.remove('itemselectwhitesword');
			document.getElementById('itemselectwhitesword').classList.add('bombupgrade');
			document.getElementById('blockerselectmelee').classList.remove('blockerselectmelee');
			document.getElementById('blockerselectmelee').classList.add('blockerselectwand');
			
		}

		if (window.flags.showboard) {
			document.getElementById('dungeonmap_1_0').innerHTML = 'B';
			document.getElementById('dungeonmap_2_0').innerHTML = 'O';
			document.getElementById('dungeonmap_3_0').innerHTML = 'A';
			document.getElementById('dungeonmap_4_0').innerHTML = 'R';
			document.getElementById('dungeonmap_5_0').innerHTML = 'D';
		}


		switchdungeon(0);

		window.updateow();
	}

	function resetAllItemClasses() {
		document.getElementById('item_woodsword').classList.remove('itemnotcollected');
		document.getElementById('item_whitesword').classList.remove('itemnotcollected');
		document.getElementById('item_magicsword').classList.remove('itemnotcollected');
		document.getElementById('item_raft').classList.remove('itemnotcollected');
		document.getElementById('item_book').classList.remove('itemnotcollected');
		document.getElementById('item_ring').classList.remove('itemnotcollected');
		document.getElementById('item_ring').classList.remove('redring');
		document.getElementById('item_ring').classList.remove('bluering');
		document.getElementById('item_ladder').classList.remove('itemnotcollected');
		document.getElementById('item_anykey').classList.remove('itemnotcollected');
		document.getElementById('item_bracelet').classList.remove('itemnotcollected');
		document.getElementById('item_boomerang').classList.remove('itemnotcollected');
		document.getElementById('item_boomerang').classList.remove('boomerang');
		document.getElementById('item_boomerang').classList.remove('magicboomerang');
		document.getElementById('item_bomb').classList.remove('itemnotcollected');
		document.getElementById('item_arrow').classList.remove('itemnotcollected');
		document.getElementById('item_arrow').classList.remove('woodarrow');
		document.getElementById('item_arrow').classList.remove('silverarrow');
		document.getElementById('item_bow').classList.remove('itemnotcollected');
		document.getElementById('item_candle').classList.remove('itemnotcollected');
		document.getElementById('item_candle').classList.remove('bluecandle');
		document.getElementById('item_candle').classList.remove('redcandle');
		document.getElementById('item_recorder').classList.remove('itemnotcollected');
		document.getElementById('item_meat').classList.remove('itemnotcollected');
		document.getElementById('item_potion').classList.remove('itemnotcollected');
		document.getElementById('item_potion').classList.remove('manuscript');
		document.getElementById('item_potion').classList.remove('bluepotion');
		document.getElementById('item_potion').classList.remove('redpotion');
		document.getElementById('item_wand').classList.remove('itemnotcollected');
		document.getElementById('takeanyheart_1').classList.remove('itemnotcollected');
		document.getElementById('takeanyheart_1').classList.remove('heartcontainer');
		document.getElementById('takeanyheart_1').classList.remove('anypotion');
		document.getElementById('takeanyheart_2').classList.remove('itemnotcollected');
		document.getElementById('takeanyheart_2').classList.remove('heartcontainer');
		document.getElementById('takeanyheart_2').classList.remove('anypotion');
		document.getElementById('takeanyheart_3').classList.remove('itemnotcollected');
		document.getElementById('takeanyheart_3').classList.remove('heartcontainer');
		document.getElementById('takeanyheart_3').classList.remove('anypotion');
		document.getElementById('takeanyheart_4').classList.remove('itemnotcollected');
		document.getElementById('takeanyheart_4').classList.remove('heartcontainer');
		document.getElementById('takeanyheart_4').classList.remove('anypotion');

		document.getElementById('itemselectanykey').classList.remove('itemnotcollected');
		document.getElementById('itemselectbook').classList.remove('itemnotcollected');
		document.getElementById('itemselectboomerang').classList.remove('itemnotcollected');
		document.getElementById('itemselectbow').classList.remove('itemnotcollected');
		document.getElementById('itemselectladder').classList.remove('itemnotcollected');
		document.getElementById('itemselectmagicboomerang').classList.remove('itemnotcollected');
		document.getElementById('itemselectbracelet').classList.remove('itemnotcollected');
		document.getElementById('itemselectraft').classList.remove('itemnotcollected');
		document.getElementById('itemselectrecorder').classList.remove('itemnotcollected');
		document.getElementById('itemselectredcandle').classList.remove('itemnotcollected');
		document.getElementById('itemselectredring').classList.remove('itemnotcollected');
		document.getElementById('itemselectsilverarrow').classList.remove('itemnotcollected');
		document.getElementById('itemselectwand').classList.remove('itemnotcollected');
		document.getElementById('itemselectwhitesword').classList.remove('itemnotcollected');
		document.getElementById('itemselectheartcontainer').classList.remove('itemnotcollected');
	}

	window.updateow = function() {
		window.remainingchecks = 0;
		window.availablechecks = 0;
		window.items.maxhearts = 3;

		resetAllItemClasses();

		if (!window.items.woodsword) document.getElementById('item_woodsword').classList.add('itemnotcollected');
		if (!window.items.whitesword) document.getElementById('item_whitesword').classList.add('itemnotcollected');
		if (!window.items.magicsword) document.getElementById('item_magicsword').classList.add('itemnotcollected');

		if (!window.items.raft) document.getElementById('item_raft').classList.add('itemnotcollected');
		if (!window.items.book) document.getElementById('item_book').classList.add('itemnotcollected');
		if (!window.items.bluering && !window.items.redring) {
			document.getElementById('item_ring').classList.add('itemnotcollected');
			document.getElementById('item_ring').classList.add('bluering');
		} else if (window.items.bluering && !window.items.redring) {
			document.getElementById('item_ring').classList.add('bluering');
		} else {
			document.getElementById('item_ring').classList.add('redring');
		}
		if (!window.items.ladder) document.getElementById('item_ladder').classList.add('itemnotcollected');
		if (!window.items.anykey) document.getElementById('item_anykey').classList.add('itemnotcollected');
		if (!window.items.bracelet) document.getElementById('item_bracelet').classList.add('itemnotcollected');
		if (!window.items.boomerang && !window.items.magicboomerang) {
			document.getElementById('item_boomerang').classList.add('itemnotcollected');
			document.getElementById('item_boomerang').classList.add('boomerang');
		} else if (window.items.boomerang && !window.items.magicboomerang) {
			document.getElementById('item_boomerang').classList.add('boomerang');
		} else {
			document.getElementById('item_boomerang').classList.add('magicboomerang');
		}
		if (!window.items.bomb) document.getElementById('item_bomb').classList.add('itemnotcollected');
		if (!window.items.woodarrow && !window.items.silverarrow) {
			document.getElementById('item_arrow').classList.add('itemnotcollected');
			document.getElementById('item_arrow').classList.add('woodarrow');
		} else if (window.items.woodarrow && !window.items.silverarrow) {
			document.getElementById('item_arrow').classList.add('woodarrow');
		} else {
			document.getElementById('item_arrow').classList.add('silverarrow');
		}
		if (!window.items.bow) document.getElementById('item_bow').classList.add('itemnotcollected');
		if (!window.items.bluecandle && !window.items.redcandle) {
			document.getElementById('item_candle').classList.add('itemnotcollected');
			document.getElementById('item_candle').classList.add('bluecandle');
		} else if (window.items.bluecandle && !window.items.redcandle) {
			document.getElementById('item_candle').classList.add('bluecandle');
		} else {
			document.getElementById('item_candle').classList.add('redcandle');
		}
		if (!window.items.recorder) document.getElementById('item_recorder').classList.add('itemnotcollected');
		if (!window.items.meat) document.getElementById('item_meat').classList.add('itemnotcollected');
		if (!window.items.manuscript && !window.items.bluepotion && !window.items.redpotion) {
			document.getElementById('item_potion').classList.add('itemnotcollected');
			document.getElementById('item_potion').classList.add('manuscript');
		} else if (window.items.manuscript && !window.items.bluepotion && !window.items.redpotion) {
			document.getElementById('item_potion').classList.add('manuscript');
		} else if (window.items.bluepotion && !window.items.redpotion) {
			document.getElementById('item_potion').classList.add('bluepotion');
		} else {
			document.getElementById('item_potion').classList.add('redpotion');
		}
		if (!window.items.wand) document.getElementById('item_wand').classList.add('itemnotcollected');

		for (var i = 0; i < 4; i++) {
			if (window.items.anyheart[i] == 0) {
				document.getElementById('takeanyheart_' + (i + 1)).classList.add('itemnotcollected');
				document.getElementById('takeanyheart_' + (i + 1)).classList.add('heartcontainer');
			} else if (window.items.anyheart[i] == 1) {
				document.getElementById('takeanyheart_' + (i + 1)).classList.add('heartcontainer');
				window.items.maxhearts++;
			} else {
				document.getElementById('takeanyheart_' + (i + 1)).classList.add('anypotion');
			}
		}

		for (var i = 0; i < window.dungeons.length; i++) {
			for (var j = 0; j < window.dungeons[i].items.length; j++) {
				if (window.dungeons[i].items[j].item != '') {
					if (!window.dungeons[i].items[j].item == 'heartcontainer') {
						document.getElementById('itemselect' + window.dungeons[i].items[j].item).classList.add('itemnotcollected');
					} else {
						if (window.flags.heartshuffle || i == 8 || j > 0) {
							document.getElementById('itemselect' + window.dungeons[i].items[j].item).classList.add('itemnotcollected');
						}
					}
				}
			}			
		}

		for (var i = 0; i < 3; i++) {
			if (window.items.owitems[i].item != '') {
				if (!window.items.owitems[i].item == 'heartcontainer') {
					document.getElementById('itemselect' + window.items.owitems[i].item).classList.add('itemnotcollected');
				} else {
					if (window.flags.heartshuffle || i == 8 || j > 0) {
						document.getElementById('itemselect' + window.items.owitems[i].item).classList.add('itemnotcollected');
					}
				}
			}		
		}

		for (var i = 1; i < 9; i++) {
			for (var j = 1; j < 17; j++) {
				var currentow = document.getElementById('ow_' + i + '_' + j);
				currentow.classList.remove('available');
				currentow.classList.remove('mixedavailable');
				currentow.classList.remove('tagged');
				currentow.classList.remove('unavailable');

				if ((window.locations[i - 1][j - 1].status == 'A' || window.locations[i - 1][j - 1].status == 'M') && window.locations[i - 1][j - 1].requirements != '') {
					switch (window.locations[i - 1][j - 1].requirements) {
						case 'B':
							if (!items.bomb) {
								currentow.classList.add('unavailable');
								if (window.locations[i - 1][j - 1].tag == '') window.remainingchecks++;
							} else {
								currentow.classList.add(window.locations[i - 1][j - 1].startingstatus == 'M' ? 'mixedavailable' : 'available');
								if (window.locations[i - 1][j - 1].tag == '') window.availablechecks++;
								if (window.locations[i - 1][j - 1].tag == '') window.remainingchecks++;
							}
							break;
						case 'C':
							if (!items.bluecandle && !items.redcandle) {
								currentow.classList.add('unavailable');
								if (window.locations[i - 1][j - 1].tag == '') window.remainingchecks++;
							} else {
								currentow.classList.add(window.locations[i - 1][j - 1].startingstatus == 'M' ? 'mixedavailable' : 'available');
								if (window.locations[i - 1][j - 1].tag == '') window.availablechecks++;
								if (window.locations[i - 1][j - 1].tag == '') window.remainingchecks++;
							}
							break;
						case 'F':
							if (!items.recorder) {
								currentow.classList.add('unavailable');
								if (window.locations[i - 1][j - 1].tag == '') window.remainingchecks++;
							} else {
								currentow.classList.add(window.locations[i - 1][j - 1].startingstatus == 'M' ? 'mixedavailable' : 'available');
								if (window.locations[i - 1][j - 1].tag == '') window.availablechecks++;
								if (window.locations[i - 1][j - 1].tag == '') window.remainingchecks++;
							}
							break;
						case 'R':
							if (!items.raft) {
								currentow.classList.add('unavailable');
								if (window.locations[i - 1][j - 1].tag == '') window.remainingchecks++;
							} else {
								currentow.classList.add(window.locations[i - 1][j - 1].startingstatus == 'M' ? 'mixedavailable' : 'available');
								if (window.locations[i - 1][j - 1].tag == '') window.availablechecks++;
								if (window.locations[i - 1][j - 1].tag == '') window.remainingchecks++;
							}
							break;
						case 'P':
							if (!items.bracelet) {
								currentow.classList.add('unavailable');
								if (window.locations[i - 1][j - 1].tag == '') window.remainingchecks++;
							} else {
								currentow.classList.add(window.locations[i - 1][j - 1].startingstatus == 'M' ? 'mixedavailable' : 'available');
								if (window.locations[i - 1][j - 1].tag == '') window.availablechecks++;
								if (window.locations[i - 1][j - 1].tag == '') window.remainingchecks++;
							}
							break;
						case 'L':
							if (!items.ladder || !items.bomb) {
								currentow.classList.add('unavailable');
								if (window.locations[i - 1][j - 1].tag == '') window.remainingchecks++;
							} else {
								currentow.classList.add(window.locations[i - 1][j - 1].startingstatus == 'M' ? 'mixedavailable' : 'available');
								if (window.locations[i - 1][j - 1].tag == '') window.availablechecks++;
								if (window.locations[i - 1][j - 1].tag == '') window.remainingchecks++;
							}
							break;
					}
				} else {
					//C: Checked/Clear; U: Unavailable; A: Available; M: Available/Mixed; T: Tagged
					switch (window.locations[i - 1][j - 1].status) {
						case 'C':
						case 'U':
							document.getElementById('owtag_' + i + '_' + j).className = '';
							document.getElementById('owtag_' + i + '_' + j).innerHTML = '';
							currentow.classList.add('unavailable');
							break;
						case 'A':
							currentow.classList.add('available');
							if (window.locations[i - 1][j - 1].tag == '') window.remainingchecks++;
							if (window.locations[i - 1][j - 1].tag == '') window.availablechecks++;
							break;
						case 'M':
							currentow.classList.add('mixedavailable');
							if (window.locations[i - 1][j - 1].tag == '') window.remainingchecks++;
							if (window.locations[i - 1][j - 1].tag == '') window.availablechecks++;
							break;
						case 'T':
							currentow.classList.add('tagged');
							var currentowtag = document.getElementById('owtag_' + i + '_' + j);
							currentowtag.innerHTML = '';
							currentowtag.className = "";

							for (var k = 1; k < 4; k++) {
								document.getElementById('owshop_' + i + '_' + j + '_' + k).className = "";
							}

							if (window.locations[i - 1][j - 1].tag != '' && window.locations[i - 1][j - 1].tag != 'itemshop') {
								currentowtag.classList.add('owtag');
							}

							switch (window.locations[i - 1][j - 1].tag) {
								case 'dungeon1': 
								case 'dungeon2': 
								case 'dungeon3': 
								case 'dungeon4': 
								case 'dungeon5': 
								case 'dungeon6': 
								case 'dungeon7': 
								case 'dungeon8': 
								case 'dungeon9': 
									currentowtag.classList.add('owselectdungeon');
									currentowtag.innerHTML = window.locations[i - 1][j - 1].tag.replace('dungeon', '');
									break;
								case 'anyroad1':
								case 'anyroad2':
								case 'anyroad3':
								case 'anyroad4':
									currentowtag.classList.add('owselectanyroad');
									currentowtag.innerHTML = window.locations[i - 1][j - 1].tag.replace('anyroad', '');
									break;
								case 'woodsword':
									currentowtag.classList.add('owselectsword');
									currentowtag.classList.add('woodsword_large');
									break;
								case 'whitesword':
									currentowtag.classList.add('owselectsword');
									currentowtag.classList.add('whitesword_large');
									break;
								case 'magicsword':
									currentowtag.classList.add('owselectsword');
									currentowtag.classList.add('magicsword_large');
									break;
								case 'manuscript':
									currentowtag.classList.add('owselectmisc');
									currentowtag.classList.add('manuscript');
									break;
								case 'potion':
									currentowtag.classList.add('owselectmisc');
									currentowtag.classList.add('redpotion');
									break;
								case 'hint':
									currentowtag.classList.add('owselectmisc');
									currentowtag.innerHTML = '?';
									break;
								case 'rupee':
									currentowtag.classList.add('owselectmisc');
									currentowtag.classList.add('rupee');
									break;
								case 'takeany':
									currentowtag.classList.add('owselectmisc');
									currentowtag.classList.add('heartcontainer');
									break;
								case 'gamble':
									currentowtag.classList.add('owselectmisc');
									currentowtag.innerHTML = '+';
									break;
								case 'itemshop':
									for (var k = 1; k < 4; k++) {
										var currentowtag = document.getElementById('owshop_' + i + '_' + j + '_' + k);
										if (window.locations[i - 1][j - 1].shopitems[k - 1] != '') {
											currentowtag.classList.add('owshoptag');
											currentowtag.classList.add(window.locations[i - 1][j - 1].shopitems[k - 1]);
										}
									}
									break;
							}
							break;
					}
				}
			}
		}

		for (var i = 0; i < 9; i++) {
			if (window.items.heartcontainers[i] == true) {
				window.items.maxhearts++;
			}
		}

		window.items.maxhearts = window.items.maxhearts + window.flags.startingextrahearts;

		if (window.items.maxhearts > 16) window.items.maxhearts = 16;

		for (var i = 1; i <= 16; i++) {
			if (i <= window.items.maxhearts) {
				document.getElementById('heart_' + i).style.visibility = 'visible';
			} else {
				document.getElementById('heart_' + i).style.visibility = 'hidden';
			}
		} 

		for (var i = 0; i < 8; i++) {
			document.getElementById('triforce_' + (parseInt(i) + 1)).classList.remove('itemnotcollected');
			if (!window.items.triforce[i]) {
				document.getElementById('triforce_' + (parseInt(i) + 1)).classList.add('itemnotcollected');
			}
			document.getElementById('unknowndungeon_' + (parseInt(i) + 1)).innerHTML = window.items.unknowndungeon[i];
		} 

		for (var i = 0; i < 9; i++) {
			document.getElementById('dungeonhint_' + (parseInt(i) + 1)).innerHTML = window.items.hints[i];

			for (var j = 0; j < window.dungeons[i].items.length; j++) {
				var currentelement = document.getElementById('dungeonitem_' + (parseInt(i) + 1) + '_' + (parseInt(j) + 1));
				var currentimg = document.getElementById('dungeonitemimage_' + (parseInt(i) + 1) + '_' + (parseInt(j) + 1));
				currentimg.classList.remove('itemnotcollected');
				if (window.dungeons[i].items[j].item != '') {
					var largemod = '';
					if (window.dungeons[i].items[j].item == 'anykey' || window.dungeons[i].items[j].item == 'book' || 
						window.dungeons[i].items[j].item == 'bow' || window.dungeons[i].items[j].item == 'redring' || 
						window.dungeons[i].items[j].item == 'silverarrow' || window.dungeons[i].items[j].item == 'whitesword') {
							largemod = '_large';
						}

					if (window.flags.swordless && window.dungeons[i].items[j].item == 'whitesword') {
						currentimg.src = "./images/bombupgrade_large.png"; 
					} else {
						currentimg.src = "./images/" + window.dungeons[i].items[j].item + largemod + ".png"; 
					}
					currentelement.style.backgroundImage = "url('')"; 
				} else {
					window.dungeons[i].items[j].obtained = false;
					currentimg.src = "./images/blank.png";
					if (j == 2 || (j == 1 && i < 2) || (j == 0 && i == 8)) {
						currentelement.style.backgroundImage = "url('../images/stairs.png');";
					}
				}
				if (window.dungeons[i].items[j].obtained == false) {
					document.getElementById('dungeonitemimage_' + (parseInt(i) + 1) + '_' + (parseInt(j) + 1)).classList.add('itemnotcollected');
				}
			}

			document.getElementById('dungeonselecttab_' + (i + 1)).className = '';
			document.getElementById('dungeonselecttab_' + (i + 1)).classList.add('dungeonselecttab');

			if (window.dungeons[i].discovered) {
				document.getElementById('dungeonselecttab_' + (i + 1)).classList.add('discovered');
			}

			for (var j = 0; j < window.dungeons[i].blockers.length; j++) {
				var currentelement = document.getElementById('dungeonblock_' + (parseInt(i) + 1) + '_' + (parseInt(j) + 1));
				currentelement.classList.remove('blockerssoftblock');
				currentelement.classList.remove('blockershardblock');
				currentelement.classList.remove('blockersobtained');
				
				if (window.dungeons[i].blockers[j].item != '') {
					var largemod = '';
					if (window.dungeons[i].items[j].item == 'anykey' || window.dungeons[i].items[j].item == 'book' || 
						window.dungeons[i].items[j].item == 'bow' || window.dungeons[i].items[j].item == 'redring' || 
						window.dungeons[i].items[j].item == 'silverarrow' || window.dungeons[i].items[j].item == 'whitesword') {
							largemod = '_large';
						} else {
							largemod = '';
						}

					if (window.flags.swordless && window.dungeons[i].blockers[j].item == 'melee') {
						currentelement.style.backgroundImage = "url('images/wand.png')";
					} else {
						currentelement.style.backgroundImage = "url('images/" + window.dungeons[i].blockers[j].item + largemod + ".png')";
					}

					if ((window.dungeons[i].blockers[j].item == 'bomb' && window.items.bomb) ||
					(window.dungeons[i].blockers[j].item == 'bow' && window.items.bow) ||
					(window.dungeons[i].blockers[j].item == 'key' && window.items.anykey) ||
					(window.dungeons[i].blockers[j].item == 'ladder' && window.items.ladder) ||
					(window.dungeons[i].blockers[j].item == 'meat' && window.items.meat) ||
					(window.dungeons[i].blockers[j].item == 'recorder' && window.items.recorder) ||
					(window.dungeons[i].blockers[j].item == 'melee' && (!window.flags.swordless && (window.items.woodsword || window.items.whitesword || window.items.magicsword) || window.items.wand))) {
						currentelement.classList.add('blockersobtained');
					} else {
						currentelement.classList.add(window.dungeons[i].blockers[j].hardblock ? 'blockershardblock' : 'blockerssoftblock');
					}
				} else {
						currentelement.style.backgroundImage = "url('')"; 
				}
			}
		} 

		for (var i = 0; i < 3; i++) {
			var currentelement = document.getElementById('overworlditem_' + (parseInt(i) + 1));
			currentelement.classList.remove('itemnotcollected');

			if (window.items.owitems[i].item != '') {
				if (window.flags.swordless && window.items.owitems[i].item == 'whitesword') {
					currentelement.style.backgroundImage = "url('images/bombupgrade.png')";
				} else {
					currentelement.style.backgroundImage = "url('images/" + window.items.owitems[i].item  + ".png')";
				}
				
				if (window.items.owitems[i].obtained == false) {
					if ((window.items.owitems[i].item == 'bomb' && window.items.bomb) ||
						(window.items.owitems[i].item == 'bow' && window.items.bow) ||
						(window.items.owitems[i].item == 'key' && window.items.anykey) ||
						(window.items.owitems[i].item == 'ladder' && window.items.ladder) ||
						(window.items.owitems[i].item == 'meat' && window.items.meat) ||
						(window.items.owitems[i].item == 'recorder' && window.items.recorder) ||
						(window.items.owitems[i].item == 'melee' && (window.items.woodsword || window.items.whitesword || window.items.magicsword || window.items.wand))) {
						currentelement.classList.add('blockersobtained');
					} else {
						currentelement.classList.add('itemnotcollected');
					}
				}
			} else {
				currentelement.style.backgroundImage = "url('')"; 
			}
		}

		for (var i = 0; i < 64; i++) {
			var currentelement = document.getElementById('dungeonmap_' + Math.floor(((i / 8) + 1)) + '_' + ((i % 8) + 1));
			currentelement.className = 'dungeonmaproom';

			if (window.dungeons[currentdungeon].rooms[i].tile != '') {
				currentelement.classList.add('dungeonroom' + window.dungeons[currentdungeon].rooms[i].tile);
				if (!window.dungeons[currentdungeon].rooms[i].cleared) {
					currentelement.classList.add('dungeontileuncleared');
				}
			}

			if (i < 56) {
				var currentdoor = document.getElementById('dungeondoorns_' + Math.floor(((i / 7) + 1)) + '_' + ((i % 7) + 1));
				currentdoor.className = 'dungeonmapdoorns';

				if (window.dungeons[currentdungeon].doorsns[i].tile != '') {
					currentdoor.classList.add('dungeondoor' + window.dungeons[currentdungeon].doorsns[i].tile);
				}

				currentdoor = document.getElementById('dungeondoorew_' + Math.floor(((i / 8) + 1)) + '_' + ((i % 8) + 1));
				currentdoor.className = 'dungeonmapdoorew';

				if (window.dungeons[currentdungeon].doorsew[i].tile != '') {
					currentdoor.classList.add('dungeondoor' + window.dungeons[currentdungeon].doorsew[i].tile);
				}
			}

			var currentmonster = document.getElementById('dungeonmapmonster_' + Math.floor(((i / 8) + 1)) + '_' + ((i % 8) + 1));
			currentmonster.className = 'dungeonmapmonster';

			if (window.dungeons[currentdungeon].rooms[i].monster != '') {
				currentmonster.classList.add('dungeonmonster' + window.dungeons[currentdungeon].rooms[i].monster);
			}

			var currentitem = document.getElementById('dungeonmapitem_' + Math.floor(((i / 8) + 1)) + '_' + ((i % 8) + 1));
			currentitem.className = 'dungeonmapitem';

			if (window.dungeons[currentdungeon].rooms[i].item != '') {
				currentitem.classList.add('dungeonobject' + window.dungeons[currentdungeon].rooms[i].item);
			}
		}
		
		//Disabling for now, need to add images to use both background and greyscale
		//May not re-enable, not a very important feature

		//Check for White Sword item
		/* var currentelement = document.getElementById('overworlditem_1');
		if (window.items.owitems[0].item != '' && !window.items.owitems[0].obtained) {
			currentelement.classList.remove('blockershardblock');
			currentelement.classList.remove('blockerssoftblock');
			currentelement.classList.remove('blockersobtained');

			if (window.items.maxhearts >= window.flags.whiteswordmax) {
				currentelement.classList.add('blockersobtained');
			} else if (window.items.maxhearts < window.flags.whiteswordmax && window.items.maxhearts >= window.flags.whiteswordmin) {
				currentelement.classList.add('blockerssoftblock');
			} else {
				currentelement.classList.add('blockershardblock');
			}
		} else {
			currentelement.classList.remove('itemnotcollected');
		}

		//Check for Ladder item
		var currentelement = document.getElementById('overworlditem_2');
		if (window.items.owitems[1].item != '' && !window.items.owitems[1].obtained) {
			currentelement.classList.remove('blockershardblock');
			currentelement.classList.remove('blockersobtained');

			if (window.items.ladder) {
				currentelement.classList.add('blockersobtained');
			} else {
				currentelement.classList.add('blockershardblock');
			}
		} else {
			currentelement.classList.remove('itemnotcollected');
		} */

		document.getElementById('owstats').innerHTML = availablechecks + ' AVAILABLE / ' + remainingchecks + ' TOTAL';
	};


	window.itemclick = function(x) {
		switch (x) {
			case 'woodsword':
				window.items.woodsword = !window.items.woodsword;
				break;
			case 'whitesword':
				window.items.whitesword = !window.items.whitesword;
				break;
			case 'magicsword':
				window.items.magicsword = !window.items.magicsword;
				break;
			case 'ring':
				window.items.bluering = !window.items.bluering;
				break;
			case 'bomb':
				window.items.bomb = !window.items.bomb;
				break;
			case 'arrow':
				window.items.woodarrow = !window.items.woodarrow;
				break;
			case 'candle':
				window.items.bluecandle = !window.items.bluecandle;
				break;
			case 'meat':
				window.items.meat = !window.items.meat;
				break;
			case 'potion':
				if (window.items.redpotion) {
					window.items.redpotion = !window.items.redpotion;
				} else if (window.items.bluepotion) {
					window.items.bluepotion = !window.items.bluepotion;
					window.items.redpotion = !window.items.redpotion;
				} else if (window.items.manuscript) {
					window.items.manuscript = !window.items.manuscript;
					window.items.bluepotion = !window.items.bluepotion;
				} else if (!window.items.manuscript && !window.items.bluepotion && !window.items.redpotion) {
					window.items.manuscript = !window.items.manuscript;
				}
				break;
			case 'heart1':
			case 'heart2':
			case 'heart3':
			case 'heart4':
				var whichheart = x == 'heart1' ? 0 : x == 'heart2' ? 1 : x == 'heart3' ? 2 : 3;

				window.items.anyheart[whichheart]++;
				if (window.items.anyheart[whichheart] == 3) {
					window.items.anyheart[whichheart] = 0;
				}
				break;

		}

		window.updateow();
	};

	window.collecttriforce = function(x) {
		window.items.triforce[x - 1] = !window.items.triforce[x - 1];
		window.updateow();
	}

	window.owclick = function(x, y) {
		//Cannot uncheck any location that is unavailable
		//C: Checked/Clear; U: Unavailable; A: Available; M: Available/Mixed; T: Tagged
		if (window.locations[x - 1][y - 1].status != 'U') {
			//If location has been cleared, reset it to the starting status
			if (window.locations[x - 1][y - 1].status == 'C') {
				window.locations[x - 1][y - 1].status = window.locations[x - 1][y - 1].startingstatus;
			//If location is available or mixed, check off location as cleared, if requirements are met
			} else if (window.locations[x - 1][y - 1].status == 'A' || window.locations[x - 1][y - 1].status == 'M') {
				if (window.locations[x - 1][y - 1].requirements == '' ||
					window.locations[x - 1][y - 1].requirements == 'B' && window.items.bomb || 
					window.locations[x - 1][y - 1].requirements == 'L' && (window.items.bomb && window.items.ladder) || 
					window.locations[x - 1][y - 1].requirements == 'C' && (window.items.bluecandle || window.items.redcandle) || 
					window.locations[x - 1][y - 1].requirements == 'P' && window.items.bracelet || 
					window.locations[x - 1][y - 1].requirements == 'R' && window.items.raft || 
					window.locations[x - 1][y - 1].requirements == 'F' && window.items.recorder) {
						window.locations[x - 1][y - 1].status = 'C';
					}
			}
			window.updateow();
		}
    };

	window.sethint = function(x) {
		window.items.hints[window.activepanelid] = x;
		window.activepanel = 'X'
		window.updateow();
	}

	window.setunknowndungeon = function(x) {
		window.items.unknowndungeon[window.activepanelid] = x;
		window.activepanel = 'X'
		window.updateow();
	}

	window.switchdungeon = function (x) {
		document.getElementById('dungeonmap_7_0').innerHTML = (x + 1);
		
		window.currentdungeon = x;

		if (x == 8) {
			document.getElementById('dungeonroomstartingleft').style.display = 'none';
			document.getElementById('dungeonroomstartingtop').style.display = 'none';
			document.getElementById('dungeonroomstartingright').style.display = 'none';
			document.getElementById('dungeonrooml9blank').style.display = 'block';
			document.getElementById('dungeonroomganon').style.display = 'block';
			document.getElementById('dungeonroomzelda').style.display = 'block';
		} else {
			document.getElementById('dungeonroomstartingleft').style.display = 'block';
			document.getElementById('dungeonroomstartingtop').style.display = 'block';
			document.getElementById('dungeonroomstartingright').style.display = 'block';
			document.getElementById('dungeonrooml9blank').style.display = 'none';
			document.getElementById('dungeonroomganon').style.display = 'none';
			document.getElementById('dungeonroomzelda').style.display = 'none';
		}


		window.updateow();
	}

	document.onmouseover = function(e) {
		if (e.target.id.indexOf('ow_') == 0 && e.target.id.indexOf('_') > -1) {
			//Show Magnify Window
			var y = parseInt(e.target.id.substring(e.target.id.lastIndexOf('_') + 1));
			var x = parseInt(e.target.id.substring(e.target.id.indexOf('_') + 1));


			if (x != 1) {
				if (y != 1) {
					document.getElementById('owmagnify_1').style.backgroundImage = "url('./images/overworld/q" + window.flags.quest + "/row-" + (x - 1) + "-column-" + (y - 1) + ".png')"; 
				} else {
					document.getElementById('owmagnify_1').style.backgroundImage = "";
				}
				document.getElementById('owmagnify_2').style.backgroundImage = "url('./images/overworld/q" + window.flags.quest + "/row-" + (x - 1) + "-column-" + y + ".png')";
				if (y != 16)  {
					document.getElementById('owmagnify_3').style.backgroundImage = "url('./images/overworld/q" + window.flags.quest + "/row-" + (x - 1) + "-column-" + (y + 1) + ".png')"; 
				} else {
					document.getElementById('owmagnify_3').style.backgroundImage = "";
				}
			} else {
				document.getElementById('owmagnify_1').style.backgroundImage = "";
				document.getElementById('owmagnify_2').style.backgroundImage = "";
				document.getElementById('owmagnify_3').style.backgroundImage = "";
			}

			if (y != 1) {
				document.getElementById('owmagnify_4').style.backgroundImage = "url('./images/overworld/q" + window.flags.quest + "/row-" + x + "-column-" + (y - 1) + ".png')"; 
			} else {
				document.getElementById('owmagnify_4').style.backgroundImage = "";
			}
			document.getElementById('owmagnify_5').style.backgroundImage = "url('./images/overworld/q" + window.flags.quest + "/row-" + x + "-column-" + y + ".png')";
			if (y != 16)  {
				document.getElementById('owmagnify_6').style.backgroundImage = "url('./images/overworld/q" + window.flags.quest + "/row-" + x + "-column-" + (y + 1) + ".png')"; 
			} else {
				document.getElementById('owmagnify_6').style.backgroundImage = "";
			}

			if (x != 8) {
				if (y != 1) {
					document.getElementById('owmagnify_7').style.backgroundImage = "url('./images/overworld/q" + window.flags.quest + "/row-" + (x + 1) + "-column-" + (y - 1) + ".png')"; 
				} else {
					document.getElementById('owmagnify_7').style.backgroundImage = "";
				}
				document.getElementById('owmagnify_8').style.backgroundImage = "url('./images/overworld/q" + window.flags.quest + "/row-" + (x + 1) + "-column-" + y + ".png')";
				if (y != 16)  {
					document.getElementById('owmagnify_9').style.backgroundImage = "url('./images/overworld/q" + window.flags.quest + "/row-" + (x + 1) + "-column-" + (y + 1) + ".png')"; 
				} else {
					document.getElementById('owmagnify_9').style.backgroundImage = "";
				}
			} else {
				document.getElementById('owmagnify_7').style.backgroundImage = "";
				document.getElementById('owmagnify_8').style.backgroundImage = "";
				document.getElementById('owmagnify_9').style.backgroundImage = "";
			}

			document.getElementById('owmagnify').style.display = 'block';
			document.getElementById('dungeonmap').style.display = 'none';
		} else {
			document.getElementById('owmagnify').style.display = 'none';
			document.getElementById('dungeonmap').style.display = 'block';
		}

		if (e.target.id.indexOf('owselect') == 0) {
			var item = e.target.id.replace('owselect', '');

			if (item == 'dungeon1') document.getElementById('owselecthovertext').innerHTML = window.flags.unknowndungeon ? 'DUNGEON A' : 'DUNGEON 1';
			if (item == 'dungeon2') document.getElementById('owselecthovertext').innerHTML = window.flags.unknowndungeon ? 'DUNGEON B' : 'DUNGEON 2';
			if (item == 'dungeon3') document.getElementById('owselecthovertext').innerHTML = window.flags.unknowndungeon ? 'DUNGEON C' : 'DUNGEON 3';
			if (item == 'dungeon4') document.getElementById('owselecthovertext').innerHTML = window.flags.unknowndungeon ? 'DUNGEON D' : 'DUNGEON 4';
			if (item == 'dungeon5') document.getElementById('owselecthovertext').innerHTML = window.flags.unknowndungeon ? 'DUNGEON E' : 'DUNGEON 5';
			if (item == 'dungeon6') document.getElementById('owselecthovertext').innerHTML = window.flags.unknowndungeon ? 'DUNGEON F' : 'DUNGEON 6';
			if (item == 'dungeon7') document.getElementById('owselecthovertext').innerHTML = window.flags.unknowndungeon ? 'DUNGEON G' : 'DUNGEON 7';
			if (item == 'dungeon8') document.getElementById('owselecthovertext').innerHTML = window.flags.unknowndungeon ? 'DUNGEON H' : 'DUNGEON 8';
			if (item == 'dungeon9') document.getElementById('owselecthovertext').innerHTML = 'DUNGEON 9';
			if (item == 'anyroad1') document.getElementById('owselecthovertext').innerHTML = 'ANY ROAD 1';
			if (item == 'anyroad2') document.getElementById('owselecthovertext').innerHTML = 'ANY ROAD 2';
			if (item == 'anyroad3') document.getElementById('owselecthovertext').innerHTML = 'ANY ROAD 3';
			if (item == 'anyroad4') document.getElementById('owselecthovertext').innerHTML = 'ANY ROAD 4';
			if (item == 'woodsword') document.getElementById('owselecthovertext').innerHTML = 'WOOD SWORD';
			if (item == 'whitesword') document.getElementById('owselecthovertext').innerHTML = window.flags.swordless ? 'BOMB UPGRADE' : 'WHITE SWORD ITEM';
			if (item == 'magicsword') document.getElementById('owselecthovertext').innerHTML = window.flags.swordless ? 'BOMB UPGRADE' : 'MAGIC SWORD';
			if (item == 'arrow') document.getElementById('owselecthovertext').innerHTML = 'SHOP - WOOD ARROW';
			if (item == 'bomb') document.getElementById('owselecthovertext').innerHTML = 'SHOP - BOMB';
			if (item == 'bluecandle') document.getElementById('owselecthovertext').innerHTML = 'SHOP - BLUE CANDLE';
			if (item == 'key') document.getElementById('owselecthovertext').innerHTML = 'SHOP - KEY';
			if (item == 'meat') document.getElementById('owselecthovertext').innerHTML = 'SHOP - MEAT';
			if (item == 'bluering') document.getElementById('owselecthovertext').innerHTML = 'SHOP - BLUE RING';
			if (item == 'shield') document.getElementById('owselecthovertext').innerHTML = 'SHOP - MAGIC SHIELD';
			if (item == 'manuscript') document.getElementById('owselecthovertext').innerHTML = 'MANUSCRIPT';
			if (item == 'potion') document.getElementById('owselecthovertext').innerHTML = 'POTION SHOP';
			if (item == 'hint') document.getElementById('owselecthovertext').innerHTML = 'HINT';
			if (item == 'rupee') document.getElementById('owselecthovertext').innerHTML = 'RUPEE';
			if (item == 'takeany') document.getElementById('owselecthovertext').innerHTML = 'TAKE ANY';
			if (item == 'gamble') document.getElementById('owselecthovertext').innerHTML = 'GAMBLE';
			if (item == 'clear') document.getElementById('owselecthovertext').innerHTML = 'CLEAR TILE';
			if (item == 'unclear') document.getElementById('owselecthovertext').innerHTML = 'UNCHECK TILE';
		} else {	
			document.getElementById('owselecthovertext').innerHTML = '';
		}

		if (e.target.id.indexOf('dungeonroom') == 0) {
			var map = e.target.id.replace('dungeonroom', '');
			if (map == 'startingtop') document.getElementById('dungeonselecthovertext').innerHTML = 'STARTING ROOM TOP';
			if (map == 'startingleft') document.getElementById('dungeonselecthovertext').innerHTML = 'STARTING ROOM LEFT';
			if (map == 'startingright') document.getElementById('dungeonselecthovertext').innerHTML = 'STARTING ROOM RIGHT';
			if (map == 'startingbottom') document.getElementById('dungeonselecthovertext').innerHTML = 'STARTING ROOM BOTTOM';
			if (map == 'emptyroom') document.getElementById('dungeonselecthovertext').innerHTML = 'EMPTY ROOM';
			if (map == 'pushroom') document.getElementById('dungeonselecthovertext').innerHTML = 'PUSH ROOM';
			if (map == 'staircase') document.getElementById('dungeonselecthovertext').innerHTML = 'STAIRCASE';
			if (map == 'singleriver') document.getElementById('dungeonselecthovertext').innerHTML = 'SINGLE RIVER';
			if (map == 'doubleriver') document.getElementById('dungeonselecthovertext').innerHTML = 'DOUBLE RIVER';
			if (map == 'eastriver') document.getElementById('dungeonselecthovertext').innerHTML = 'EAST RIVER';
			if (map == 'squareriver') document.getElementById('dungeonselecthovertext').innerHTML = 'SQUARE RIVER';
			if (map == 'chevyriver') document.getElementById('dungeonselecthovertext').innerHTML = 'CHEVY RIVER';
			if (map == 'bottombridge') document.getElementById('dungeonselecthovertext').innerHTML = 'BOTTOM BRIDGE';
			if (map == 'leftbridge') document.getElementById('dungeonselecthovertext').innerHTML = 'LEFT BRIDGE';
			if (map == 'insersection') document.getElementById('dungeonselecthovertext').innerHTML = 'INTERSECTION';
			if (map == 'chutens') document.getElementById('dungeonselecthovertext').innerHTML = 'CHUTE N - S';
			if (map == 'chuteew') document.getElementById('dungeonselecthovertext').innerHTML = 'CHUTE E - W';
			if (map == 'mugger') document.getElementById('dungeonselecthovertext').innerHTML = 'MUGGER ROOM';
			if (map == 'bombupgrade') document.getElementById('dungeonselecthovertext').innerHTML = 'BOMB UPGRADE';
			if (map == 'meatblock') document.getElementById('dungeonselecthovertext').innerHTML = 'MEAT BLOCK';
			if (map == 'transport1') document.getElementById('dungeonselecthovertext').innerHTML = 'TRANSPORT 1';
			if (map == 'transport2') document.getElementById('dungeonselecthovertext').innerHTML = 'TRANSPORT 2';
			if (map == 'transport3') document.getElementById('dungeonselecthovertext').innerHTML = 'TRANSPORT 3';
			if (map == 'transport4') document.getElementById('dungeonselecthovertext').innerHTML = 'TRANSPORT 4';
			if (map == 'transport5') document.getElementById('dungeonselecthovertext').innerHTML = 'TRANSPORT 5';
			if (map == 'transport6') document.getElementById('dungeonselecthovertext').innerHTML = 'TRANSPORT 6';
			if (map == 'transport7') document.getElementById('dungeonselecthovertext').innerHTML = 'TRANSPORT 7';
			if (map == 'transport8') document.getElementById('dungeonselecthovertext').innerHTML = 'TRANSPORT 8';
			if (map == 'transport0') document.getElementById('dungeonselecthovertext').innerHTML = 'UNKNOWN TRANSPORT';
			if (map == 'ganon') document.getElementById('dungeonselecthovertext').innerHTML = 'GANON';
			if (map == 'zelda') document.getElementById('dungeonselecthovertext').innerHTML = 'ZELDA';
			if (map == 'blank') document.getElementById('dungeonselecthovertext').innerHTML = 'CLEAR TILE';
		} else {	
			document.getElementById('dungeonselecthovertext').innerHTML = '';
		}

		if (e.target.id.indexOf('dungeonobject') == 0) {
			var map = e.target.id.replace('dungeonobject', '');
			if (map == 'triforce') document.getElementById('dungeonselectobjecthovertext').innerHTML = 'TRIFORCE';
			if (map == 'heartcontainer') document.getElementById('dungeonselectobjecthovertext').innerHTML = 'HEART CONTAINER';
			if (map == 'item') document.getElementById('dungeonselectobjecthovertext').innerHTML = 'ITEM';
			if (map == 'bomb') document.getElementById('dungeonselectobjecthovertext').innerHTML = 'BOMB';
			if (map == 'key') document.getElementById('dungeonselectobjecthovertext').innerHTML = 'KEY';
			if (map == 'rupee') document.getElementById('dungeonselectobjecthovertext').innerHTML = 'RUPEE';
			if (map == 'map') document.getElementById('dungeonselectobjecthovertext').innerHTML = 'MAP';
			if (map == 'compass') document.getElementById('dungeonselectobjecthovertext').innerHTML = 'COMPASS';
			if (map == 'blank') document.getElementById('dungeonselectobjecthovertext').innerHTML = 'CLEAR ITEM';
		} else {	
			document.getElementById('dungeonselectobjecthovertext').innerHTML = '';
		}

		if (e.target.id.indexOf('dungeonmonster') == 0) {
			var map = e.target.id.replace('dungeonmonster', '');	
			if (map == 'gleeok') document.getElementById('dungeonselectmonsterhovertext').innerHTML = 'GLEEOK';
			if (map == 'patra') document.getElementById('dungeonselectmonsterhovertext').innerHTML = 'PATRA';
			if (map == 'manhandla') document.getElementById('dungeonselectmonsterhovertext').innerHTML = 'MANHANDLA';
			if (map == 'aquamentus') document.getElementById('dungeonselectmonsterhovertext').innerHTML = 'AQUAMENTUS';
			if (map == 'gohma') document.getElementById('dungeonselectmonsterhovertext').innerHTML = 'GHOMA';
			if (map == 'digdogger') document.getElementById('dungeonselectmonsterhovertext').innerHTML = 'DIGDIGGER';
			if (map == 'moldorm') document.getElementById('dungeonselectmonsterhovertext').innerHTML = 'MOLDORM';
			if (map == 'lanmola') document.getElementById('dungeonselectmonsterhovertext').innerHTML = 'LANMOLA';
			if (map == 'dodongo') document.getElementById('dungeonselectmonsterhovertext').innerHTML = 'DODONGO';
			if (map == 'wizzrobe') document.getElementById('dungeonselectmonsterhovertext').innerHTML = 'WIZZROBE';
			if (map == 'darknut') document.getElementById('dungeonselectmonsterhovertext').innerHTML = 'DARKNUT';
			if (map == 'polsvoice') document.getElementById('dungeonselectmonsterhovertext').innerHTML = 'POLSVOICE';
			if (map == 'bluebubble') document.getElementById('dungeonselectmonsterhovertext').innerHTML = 'BLUE BUBBLE';
			if (map == 'redbubble') document.getElementById('dungeonselectmonsterhovertext').innerHTML = 'RED BUBBLE';
			if (map == 'other') document.getElementById('dungeonselectmonsterhovertext').innerHTML = 'OTHER';
			if (map == 'blank') document.getElementById('dungeonselectmonsterhovertext').innerHTML = 'CLEAR MONSTER';
		} else {	
			document.getElementById('dungeonselectmonsterhovertext').innerHTML = '';
		}
	}

	function resetAllModals() {
		document.getElementById('dungeonhintmodal').style.display = 'none';
		document.getElementById('unknowndungeonmodal').style.display = 'none';
		document.getElementById('itemselectmodal').style.display = 'none';
		document.getElementById('blockerselectmodal').style.display = 'none';
		document.getElementById('owselectmodal').style.display = 'none';
		document.getElementById('dungeonroommodal').style.display = 'none';
		document.getElementById('dungeonmonstermodal').style.display = 'none';
		document.getElementById('dungeonobjectmodal').style.display = 'none';

		window.activepanel = '';
	}

	function selectFromModal(leftclick, eventid) {
		//console.log(event.target.id);
		if (window.activepanel == 'X') {
			//resetAllModals();
		//Dungeon Item
		} else if (window.activepanel == 'D') {
			if (eventid.startsWith('itemselect')) {
				var item = eventid.replace('itemselect', '', eventid);
				if (item != 'empty') {
					var currentheartcount = 0;
					for (var i = 0; i < window.dungeons.length; i++) {
						for (var j = 0; j < window.dungeons[i].items.length; j++) {
							if (window.dungeons[i].items[j].item == 'heartcontainer') {
								currentheartcount++;
							}
							if (window.dungeons[i].items[j].item != '' && window.dungeons[i].items[j].item == item && (item != 'heartcontainer' || currentheartcount >= 9)) {
								return;
							}
						}
					}

					for (var i = 0; i < 3; i++) {
						if (window.items.owitems[i].item == 'heartcontainer') {
							currentheartcount++;
						}
						if (window.items.owitems[i].item != '' && window.items.owitems[i].item == item && (item != 'heartcontainer' || currentheartcount >= 9)) {
							return;
						}
					}

					if (leftclick) {
						window.dungeons[window.activepanelid - 1].items[window.activepanelid2].item = item;
						window.dungeons[window.activepanelid - 1].items[window.activepanelid2].obtained = true;
					} else {
						window.dungeons[window.activepanelid - 1].items[window.activepanelid2].item = item;
						window.dungeons[window.activepanelid - 1].items[window.activepanelid2].obtained = false;
					}

					switch (item) {
						case 'anykey': window.items.anykey = (leftclick ? true : false); break;
						case 'book': window.items.book = (leftclick ? true : false); break;
						case 'boomerang': window.items.boomerang = (leftclick ? true : false); break;
						case 'bow': window.items.bow = (leftclick ? true : false); break;
						case 'ladder': window.items.ladder = (leftclick ? true : false); break;
						case 'magicboomerang': window.items.magicboomerang = (leftclick ? true : false); break;
						case 'bracelet': window.items.bracelet = (leftclick ? true : false); break;
						case 'raft': window.items.raft = (leftclick ? true : false); break;
						case 'recorder': window.items.recorder = (leftclick ? true : false); break;
						case 'redcandle': window.items.redcandle = (leftclick ? true : false); break;
						case 'redring': window.items.redring = (leftclick ? true : false); break;
						case 'silverarrow': window.items.silverarrow = (leftclick ? true : false); break;
						case 'wand': window.items.wand = (leftclick ? true : false); break;
						case 'whitesword': window.items.whitesword = (leftclick ? true : false); break;
						case 'heartcontainer':
							for (var i = 0; i < 9; i++) {
								if (window.items.heartcontainers[i] == false) {
									window.items.heartcontainers[i] = true;
									i = 99;
								}
							}
							break;
					}
				} else {
					switch (window.dungeons[window.activepanelid - 1].items[window.activepanelid2].item) {
						case 'anykey': window.items.anykey = false; break;
						case 'book': window.items.book = false; break;
						case 'boomerang': window.items.boomerang = false; break;
						case 'bow': window.items.bow = false; break;
						case 'ladder': window.items.ladder = false; break;
						case 'magicboomerang': window.items.magicboomerang = false; break;
						case 'bracelet': window.items.bracelet = false; break;
						case 'raft': window.items.raft = false; break;
						case 'recorder': window.items.recorder = false; break;
						case 'redcandle': window.items.redcandle = false; break;
						case 'redring': window.items.redring = false; break;
						case 'silverarrow': window.items.silverarrow = false; break;
						case 'wand': window.items.wand = false; break;
						case 'whitesword': window.items.whitesword = false; break;
						case 'heartcontainer':
							for (var i = 0; i < 9; i++) {
								if (window.items.heartcontainers[i] == true) {
									window.items.heartcontainers[i] = false;
									i = 99;
								}
							}
							break;
					}
					window.dungeons[window.activepanelid - 1].items[window.activepanelid2].item = '';
					window.dungeons[window.activepanelid - 1].items[window.activepanelid2].obtained = false;
				}
			}
		} else if (window.activepanel == 'B') {
			if (eventid.startsWith('blockerselect')) {
				var item = eventid.replace('blockerselect', '', eventid);
				if (item != 'empty') {
					if (leftclick) {
						window.dungeons[window.activepanelid - 1].blockers[window.activepanelid2].item = item;
						window.dungeons[window.activepanelid - 1].blockers[window.activepanelid2].hardblock = true;
					} else {
						window.dungeons[window.activepanelid - 1].blockers[window.activepanelid2].item = item;
						window.dungeons[window.activepanelid - 1].blockers[window.activepanelid2].hardblock = false;
					}
				} else {
					window.dungeons[window.activepanelid - 1].blockers[window.activepanelid2].item = '';
					window.dungeons[window.activepanelid - 1].blockers[window.activepanelid2].hardblock = false;
				}
			}
		//Overworld Items
		} else if (window.activepanel == 'I') {
			if (eventid.startsWith('itemselect')) {
				var item = eventid.replace('itemselect', '', eventid);
				if (item != 'empty') {
					var currentheartcount = 0;

					for (var i = 0; i < window.dungeons.length; i++) {
						for (var j = 0; j < window.dungeons[i].items.length; j++) {
							if (window.dungeons[i].items[j].item == 'heartcontainer') {
								currentheartcount++;
							}
							if (window.dungeons[i].items[j].item != '' && window.dungeons[i].items[j].item == item && (item != 'heartcontainer' || currentheartcount >= 9)) {
								return;
							}
						}
					}


					for (var i = 0; i < 3; i++) {
						if (window.items.owitems[i].item == 'heartcontainer') {
							currentheartcount++;
						}
						if (window.items.owitems[i].item != '' && window.items.owitems[i].item == item && (item != 'heartcontainer' || currentheartcount >= 9)) {
							return;
						}
					}

					if (leftclick) {
						window.items.owitems[window.activepanelid - 1].item = item;
						window.items.owitems[window.activepanelid - 1].obtained = true;
					} else {
						window.items.owitems[window.activepanelid - 1].item = item;
						window.items.owitems[window.activepanelid - 1].obtained = false;
					}

					switch (item) {
						case 'anykey': window.items.anykey = (leftclick ? true : false); break;
						case 'book': window.items.book = (leftclick ? true : false); break;
						case 'boomerang': window.items.boomerang = (leftclick ? true : false); break;
						case 'bow': window.items.bow = (leftclick ? true : false); break;
						case 'ladder': window.items.ladder = (leftclick ? true : false); break;
						case 'magicboomerang': window.items.magicboomerang = (leftclick ? true : false); break;
						case 'bracelet': window.items.bracelet = (leftclick ? true : false); break;
						case 'raft': window.items.raft = (leftclick ? true : false); break;
						case 'recorder': window.items.recorder = (leftclick ? true : false); break;
						case 'redcandle': window.items.redcandle = (leftclick ? true : false); break;
						case 'redring': window.items.redring = (leftclick ? true : false); break;
						case 'silverarrow': window.items.silverarrow = (leftclick ? true : false); break;
						case 'wand': window.items.wand = (leftclick ? true : false); break;
						case 'whitesword': window.items.whitesword = (leftclick ? true : false); break;
						case 'heartcontainer':
							for (var i = 0; i < 9; i++) {
								if (window.items.heartcontainers[i] == false) {
									window.items.heartcontainers[i] = true;
									i = 99;
								}
							}
							break;
					}
				} else {
					switch (window.items.owitems[window.activepanelid - 1].item) {
						case 'anykey': window.items.anykey = false; break;
						case 'book': window.items.book = false; break;
						case 'boomerang': window.items.boomerang = false; break;
						case 'bow': window.items.bow = false; break;
						case 'ladder': window.items.ladder = false; break;
						case 'magicboomerang': window.items.magicboomerang = false; break;
						case 'bracelet': window.items.bracelet = false; break;
						case 'raft': window.items.raft = false; break;
						case 'recorder': window.items.recorder = false; break;
						case 'redcandle': window.items.redcandle = false; break;
						case 'redring': window.items.redring = false; break;
						case 'silverarrow': window.items.silverarrow = false; break;
						case 'wand': window.items.wand = false; break;
						case 'whitesword': window.items.whitesword = false; break;
						case 'heartcontainer':
							for (var i = 0; i < 9; i++) {
								if (window.items.heartcontainers[i] == true) {
									window.items.heartcontainers[i] = false;
									i = 99;
								}
							}
							break;
					}
					window.items.owitems[window.activepanelid - 1].item = '';
					window.items.owitems[window.activepanelid - 1].obtained = false;
				}
			}
		//Overworld Tags
		} else if (window.activepanel == 'O') {
			if (eventid.startsWith('owselect')) {
				var map = eventid.replace('owselect', '', eventid);

				if (map != 'manuscript' && map != 'potion' && map != 'hint' && map != 'rupee' && map != 'takeany' && map != 'gamble'
					&& map != 'woodarrow' || map != 'bomb' || map != 'bluecandle' || map != 'key' || map != 'meat' || map != 'bluering' || map != 'shield') {
					for (var i = 0; i < 8; i++) {
						for (var j = 0; j < 16; j++) {
							if (window.locations[i][j].tag == map) {
								return;
							}
						}
					}
				}

				if (map == 'clear') {
					window.locations[window.activepanelid][window.activepanelid2].status = 'C';
					window.locations[window.activepanelid][window.activepanelid2].tag = '';
					window.locations[window.activepanelid][window.activepanelid2].shopitems = ['', '', ''];
				} else if (map == 'unclear') {
					window.locations[window.activepanelid][window.activepanelid2].status = window.locations[window.activepanelid][window.activepanelid2].startingstatus;
					window.locations[window.activepanelid][window.activepanelid2].tag = '';
				} else {
					window.locations[window.activepanelid][window.activepanelid2].status = 'T';

					if (map == 'woodarrow' || map == 'bomb' || map == 'bluecandle' || map == 'key' || map == 'meat' || map == 'bluering' || map == 'shield') {
						var existingitems = 0;
						var additem = true;
						for (var i = 0; i < 3; i++) {
							if (window.locations[window.activepanelid][window.activepanelid2].shopitems[i] == map) {
								window.locations[window.activepanelid][window.activepanelid2].shopitems[i] = '';
								additem = false;
							} else {
								if (window.locations[window.activepanelid][window.activepanelid2].shopitems[i] != '') {
									existingitems++;
								}
							}
						}
						if (additem) {
							for (var i = 0; i < 3; i++) {
								if (window.locations[window.activepanelid][window.activepanelid2].shopitems[i] == '') {
									window.locations[window.activepanelid][window.activepanelid2].shopitems[i] = map;
									window.locations[window.activepanelid][window.activepanelid2].tag = 'itemshop';
									i = 99;
								}
							}
						} else {
							if (existingitems == 0) {
								window.locations[window.activepanelid][window.activepanelid2].tag = '';
							}
						}
					} else {
						window.locations[window.activepanelid][window.activepanelid2].tag = map;
						if (map.startsWith('dungeon')) {
							var dungeonint = parseInt(map.replace('dungeon', ''));
							window.dungeons[dungeonint - 1].discovered = true;
							//document.getElementById('dungeonselecttab_' + dungeonint).classList.add('discovered');
							switchdungeon(dungeonint - 1);
						}
					} 

				} 
			}
		//Dungeon Rooms
		} else if (window.activepanel == 'M') {
			if (eventid.startsWith('dungeonroom')) {
				var map = eventid.replace('dungeonroom', '', eventid);

				var currenttile = window.dungeons[currentdungeon].rooms[(((window.activepanelid - 1) * 8) + (window.activepanelid2 - 1))];

				if (map == 'blank') {
					currenttile.tile = '';
					currenttile.cleared = false;
					currenttile.monster = '';
					currenttile.item = '';
				} else if (!map.startsWith('starting')) {
					currenttile.tile = map;
					currenttile.cleared = true;
				} else {
					if (!window.dungeons[currentdungeon].started) {
						currenttile.tile = map;
						currenttile.cleared = true;
						window.dungeons[currentdungeon].started = true;
					}
				}

				window.dungeons[currentdungeon].started = true;
			}
		//Dungeon Monster
		} else if (window.activepanel == 'C') {
			if (eventid.startsWith('dungeonmonster')) {
				var map = eventid.replace('dungeonmonster', '', eventid);

				var currenttile = window.dungeons[currentdungeon].rooms[(((window.activepanelid) * 8) + (window.activepanelid2))];

				if (map == 'blank') {
					currenttile.monster = '';
				} else {
					currenttile.monster = map;
				}
			}
		//Inside Dungeon Items
		} else if (window.activepanel == 'T') {
			if (eventid.startsWith('dungeonobject')) {
				var map = eventid.replace('dungeonobject', '', eventid);

				var currenttile = window.dungeons[currentdungeon].rooms[(((window.activepanelid) * 8) + (window.activepanelid2))];

				if (map == 'blank') {
					currenttile.item = '';
				} else {
					currenttile.item = map;
				}
			}
		}

		resetAllModals();

		window.updateow();
	}

	function detectLeftClick(event) {
		//console.log(event.target.id);

		if (window.activepanel != '') {
			selectFromModal(true, event.target.id);
		} else {
			if (event.target.id.indexOf('dungeonhint_') > -1) {
				window.activepanel = 'H'

				document.getElementById('dungeonhintmodal').style.display = 'inherit';

				window.activepanelid = parseInt(event.target.id.substring(parseInt(event.target.id.indexOf('_')) + 1)) - 1;

				document.getElementById('dungeonhintmodal').style.left = 50;
				document.getElementById('dungeonhintmodal').style.top = (window.activepanelid * 36) + 606;

			} else if (event.target.id.indexOf('unknowndungeon_') > -1) { 
				window.activepanel = 'U'

				document.getElementById('unknowndungeonmodal').style.display = 'inherit';

				window.activepanelid = parseInt(event.target.id.substring(parseInt(event.target.id.indexOf('_')) + 1)) - 1;

				document.getElementById('unknowndungeonmodal').style.left = 8;
				document.getElementById('unknowndungeonmodal').style.top = (window.activepanelid * 36) + 606;
			//Dungeon Items
			} else if (event.target.id.startsWith('dungeonitemimage_') || event.target.id.startsWith('itemselect')) {
				window.activepanelid = parseInt(event.target.id.substring(parseInt(event.target.id.indexOf('_')) + 1))- 1;
				window.activepanelid2 = parseInt(event.target.id.substring(parseInt(event.target.id.lastIndexOf('_')) + 1)) - 1;

				if (window.dungeons[window.activepanelid].items[window.activepanelid2].item != '') {
					window.dungeons[window.activepanelid].items[window.activepanelid2].obtained = !window.dungeons[window.activepanelid].items[window.activepanelid2].obtained;

					if (window.dungeons[window.activepanelid].items[window.activepanelid2].item == 'heartcontainer') {
						if (window.dungeons[window.activepanelid].items[window.activepanelid2].obtained) {
							for (var i = 0; i < 9; i++) {
								if (window.items.heartcontainers[i] == false) {
									window.items.heartcontainers[i] = true;
									i = 99;
								}
							}
						} else {
							for (var i = 0; i < 9; i++) {
								if (window.items.heartcontainers[i] == true) {
									window.items.heartcontainers[i] = false;
									i = 99;
								}
							}
						}
					} else {
						switch (window.dungeons[window.activepanelid].items[window.activepanelid2].item) {
							case 'anykey': window.items.anykey = window.dungeons[window.activepanelid].items[window.activepanelid2].obtained; break;
							case 'book': window.items.book = window.dungeons[window.activepanelid].items[window.activepanelid2].obtained; break;
							case 'boomerang': window.items.boomerang = window.dungeons[window.activepanelid].items[window.activepanelid2].obtained; break;
							case 'bow': window.items.bow = window.dungeons[window.activepanelid].items[window.activepanelid2].obtained; break;
							case 'ladder': window.items.ladder = window.dungeons[window.activepanelid].items[window.activepanelid2].obtained; break;
							case 'magicboomerang': window.items.magicboomerang = window.dungeons[window.activepanelid].items[window.activepanelid2].obtained; break;
							case 'bracelet': window.items.bracelet = window.dungeons[window.activepanelid].items[window.activepanelid2].obtained; break;
							case 'raft': window.items.raft = window.dungeons[window.activepanelid].items[window.activepanelid2].obtained; break;
							case 'recorder': window.items.recorder = window.dungeons[window.activepanelid].items[window.activepanelid2].obtained; break;
							case 'redcandle': window.items.redcandle = window.dungeons[window.activepanelid].items[window.activepanelid2].obtained; break;
							case 'redring': window.items.redring = window.dungeons[window.activepanelid].items[window.activepanelid2].obtained; break;
							case 'silverarrow': window.items.silverarrow = window.dungeons[window.activepanelid].items[window.activepanelid2].obtained; break;
							case 'wand': window.items.wand = window.dungeons[window.activepanelid].items[window.activepanelid2].obtained; break;
							case 'whitesword': window.items.whitesword = window.dungeons[window.activepanelid].items[window.activepanelid2].obtained; break;
						}
					}
				}
			//Overworld Items
			} else if (event.target.id.startsWith('overworlditem_')) {
				window.activepanelid = parseInt(event.target.id.substring(parseInt(event.target.id.indexOf('_')) + 1))- 1;

				if (window.items.owitems[window.activepanelid].item != '') {
					window.items.owitems[window.activepanelid].obtained = !window.items.owitems[window.activepanelid].obtained;

					if (window.items.owitems[window.activepanelid].item == 'heartcontainer') {
						if (window.items.owitems[window.activepanelid].obtained) {
							for (var i = 0; i < 9; i++) {
								if (window.items.heartcontainers[i] == false) {
									window.items.heartcontainers[i] = true;
									i = 99;
								}
							}
						} else {
							for (var i = 0; i < 9; i++) {
								if (window.items.heartcontainers[i] == true) {
									window.items.heartcontainers[i] = false;
									i = 99;
								}
							}
						}
					} else {
						switch (window.items.owitems[window.activepanelid].item) {
							case 'anykey': window.items.anykey = window.items.owitems[window.activepanelid].obtained; break;
							case 'book': window.items.book = window.items.owitems[window.activepanelid].obtained; break;
							case 'boomerang': window.items.boomerang = window.items.owitems[window.activepanelid].obtained; break;
							case 'bow': window.items.bow = window.items.owitems[window.activepanelid].obtained; break;
							case 'ladder': window.items.ladder = window.items.owitems[window.activepanelid].obtained; break;
							case 'magicboomerang': window.items.magicboomerang = window.items.owitems[window.activepanelid].obtained; break;
							case 'bracelet': window.items.bracelet = window.items.owitems[window.activepanelid].obtained; break;
							case 'raft': window.items.raft = window.items.owitems[window.activepanelid].obtained; break;
							case 'recorder': window.items.recorder = window.items.owitems[window.activepanelid].obtained; break;
							case 'redcandle': window.items.redcandle = window.items.owitems[window.activepanelid].obtained; break;
							case 'redring': window.items.redring = window.items.owitems[window.activepanelid].obtained; break;
							case 'silverarrow': window.items.silverarrow = window.items.owitems[window.activepanelid].obtained; break;
							case 'wand': window.items.wand = window.items.owitems[window.activepanelid].obtained; break;
							case 'whitesword': window.items.whitesword = window.items.owitems[window.activepanelid].obtained; break;
						}
					}
				}
			//Dungeon Map
			} else if (event.target.id.startsWith('dungeonmap_') || event.target.id.startsWith('dungeonmapmonster_') || event.target.id.startsWith('dungeonmapitem_')) {
				window.activepanelid = parseInt(event.target.id.substring(parseInt(event.target.id.indexOf('_')) + 1))- 1;
				window.activepanelid2 = parseInt(event.target.id.substring(parseInt(event.target.id.lastIndexOf('_')) + 1)) - 1;

				var currentroom = (window.activepanelid * 8) + window.activepanelid2

				if (!window.dungeons[window.currentdungeon].started) {
					window.dungeons[window.currentdungeon].rooms[currentroom].tile = 'startingbottom';
					window.dungeons[window.currentdungeon].rooms[currentroom].cleared = true;
					window.dungeons[window.currentdungeon].started = true;
				} else {
					if (window.dungeons[window.currentdungeon].rooms[currentroom].tile.startsWith('starting')) {
						if (window.dungeons[window.currentdungeon].rooms[currentroom].tile == 'startingbottom') window.dungeons[window.currentdungeon].rooms[currentroom].tile = 'startingleft';
						else if (window.dungeons[window.currentdungeon].rooms[currentroom].tile == 'startingleft') window.dungeons[window.currentdungeon].rooms[currentroom].tile = 'startingtop';
						else if (window.dungeons[window.currentdungeon].rooms[currentroom].tile == 'startingtop') window.dungeons[window.currentdungeon].rooms[currentroom].tile = 'startingright';
						else if (window.dungeons[window.currentdungeon].rooms[currentroom].tile == 'startingright') window.dungeons[window.currentdungeon].rooms[currentroom].tile = 'startingbottom';
					} else if (window.dungeons[window.currentdungeon].rooms[currentroom].tile != '') {
						window.dungeons[window.currentdungeon].rooms[currentroom].cleared = !window.dungeons[window.currentdungeon].rooms[currentroom].cleared;
					} else {
						window.dungeons[window.currentdungeon].rooms[currentroom].tile = 'emptyroom';
						window.dungeons[window.currentdungeon].rooms[currentroom].cleared = true;
					}
				}
			} else if (event.target.id.startsWith('dungeondoorew_')) {
				window.activepanelid = parseInt(event.target.id.substring(parseInt(event.target.id.indexOf('_')) + 1))- 1;
				window.activepanelid2 = parseInt(event.target.id.substring(parseInt(event.target.id.lastIndexOf('_')) + 1)) - 1;

				if (window.dungeons[window.currentdungeon].doorsew[(window.activepanelid * 8) + window.activepanelid2].tile == 'key' ||
				window.dungeons[window.currentdungeon].doorsew[(window.activepanelid * 8) + window.activepanelid2].tile == 'locked') {
					window.dungeons[window.currentdungeon].doorsew[(window.activepanelid * 8) + window.activepanelid2].tile = 'open';
				}
			} else if (event.target.id.startsWith('dungeondoorns_')) {
				window.activepanelid = parseInt(event.target.id.substring(parseInt(event.target.id.indexOf('_')) + 1))- 1;
				window.activepanelid2 = parseInt(event.target.id.substring(parseInt(event.target.id.lastIndexOf('_')) + 1)) - 1;

				if (window.dungeons[window.currentdungeon].doorsew[(window.activepanelid * 7) + window.activepanelid2].tile == 'key' ||
				window.dungeons[window.currentdungeon].doorsew[(window.activepanelid * 7) + window.activepanelid2].tile == 'locked') {
					window.dungeons[window.currentdungeon].doorsew[(window.activepanelid * 7) + window.activepanelid2].tile = 'open';
				}				
			}
		}

		window.updateow();
	}

	function detectRightClick(event) {
		if (window.activepanel != '') {
			selectFromModal(false, event.target.id);
		} else {
			//Dungeon Items
			if (event.target.id.startsWith('dungeonitemimage_')) {
				window.activepanelid = parseInt(event.target.id.substring(parseInt(event.target.id.indexOf('_')) + 1));
				window.activepanelid2 = parseInt(event.target.id.substring(parseInt(event.target.id.lastIndexOf('_')) + 1)) - 1;

				//Don't allow left click heart containers when heart shuffle is active
				if (window.flags.heartshuffle || window.activepanelid2 != 0 || window.activepanelid == 9) {
					window.activepanel = 'D';
					
					document.getElementById('itemselectmodal').style.display = 'inherit';

					document.getElementById('itemselectmodal').style.left = (window.activepanelid2 * 36) + 122;
					document.getElementById('itemselectmodal').style.top = (window.activepanelid * 36) + 382;
				}
			//Overworld Map
			} else if (event.target.id.startsWith('ow_') || event.target.id.startsWith('owtag_') || event.target.id.startsWith('owshop_')) {
				window.activepanel = 'O';

				var tmpsplit = event.target.id.split('_');

				window.activepanelid = parseInt(tmpsplit[1]) - 1;
				window.activepanelid2 = parseInt(tmpsplit[2]) - 1;

				if (window.locations[window.activepanelid][window.activepanelid2].startingstatus != 'U') {
					document.getElementById('owselectmodal').style.display = 'inherit';

					document.getElementById('owselectmodal').style.left = window.activepanelid2 < 2 ? 10 : window.activepanelid2 > 13 ? 674 : (window.activepanelid2 * 60) - 108;
					document.getElementById('owselectmodal').style.top = window.activepanelid == 0 ? 286 : window.activepanelid == 7 ? 328 : 302;
				} else {
					window.activepanel = '';
				}
			//Overworld Item
			} else if (event.target.id.startsWith('overworlditem_')) {
				window.activepanel = 'I';

				document.getElementById('itemselectmodal').style.display = 'inherit';

				window.activepanelid = parseInt(event.target.id.substring(parseInt(event.target.id.indexOf('_')) + 1));

				document.getElementById('itemselectmodal').style.left = ((window.activepanelid - 1) * 76) + 628; 
				document.getElementById('itemselectmodal').style.top = 200;
			//Dungeon Map
			} else if (event.target.id.startsWith('dungeonmap_') || event.target.id.startsWith('dungeonmapmonster_') || event.target.id.startsWith('dungeonmapitem_')) {
				window.activepanel = 'M';

				window.activepanelid = parseInt(event.target.id.substring(parseInt(event.target.id.indexOf('_')) + 1));  
				window.activepanelid2 = parseInt(event.target.id.substring(parseInt(event.target.id.lastIndexOf('_')) + 1));

				if (window.activepanelid2 != 0) {
					document.getElementById('dungeonroommodal').style.display = 'inherit';
				} else {
					window.activepanel = '';
				}
			//Dungeon Blockers
			} else if (event.target.id.startsWith('dungeonblock_')) {
				window.activepanel = 'B';

				window.activepanelid = parseInt(event.target.id.substring(parseInt(event.target.id.indexOf('_')) + 1));
				window.activepanelid2 = parseInt(event.target.id.substring(parseInt(event.target.id.lastIndexOf('_')) + 1)) - 1;

				document.getElementById('blockerselectmodal').style.display = 'inherit';

				document.getElementById('blockerselectmodal').style.left = (window.activepanelid2 * 36) + 236;
				document.getElementById('blockerselectmodal').style.top = (window.activepanelid * 36) + 472;
			} 
		}

		event.preventDefault();
	}

	//Only monitor for scroll wheel events on the dungeon map or doors
	function detectUpWheel(event) {
		if (event.target.id.startsWith('dungeonmap_') || event.target.id.startsWith('dungeonmapmonster_') || event.target.id.startsWith('dungeonmapitem_')) {
			window.activepanel = 'C';

			window.activepanelid = parseInt(event.target.id.substring(parseInt(event.target.id.indexOf('_')) + 1)) - 1;
			window.activepanelid2 = parseInt(event.target.id.substring(parseInt(event.target.id.lastIndexOf('_')) + 1)) - 1; 

			document.getElementById('dungeonmonstermodal').style.display = 'inherit';
		} else if (event.target.id.startsWith('dungeondoorns_')) {
			window.activepanelid = parseInt(event.target.id.substring(parseInt(event.target.id.indexOf('_')) + 1)) - 1;
			window.activepanelid2 = parseInt(event.target.id.substring(parseInt(event.target.id.lastIndexOf('_')) + 1)) - 1;

			var activedoor = window.dungeons[window.currentdungeon].doorsns[(window.activepanelid * 7) + window.activepanelid2];

			if (activedoor.tile == '') activedoor.tile = 'block';
			else if (activedoor.tile == 'open') activedoor.tile = '';
			else if (activedoor.tile == 'key') activedoor.tile = 'open';
			else if (activedoor.tile == 'locked') activedoor.tile = 'key';
			else if (activedoor.tile == 'special') activedoor.tile = 'locked';
			else if (activedoor.tile == 'block') activedoor.tile = 'special';

			window.updateow();
		} else if (event.target.id.startsWith('dungeondoorew_')) {
			window.activepanelid = parseInt(event.target.id.substring(parseInt(event.target.id.indexOf('_')) + 1)) - 1;
			window.activepanelid2 = parseInt(event.target.id.substring(parseInt(event.target.id.lastIndexOf('_')) + 1)) - 1;

			var activedoor = window.dungeons[window.currentdungeon].doorsew[(window.activepanelid * 8) + window.activepanelid2];

			if (activedoor.tile == '') activedoor.tile = 'block';
			else if (activedoor.tile == 'open') activedoor.tile = '';
			else if (activedoor.tile == 'key') activedoor.tile = 'open';
			else if (activedoor.tile == 'locked') activedoor.tile = 'key';
			else if (activedoor.tile == 'special') activedoor.tile = 'locked';
			else if (activedoor.tile == 'block') activedoor.tile = 'special';

			window.updateow();
		}
	}

	function detectDownWheel(event) {
		if (event.target.id.startsWith('dungeonmap_') || event.target.id.startsWith('dungeonmapmonster_') || event.target.id.startsWith('dungeonmapitem_')) {
			window.activepanel = 'T';

			window.activepanelid = parseInt(event.target.id.substring(parseInt(event.target.id.indexOf('_')) + 1)) - 1;
			window.activepanelid2 = parseInt(event.target.id.substring(parseInt(event.target.id.lastIndexOf('_')) + 1)) - 1;

			document.getElementById('dungeonobjectmodal').style.display = 'inherit';

		} else if (event.target.id.startsWith('dungeondoorns_')) {
			window.activepanelid = parseInt(event.target.id.substring(parseInt(event.target.id.indexOf('_')) + 1)) - 1;
			window.activepanelid2 = parseInt(event.target.id.substring(parseInt(event.target.id.lastIndexOf('_')) + 1)) - 1;

			var activedoor = window.dungeons[window.currentdungeon].doorsns[(window.activepanelid * 7) + window.activepanelid2];

			if (activedoor.tile == '') activedoor.tile = 'open';
			else if (activedoor.tile == 'open') activedoor.tile = 'key';
			else if (activedoor.tile == 'key') activedoor.tile = 'locked';
			else if (activedoor.tile == 'locked') activedoor.tile = 'special';
			else if (activedoor.tile == 'special') activedoor.tile = 'block';
			else if (activedoor.tile == 'block') activedoor.tile = '';

			window.updateow();
		} else if (event.target.id.startsWith('dungeondoorew_')) {
			window.activepanelid = parseInt(event.target.id.substring(parseInt(event.target.id.indexOf('_')) + 1)) - 1;
			window.activepanelid2 = parseInt(event.target.id.substring(parseInt(event.target.id.lastIndexOf('_')) + 1)) - 1;

			var activedoor = window.dungeons[window.currentdungeon].doorsew[(window.activepanelid * 8) + window.activepanelid2];

			if (activedoor.tile == '') activedoor.tile = 'open';
			else if (activedoor.tile == 'open') activedoor.tile = 'key';
			else if (activedoor.tile == 'key') activedoor.tile = 'locked';
			else if (activedoor.tile == 'locked') activedoor.tile = 'special';
			else if (activedoor.tile == 'special') activedoor.tile = 'block';
			else if (activedoor.tile == 'block') activedoor.tile = '';

			window.updateow();
		}

	}

	

}(window));
