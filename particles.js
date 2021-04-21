import { curryN, pipe } from 'ramda';

const particle = (x, y) => {
    const size = 3;
    const baseX = x;
    const baseY = y;
    const density = Math.random() * 30 + 1;
    return {
        x,
        y,
        baseX,
        baseY,
        size,
        density
    }
}

let createParticles = ({height, width, data}) => {
    let particles = [];
    for (let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            if(data[(y * 4 * width) + (x *4) + 3] > 128) {
                let positionX = x;
                let positionY = y;
                particles.push(particle(positionX * 10 + 200, positionY * 10 + 100))
            }
        }
    }
    return particles;
}


const update = (mouse, element) => {
    let elementCopy = JSON.parse(JSON.stringify(element))
    let dx = mouse.mouseX - elementCopy.x;
    let dy = mouse.mouseY - elementCopy.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let distanceX = forceDirectionX * force * element.density;
    let distanceY = forceDirectionY * force * element.density;
    if (distance < mouse.radius) {
        elementCopy.x -= distanceX;
        elementCopy.y -= distanceY;
    }
    else {
        if(elementCopy.x !== elementCopy.baseX) {
            let dx = elementCopy.x - elementCopy.baseX;
            elementCopy.x -= dx/10;
        }
        if(elementCopy.y !== elementCopy.baseY) {
            let dy = elementCopy.y - elementCopy.baseY;
            elementCopy.y -= dy/10;
        }
    }
    return elementCopy;
}
let curriedUpdate = curryN(2, update);

let updateParticles = (particlesArr, mouse) =>  particlesArr.map(curriedUpdate(mouse));

export { updateParticles, createParticles }