/***
 * Used during configuration stages so user can say how many bits they used to eat
 ***/
window.animals_config = {
	Chicken : { 
		name : 'Chicken',
		image : 'chicken.jpg',
		carcas_weight : 1500,
		amounts : {
			quarters : {
				name : 'Quarters',
				image : 'chicken-quarter.png',
				weight : 375,
				num : 0
			},
			big_bits : {
				name : 'Big bits',
				image : 'steak.png',
				weight : 175,
				num : 0
			},
			small_bits : {
				name : 'Small bits',
				image : 'meatball.png',
				weight: 70,
				num : 0
			}
		}
	},	
	Cow : { 
		name : 'Cow',
		image : 'cow.gif',
		carcas_weight : 220 * 1000 * 0.75,
		amounts : {
			big_bits : {
				name : 'Big bits',
				image : 'steak.png',
				weight : 175,
				num : 0
			},
			small_bits : {
				name : 'Small bits',
				image : 'meatball.png',
				weight: 70,
				num : 0
			}
		}
	},
	Fish : { 
		name : 'Fish',
		image : 'fish.png',
		carcas_weight : 800,
		amounts : {
			pieces : {
				name : 'Pieces',
				image : 'fish-fillet.jpg',
				weight : 100,
				num : 0
			}
		}
	},
	Pig : { 
		name : 'Pig',
		image : 'pig.jpg',
		carcas_weight : 55 * 1000 * 0.75,
		amounts : {
			big_bits : {
				name : 'Big bits',
				image : 'steak.png',
				weight : 175,
				num : 0
			},
			small_bits : {
				name : 'Small bits',
				image : 'meatball.png',
				weight: 70,
				num : 0
			}
		}
	},
	Sheep : { 
		name : 'Sheep',
		image : 'sheep.jpg',
		carcas_weight : 22 * 1000 * 0.75,
		amounts : {
			big_bits : {
				name : 'Big bits',
				image : 'steak.png',
				weight : 175,
				num : 0
			},
			small_bits : {
				name : 'Small bits',
				image : 'meatball.png',
				weight: 70,
				num : 0
			}
		}
	}
};

/***
 * The user's actual animals - generated based on their animals_config values
 ***/
window.animals = [];





