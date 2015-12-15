var selected = null;
var img = null;
var moves = 0;
var minmoves = 0;
var done = true;

$(document).ready(function(){
	
	function swapCells(source, target)
	{
		//alert(source+""+target);
		if(target.attr("order") != source.attr("order")) //presumably they are both 0 so no swap needed
		{
			//essentially just swap their bg position
			var temp = source.css("background-position");
			var temp_ord = source.attr("order");
			
			//alert(temp);
			source.css("background-position", target.css("background-position"));
			target.css("background-position", temp);
			
			source.attr("order", target.attr("order"));
			target.attr("order", temp_ord);
			
			//if game has not been completed keep track of moves
			if(!done)
			{
				moves++;
				$("#moves").html("Moves so far: "+moves);
				
				if(checkSolution()) //check for solution
				{
					if(moves == minmoves) //check if perfect
					{
						$("#moves").html("Perfect solution!");
					}
					else
					{
						$("#moves").html("Completed in "+moves+" moves");
					}
					
					done = true;
				}
			}
		}
		
		//reset selection state
		$("#left div, #right div").removeClass("selected");
		selected = null;
	}
	
	function checkSolution()
	{
		var ok = true;
		
		//check if the elements are in the expected order
		$("#right .cell").each(function(i, el){
			
			//alert((i+1) + ":" + $(el).attr("order"));
			if (parseInt($(el).attr("order")) != i+1)
			{
				ok = false;
				return ok;
			}
			
		});
		
		return ok;
	}
	
	
	function createPuzzle()
	{
		if(img !== null)
		{
			$("#left").empty();
			$("#right").empty();
			
			//assume we can do 100x100 px cells
			var rows = Math.round(img.height / 100);
			var columns = Math.round(img.width / 100);
			
			//quickfix to rounding problems
			if(img.width > columns*100) columns++;
			if(img.rows > rows*100) rows++;
			
			console.log("Rows"+rows);
			console.log("Columns"+columns);
			
			//these have to be offset depending on the cell
			$("#left").css("width", columns * (100+2));
			$("#left").css("height", rows * (100+2));
			
			var ord = 0; //to keep track of original order
			for(var i = 0; i < rows ; i++)
			{
				for(var j = 0; j < columns; j++)
				{
					ord++;
					$("#left").append('<div order="'+ord+'" class="cell" style="background-image: url('+ img.src +'); background-position: -'+ (j*100) +'px -'+ (i*100) +'px"><div>');
				}	
			}
				
			//these have to be blank
			$("#right").css("width", columns * (100 + 2));
			$("#right").css("height", rows * (100 + 2));
			
			for(var i = 0; i < rows ; i++)
			{
				for(var j = 0; j < columns; j++)
				{
					$("#right").append('<div order="0" class="cell" style="background-image: url('+ img.src +'); background-position: -'+ img.width +'px -'+ img.height +'px"><div>');
				}	
			}
			
			//randomize image (100 passes should do it);
			
			var rand = 100;
			for(var k = 0; k < rand; k++)
			{
				var s = Math.floor((Math.random()*rows*columns)+1);
				var t = Math.floor((Math.random()*rows*columns)+1);
				
				swapCells($("#left .cell:nth-child("+s+")"), $("#left .cell:nth-child("+t+")"));
			}
			
			
			//make holder a reasonable size
			$(".holder").css("min-width", 2*columns*(100+2)+300);
			$("body").css("min-width", 2*columns*(100+2)+300);
		
			//reset game state
			minmoves = columns*rows;
			done = false;
			//reset/populate moves
			moves = 0;
			$("#moves").html("Moves so far: "+moves);
		}
		
		$(".cell").on('click', function(){
			
			//alert("clicked");
			
			$(this).addClass("selected");
			
			if(selected === $(this))
			{
				$(this).removeClass("selected");
				selected = null;
			}
			
			if(selected === null) //if nothing selected
			{
				$(this).addClass("selected");
				selected = $(this);
			}
			else //means we're swapping something
			{
				swapCells($(this), selected);
			}
		});
	}
	
	$("#puzzlify").click(function(){
		
		img = new Image();
		img.src = $("#target_image").val();
		img.onload = createPuzzle;
		
	});
	
	
});