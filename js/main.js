const submit = document.getElementById('submit');
const input = document.getElementById('input');

input.onkeyup = function(e) {
	const search = input.value;
	if (e.keyCode == 13) searchWiki(search);
}

submit.onclick = function() {
	const search = input.value;
	searchWiki(search);
}

function searchWiki(search) {
	const url = 'https://ru.wikipedia.org/w/api.php?action=opensearch&format=json&search=' 
				+ search;

	const request = new XMLHttpRequest();
	request.open('GET', url);
	request.setRequestHeader("Origin", "https://chappi3322.github.io");
	request.responseType = 'json';
	request.onload = function() {
		console.log(request.response);
	}
	request.send();	
}