$(function(){
	
	/***
	 * Simple router
	 ***/
	var routes= $('[route]')
	routes.hide();
	$('[default-route]').show();
	$('[route-to]').click(function(){
		routes.hide();
		$('[route=' + $(this).attr('route-to') + ']').show();
	});
	
	
	/***
	 * Form button JavaScript
	 * 
	 * Make it look like they are depressed on click
	 ***/
	$('body').on('mousedown', 'button', function(){
		$(this).addClass('pressed');
	})
	.on('mouseup mouseout', 'button', function(){
		$(this).removeClass('pressed');
	})
	// Toggle expandy chevron icon (between up and down)
	.on('click', '.toggle-visibility', function(){
		$(this).toggleClass('collapse');
	});
	
	
	
	// temp function to calculate and populate 'world'
	$('#tmp-toworld').click(function(){
		
		$('#world').empty(); //remove animals from previous calcs
		
		if (window.one_from_date == true) {
			var weeks = Math.round( (new Date() - new Date($('#all_animals_from_date').val())) / 604800000);
		}
		
		
		for (animal_type in animals_config) {
			var a = animals_config[animal_type];
			
			console.log('animal type: ',animal_type);
			
			
			// If the user is using unique dates - need to calculate weeks for each animal
			if (window.one_from_date == false) {
				var weeks =  Math.round( (new Date() - new Date(a.from_date)) / 604800000);
				console.log("a.from_date=",a.from_date);
				console.log("new Date(a.from_date))=",new Date(a.from_date));
			}
			
			var num_animals = 0;
			var total_weight = 0;
			
			for (size_type in a.amounts) {
				total_weight = total_weight + (a.amounts[size_type].weight * a.amounts[size_type].num);
				num_animals = num_animals + Math.floor( (total_weight * weeks) / a.carcas_weight );
			}

			
			if (num_animals > 0) {
				for (var i=0; i < num_animals; i++) {
					console.log('creating animal');
					$('#world').append('<img src="images/' + a.image + '" class="animal-pic">');
				}
			}
		}

	});
	
	
	/***
	 * Date fields are hidden in the animal data entry blocks. 
	 * This function shows the fields if the user wants to choose unique dates.
	 ***/
	window.one_from_date = true;
	$('input[name=date-stopped-radio]').click(function(){
		if ( $(this).val() == 'same' ) {
			$('.setup-animal .date').hide();
			window.one_from_date = true;
		} else if ( $(this).val() == 'different' ) {
			$('.setup-animal .date').show();
			window.one_from_date = false;
		}
	});
	
	
	
	var $animal_template = $('.template.setup-animal');
	var $bits_block_template = $('.template.bits-block');
	
	for (animal_type in animals_config) {
		
		var el = $animal_template.clone().removeClass('template').attr('name', animal_type);
		el.find('.title h2').text(animals_config[animal_type].name);
		el.find('.title img').attr('src', 'images/' + animals_config[animal_type].image);

		for (size_type in animals_config[animal_type].amounts) {
			
			var item = animals_config[animal_type].amounts[size_type];
			
			var bb_el = $bits_block_template.clone().removeClass('template').attr('name', size_type);
			bb_el.find('.type').text(item.name);
			
			// Use correct image for this bit-block template
			bb_el.find('.type-image').attr('src','images/' + item.image);
			
			bb_el.appendTo(el.find('.bit-blocks'));
			
			// Add span for images to appear in total row
			if ( el.find('.total ' + size_type).length == 0 ) {
				el.find('.total').append('<span class="image-total-for-' + size_type + '"></span>');
			}
		}
			
		el.appendTo('#animal-configs');
	}
	
	
	
	/***
	 * DOM events 
	 ***/
	$('#animal-configs')
	
	// Title
	.on('click', '.title', function(){
		var $animal_block = $(this).parents('.setup-animal');
		$(this).parents('.setup-animal').find('.body').slideToggle();
	})
	
	// Plus
	.on('click', '.bits-block .plus', function(){
		var $animal_block = $(this).parents('.setup-animal');
		var $bits_block = $(this).parents('.bits-block');

		animals_config[$animal_block.attr('name')]['amounts'][$bits_block.attr('name')].num++;
		$bits_block.find('.number').text(animals_config[$animal_block.attr('name')]['amounts'][$bits_block.attr('name')].num);
		
		// Add one to totals
		$animal_block.find('.total .image-total-for-' + $bits_block.attr('name')).append('<img class="type-image" src="images/' + animals_config[$animal_block.attr('name')]['amounts'][$bits_block.attr('name')].image + '">');
	})
	// Minus
	.on('click', '.bits-block .minus', function(){
		var $animal_block = $(this).parents('.setup-animal');
		var $bits_block = $(this).parents('.bits-block');

		// Can't reduce to beyond 0
		if (animals_config[$animal_block.attr('name')]['amounts'][$bits_block.attr('name')].num == 0) {
			return;
		}

		animals_config[$animal_block.attr('name')]['amounts'][$bits_block.attr('name')].num--;
		$bits_block.find('.number').text(animals_config[$animal_block.attr('name')]['amounts'][$bits_block.attr('name')].num);
		
		// Remove one from totals
		$animal_block.find('.total .image-total-for-' + $bits_block.attr('name') + ' .type-image').last().remove();
	})
	// From date field
	.on('change', 'input[type=date]', function(){
		var $animal_block = $(this).parents('.setup-animal');

		animals_config[$animal_block.attr('name')].from_date = $(this).val();
	});
		
		
});
