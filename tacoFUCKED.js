var converter = new showdown.Converter(),
	url = 'https://taco-randomizer.herokuapp.com/',
	recipe = [],
	layers = [],
	tacoIcon = '<img src="https://img.icons8.com/color/48/000000/taco.png"/>';


$('#btn').click(function () {

	updatePage();
})

$('#list').on('click', 'li', function () {
	updateRecipe($(this));
	toggleActive($(this));
})

$('#list').on('click', '#tacoSpan', function () {

	changeIngredient($(this).parent());

})

async function updatePage() {
	let data = await $.getJSON(url + 'random/');
	//storing original object to be used later
	$('#list').data('data', data);

	layers = Object.keys(data);
	var recipeName = layers.map(val => data[val].name);
	recipes = layers.map(val => converter.makeHtml(data[val].recipe));

	//clear old recipe
	$('ul').html("");
	$('#recipe').html("");

	//append new recipe
	recipeName.forEach((val, ind) => {
		// var data = converter.makeHtml(val);
		newItem(val, ind);
		// $(`'#item-${ind}'`).data('recipeData', recipes[ind]);
		// $('li p').first().html($('#list').data('data')[[list[ind]]);
	})


}

function newItem(val, ind) {
	var newItem = $(`<li id="item-${ind}"><span id="tacoSpan">${tacoIcon}</span>${val}</li>`);
	newItem.data('recipeData', recipes[ind]);
	newItem.data('layerData', layers[ind] + "s/");
	newItem.data('layerIndex', ind);
	$('#list').append(newItem);
}

function updateRecipe(newRecipe) {
	$('#recipe').html("");
	let recipEEE = newRecipe.data('recipeData');
	$('#recipe').html(recipEEE);



}

function toggleActive(recipe) {
	$("li").removeClass("active");  // remove active class from all
	$(recipe).addClass("active");         // add active class to clicked element 
};

async function changeIngredient(item) {

	let data = $.getJSON(url + item.data('layerData'))

	var randIng = data[Math.floor(Math.random() * data.length)];
	//clear old recipe

	$(item).remove();
	$('#recipe').html("");

	newItem(randIng.name, item.data('layerIndex'));
	var newerRecipe = converter.makeHtml(randIng.recipe);
	updateRecipe(newerRecipe);

}