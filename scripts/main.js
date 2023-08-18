/**
 * Delay to start calculating since there might be
 * a lazy load process to load the hours
 */
const delay = 400

/**
 * Calculates the sum of hours of each month
 * @param {HTMLElement[]} monthLabels
 * @returns {Object}
 */
function calcHours(monthLabels) {

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
		hour.setAttribute("x", (parseInt(hour.getAttribute("x")) - 6).toString())
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

setTimeout(task, delay);