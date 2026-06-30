$(document).ready(function () {
	// Popup - simple error message
	function showPopup(message) {
		$("#toastMessage").text(message);
		const toastElement = document.getElementById("gameToast");
		const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
		toast.show();
	}

	// Data info for Scrabble Tiles - I followed this one - https://www.scrabblewizard.com/scrabble-tile-distribution/
	const scrabbleDistributionTiles = [
		{ letter: "A", value: 1, count: 9 },
		{ letter: "B", value: 3, count: 2 },
		{ letter: "C", value: 3, count: 2 },
		{ letter: "D", value: 2, count: 4 },
		{ letter: "E", value: 1, count: 12 },
		{ letter: "F", value: 4, count: 2 },
		{ letter: "G", value: 2, count: 3 },
		{ letter: "H", value: 4, count: 2 },
		{ letter: "I", value: 1, count: 9 },
		{ letter: "J", value: 8, count: 1 },
		{ letter: "K", value: 5, count: 1 },
		{ letter: "L", value: 1, count: 4 },
		{ letter: "M", value: 3, count: 2 },
		{ letter: "N", value: 1, count: 6 },
		{ letter: "O", value: 1, count: 8 },
		{ letter: "P", value: 3, count: 2 },
		{ letter: "Q", value: 10, count: 1 },
		{ letter: "R", value: 1, count: 6 },
		{ letter: "S", value: 1, count: 4 },
		{ letter: "T", value: 1, count: 6 },
		{ letter: "U", value: 1, count: 4 },
		{ letter: "V", value: 4, count: 2 },
		{ letter: "W", value: 4, count: 2 },
		{ letter: "X", value: 8, count: 1 },
		{ letter: "Y", value: 4, count: 2 },
		{ letter: "Z", value: 10, count: 1 },
		{ letter: "_", value: 0, count: 2 },
	];

	// Board layout -15 squares) Empty string = normal square
	const boardLayout = [
		"",
		"",
		"double-word",
		"",
		"",
		"",
		"triple-letter",
		"",
		"double-letter",
		"",
		"",
		"triple-word",
		"",
		"",
		"",
	];

	let tileBag = [];
	let playerTileRack = [];
	let totalScore = 0;

	// start the Game
	function startScabbleGame() {
		totalScore = 0;
		$("#total-score").text(totalScore);
		$("#current-score").text("0");
		buildTileBag();
		renderBoard();
		playerTileRack = [];
		drawTiles(7);
	}

	// Build the bag of tiles for user
	function buildTileBag() {
		tileBag = [];
		scrabbleDistributionTiles.forEach((tilesInfoForUser) => {
			for (let tile = 0; tile < tilesInfoForUser.count; tile++) {
				tileBag.push({
					letter: tilesInfoForUser.letter,
					value: tilesInfoForUser.value,
				});
			}
		});
		// Shuffle the bag of tiles so user won't get same ones in order over and over again
		tileBag.sort(() => Math.random() - 0.5);
	}

	// Draw tiles from the bag to the player's rack
	function drawTiles(numOfTilesInBag) {
		for (let tile = 0; tile < numOfTilesInBag; tile++) {
			if (tileBag.length > 0) {
				playerTileRack.push(tileBag.pop());
			}
		}
		renderTileRack();
	}

	// create the Scrabble Board for user
	function renderBoard() {
		const board = $("#scrabble-board");
		board.empty();

		// special squares
		boardLayout.forEach((type, index) => {
			let specialTileSquare = "";
			if (type === "double-letter") specialTileSquare = "Double<br>Letter";
			if (type === "triple-letter") specialTileSquare = "Triple<br>Letter";
			if (type === "double-word") specialTileSquare = "Double<br>Word";
			if (type === "triple-word") specialTileSquare = "Triple<br>Word";

			const $square = $("<div></div>")
				.addClass("board-square")
				.addClass(type)
				.attr("data-index", index)
				.attr("data-type", type)
				.html(specialTileSquare);

			board.append($square);
		});
		setupDroppablesTiles();
	}

	// create the Tile rack for user
	function renderTileRack() {
		const playerRack = $("#tile-rack");
		playerRack.empty();

		playerTileRack.forEach((tile, index) => {
			// Format for Blank Tiles
			let displayLetter = tile.letter === "_" ? "" : tile.letter;
			let displayScore = tile.value === 0 ? "" : tile.value;

			const tileToRender = $("<div></div>")
				.addClass("scrabble-tile")
				.attr("data-letter", tile.letter)
				.attr("data-value", tile.value)
				.html(`${displayLetter}<span class="score">${displayScore}</span>`);

			playerRack.append(tileToRender);
		});
		setupDraggableTiles();
	}

	// Draggable tiles
	function setupDraggableTiles() {
		$(".scrabble-tile").draggable({
			revert: "invalid", // Snap back if not dropped on a valid target
			zIndex: 100,
			cursor: "grabbing",
			start: function (event, ui) {
				$(this).removeClass("on-board");
			},
		});
	}

	//  Droppable board squares & rack
	function setupDroppablesTiles() {
		$(".board-square").droppable({
			accept: function (draggable) {
				// Only accept if square is empty, OR if the draggable is already here
				return (
					$(this).children(".scrabble-tile").length === 0 ||
					$(this).children(".scrabble-tile").is(draggable)
				);
			},
			drop: function (event, ui) {
				let draggableTile = ui.draggable;
				let targetSquare = $(this);

				// Check adjacency requirement
				if (!isValidPlacement(targetSquare.attr("data-index"), draggableTile)) {
					// Bounce back
					draggableTile.animate({ top: 0, left: 0 }, "fast");

					if (draggableTile.parent().attr("id") === "tile-rack") {
						$("#tile-rack").append(draggableTile);
					}

					showPopup(
						"Tiles must be placed adjacent to existing tiles on the board!",
					);
					return;
				}

				// Snap tiles into position physically in the board
				draggableTile.detach().css({ top: 0, left: 0 }).appendTo(targetSquare);
				draggableTile.addClass("on-board");

				calculateCurrentScore();
			},
		});

		// Allow dragging back to the rack
		$("#tile-rack").droppable({
			accept: ".scrabble-tile",
			drop: function (event, ui) {
				let draggableTile = ui.draggable;
				draggableTile.detach().css({ top: 0, left: 0 }).appendTo(this);
				draggableTile.removeClass("on-board");
				calculateCurrentScore();
			},
		});
	}

	// to enforce tiles being placed next to each other(+1 and -1)(adjacency)
	function isValidPlacement(newTileIndex, draggedTile) {
		newTileIndex = parseInt(newTileIndex);
		let takenTileSpotsOnBoard = [];

		$(".board-square").each(function () {
			const childTile = $(this).children(".scrabble-tile");
			if (childTile.length > 0 && !childTile.is(draggedTile)) {
				takenTileSpotsOnBoard.push(parseInt($(this).attr("data-index")));
			}
		});

		if (takenTileSpotsOnBoard.length === 0) return true; // First tile goes anywhere
		return (
			takenTileSpotsOnBoard.includes(newTileIndex - 1) || // behind and front
			takenTileSpotsOnBoard.includes(newTileIndex + 1)
		);
	}

	// Calculate the score of the currently placed tiles
	function calculateCurrentScore() {
		let currentScore = 0;
		let wordMultiplier = 1;

		$(".board-square").each(function () {
			const tile = $(this).children(".scrabble-tile");
			if (tile.length > 0) {
				let letterExtraPoints = parseInt(tile.attr("data-value"));
				let squareType = $(this).attr("data-type");

				// special tiles(extra points if user use  them)
				if (squareType === "double-letter") letterExtraPoints *= 2;
				if (squareType === "triple-letter") letterExtraPoints *= 3;
				if (squareType === "double-word") wordMultiplier *= 2;
				if (squareType === "triple-word") wordMultiplier *= 3;

				currentScore += letterExtraPoints;
			}
		});
		// extra points multiplier
		currentScore *= wordMultiplier;
		$("#current-score").text(currentScore);
		return currentScore;
	}

	// user click on word Button(no word check)
	$("#btn-submit").click(function () {
		const score = calculateCurrentScore();
		if (score === 0) {
			showPopup("Place tiles on the board to make a word first!"); // pop up if user submit but no tile was place on board
			return;
		}

		totalScore += score;
		$("#total-score").text(totalScore);

		// Remove used tiles from the board
		$(".board-square .scrabble-tile").each(function () {
			$(this).remove();
		});

		// Sync the playerRack array with what remains in the tile rack
		playerTileRack = [];
		$("#tile-rack .scrabble-tile").each(function () {
			playerTileRack.push({
				letter: $(this).attr("data-letter"),
				value: parseInt($(this).attr("data-value")),
			});
		});

		// Reset current score display
		$("#current-score").text("0");

		// Deal new tiles to get back to 7(on reset as well)
		drawTiles(7 - playerTileRack.length);
	});

	// Recall & reset current tiles back to rack
	$("#btn-reset").click(function () {
		$(".board-square .scrabble-tile").each(function () {
			let boardTile = $(this);
			boardTile.detach().css({ top: 0, left: 0 }).appendTo("#tile-rack");
			boardTile.removeClass("on-board");
		});
		calculateCurrentScore();
	});

	// restart the game entirely
	$("#btn-restart").click(function () {
		startScabbleGame();
	});

	// Start the game on load
	startScabbleGame();
});
