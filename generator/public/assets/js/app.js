(function() {
	var elements = {
		multiplierInput: document.getElementById('multiplier-input'),
		multiplierOutput: document.getElementById('multiplier-output')
	}

	elements.multiplierInput.addEventListener('input', function(e) {
		elements.multiplierOutput.innerText = 'x ' + e.target.value
	})
})();