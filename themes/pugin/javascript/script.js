$(document).ready(function(){

    // Set slideshow obj globally
    var $ss = $('#slideshow');
	var $ss = $('#slideshow'); 
    var $pause = $('#pause');

    $pause.click(function(e) {
      e.preventDefault();
      var paused = $ss.is(':paused');
      $ss.cycle(paused ? 'resume' : 'pause', true);
    });

    var limit = 4; // Limit must be the same as the initial limit used in the Slideshow.ss
    var offset = 0; // Start at zero because increment happens before AJAX call

    // Initilize jQuery Cycle
    function init() {
        $ss.cycle({
            height: '383px',
            next:   '#next', 
            prev:   '#prev',
			paused: function(cont, opts, byHover) {
              $pause.removeClass('control--pause').addClass('control--play');
            },
            resumed: function(cont, opts, byHover) {
              $pause.removeClass('control--play').addClass('control--pause');
            },
            before: function(curr, next, opts) {
                if(opts.addSlide) { // If function exists
                    offset += limit;
                    $.ajax({
                        url: 'gallery/slideshow/images',
                        type: 'POST',
                        data: { limit: limit, offset: offset },
                        dataType: 'json',
                        success: function(data) {
                            // If data then add the images
                            if(data.length > 0) {
                                for(var i = 0; i < data.length; i++) {
                                    opts.addSlide(data[i]);
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    init();

    $('.gallery a.gallery__group').colorbox({
        rel: "gallery__group",
        maxWidth:"75%",
        maxHeight:"75%"
    });

    $('#slideshow').colorbox({
        rel: "gallery__group",
        slideshow: true,
        className: "gallery-slideshow",
        href: "a.gallery__group"
    });

    soundManager.setup({
        // path to directory containing SM2 SWF
        url: '/themes/pugin/javascript/soundmanager/swf'
    });

    threeSixtyPlayer.config.scaleFont = (navigator.userAgent.match(/msie/i)?false:true);
    threeSixtyPlayer.config.showHMSTime = true;

    // enable some spectrum stuffs

    threeSixtyPlayer.config.useWaveformData = true;
    threeSixtyPlayer.config.useEQData = true;

    // enable this in SM2 as well, as needed

    if (threeSixtyPlayer.config.useWaveformData) {
        soundManager.flash9Options.useWaveformData = true;
    }
    if (threeSixtyPlayer.config.useEQData) {
        soundManager.flash9Options.useEQData = true;
    }
    if (threeSixtyPlayer.config.usePeakData) {
        soundManager.flash9Options.usePeakData = true;
    }

    if (threeSixtyPlayer.config.useWaveformData || threeSixtyPlayer.flash9Options.useEQData || threeSixtyPlayer.flash9Options.usePeakData) {
        // even if HTML5 supports MP3, prefer flash so the visualization features can be used.
        soundManager.preferFlash = true;
    }

    // favicon is expensive CPU-wise, but can be used.
    if (window.location.href.match(/hifi/i)) {
        threeSixtyPlayer.config.useFavIcon = true;
    }

    if (window.location.href.match(/html5/i)) {
        // for testing IE 9, etc.
        soundManager.useHTML5Audio = true;
    }

});