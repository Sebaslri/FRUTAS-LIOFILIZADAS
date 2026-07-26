import {
  animate,
  group,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fadeInRight400ms = trigger('fadeInRight400ms', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(18px)' }),
    animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateX(0)' })),
  ]),
]);

export const scaleIn400ms = trigger('scaleIn400ms', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.97)' }),
    animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
]);

export const stagger40ms = trigger('stagger40ms', [
  transition(':enter', [
    query(
      '[data-stagger]',
      [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        stagger(40, [
          animate('320ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
        ]),
      ],
      { optional: true },
    ),
  ]),
]);

export const routeFadeSlide = trigger('routeFadeSlide', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'absolute', inset: 0, width: '100%' }), { optional: true }),
    group([
      query(':leave', [animate('180ms ease-out', style({ opacity: 0, transform: 'translateX(-10px)' }))], {
        optional: true,
      }),
      query(
        ':enter',
        [
          style({ opacity: 0, transform: 'translateX(18px) scale(0.99)' }),
          animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateX(0) scale(1)' })),
        ],
        { optional: true },
      ),
    ]),
  ]),
]);
