import fetch from 'node-fetch';

const DEBUG_ENABLED = false;

async function getData(url) {
	try {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Fetch data error. Response status: ${res.status}`);
		}

		return await res.json();
	} catch (e) {
		console.warn(e);
	}
}

function debugLog(...args) {
	if (DEBUG_ENABLED) {
		console.log(...args);
	}
}

try {
	// Fetch the data
	const input_url = 'https://www.monogo.pl/competition/input.txt';
	const {
		selectedFilters,
		products,
		colors,
		sizes
	} = await getData(input_url);
	debugLog({
		selectedFilters,
		products: products.slice(0, 5),
		colors: colors.slice(0, 5),
		sizes: sizes.slice(0, 5)
	});

	// Combine products with colors and sizes
	const combined_prods = products.map(p => ({
		...p,
		color: colors.find(c => +c.id == p.id)?.value,
		size: sizes.find(s => +s.id == p.id)?.value,
	}));
	debugLog(combined_prods.slice(0, 5));

	// Get filtered products
	const filtered_prods = combined_prods.filter(p => selectedFilters.colors.includes(p.color) && selectedFilters.sizes.includes(p.size) && p.price > 200);
	debugLog(filtered_prods.slice(0, 5));

	// Get min & max price
	filtered_prods.sort((a, b) => a.price - b.price);
	const min_price = filtered_prods[0].price;
	const max_price = filtered_prods[filtered_prods.length - 1].price;
	debugLog({ min_price, max_price });

	// Get multiplication result
	const multi = Math.round(min_price * max_price);
	debugLog({ multi });

	// Get array result
	const arr_result = `${multi}`.match(/.{1,2}/g)
															 .map(e => e.split('').map(ee => +ee))
															 .map(e => e[0] + e[1]);
	debugLog({ arr_result });

	// Get final results
	const monogo_nr = 14; // Jeśli dobrze zrozumiałem że chodzi o adres :)
	const index_of_monogo_nr = arr_result.findIndex(e => e == monogo_nr);
	const final_result = index_of_monogo_nr * multi * 'Monogo'.length;
	debugLog({ monogo_nr, index_of_monogo_nr, final_result });

	// Print result
	console.log('\nThe result is:\n\t\t', final_result, '\n');
} catch (e) {
	console.warn(`Failed to execute task:\n\t${e}`);
}

// TODO:
// [ ] Remove debug logs
// [ ] Maybe create class or more functions
