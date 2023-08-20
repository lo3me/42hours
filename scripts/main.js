/**
 * Calculates the sum of hours of each month
 * @param {HTMLElement[]} monthLabels
 * @returns {Object}
 */
function calcHours(monthLabels) {
	const months = {};
	let currentMonthLabel = null;

	monthLabels.forEach(label => {
		const monthName = label.textContent.trim();
		months[monthName] = [];
		currentMonthLabel = monthName;
	});

	const elements = document.querySelectorAll('svg text[font-size="10"], svg g[data-toggle="tooltip"][data-original-title]');
	elements.forEach(element => {
		const tagName = element.tagName.toLowerCase();
		if (tagName === 'text') {
			const monthName = element.textContent.trim();
			currentMonthLabel = monthName;
		} else if (tagName === 'g') {
			if (currentMonthLabel !== null) {
				months[currentMonthLabel].push(element);
			}
		}
	});

	const monthSums = {};
	for (const monthName in months) {
		monthSums[monthName] = 0;
		months[monthName].forEach(element => {
			const title = element.getAttribute('data-original-title');
			const time = parseFloat(title.replace("h", "."));
			if (!isNaN(time)) {
				monthSums[monthName] += Math.floor(time);
				monthSums[monthName] += (time - Math.floor(time)) / 6 * 10;
			}
		});
		monthSums[monthName] = (monthSums[monthName] + ((monthSums[monthName] - Math.floor(monthSums[monthName])) * 0.6)).toFixed(2);
	}
	return monthSums;
}

/**
 * Shows the calculated hours below each paired month label
 * @param {HTMLElement[]} monthLabels
 * @param {Object} monthSums
 */
function displayHours(monthLabels, monthSums) {
	monthLabels.forEach(label => {
		const hour = label.cloneNode(true)
		hour.setAttribute("y", (parseInt(hour.getAttribute("y")) + 12).toString())
		hour.setAttribute("x", (parseInt(hour.getAttribute("x")) - 9).toString())
		hour.style.fill = "#007B7C";
		hour.style.fontWeight = 700;
		hour.textContent = monthSums[label.textContent.trim()] + "h"
		label.parentNode.insertBefore(hour, label.nextSibling);
	})
}

/**
 * Main task representor
 */
function task() {
	const monthLabels = Array.from(document.querySelectorAll('svg text[font-size="10"]'));
	const monthSums = calcHours(monthLabels);
	displayHours(monthLabels, monthSums);
}

/**
 * 
 * @param {HTMLElement} parent The parent element of the target
 * @param {string} childQS The target query selector to be observed
 * @param {function(void): void} callback Gets called whenever the target is visible
 */
function respondToVisibility(parent, childQS, callback) {
	var observer = new MutationObserver((mutations) => {
		const record = mutations[0]
		if (record.type == "childList" && parent.querySelectorAll(childQS).length > 0) {
			callback();
			observer.disconnect();
		}
	});
	observer.observe(parent, { childList: true });
}

respondToVisibility(document.getElementById("user-locations"), "svg g rect[fill]", task);
