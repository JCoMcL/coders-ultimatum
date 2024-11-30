async function getData(url) {
	try {
		const response = await fetch(url);
		const csvText = await response.text();
		
		// Split CSV into rows
		const rows = csvText.split('\n').filter(item => item);
		
		// Extract headers
		const headers = rows[0].split(',');
		
		// Convert to array of objects
		const data = rows.slice(1).map(row => {
			if (!row)
				return;
			const values = row.split(',');
			return headers.reduce((obj, header, index) => {
				obj[header.trim()] = values[index]?.trim();
				return obj;
			}, {});
		});

		return data;
	} catch (error) {
		console.error('Error loading CSV:', error);
	}
}

const template = document.getElementById("langblock-template");

function populateTemplate(data) {
	// Create a function to inject variables using template literals
	const render = new Function(...Object.keys(data), `return \`${template.innerHTML}\`;`);

	// Call the function with the data object values
	const populatedHTML = render(...Object.values(data));

	// Convert the string to a DOM element
	const tempContainer = document.createElement("div");
	tempContainer.innerHTML = populatedHTML;
	return tempContainer.firstElementChild;
}

function addLangblock(element) {
	template.parentElement.appendChild(element)
}

function getTwoRandom(array) {
	if (array.length < 2) {
		throw new Error("Array must have at least two elements.");
	}

	// Get two unique random indices
	const index1 = Math.floor(Math.random() * array.length);
	let index2;
	do {
		index2 = Math.floor(Math.random() * array.length);
	} while (index2 === index1);

	// Return the elements at those indices
	return [array[index1], array[index2]];
}

getData("langs.csv").then(langs => {
	getTwoRandom(langs).forEach(lang => {
		console.log(lang)
		addLangblock(populateTemplate(lang))
	})
})


addLangblock(populateTemplate("langblock-template", {
	name: "Ada",
	points: 7,
	icon: "/icons/ada.svg",
	link: "https://ada-lang.io/"
}));

addLangblock(populateTemplate("langblock-template", {
	name: "Python",
	points: 10,
	icon: "/icons/python.svg",
	link: "https://python.org/"
}));
