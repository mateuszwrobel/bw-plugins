// ==UserScript==
// @name       BW automat
// @version    0.1
// @description  enter something useful
// @include     http://r*.bloodwars.interia.pl/*
// @include     http://r*.bloodwars.net/*
// @copyright  2012+, You
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==


/*

GLOBALS FROM BW
timeFields.quest_timeleft
var _v = new Date();

*/

//var _v = _v || new Date();
//var timeFields = timeFields || {};
( function ( window, document, jQuery ) {

    var $ = jQuery.noConflict(true);

    var params = window.location.search.substr( 1 ).split( '&' );
    var paramsAssoc = [];

    for( var i = 0; i < params.length; i++ ) {
        var param = params[ i ].split( '=' );
        paramsAssoc[ param[ 0 ] ] = param[ 1 ];
    }

    var actions = {
        auction: function () {
            $( '.item-link' ).each( function () {
                var $this = $(this);
                $this.trigger( 'click' );

                var test2 = $( '#overDiv .itemdesc-s:last' ).text();
                var price = parseInt(test2.substr( test2.search( ':' )+2 ).replace( ' ', '' ), 10);

                var topOffer = $this.parent().parent().find( 'td' ).eq( 3 );

                var totalValue = Math.floor( price * 0.0175 );
                var totalValue2 = Math.floor( price * 0.019 );
                var max = Math.floor( totalValue / 1.05 / 1.05 );
                var middle = Math.floor( totalValue / 1.05 );
                
                var wrapper = $( '<span>' );
                if (
                    (
                        parseInt( topOffer.text().replace( ' ', '' ), 10) < totalValue
                       || topOffer.text().search( 'brak' ) > -1
                        && max > 50
                    )
                    && parseInt( topOffer.text(), 10) * 1.05 < totalValue
                ) {
                    wrapper.css( 'color','lime' );
                }

                wrapper.text( max + '/' + middle + ' t: ' + totalValue2 + '/' + totalValue );
                
                topOffer.append( ' / max: ' ).append(wrapper);

                $( '#overDiv' ).css({
                    position: 'absolute',
                    visibility: 'hidden',
                    top: -10000,
                    left: -10000
                });
            } );
        },

        quest: function () {
            var $questTimer = $( 'form[name="questForm"]' );

            var questing = parseInt( localStorage.getItem( 'questing' ), 10 );

            var questButton = $( '<span>' )
                .attr( {
                    id: 'quest-button',
                } )
                .addClass( ( questing ) ? 'disabled' : 'enabled' )
                .css( 'cursor', 'pointer' )
                .text( ( questing ) ? 'Zakończ wyprawkowanie' : 'Wyprawkuj' );

            var runQuest = function() {
                if ( questing ) {
                    var formButton = $( '#startQuest' );
                    if ( timeFields.quest_timeleft === undefined ) {
                        formButton.trigger( 'click' );
                    } else {
                        var _n = new Date();
                        var diff = Math.round( ( _n.getTime() - _v.getTime() ) / 1000 );
                        var _s = timeFields.quest_timeleft - diff;

                        if ( _s <= 0 ) {
                            location.reload();
                        }
                        setTimeout( runQuest, timeFields.quest_timeleft * 1000 + 1000 );
                    }
                }
            };

            var setQuesting = function() {

                if ( questing ) {
                    localStorage.setItem( 'questing', 0 );
                    questing = 0;

                    questButton
                        .removeClass('disabled')
                        .addClass('enabled')
                        .text('Wyprawkuj');

                    return false;
                }

                questButton
                    .removeClass('enabled')
                    .addClass('disabled')
                    .text('Zakończ wyprawkowanie');

                localStorage.setItem( 'questing', 1 );
                questing = 1;
                runQuest();

                return false;
            };

            questButton.on( 'click', setQuesting );
            $('body').before( questButton ).after( '&nbsp;' );

            runQuest();
        },

        msg: function () {
        },

        settings: function () {


        }
    };

    if ( typeof actions[ paramsAssoc.a ] === 'function' ) {
        actions[ paramsAssoc.a ].call();
    }
})( window, document, jQuery );
