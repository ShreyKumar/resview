'use strict';

// Reviews controller
angular.module('reviews').controller('ReviewsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', '$http', 'Reviews',
	function($scope, $rootScope, $stateParams, $location, Authentication, $http, Reviews) {
		$scope.authentication = Authentication;
        $scope.isName = false;
        
        $scope.residence = "Chestnut Residence";
        
        function initialize() {
    //load grayscale style
    var styles = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]
            
    // Create a new StyledMapType object, passing it the array of styles,
    // as well as the name to be displayed on the map type control.
    var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

            
    var myLatlng = new google.maps.LatLng(43.6542904, -79.3854518);
    var mapOptions = {
        zoom: 16,
        center: myLatlng,
        mapTypeControlOptions: false,
        disableDefaultUI: true,
        scaleControl: true,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE 
        }
    };
            
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map
    });
            
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');
}

google.maps.event.addDomListener(window, 'load', initialize);
        // END G MAPS
        
        //global variables
        var building;
        var headline;
        var description;
        
		// Create new Review
		$scope.create = function(headline, description, don, food, conv, overallexp, building) {
			// Create new Review object
			var review = new Reviews ({
				headline: headline,
                description: description,
                don: don,
                foodquality: food,
                convinience: conv,
                overallexp: overallexp,
                agrees: [],
                disagrees: [],
                building: building
			});
            
            console.log(review);
			// save it 
			review.$save();
		};

        $scope.getStars = function() {
            console.log(parseInt(review.overallexp));
        };
        
		// Remove existing Review
		$scope.remove = function(review) {
			if ( review ) { 
				review.$remove();

				for (var i in $scope.reviews) {
					if ($scope.reviews [i] === review) {
						$scope.reviews.splice(i, 1);
					}
				}
			} else {
				$scope.review.$remove(function() {
					$location.path('reviews');
				});
			}
		};

		// Update existing Review
		$scope.update = function(review) {
			review.$update(function() {
				$location.path('reviews/' + review._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Reviews
		$scope.find = function() {
			$scope.reviews = Reviews.query();
		};

		// Find existing Review
		$scope.findOne = function() {
			$scope.review = Reviews.get({ 
				reviewId: $stateParams.reviewId
			});
		};
        
        
        //jQuery Magic
        $(document).ready(function(){
            var isClicked = false;
            var isClickedBack = false;
            
            $('div.col-md-3 > div.controls > div.glyphicon').click(function(){
                var currElement = $(this).next();
                while(currElement.hasClass('glyphicon-star')){
                    currElement.removeClass('glyphicon-star');
                    currElement.addClass('glyphicon-star-empty');
                    currElement.removeClass('isClicked');
                    currElement = currElement.next();
                    
                    isClickedBack = true;
                }
                
                //add the first one
                $(this).removeClass('glyphicon-star-empty');
                $(this).addClass('glyphicon-star');
                $(this).addClass('isClicked');
                
                //take the rest out
                $(this).prevAll().removeClass('glyphicon-star-empty');
                $(this).prevAll().addClass('glyphicon-star');
                $(this).prevAll().addClass('isClicked');
                
                //turn on isClicked
                isClicked = true;
                
            });
            
            $('div.col-md-3 > div.controls > div.glyphicon').mouseenter(function(){
                //add the first one
                $(this).removeClass('glyphicon-star-empty');
                $(this).addClass('glyphicon-star');
                
                //take the rest out
                $(this).prevAll().removeClass('glyphicon-star-empty');
                $(this).prevAll().addClass('glyphicon-star');
                
                isClicked = false;
            });
            
            $('div.col-md-3 > div.controls > div.glyphicon').mouseleave(function(){
                if(!isClicked){
                    if(!$(this).hasClass('isClicked')){
                        //add the first one
                        $(this).addClass('glyphicon-star-empty');
                        $(this).removeClass('glyphicon-star');
                    }

                    $(this).prevAll(':not(div.isClicked)').addClass('glyphicon-star-empty');
                    $(this).prevAll(':not(div.isClicked)').removeClass('glyphicon-star');
                }
            });
            
            $("#view").addClass('active');
            $("#write").removeClass('active');
            $("#writereview").hide();
            
            $("#write").unbind().click(function(){
                //change navs
                $("#view").removeClass('active');
                $("#write").addClass('active');
                
                //reset entire preview
                $("div#insertbuilding").html("");
                $("div#main-stars").children("div.glyphicon").removeClass("glyphicon-star");
                $("div#main-stars").children("div.glyphicon").addClass("glyphicon-star-empty");
                $("div#headline").html("");
                $("div#donstars").html("");
                $("div#foodstars").html("");
                $("div#convstars").html("");
                $("textarea#thoughts-value").html("");
                $("#preview-outer").hide();
                
                //take out error
                $("#building").unwrap("<div class='error' />");
                $("#exp").unwrap("<div class='error' />");
                $("#errormsg").html("");
                
                $("#writereview").show();
                $("#seereviews").hide();
            });
            
            $("#view").unbind().click(function(){
                //change navs
                $("#view").addClass('active');
                $("#write").removeClass('active');
                $("#previewcontent").html("");
                $("#preview").hide();
                
                $("#writereview").hide();
                $("#seereviews").show();
                
            });
            
            //main div fix
            $('section').css("background-color", "white");
            $('section > div.col-md-12').css("background-color", "white");
            
            //hide preview initially
            $("#preview-outer").hide();
            $("#preview").hide();
            
            //Form validation
            $("input#submit").unbind().click(function(){
                
                //hide name
                var isName = $("#hidename").is(":checked");
                var isPic = $("#hidepic").is(":checked");
                
                if(isName){
                    $("#reviewer").html("Anonymous");
                } else {
                    $("#reviewer").html($scope.authentication.user.displayName);
                }
                
                if(!$('div#exp > div.col-md-3 > div.controls').children('div.glyphicon').hasClass('isClicked')){
                    $("div#errormsg").html("");
                    $('div#exp').wrapAll('<div class="error" />');
                    $('div#errormsg').append('<h4>Overall Experience is required.</h4>');
                } else if($("#building-value").val() == 'none'){
                    $("div#errormsg").html("");
                    $('div#building').wrapAll('<div class="error" />');
                    $('div#errormsg').append('<h4>Building is required</h4>');
                } else {
                    building = $("select#building-value").val();
                    if(building == 'chestnut'){
                       $('#insertbuilding').html("Chestnut Residence");
                    }
                    //here comes the animation
                    $('#writereview').fadeOut();
                    
                    //show top and bottom headings too
                    $("#preview").show();
                    $("#preview > h3").show();
                    $("#preview > p").show();
                    $(".edit-btn").show();
                    //unwrap container
                    $("#previewcontent").unwrap("<div class='container' />");
                    
                    $("#preview-outer > h3, #preview-outer > p").show();
                    
                    //remove preview settings
                    //$("#previewcontent").parent().css("width", "100%");
                    $("#previewcontent").css("margin", "");
                    $("#previewcontent").css("height", "auto");
                    $("#previewcontent").css("margin-left", "0px");
                    $("#previewcontent").css("margin-right", "0px");
                    $("#previewcontent").css("position", "relative");
                    
                    headline = $("#title").val();
                    if($("#title").val() != ""){
                        //load up the content
                        var preview = "<i><div class='fa fa-quote-left' style='font-size: 20px'></div><h3><a id='headclick'>&nbsp;" +
                            headline + "</a></h3>" + 
                            "<div class='row container' id='more' style='width: 100%'></div>" + 
                            "&nbsp;<div class='fa fa-quote-right' style='font-size: 20px'></div></i>";

                    }
                    $("#headline").html(preview);
                        
                    //initially hide more
                    description = $("textarea#comments").val()
                    $("div#more").html("<i>" + description + "</i>");
                    $("div#more").hide();
                        
                    var down = false;
                    $("a#headclick").click(function(){
                        if(down){
                            $("div#more").slideUp();
                            down = false;
                        } else {
                            $("div#more").slideDown();
                            down = true;
                        }
                    });
                    
                    
                    //count up all stars
                    var donstars = $("div#don div.controls div.isClicked").length;
                    var foodstars = $("div#food div.controls div.isClicked").length;
                    var expstars = $("div#exp div.controls div.isClicked").length;
                    var convstars = $("div#conv div.controls div.isClicked").length;
                    
                    /*************** LOAD UP EXP STARS ****************/
                    //clear entire stars
                    $("div#previewcontent div.name.row h3").children().removeClass('glyphicon-star');
                    $("div#previewcontent div.name.row h3").children().addClass('glyphicon-star-empty');
                    
                    //go through every star and color it in
                    var i = 0
                    var element = $("div#previewcontent div#main-stars").children().first();
                    console.log(element);
                    while(i < expstars){
                        element.removeClass('glyphicon-star-empty');
                        element.addClass('glyphicon-star');
                            
                        element = element.next();
                        i++;
                    }
                    
                    
                    /**************** LOAD UP DON STARS ****************/
                    if(donstars != 0){
                        
                        var stars = 
                            "<div class='row'>" + 
                                "<div class='col-md-6'>" + 
                                    "Don" +
                                "</div>" +
                                "<div class='col-md-6'>" + 
                                    "<div class='glyphicon glyphicon-star-empty'></div>" +
                                    "<div class='glyphicon glyphicon-star-empty'></div>" +
                                    "<div class='glyphicon glyphicon-star-empty'></div>" +
                                    "<div class='glyphicon glyphicon-star-empty'></div>" +
                                    "<div class='glyphicon glyphicon-star-empty'></div>" +
                                "</div>" + 
                            "</div>";
                        
                        $("div#stars div#donstars").html("");
                        $("div#stars div#donstars").append(stars);
                        
                        //Color stars
                        var i = 0
                        var element = $("div#stars div#donstars div.row div.col-md-6").children().first();
                        while(i < donstars){
                            element.removeClass('glyphicon-star-empty');
                            element.addClass('glyphicon-star');

                            element = element.next();
                            i++;
                        }
                        
                    }
                    /********* LOAD UP FOOD STARS ********/
                    if(foodstars != 0){
                        var stars = 
                            "<div class='row'>" + 
                                "<div class='col-md-6'>" + 
                                    "Food Quality" +
                                "</div>" +
                                "<div class='col-md-6'>" + 
                                    "<div class='glyphicon glyphicon-star-empty'></div>" +
                                    "<div class='glyphicon glyphicon-star-empty'></div>" +
                                    "<div class='glyphicon glyphicon-star-empty'></div>" +
                                    "<div class='glyphicon glyphicon-star-empty'></div>" +
                                    "<div class='glyphicon glyphicon-star-empty'></div>" +
                                "</div>" + 
                            "</div>";
                        
                        $("div#stars div#foodstars").html("");
                        $("div#stars div#foodstars").append(stars);
                        
                        //Color stars
                        var i = 0
                        var element = $("div#stars div#foodstars div.row div.col-md-6").children().first();
                        while(i < foodstars){
                            element.removeClass('glyphicon-star-empty');
                            element.addClass('glyphicon-star');

                            element = element.next();
                            i++;
                        }
                        
                    }
                    
                    if(convstars != 0){
                        var stars = 
                            "<div class='row'>" + 
                                "<div class='col-md-6'>" + 
                                    "Convinience" +
                                "</div>" +
                                "<div class='col-md-6'>" + 
                                    "<div class='glyphicon glyphicon-star-empty'></div>" +
                                    "<div class='glyphicon glyphicon-star-empty'></div>" +
                                    "<div class='glyphicon glyphicon-star-empty'></div>" +
                                    "<div class='glyphicon glyphicon-star-empty'></div>" +
                                    "<div class='glyphicon glyphicon-star-empty'></div>" +
                                "</div>" + 
                            "</div>";
                        
                        $("div#stars div#convstars").html("");
                        $("div#stars div#convstars").append(stars);
                        
                        //Color stars
                        var i = 0
                        var element = $("div#stars div#convstars div.row div.col-md-6").children().first();
                        while(i < convstars){
                            element.removeClass('glyphicon-star-empty');
                            element.addClass('glyphicon-star');

                            element = element.next();
                            i++;
                        }
                        
                    }
                    $("div#preview-outer").fadeIn(4500);
                    $("div#preview-outer").show();
                    
                }
            });
            
        });
        
        $(document).ready(function(){
            //Edit function
            $("a#edit").unbind().click(function(){
                $("#preview-outer").fadeOut(4500);
                $("#writereview").fadeIn(4500);
                
                //put details back
                $("textarea").html($("#comments").val());
                $("#title").html($("#title").val());
            });
            
            $("a#perfect").unbind().click(function(){
                var width = $("#previewcontent").width();
                var height = $("#previewcontent").height();
                
                //make it absolute
                $("#previewcontent").css("position", "absolute");
                $("#previewcontent").css("width", width + 2);
                $("#previewcontent").css("height", "auto");
                $("#previewcontent").css("margin", "1%");
                $("#previewcontent").wrapAll("<div class='container' />");
                $("div.edit-btn").hide();
                
                $("#previewcontent").animate({
                    marginTop: '-46%'
                }, {
                    duration: 2000
                });
                
                $("#preview-outer > div#preview > h3, #preview-outer > div#preview > p").hide();
                
                //reset everything in write review
                $("#newreview").trigger("reset");
                
                var donstars = $("div#don div.controls div.isClicked").length;
                var foodstars = $("div#food div.controls div.isClicked").length;
                var expstars = $("div#exp div.controls div.isClicked").length;
                var convstars = $("div#conv div.controls div.isClicked").length;
                
                console.log(donstars);
                console.log(foodstars);
                console.log(expstars);
                console.log(convstars);
                
                var donstar = $("#don .controls").children("div.isClicked").first();
                
                for(var i = 0; i < donstars; i++){
                    donstar.removeClass("isClicked");
                    donstar.removeClass("glyphicon-star");
                    donstar.addClass("glyphicon-star-empty");
                    
                    donstar = donstar.next();
                }
                
                var foodstar = $("#food .controls").children("div.isClicked").first();
                
                for(var i = 0; i < foodstars; i++){
                    foodstar.removeClass("isClicked");
                    foodstar.removeClass("glyphicon-star");
                    foodstar.addClass("glyphicon-star-empty");
                    
                    foodstar = foodstar.next();
                }
                
                var convstar = $("#conv .controls").children("div.isClicked").first();
                for(var i = 0; i < convstars; i++){
                    convstar.removeClass("isClicked");
                    convstar.removeClass("glyphicon-star");
                    convstar.addClass("glyphicon-star-empty");
                    
                    convstar = convstar.next();
                }
                
                var expstar = $("#exp .controls").children("div.isClicked").first();
                for(var i = 0; i < expstars; i++){
                    expstar.removeClass("isClicked");
                    expstar.removeClass("glyphicon-star");
                    expstar.addClass("glyphicon-star-empty");
                    
                    expstar = expstar.next();
                }
                
                //readjust 
                $("#previewcontent").css("margin-top", "-30%");
                
                //change content
                $("#writereview").delay(2000).hide(0);
                $("#seereviews").delay(2000).show(0);
                
                $("#preview-outer > h3, #preview-outer > p").hide();
                
                $("#write").delay(4000).removeClass("active");
                $("#view").addClass("active");
                
                //slide down
                $("#previewcontent").delay(200).animate({
                    marginTop: "12%"
                }, {
                    duration: 2000
                });
                $(".list-group").animate({
                    marginTop: height + 80
                }, {
                    duration: 4000
                });
                
                //add to review
                $scope.create(headline, description, String(donstars), String(foodstars), String(convstars), String(expstars), building);
            });
        });
        
        /********************************************** List reviews ***************************************************/
        $(document).ready(function(){
            $scope.find();
            
            $scope.trackFull = function(num){
                return new Array(parseInt(num));
            }
            $scope.trackEmpty = function(num){
                return new Array(5 - parseInt(num));   
            }
            
            $("div.description").css("display", "none");
            $(document).unbind().on('click', 'div.headline', function(){
                var description = $(this).parent().parent().find("div.row > div.description");
                description.slideToggle();
            });
            
            //get all overall exp in chronological order
            $scope.reviews.$promise.then(function(res){
                console.log(res);
            });
        });
        
        $scope.hasUser = function(user, agrees){
            for(var i = 0; i < agrees.length; i++){
                if(agrees[i]._id == user._id){
                    return true;
                }
            }
            return false;
        }
        
        /* Liking and disliking reviews */
        $scope.agree = function(id){
            console.log(id);
            $http.get("reviews/" + id).success(function(data){
                console.log(data);
                var agrees = data.agrees;
                
                //add user only if he doesn't exist
                if(!$scope.hasUser($scope.authentication.user, agrees)){
                    agrees.push($scope.authentication.user);
                    data.agrees = agrees;

                    var review = new Reviews(data);
                    $(document).ready(function(){
                        var current = parseInt($("div#review-id-" + id + " div.agrees").html());
                        current += 1;
                        $("div#review-id-" + id + " div.agrees").html(String(current));
                    });

                    /*
                    review.$update(function(){
                    });
                    */
                }
            });
        }
        $scope.disagree = function(id){
            console.log(id);
            $http.get("reviews/" + id).success(function(data){
                console.log(data);
            });
        }
    }]);