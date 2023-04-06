(async function main() {
	const cardDisplay = document.getElementById("cardDisplay");
	const drawCount = document.getElementById("drawCount");
	const repeatBtn = document.getElementById("repeatBtn");
	const remainingDisplay = document.getElementById("remainingDisplay");

	let remainingCards;
	let deck = {};
	async function shuffleDeck(deckid) {
		deck = await fetch(`https://deckofcardsapi.com/api/deck/${deckid ? deckid : "new"}/shuffle/?deck_count=1`);
		deck = await deck.json();
		remainingCards = 52;
		console.log(deck);
	}
	await shuffleDeck();

	async function drawRequest(count) {
		let card = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=${count ? count : 1}`);
		card = await card.json();
		return card.cards.map((x) => {
			remainingCards--;
			cardDisplay.innerHTML += `<img src=${x.image}>`;
			// console.log(x.code);
			return x.code;
		});
	}

	async function drawCard(count) {
		console.log("drawing " + count);
		cardDisplay.innerHTML = "";
		let cardsReturn = [];
		if (remainingCards < count) {
			count -= remainingCards;
			cardsReturn.push(await drawRequest(remainingCards));
			await shuffleDeck(deck.deck_id);
		}
		cardsReturn.push(await drawRequest(count));
		return cardsReturn;
	}

	let alreadyDrawing = false;
	async function drawListener(event) {
		if (alreadyDrawing) return;
		if (drawCount.value < 1 || drawCount.value > 52) {
			drawCount.style.outline = "solid red 0.1rem";
			setTimeout(() => {drawCount.style.outline = ""}, 2000);
            drawCount.value = ""
			return;
		}
		alreadyDrawing = true;
		console.log(await drawCard(drawCount.value));
		console.log("remaining: " + remainingCards);
		remainingDisplay.innerHTML = `${remainingCards} cards in deck`;
		event.target.focus();
		alreadyDrawing = false;
	}
	drawCount.addEventListener("keypress", (e) => {
		if (e.key === "Enter") drawListener(e);
	});
	repeatBtn.addEventListener("click", drawListener);
	// console.log(`${await drawCard()}`);
})();
