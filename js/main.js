const submit = document.getElementById('submit');
const input = document.getElementById('input');
const select = document.getElementById('select');
const dark = document.querySelector('.dark-theme');
const light = document.querySelector('.light-theme');
const filter = document.querySelector('.filter');

// Установить ранее сохраненную тему
window.onload = function() {
	const theme = localStorage.getItem('body');

	if (theme != null) {
		document.body.removeAttribute('class');
		input.removeAttribute('class');
		submit.removeAttribute('class');
		select.previousElementSibling.removeAttribute('class');

		document.body.classList.add(theme + 'theme-body');
		select.previousElementSibling.classList.add(theme + 'theme-p');
		input.classList.add(theme + 'theme-input');
		submit.classList.add(theme + 'submit');
	}
}

submit.onclick = function() {
	const bodyClass = document.body.getAttribute('class');

	// При нажатии на кнопку активировать поиск и установить тему  
	if (!input.classList.contains('input-active')) {
		switch (bodyClass) {
			case 'dark-theme-body':
				input.classList.add('input-active');
				submit.classList.add('dark-submit-active');
				break;
			case 'light-theme-body':
				input.classList.add('input-active');
				submit.classList.add('light-submit-active');
				break;
			default:
				return false;
				break;
		}
		input.focus();
	}
	else {
		const search = input.value;
		const count = select.value;
		searchArticles(search, count);
	}
}

input.onkeyup = function(e) {
	if (e.keyCode == 13) {
		const search = input.value;
		const count = select.value;
		searchArticles(search, count);
	}
}

// Темная тема
dark.onclick = function() {
	const articles = document.querySelectorAll('.results');

	removeTheme(articles);
	document.body.classList.add('dark-theme-body');
	select.previousElementSibling.classList.add('dark-theme-p');

	// Если открыта поисковая строка
	if (input.classList.contains('input-active')) {
		input.setAttribute('class', 'dark-theme-input input-active');
		submit.setAttribute('class', 'dark-submit dark-submit-active');
	}
	else {
		input.setAttribute('class', 'dark-theme-input');
		submit.setAttribute('class', 'dark-submit');
	}

	for (let i = 0; i < articles.length; i++) {
		const a = articles[i].children[0];
		const p = articles[i].children[1];

		a.classList.add('dark-theme-a');
		p.classList.add('dark-theme-p');
	}

	// Сохранить темную тему
	localStorage.setItem('body', 'dark-');
}

// Светлая тема
light.onclick = function() {
	const articles = document.querySelectorAll('.results');

	removeTheme(articles);
	document.body.classList.add('light-theme-body');
	select.previousElementSibling.classList.add('light-theme-p');

	// Если открыта поисковая строка	
	if (input.classList.contains('input-active')) {
		input.setAttribute('class', 'light-theme-input input-active');
		submit.setAttribute('class', 'light-submit light-submit-active');
	}
	else {
		input.setAttribute('class', 'light-theme-input');
		submit.setAttribute('class', 'light-submit');
	}

	for (let i = 0; i < articles.length; i++) {
		const a = articles[i].children[0];
		const p = articles[i].children[1];

		a.classList.add('light-theme-a');
		p.classList.add('light-theme-p');
	}

	// Сохранить светлую тему
	localStorage.setItem('body', 'light-');
}

filter.onclick = function() {
	const articles = document.querySelectorAll('.results');
	let pushArticles = document.querySelector('.articles');
	let arr = [];

	for (let i = 0; i < articles.length; i++) {
		arr.push([articles[i].children[0].innerHTML.toLowerCase(), articles[i]]);
	}

	if (pushArticles.classList.contains('up-down')) {
		arr = arr.sort();
		pushArticles.classList.remove('up-down');
		pushArticles.classList.add('down-up');
		pushArticles.innerHTML = '';
		document.querySelector('.filter').innerHTML = '&darr;';
	}

	else {
		arr = arr.sort().reverse();
		pushArticles.classList.remove('down-up');
		pushArticles.classList.add('up-down');
		pushArticles.innerHTML = '';
		document.querySelector('.filter').innerHTML = '&uarr;';	
	}

	for (let j = 0; j < arr.length; j++) {
		pushArticles.appendChild(arr[j][1]);
	}
}

function removeTheme(articles) {
	document.body.removeAttribute('class');
	select.previousElementSibling.removeAttribute('class');

	for (let i = 0; i < articles.length; i++) {
		articles[i].children[0].removeAttribute('class');
		articles[i].children[1].removeAttribute('class');
	}
}

function searchArticles(search, count) {
	// Обнуление запросов
	document.querySelector('.articles').innerHTML = '';

	const url = 'https://ru.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search='
				+ search + '&limit=' + count;
	const request = new XMLHttpRequest();
	request.open('GET', url);
	request.responseType = 'json';
	request.onload = function() {
		const names = request.response[1];
		const links = request.response[3];

		for (let i = 0; i < names.length; i++) {
			getText(names[i], links[i], count);
		}
	}
	request.send();
}

function getText(names, links, count) {
	const url = 'https://ru.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exintro=&explaintext=&titles='
				+ names + '&limit=' + count;
	const request = new XMLHttpRequest();
	request.open('GET', url);
	request.responseType = 'json';
	request.onload = function() {
		const req = request.response.query.pages;
        const obj = Object.keys(req)[0];
        // Получить текст статьи и ограничить до 35 слов
        let text = req[obj].extract.split(' ').splice(',', 35);
    
        push(names, text, links);
	}
	request.send();
}

function push(names, text, links) {
	// Если пустой запрос
	if (text.length <= 1) return false;

	const div = document.createElement('div');
	div.classList.add('results');
	document.querySelector('.articles').appendChild(div);

	const a = document.createElement('a');
	a.setAttribute('href', links);
	a.setAttribute('target', '_blank');
	a.innerHTML = names;
	setTheme(a);
	div.appendChild(a);

	const p = document.createElement('p');
	p.innerHTML = text.join(' ') + '...';
	setTheme(p);
	div.appendChild(p);
}

function setTheme(tag) {
	const bodyClass = document.body.getAttribute('class');
	const tagName = tag.tagName.toLowerCase();

	switch (bodyClass) {
		case 'dark-theme-body':
			tag.classList.add('dark-theme-' + tagName);
			break;
		case 'light-theme-body':
			tag.classList.add('light-theme-' + tagName);
			break;
		default:
			return false;
			break;
	}
}