import { Observable, fromEvent, range, of, from, interval, animationFrameScheduler } from 'rxjs';
import { tap, map, pluck, mergeMap, concatMap, reduce, scan, toArray, take, repeat, withLatestFrom, startWith, mergeScan, takeUntil } from 'rxjs/operators';
import { createParticles, updateParticles } from './particles';
import { curryN, pipe } from 'ramda';

const canvasProps = (function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight

    return {
        canvas,
        ctx,
        drawText: char => {
            ctx.fillStyle = 'white',
            ctx.font = '90px Verdana';
            ctx.fillText(`${char}`, 20, 60);
        },
        drawParticle: element => {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2)
            ctx.closePath();
            ctx.fill();
        },
        clearCtx: () => ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
})();

canvasProps.drawText('A');

const textData = canvasProps.ctx.getImageData(0,0,100,100);

console.log('textData',textData);

let particles = createParticles(Object.freeze(textData));

const mousemove$ = fromEvent(window, 'mousemove').pipe(
    startWith({
        mouseX: null,
        mouseY: null,
        radius: 50
    }),
    map(event => {
        return {
            mouseX: event.x,
            mouseY: event.y,
            radius: 50
        }
    })
)



const animationFrame$ = of(0, animationFrameScheduler).pipe(
    repeat()
)

const animationLoop$ = animationFrame$.pipe(
    withLatestFrom(mousemove$),
    pluck(1),
    scan(updateParticles,particles)
)



animationLoop$.subscribe(particlesTODraw => {
    canvasProps.clearCtx();
    particlesTODraw.forEach(canvasProps.drawParticle)
});



















































// const animationRepeat$ = animationFrame$.pipe(
//     mergeScan((acc, curr) => {
//         return mousemove$.pipe(
//             tap((e) => console.log(e)),
//             takeUntil(mouseLeave$)
//         )
//     })
// )


// const animationLoop$ = animationFrame$.pipe(
//     withLatestFrom(particles$,mousemove$),
//     tap(([frame,particles, mousemove]) => {
//         canvasProps.clearCtx();
//     }),
//     scan((acc,particles) => particles.map(updateAndDraw(mousemove)),)
// )

// const animationFrame$ = interval(2000);

// const mouseLeave$ = fromEvent(window, 'mouseleave');

// const curriedUpdate = curryN(2, update);

// const updateAndDraw = (mousemove) => pipe(curriedUpdate(mousemove), canvasProps.drawParticle);

// const particles$ = range(1, 2).pipe(
//     take(2),
//     map(() => {
//         let x = Math.random() * canvasProps.canvas.width;
//         let y = Math.random() * canvasProps.canvas.height;
//         return particle(x, y);
//     }),
//     toArray()
// );
