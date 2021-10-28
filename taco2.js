const converter = new showdown.Converter(),
	url = 'https://taco-randomizer.herokuapp.com/',
	tacoIcon = '<img src="https://img.icons8.com/color/48/000000/taco.png"/>',
	tacoSpan = '<span> &#x1F32E </span>',
	tacoButton = document.getElementById('btn');
let recipe = [],
	layers = [];


$(document).ready(function () {
	tacoButton.addEventListener('click', () => {
		tacoButton.classList.remove('start');
		tacoButton.addEventListener('transitionend', () => updatePage())
	})



	$('#list').on('click', 'li', function () {
		showRecipe($(this));
		toggleActive($(this));
	})

	$('#list').on('click', 'span', function (event) {
		event.stopPropagation();
		changeIngredient($(this).parent());
	})
})
async function updatePage() {

	let data = await $.getJSON(url + 'random/');


	layers = Object.keys(data);
	var recipeName = layers.map(val => data[val].name);
	recipes = layers.map(val => converter.makeHtml(data[val].recipe));

	//clear old recipe
	$('ul').html("");
	$('#recipe').html("");
	$('.col2').removeClass('activeCol2');
	$('#recipe').removeClass('activeRecipe');

	//append new recipe
	recipeName.forEach((val, ind) => {
		updateName(val, ind);

	})

}

function updateName(val, ind) {
	var newName = $(`<li id="item-${ind}">${tacoSpan}${val}</li>`);
	var dataObj = {
		'recipeData': recipes[ind],
		'layerData': layers[ind] + "s/",
		'layerIndex': ind
	};
	newName.data('data', dataObj);
	$('#list').append(newName);
}

function showRecipe(newRecipe) {
	let recipEEE = newRecipe.data('data').recipeData;
	$('#recipe').html("")
		.html(recipEEE);
	$('.col2').addClass('activeCol2');
	$('#recipe').addClass('activeRecipe');
}

function toggleActive(recipe) {
	$("li").removeClass("active");  // remove active class from all
	$(recipe).addClass("active");         // add active class to clicked element 
};

async function changeIngredient(item) {
	let data = await $.getJSON(url + item.data('data').layerData);
	var randIng = data[Math.floor(Math.random() * data.length)];
	replaceNameAndRecipe(randIng, item.data('data').layerIndex, item);
}

function replaceNameAndRecipe(val, ind, item) {
	var newerRecipe = converter.makeHtml(val.recipe);
	let newName = val.name;

	$(`#item-${ind}`).html(tacoSpan + newName)
		.data('data').recipeData = newerRecipe;
	if ($(`#item-${ind}`).hasClass('active')) {
		showRecipe(item);
	}
}