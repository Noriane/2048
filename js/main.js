(function($) {

	$.fn.load_2048 = function() 
    {
    	var container = this;
    	this.load( "2048.php", function() {

			var size;
			var delay = 50;
			var start = false;
			var canMove = true;
			var moved = false;
			var final_score = 2048;
			var score = 0;
			var score_max = 0;
			var current_win;
			var win;

			function randValue()
			{
				if (Math.random() > 0.2)
				{
					value = 2;
				}	
				else
				{
					value = 4;
				}
				return value;
			}

			function createMap(current_size)
			{
				size = current_size;
				var width = 110;//px
				var nb_tile = size*size;
				var background = container.find(".background");
				var map = container.find("section.active_items");

				background.children("div").remove();
				background.css({"width":width*size+"px", "height":width*size+"px"})
				container.find("header").css({"width":"440px"})
				map.find("div").remove();

				background.attr("nbcol", size);
				for (var j = 1; j <= size; j++)
				{
					for (var i = 1; i <= size; i++)
					{
						background.append("<div></div>");
						map.append("<div posx="+i+" posy="+j+"></div>")
					}
					i=1;
				}
				initialize();
			}

			function initialize()
			{
				var targets = container.find('.active_items >div');
				var targets_free = targets.filter(':not([value])');
				var targets_active = targets.filter('[value]');
				score = 0;

				targets.each(function() 
				{ 
				  if ($(this).attr("value"))
				  {
				  	$(this).removeAttr("value");
					$(this).html(" ");
				  }
				});

				container.find(".results >div").removeAttr("win");
				if (document.cookie && getCookie('id'))
				{
					post_init();

				}else
				{
					/* COOKIE */
					setCookie("score", "0", 1);
					start_score = getCookie('score');

					datas_cookie = {score: start_score};
		        	$.post('server.php', datas_cookie, function(data) {
						post_init();
			        });

				}
			}
			function setCookie(cname, cvalue, exdays) 
			{
			    var d = new Date();
			    d.setTime(d.getTime() + (exdays*24*60*60*1000));
			    var expires = "expires="+ d.toUTCString();
			    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
			}

			function post_init()
			{
				debugger;
				get_score_max().done(function()
				{
					updateScore();
					createTile();
					createTile();
					return true;
				});
			}
		
			function getCookie(name) 
			{
			  var value = "; " + document.cookie;
			  var parts = value.split("; " + name + "=");
			  if (parts.length == 2) 
			  	return parts.pop().split(";").shift();
			}

			function createTile()
			{
				var targets = container.find('.active_items >div');
				var targets_free = targets.filter(':not([value])');
				var targets_active = targets.filter('[value]');
				var num1 = randValue(); 

				targets.attr("join", 0);
				var target = $(targets_free[Math.floor(Math.random()*targets_free.length)]);
				target.attr("value", num1).attr("join", 0).html("<div>"+num1+"</div>");

				setTimeout(function()
				{
					target.addClass("grow");
				}, 20);

				targets_free = targets.filter(':not([value])');
				if (targets_free.length == 0)
				{
					if (check_last_tile(targets))
					{
						lost_game();
					}
				}
			}

			function updateScore(current_win)
			{
				var score_container = container.find(".score");
				var score_max_container = container.find(".score_max");

				score_max = parseInt(score_max_container.attr("score_max"), 10);

				var current_win_container = container.find(".current_win");
				score_container.html(score);
				if (win == 0)//total win
				{
					score_container.html("0");
				}else
				{
					if (score > score_max)
					{
						data = {score_max: score};
						var score_max = "";
						$.post('server.php', data, function(data) {
							alert(data);
				        });

				        container.find(".score_max").html(score);
					}
					setTimeout(function()
					{
						current_win_container.html("").removeAttr("value").fadeOut(200);
					}, 800);
				}
				if (current_win)//win by turn
				{
					current_win_container.html("+"+current_win).attr("value", current_win).fadeIn(500);
				}
			}

			function lost_game()
			{
				container.find(".results .loose").attr("win", 0);
				container.find(".results").fadeIn(300);
				win = 0;
				//Restart game after game over
				container.find(".start_again").on("click", function()
				{
					container.find(".win").removeAttr("win");
				});
				return true;
			}

			function win_game()
			{
				container.find(".results .win").attr("win", 1);
				container.find(".results").fadeIn(300);

				//Continue game after winning 2048
				container.find(".free_play").on("click", function()
				{
					container.find(".win").removeAttr("win");
				});
			}

			function check_last_tile(targets)
			{
				var target;
				var x,y;
				var last= true;

				for (var i = 0; i < targets.length;i++)
				{
					target = targets.eq(i);
					x = parseInt(target.attr("posx"), 10);
					y = parseInt(target.attr("posy"), 10);
					
					if (target.siblings("[posx='"+(x+1)+"'][posy='"+y+"']").attr("value") == target.attr("value"))
					{
						last = false;
						return last;
					}
					if (target.siblings("[posx='"+x+"'][posy='"+(y+1)+"']").attr("value") == target.attr("value"))
					{
						last = false;
						return last;
					}	
				}
				return last;
			}

			function move(e)
			{
				if (!canMove) 
				{
					return false;
				}
				canMove = false;
			

				if (e.keyCode == 37) 
			    { 
					move_x("left");
			       	return false;
			    }
			    if (e.keyCode == 38) 
			    { 
			       move_y("up");
			       return false;
			    }
			    if (e.keyCode == 39) 
			    { 
			       move_x("right");
			       return false;
			    }
			    if (e.keyCode == 40) 
			    { 
			       move_y("down");
			       return false;
			    }
			}
			var i= 0;

			function move_x(direction)
			{
				if (direction == "left")
				{
					for(var x=1; x<=size; x++)//check by lines
					{
						var $target_x = container.find('.active_items >div[value][posx="'+x+'"]');
						$target_x.each(function()
						{
							var current = $(this);
							if (check_next_x(current, direction))
							{
								moved = true;
							}
						});
					}
				}else if (direction == "right")
				{
					for(var x=size; x>=1; x--)//check by lines
					{
						var $target_x = container.find('.active_items >div[value][posx="'+x+'"]');
						$target_x.each(function()
						{
							var current = $(this);
							if (check_next_x(current, direction))
							{
								moved = true;
							}
						});
					}
				}
				i++;

				if(i<size) //check by columns
				{	
						setTimeout(function()
						{
							move_x(direction)
						}, delay);
					return;
					return
				}
				else if (moved)
				{
					setTimeout(function()
					{
						createTile();
						canMove= true;
					}, delay*2);
				}else
				{
					canMove= true;
				}
				i=0;
				moved = false;
			}

			function move_y(direction)
			{

				if (direction == "up")
				{
					for(var y=1; y<=size; y++)//check by lines
					{
						var $target_y = container.find('.active_items >div[value][posy="'+y+'"]');
						$target_y.each(function()
						{
							var current = $(this);
							if (check_next_y(current, direction))
							{
								moved = true;
							}
						});
					}
				}else if (direction == "down")
				{
					for(var y=size; y>=1; y--)//check by lines
					{
						var $target_y = container.find('.active_items >div[value][posy="'+y+'"]');
						$target_y.each(function()
						{
							var current = $(this);
							if (check_next_y(current, direction))
							{
								moved = true;
							}
						});
					}
				}
				i++;

				if(i<size) //check by columns
				{	
					setTimeout(function()
						{
							move_y(direction)
						}, delay);
					return;
				}
				else if (moved)
				{
					setTimeout(function()
						{
							createTile();
							canMove= true;
						}, delay*2);


				}else{
					canMove= true;
				}
				
				i=0;
				moved = false;
			}
					
			function swap(tile, x, y)
			{
				var tile2 = tile.siblings("[posx='"+x+"'][posy='"+y+"']");

				tile2.attr("posx", tile.attr("posx"));
				tile2.attr("posy", tile.attr("posy"));

				tile2.removeAttr("value").removeAttr("join");
				tile2.removeClass("grow");
				tile2.find("div").remove();

				tile.attr("posx", x);
				tile.attr("posy", y);
			}

			function new_posx(posx, direction)
			{
				if (direction == "left" && (posx > 1))
				{
					return (posx - 1);
				}
				else if (direction == "right" && (posx < size))
				{
					return (posx + 1);
				}
			}

			function new_posy(posy, direction)
			{
				if (direction == "up" && (posy > 1))
				{
					return (posy - 1);
				}
				else if (direction == "down" && (posy < size))
				{
					return (posy + 1);
				}
			}

			function check_next_x(current, direction)
			{
				//main
				var main = current;
				var posy = parseInt(main.attr("posy"), 10);
				var posx = parseInt(main.attr("posx"), 10);
				var value = parseInt(main.attr("value"), 10);
				var join = parseInt(main.attr("join"), 10);

				//element to compare
				if (direction == "left")
				{
					var el_to_compare = main.siblings("[posx='"+(posx-1)+"'][posy='"+posy+"']");
				}
				else if (direction == "right")
				{
					var el_to_compare = main.siblings("[posx='"+(posx+1)+"'][posy='"+posy+"']");
				}

				var el_value = parseInt(el_to_compare.attr("value"), 10);
				var el_posx = parseInt(el_to_compare.attr("posx"), 10);
				var el_posy = parseInt(el_to_compare.attr("posy"), 10);

				if (!el_to_compare.length)
				{
					return false;
				}
				if (el_value)//Si case suivante a un chiffre
				{
					// X AXE
					while(posy == el_posy)//Sur la même ligne
					{
						if ((direction == "left" && (posx > 1)) || (direction == "right" && (posx < size)))
						{
							if (value == el_value && (join == 0))// Si les 2 cases on la mm valeur
							{
								el_value = value*2;
								score += el_value;
								if (el_value > 999)
								{
									main.attr("smaller_font", 1);
								}
								updateScore(el_value);
								if (el_value == final_score)
								{
									win_game();
								}
								main.attr("value", el_value);
								main.html("<div>"+el_value+"</div>");

								swap(main, el_posx, el_posy);
								main.attr("join", 1);

								return true;						
							}
							else
							{
								return false;
							}
						}
					}
				}
				var posX = new_posx(posx, direction);
				swap(main, posX, posy);
				return true;
			}

			function check_next_y(current, direction)
			{
				//main
				var main = current;
				var posy = parseInt(main.attr("posy"), 10);
				var posx = parseInt(main.attr("posx"), 10);
				var value = parseInt(main.attr("value"), 10);
				var join = parseInt(main.attr("join"), 10);

				//element to compare
				if (direction == "up")
				{
					var el_to_compare = main.siblings("[posy='"+(posy-1)+"'][posx='"+posx+"']");
				}
				else if (direction == "down")
				{
					var el_to_compare = main.siblings("[posy='"+(posy+1)+"'][posx='"+posx+"']");
				}

				var el_value = parseInt(el_to_compare.attr("value"), 10);
				var el_posx = parseInt(el_to_compare.attr("posx"), 10);
				var el_posy = parseInt(el_to_compare.attr("posy"), 10);

				if (!el_to_compare.length)
				{
					return false;
				}
				if (el_value)//Si case suivante a un chiffre
				{
					// Y AXE
					while(posx == el_posx)//Sur la même ligne
					{
						if ((direction == "up" && (posy > 1)) || (direction == "down" && (posy < size)))
						{
							if (value == el_value && (join == 0))// Si les 2 cases on la mm valeur
							{
								el_value = value*2;
								score += el_value;
								if (el_value > 999)
								{
									main.attr("smaller_font", 1);
								}
								updateScore(el_value);
								if (el_value == final_score)
								{
									win_game();
								}
								main.attr("value", el_value);
								main.html("<div>"+el_value+"</div>");

								swap(main, el_posx, el_posy);

								main.attr("join", 1);

								return true;
							}
							else
							{
								return false;
							}
						}
					}
				}
				var posY = new_posy(posy, direction);
				swap(main, posx, posY);
				return true;
			}

			function get_id()
			{
				return $.get('server.php',{option:'id'}, function(data) 
				{ 
					}).fail(function() {
					alert( "error" );
				})
			}

			function get_score_max()
			{
				return $.get('server.php',{option:'score'}, function(data) 
				{ 
					container.find(".score_max").text(data['score_max']).attr("score_max", data['score_max']);
					}).fail(function() {
					alert( "error" );
				})
			}

			createMap(4);//Default size
			$(document).keydown(move);
			container.find("button.start").click(initialize);
			container.find("button.start_again").click(initialize);
			container.find("button[nbcol]").click(function()
				{
					size = $(this).attr("nbcol");
					createMap(size);
				});
			container.find(".maps button").on("click", function()
				{
					$(".maps button").removeClass("active");
					$(this).addClass("active");
				});
		});
    }

}(jQuery));