<header>
	<div class="top_content">
		<h1>2048</h1>
		<div class="score_win">
			<p>score 
				<span class="score"></span>
				<span class="current_win" value="">0</span>
			</p>
			<p>Best 
				<span class="score_max">0</span>
			</p>
		</div>
	</div>
	<button class="start">New Game</button>
	<div class="maps">
		<button nbcol="2">2 x 2</button>
		<button nbcol="3">3 x 3</button>
		<button nbcol="4">4 x 4</button>
		<button nbcol="5">5 x 5</button>
		<button nbcol="6">6 x 6</button>
	</div>
</header>
<div class="wrapper">
	<section class="background">

		<section class="active_items"></section>
		<section class="results">
			<div class="win">
				<h2>You win !</h2>
				<button class="free_play">Continue</button>
			</div>
			<div class="loose">
				<h2>Game Over</h2>
				<button class="start_again">Try again</button>
			</div>
		</section>

	</section>
</div>