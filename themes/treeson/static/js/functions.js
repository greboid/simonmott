/* PARALLAX */
;(function($){

    $.fn.parallax = function () {
        var window_width = $(window).width();
        // Parallax Scripts
        return this.each(function(i) {
            var $this = $(this);
            $this.addClass('parallax');

            function updateParallax(initial) {
                var container_height;
                if (window_width < 601) {
                    container_height = ($this.height() > 0) ? $this.height() : $this.children("img").height();
                }
                else {
                    container_height = ($this.height() > 0) ? $this.height() : 500;
                }

                var $img = $this.children("img").first();
                var img_height = $img.height();
                var parallax_dist = img_height - container_height;
                var bottom = $this.offset().top + container_height;
                var top = $this.offset().top;
                var scrollTop = $(window).scrollTop();
                var windowHeight = window.innerHeight;
                var windowBottom = scrollTop + windowHeight;
                var percentScrolled = (windowBottom - top) / (container_height + windowHeight);
                var parallax = Math.round((parallax_dist * percentScrolled));

                if (initial) {
                    $img.css('display', 'block');
                }

                if ((bottom > scrollTop) && (top < (scrollTop + windowHeight))) {
                    $img.css('transform', "translate3D(-50%," + parallax + "px, 0)");
                }
            }

            //- Wait for image load -//
            $this.children("img").one("load", function() {
                updateParallax(true);
            }).each(function() {
                if(this.complete) $(this).trigger('load');
            });

            $(window).scroll(function() {
                window_width = $(window).width();
                updateParallax(false);
            });

            $(window).resize(function() {
                window_width = $(window).width();
                updateParallax(false);
            });
        });
    };
}(jQuery));


/* PRELOADER */
var mythemes_masonry = {
    _class : function(){
        this.init = function( el, callback ){
            var total = jQuery( el ).find( 'img' ).length;

            jQuery( el ).find( 'img' ).each(function(){
                var image = new Image();

                image.onload = function(){
                    total--;

                    if( total == 0 ){
                        callback();
                    }
                }

                image.src = jQuery( this ).attr( 'src' );
            });
        }
    }
};

var _mythemes_masonry = new mythemes_masonry._class();

