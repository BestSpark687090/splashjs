// First thing's first. Make an export-thing

class tooLazyError extends Error {
    constructor(message) {
        // Need to pass `options` as the second parameter to install the "cause" property.
        super(`TODO: ${message}`, {});
    }
}
/**
 * Here's how it looks:
 * ```js
 * splashjs({
 *  preset: '', // Doesn't overwrite all options but has set ones that will be used as defaults if they're not set.
 *  // Actually i'm not too sure about that. I'll have to think about it.
 *  target: "", // Query Selector, eg #icon - Actually always needed
 *  splashes: ["Splash 1", "Splash 2", "etc splashes"], // duh
 *  color: "", // Hex code or RGB value thingy
 *  font: "", // Optional, uses the default font
 *  rotation: 0, // any number between -360 and 360 prolly?
 *  border: "", // A CSS border thing. But... for the text? Does that exist?
 *  fontSize: 0, // a number. duh. Or... actually maybe even those words that CSS provides.
 *  animation: "", // Defaults to the bounce animation. Allows users to set their own!
 *  // actually what if i make the animation thing an object. ofc i let them add some sort of animation.
 *  // if its an array it defaults to 1s that goes on forever
 *  // if its an empty string there will be NO animation
 *  moveInterval: 0, // In milliseconds. It's the setInterval that checks offsetWidth and offsetTop.
 *
 *  // obviously im gonna add more as this goes on
 * })
 * ```
 * OH and DONT forget accessibility.
 * Make sure it doesn't animate WHATSOEVER if reduce motion is on
 */

function splashjs(options = {}) {
    // console.log("Hello! You've reached SplashJS. heres the options",options)
    if (options == {} || options.target == undefined) {
        throw new Error(
            "Target of splash was not specified.\nPlease add the 'target' option to the initalizer.",
        );
    }
    // Create a text element with a good positioning
    const target = document.querySelector(options.target);
    let xPos = 0;
    let yPos = 0;

    let splash = document.createElement("p");
    splash.innerText =
        options.splashes[Math.floor(Math.random() * options.splashes.length)];
    splash.style.position = "absolute";
    splash.style.transform = "rotate(-45deg)";
    splash.style.fontFamily = options.font ?? "";
    // some guy on stackoverflow said -webkit-text-stroke works fine so ill try that
    // how do i even set that from here?
    splash.style.pointerEvents = "none"; // Lets me use the textarea
    splash.style.color = options.color ?? "";
    splash.style.webkitTextStroke = options.border ?? "";
    splash.style.fontSize = options.fontSize;
    splash.style.textAlign = "center";
    // if (typeof options.animation != "object"&&typeof options.animation != "string") {
    // Great! Use bounce.
    try {
        splash.animate(
            options.animation?.movement ?? [
                { transform: "scale(1) rotate(-45deg)" },
                { transform: "scale(1.25) rotate(-45deg)" },
                { transform: "scale(1) rotate(-45deg)" },
            ],
            options.animation?.timing ?? {
                duration: 3000,
                iterations: Infinity,
                fill: "forwards",
            },
        );
    } catch (e) {
        // Use default bounce, or if animation is a string, do none
        if (!typeof options.animation == "string") {
            splash.animate(
                [
                    { transform: "scale(1) rotate(-45deg)" },
                    { transform: "scale(1.25) rotate(-45deg)" },
                    { transform: "scale(1) rotate(-45deg)" },
                ],
                {
                    duration: 3000,
                    iterations: Infinity,
                    fill: "forwards",
                },
            );
        }
    }
    // } else if (typeof options.animation == "object") {
    //     // TODO: implement
    //     splash.animate
    //     if(typeof options.animation.movement == "string" ){
    //         // Use custom animation
    //         throw new tooLazyError("Implement custom animation technique");
    //     }
    // }
    // If it's a string then they PROBABLY? don't want anything
    // BUT we want custom animations. Gotta figure that out!
    // Probably just use the object...
    document.body.appendChild(splash);
    // Specific image-loading techniques.
    try {
        function setStuff(splash, target) {
            // !!magic number alert!! - it just feels... right.
            // If the offsetHeight is double the computed font size, it means it was wrapped.
            // Add the -10 if it does
            const computedFontSize = parseFloat(
                window
                    .getComputedStyle(splash)
                    .getPropertyValue("font-size")
                    .slice(0, -2),
            );
            let adjustion = 10;
            if (computedFontSize > splash.offsetHeight) {
                adjustion = -10;
            }
            function getTranslateXY(element) {
                const style = window.getComputedStyle(element);
                const matrix = new DOMMatrixReadOnly(style.transform);

                return {
                    x: matrix.m41, // Translate X
                    y: matrix.m42, // Translate Y
                };
            }
            const translate = getTranslateXY(target)
            yPos = target.offsetTop + target.offsetHeight + translate.y + adjustion;
            xPos = target.offsetLeft + target.offsetWidth + translate.x;

            splash.style.left = `${xPos - splash.offsetWidth / 2}px`;
            splash.style.top = `${yPos - splash.offsetHeight}px`;
        }
        if (target.complete && target.naturalWidth > 0) {
            setStuff(splash, target);
            console.log("stuff was set cause it was alr done");
        } else {
            target.addEventListener("load", function () {
                setStuff(splash, target);
                console.log("stuff was set cause load");
            });
        }
        // While I'm here, might as well implement the adjustion fix
        // If statement checks if moveInterval isn't parsable to a number.
        // Does actually kinda help if people put numbers in strings.
        // Mostly meant to check if the moveInterval's an empty string.
        options.moveInterval = options.moveInterval ?? ""; // Default to not move
        if (!isNaN(parseInt(options.moveInterval))) {
            let ogOfL = target.offsetLeft;
            let ogOfT = target.offsetTop;
            // eh- do those really need to be checked...?
            // might be nice. ill just do L and T for now
            let ogOfH = target.offsetHeight;
            let ogOfW = target.offsetWidth;
            setInterval(function (e) {
                //if (ogOfL != target.offsetLeft || ogOfT != target.offsetTop) {
                setStuff(splash, target);
                //}
            }, options.moveInterval ?? 1000);
        } else {
            // Just double checking, make it right.
            setStuff(splash, target);
        }
    } catch (e) {
        console.log("target isnt an image. This will NEED to be fixed.", e);
        // TODO: implement non-image splashes
        //throw new tooLazyError("Implement non-image splashes");
    }
    // idk if that'll work good in the end but... eh.
}
