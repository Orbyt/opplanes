if (Meteor.isClient) {

	Meteor.startup(function() {
		this.$('#video').vide('/levideo.mp4', {
	    	loop: true,
	    	muted: true,
	    	position: '0% 0%'
	  	});


	})

	Template.autocomplete.onRendered( function() {
		$(function() {
    var projects = [
      {
        value: "jquery",
        label: "jQuery",
        desc: "the write less, do more, JavaScript library"
      },
      {
        value: "jquery-ui",
        label: "jQuery UI",
        desc: "the official user interface library for jQuery"
      },
      {
        value: "sizzlejs",
        label: "Sizzle JS",
        desc: "a pure-JavaScript CSS selector engine"
      }
    ];
 
    $( "#project" ).autocomplete({
      minLength: 0,
      source: projects,
      focus: function( event, ui ) {
        $( "#project" ).val( ui.item.label );
        return false;
      },
      select: function( event, ui ) {
        $( "#project" ).val( ui.item.label );
        $( "#project-id" ).val( ui.item.value );
        $( "#project-description" ).html( ui.item.desc );
 
        return false;
      }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<a>" + item.label + "<br>" + item.desc + "</a>" )
        .appendTo( ul );
    };
  });


	});
	

	Template.top.onRendered(function() {
		// this.$('#video').vide('/levideo.mp4', {
	 //    	loop: true,
	 //    	muted: true,
	 //    	position: '0% 0%'
	 //  	});
	});
				

    Template.lefttable.helpers({

        image: function () {
        	return Session.get('leftdata').img;

        },
        data : function() {
        	return Session.get('leftdata');

        },
        compare: function() {
        	var left = Session.get('leftdata');
    		var right = Session.get('rightdata');

    		//Compare
        	var rank = left.rank > right.rank ? "better" : "worse";
        	var rating = left.rating > right.rating ? "better" : "worse";
        	var maxalt = left.maxalt > right.maxalt ? "better" : "worse";
        	var speed = left.speed > right.speed ? "better" : "worse";
        	var turn = left.turn > right.turn ? "better" : "worse";
        	var climb = left.climb > right.climb ? "better" : "worse";
        	var cost = left.cost < right.cost ? "better" : "worse";

        	return {
        		rank: rank,
        		rating: rating,
        		maxalt: maxalt,
        		speed: speed,
        		turn: turn,
        		climb: climb,
        		cost: cost

        	};

        }
    });

    Template.righttable.helpers({

    	image: function () {
           return Session.get('rightdata').img;

    	},
    	data: function() {
    		return Session.get('rightdata');

    	},
    	compare: function() {
    		var left = Session.get('leftdata');
    		var right = Session.get('rightdata');

    		//Compare
        	var rank = right.rank > left.rank ? "better" : "worse";
        	var rating = right.rating > left.rating ? "better" : "worse";
        	var maxalt = right.maxalt > left.maxalt ? "better" : "worse";
        	var speed = right.speed > left.speed ? "better" : "worse";
        	var turn = right.turn > left.turn ? "better" : "worse";
        	var climb = right.climb > left.climb ? "better" : "worse";
        	var cost = right.cost < left.cost ? "better" : "worse";

        	return {
        		rank: rank,
        		rating: rating,
        		maxalt: maxalt,
        		speed: speed,
        		turn: turn,
        		climb: climb,
        		cost: cost

        	};
    	}
    });

    Template.left.events({
        'submit form, click form .button': function (event) {
            event.preventDefault();
            var input = event.target.search.value;
            Meteor.call('search', input, function(error, result){
                Session.set('leftdata', result);
                var stuff = Session.get('leftdata');
                console.log(stuff.img);

            });
        }
    });

    Template.right.events({
    	'submit form, click form .button': function (event) {
    		event.preventDefault();
            var input = event.target.search.value;
            Meteor.call('search', input, function(error, result){
                Session.set('rightdata', result);
                var stuff = Session.get('rightdata');
                console.log(stuff.image);

            });
    	}
    }); 

    function compare (left, right) {
  	    return left > right ? "better" : "worse";
	}
}      


if (Meteor.isServer) {

    Meteor.startup(function () {
         
    });

    Meteor.methods({
        search: function (input) {

            var url = 'http://wiki.warthunder.com/index.php?title=' + input;

            var result = request.getSync(url, {encoding: null});

                $ = cheerio.load(result.body);

                /*
                 * Parse
                 */
                
                //The following is a parsing method with regex for parsing the table data
                /*var text = $('.flight-parameters td').text();
                var re = /Title\s*(.*?)\s*Country\s*(.*?)\s*Rank\s*(.*?)\s*Rating\s*(.*?)\s*Max altitude\s*(.*?)\s*Max speed\s*(.*?)\s*Turn time\s*(.*?)\s*Take on distance\s*(.*?)\s*Climb time\s*(.*?)\s*Climb rate\s*(.*?)\s*Time for free repair\s*(.*?)\s*Max repair cost\s*(.*?)\s*Cost\s*(.*?)\s*$/gm; 
				var subst = '$1, $2, $3, $4, $5, $6, $7, $8, $9';*/

				//Parse all the table info, and make them into integers/floats if necessary
				var title = $('.flight-parameters td:contains("Title")').next().text();
				var country = $('.flight-parameters td:contains("Country")').next().text();
				var rank = parseInt($('.flight-parameters td:contains("Rank")').next().text());
				var rating = parseFloat($('.flight-parameters td:contains("Rating")').next().text());
				var maxalt = parseFloat($('.flight-parameters td:contains("Max altitude")').next().text());
				var speed = parseInt($('.flight-parameters td:contains("Max speed")').next().text());
				var turn = parseFloat($('.flight-parameters td:contains("Turn time")').next().text());
				var climb = parseFloat($('.flight-parameters td:contains("Climb rate")').next().text());
				var cost = parseInt($('.flight-parameters td:contains("Cost")').next().text());

				//Grabs the img src
				var picture = $('.object-image img').attr('src');

				//Put the previous data in an object
				var data = {

					title: title,
					country: country,
					rank: rank,
					rating: rating,
					maxalt: maxalt,
					speed: speed,
					turn: turn,
					climb: climb,
					cost: cost,
					img: picture
				};

                return data;        
        }
    });
}