jQuery(document).ready(function(){    

    /* ADD MENU ARROWS */
    jQuery('nav.base-nav ul.mythemes-menu li.menu-item-has-children').prepend('<span class="menu-plus"></span>');

    jQuery( 'nav.base-nav ul li span.menu-plus' ).on( "click" , function(){
        if( jQuery( this ).hasClass( 'collapsed' ) ){
            jQuery( this ).parent().children('ul').hide( "slow" , function(){
                jQuery( this ).removeAttr( 'style' );
            });
            jQuery( this ).removeClass( 'collapsed' );
        }
        else{
            jQuery( this ).addClass( 'collapsed' );
            jQuery( this ).parent().children('ul').show( "slow" );
        }
    });

    /* ADD PLUS AND MINUS FOR MENU ITEMS WITH SUB MENU */
    jQuery( '.btn-collapse' ).click(function(){
        
        if( jQuery( this ).hasClass( 'collapsed' ) ){
            jQuery( this ).removeClass( 'collapsed' );
            jQuery( '.nav-collapse.in' ).each(function(){
                jQuery( this ).hide( 'slow' , function(){
                    jQuery( this ).removeClass( 'in' );
                    jQuery( this ).removeAttr( 'style' );
                });
            });
        }
        else{
            jQuery( '.btn-collapse' ).removeClass( 'collapsed' );
            jQuery( this ).addClass( 'collapsed' );

            var nav = jQuery( this ).attr( 'data-toggle' );

            jQuery( '.nav-collapse.in' ).each(function(){
                jQuery( this ).hide( 'slow' , function(){
                    jQuery( this ).removeClass( 'in' );
                    jQuery( this ).removeAttr( 'style' );
                });
            });

            jQuery( nav ).show( 'slow' , function(){
                jQuery( this ).addClass( 'in' );
                jQuery( this ).removeAttr( 'style' );
            });
        }
    });


    function mythemes_calc_button_wrapper_height(){
        if( jQuery( 'div.mythemes-header' ).length ){
            var height = jQuery( 'div.mythemes-header' ).height();
            var b_height = jQuery( 'div.mythemes-header' ).find( 'div.header-button-wrapper div.valign-cell' ).height() + 40;


            jQuery( 'div.mythemes-header' ).find( 'div.header-button-wrapper' ).css({ 'height' : b_height + 'px' });
            jQuery( 'div.mythemes-header div.header-headline-wrapper' ).css({ 'height' : parseInt( height - b_height ) + 'px' });
        }    
    }
    
    mythemes_calc_button_wrapper_height();

    function mythemes_parallax_cover()
    {
        var window_height   = parseInt( jQuery( window ).height() );
        var window_width    = parseInt( jQuery( window ).width() );

        var img             = jQuery( 'div.parallax-container .parallax img' ).get( 0 );

        /* the img starts display:none, so rendered size is 0 until init —
           fall back to natural size to keep the cover math deterministic */
        var img_width       = parseInt( jQuery( img ).width() )  || parseInt( img.naturalWidth );
        var img_height      = parseInt( jQuery( img ).height() ) || parseInt( img.naturalHeight );

        var r_height        = parseInt( img_height * window_width / img_width );

        jQuery( 'div.parallax-container .parallax img' ).css({ 'height' : 'auto' });
        jQuery( 'div.parallax-container .parallax img' ).css({ 'width' : 'auto' });

        if( r_height < window_height ){

            var width = parseInt( img_width * window_height / img_height );

            jQuery( 'div.parallax-container .parallax img' ).css({ 'height' : window_height + 'px' });
            jQuery( 'div.parallax-container .parallax img' ).css({ 'width'  : width + 'px' });
        }
        else{
            jQuery( 'div.parallax-container .parallax img' ).css({ 'width' : window_width + 'px' });
            jQuery( 'div.parallax-container .parallax img' ).css({ 'height' : 'auto' });
        }
    }

    _mythemes_masonry.init( 'div.parallax-container .parallax', function(){
        mythemes_parallax_cover();
        jQuery('.parallax').parallax();
        jQuery('div.parallax-container .parallax').fadeIn("fast", function(){
            jQuery( this ).css({
                'opacity': 1,
                'filter' : 'alpha(opacity=100)'
            });
        });
    });


    /* GALLERY WITH MASONRY */
    _mythemes_masonry.init( '.mythemes-gallery', function(){
        jQuery( '.mythemes-gallery' ).masonry();
    });

    /* CHANGE BORDER BOTTOM ON WINDOW RESIZE */
    jQuery( window ).resize(function() {

        jQuery( 'nav.base-nav ul span.menu-plus' ).removeClass( 'collapsed' );
        jQuery( 'nav.base-nav ul li ul' ).removeAttr( 'style' );

        if( jQuery( '.mythemes-gallery' ).length ){
            jQuery( '.mythemes-gallery' ).masonry();    
        }

        mythemes_parallax_cover();
        mythemes_calc_button_wrapper_height();
    });

    /* TAGS WITH COUNTER */
    jQuery( 'div.widget_tag_cloud div.tagcloud' ).append( '<div class="clear clearfix"></div>' );

    jQuery( 'div.widget_tag_cloud div.tagcloud a, div.widget_post_tags div.tagcloud a' ).each(function(){

        jQuery( this ).removeAttr( 'style' );
        jQuery( this ).removeAttr( 'class' );

        var text = jQuery( this ).text();
        var nr   = jQuery( this ).attr( 'title' ).split( " " )[0];


        jQuery( this ).html( '<span>' +
            '<span class="icon"><i class="mythemes-icon-tag"></i></span>' +
            '<span class="tag-name">' + text + '</span>' +
            '<span class="counter">' + nr + '</span>' +
            '</span>'
        );

        var icon            = jQuery( this ).find( 'span.icon' );
        var name            = jQuery( this ).find( 'span.tag-name' );
        var counter         = jQuery( this ).find( 'span.counter' );

        var icon_width      = icon.outerWidth();
        var counter_width   = counter.outerWidth();

        var diff            = counter_width - icon_width;
        var name_width      = name.outerWidth();
        var width           = 0;

        if( diff < 0 ){
            diff            = 0;
            width           = name_width + icon_width;
            counter.css({ 'width' : icon_width + 'px' });    
        }else{
            width           = name_width + counter_width;
        }

        counter.css({ 'margin-left' : diff + 'px' });
        jQuery( this ).css({ 'width' : width + 'px' });
    });
});