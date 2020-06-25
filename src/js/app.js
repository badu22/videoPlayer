var demoPlyr = {

	element: '#player',
	player: null,
	buttons: document.querySelectorAll('[data-source]'),
	navLinks: document.querySelectorAll('.route-link'),
	router: null,
	
    init: function() {
		this.routing();
		this.events();
	},

	events: function() {

		this.buttons.forEach(button => {
			button.addEventListener('click', () => {
				const source = button.getAttribute('data-source');
				this.player.source = sources[source];
				this.buttons.forEach(button => {
					button.classList.remove('is-active');
				});
				button.classList.add('is-active');
			});
		});

	},

	routing: function() {

		this.router = new Navigo(null, true, '#!');
		this.router.on({
			'home': () => { 
				this.getHome(); 
			},
			'features': () => { 
				this.getFeatures(); 
			},
			'*': () => { 
				this.getHome(); 
			}
		});

		this.router.navigate('home');

		this.router.resolve();

	},

	getHome: function() {
		this.getContent('home').then(() => {
			this.runPlayer();
			$('.navbar-end').show();
			this.buttons.forEach(button => {
				button.classList.remove('is-active');
			});
			this.buttons[0].classList.add('is-active');
		});
	},

	getFeatures: function() {
		if (this.player !== null) this.player.destroy();
		$('.navbar-end').hide();
		this.getContent('docs');
	},

	getContent: async function(path) {
		return  $.ajax({
					url: `views/${path}.html`, 
					context: document.body,
					success: (response) => {
						$("#content").html(response);
					}
				});
	},

	runPlayer: function() {
		this.player = new Plyr(this.element, {
			debug: true,
			title: 'View From A Blue Moon',
			iconUrl: 'dist/demo.svg',
			keyboard: {
				global: true,
			},
			tooltips: {
				controls: true,
			},
			captions: {
				active: true,
			},
			ads: {
				enabled: true,
				//7 google ima test
				// tagUrl: 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpreonly&cmsid=496&vid=short_onecue&correlator='
				
				// vast test
				tagUrl: 'https://raw.githubusercontent.com/InteractiveAdvertisingBureau/VAST_Samples/master/VAST%204.0%20Samples/Inline_Simple.xml'
			},
			previewThumbnails: {
				enabled: true,
				src: ['https://cdn.plyr.io/static/demo/thumbs/100p.vtt', 'https://cdn.plyr.io/static/demo/thumbs/240p.vtt'],
			},
			vimeo: {
				// Prevent Vimeo blocking plyr.io demo site
				referrerPolicy: 'no-referrer',
			},
		});
		window.player = this.player;
	}

};


(() => {

	// document.addEventListener('DOMContentLoaded', () => {
	$(document).ready(function() {
	
		demoPlyr.init();

	});
	
})();


