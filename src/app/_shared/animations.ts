// import the required animation functions from the angular animations module
import { trigger, state, animate, transition, style } from '@angular/animations';

// trigger name for attaching this animation to an element using the [@triggerName] syntax
export const fadeInAnimation = trigger('fadeInAnimation', [

    // route 'enter' transition
    transition(':enter', [

        // css styles at start of transition
        style({ opacity: 0 }),

        // animation and styles at end of transition
        animate('.3s', style({ opacity: 1 }))
    ]),
]);


export const moveIn = trigger('makeLargerAnimation', [
        state('*', style({
            transform: 'scale(0.7)',
        })),
        state('large', style({
            transform: 'scale(1)',
        })),
        transition(':enter', animate('100ms ease-in')),
    ]);


// trigger name for attaching this animation to an element using the [@triggerName] syntax
export const slideInOutAnimation = trigger('slideInOutAnimation', [

        // end state styles for route container (host)
        state('*', style({
          // opacity:'0'
            // the view covers the whole screen with a semi tranparent background
          // position:"absolute",
        //    top: 0,
          //  left: 0,
        //    right: 0,
        //   bottom: 0,
          //  backgroundColor: 'rgba(0, 0, 0, 0.8)'
        })),

        // route 'enter' transition
        transition(':enter', [

            // styles at start of transition
            style({
               opacity:'0'
              //  position:"absolute",
                // start with the content positioned off the right of the screen,
                // -400% is required instead of -100% because the negative position adds to the width of the element
            //    right: '-400%',

                // start with background opacity set to 0 (invisible)
            //    backgroundColor: 'rgba(0, 0, 0, 0)'
            }),

            // animation and styles at end of transition
            animate('0.2s ease-in-out', style({
                // transition the right position to 0 which slides the content into view
               // right: 0,
                 opacity:'1'
                // transition the background opacity to 0.8 to fade it in
               //backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }))
        ]),
        
        // route 'leave' transition
        transition(':leave', [
           //  style({ opacity: 1 }),
            // animation and styles at end of transition
            animate('0.2s ease-in-out', style({
                opacity:'0'
                // transition the right position to -400% which slides the content out of view
               // right: '-400%',
             //   position:'absolute',
                // transition the background opacity to 0 to fade it out
               // backgroundColor: 'rgba(0, 0, 0, 0)'
            }))
        ])
    ]);
