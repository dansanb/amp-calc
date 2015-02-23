$(document).ready(function(){

	var models = [];
	var components = [];		
	
	// load model information from json file
	$.getJSON( "data/models.json", function( data ) {	  
		models = data;	
	});

	// load component information from json file
	$.getJSON( "data/components.json", function( data ) {	  
		components = data;	
		//console.log(components.pumps.ratings["10HP"]);
		//console.log(components["pumps"].ratings["15HP"]);
	});


	
	// typhoon model click
	$('.nav li a').click(function(e) {
        e.preventDefault(); // prevent the default action
        e.stopPropagation(); // stop the click from bubbling

        // remove active link, and set it to newly clicked nav button
        $(this).closest('ul').find('.active').removeClass('active');
        $(this).parent().addClass('active');

        // get model selected
        var model = models[ $(this).data("model") ];
        
        // set jumbotron text and image
        $(".jumbotron h1").text(model.name);

        // set jumbotron background
        $(".jumbotron").css('background-image', "url(images/machines/" + model.image + ")");
        console.log(model.image);

        // load configuration options
        loadConfigs(model.config);

        // calculate amperage
        calculateAmperage();
    });


    // voltage click
	$('.voltage-multiplier button').click(function(e) {		
        e.preventDefault(); // prevent the default action
        e.stopPropagation(); // stop the click from bubbling

        // remove active link, and set it to newly clicked nav button
        $(this).closest('div').find('.active').removeClass('active');
        $(this).addClass('active');

        // calculate amperage again
        calculateAmperage();
    });

    // component rating click
    $( document ).on('click', 'div.component-item-rating-options a', function(e) {     
        e.preventDefault(); // prevent the default action
        e.stopPropagation(); // stop the click from bubbling

        // remove active link, and set it to newly clicked nav button
        $(this).closest('div.component-item-rating-options').find('a.active').removeClass('active');
        $(this).addClass('active');
        
        // calculate amperage again
        calculateAmperage();
    });



    function loadConfigs(config) {
        // remove all previous configs
        $('.config-list').empty();

        for(var i=0; i < config.length; i++) {

            var component = config[i];

            // create new html list item template for component
            var template = $('#hidden-template-component').clone().html();

            // attach to component list
            var newComponent = $('.config-list').append(template);

            // get image, description, and ratings objects
            var image = $(newComponent).children().last().find('img');
            var title = $(newComponent).children().last().find('input.component-name');
            var buttonGroup = $(newComponent).children().last().find('.btn-group');
            
            // set component properties
            //$(image).attr('src', 'images/components/' + components[component.component].image);
            $(title).val(component.title);

            // add rating button for each component
            $.each(  components[component.component].ratings, function( key, rating ) {
                
                var activeClass = "";
                if (component.rating === key) {
                    activeClass = "active ";
                }                                        

                var button = '<a href="#" class="' + activeClass + 'btn btn-default" data-amp-rating="' + rating.rating + '">' + rating.name + '</a>';
                
                $(buttonGroup).append(button);                                
            });             
        }        
    }

    function calculateAmperage() {

        var newAmps = 0;
        var currentAmps = Number( $(".amp-result").text() )
        var ampMultiplier = Number($(".voltage-multiplier button.active").data("amp-multiplier"))

        // go through each component and get it's amp rating while totaling up
        $.each(  $("div.component-item a.active"), function( key, component ) {
            newAmps += Number($(component).data("amp-rating"));
        });

        // factor in multiplier
        newAmps = newAmps * ampMultiplier;

        // set total while animating        
        $({value: currentAmps}).animate({value: newAmps}, {
            duration: 500,
            easing:'swing', // can be anything
            step: function() { // called on every step
                // Update the element's text with rounded-up value:
                $('.amp-result').text( Math.round(this.value) );
            }
        });        
    }

	
});