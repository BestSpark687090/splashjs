// First thing's first. Make an export-thing
/**
 * Here's how it looks:
 * ```js
 * splashjs({
 *  preset: '', // OVERWRITES ALL OTHER OPTIONS I GUESS
 *  target: "", // Query Selector, eg #icon - Actually always needed
 *  splashes: ["Splash 1", "Splash 2", "etc splashes"], // duh
 *  color: "", // Hex code or RGB value thingy
 *  font: "", // Optional, uses the default font
 *  rotation: 0, // any number between -360 and 360 prolly?
 *  border: "" // A CSS border thing. But... for the text? Does that exist?
 *  fontSize: 0, // a number. duh. Or... actually maybe even those words that CSS provides.
 *  // obviously im gonna add more as this goes on
 * })
 * ```
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
    splash.innerText = options.splashes[Math.floor(Math.random() * options.splashes.length)];
    splash.style.position = "absolute";
    splash.style.transform = "rotate(-45deg)";
    // some guy on stackoverflow said -webkit-text-stroke works fine so ill try that
    // how do i even set that from here?
    splash.style.webkitTextStroke=options.border??""
    splash.style.fontSize = options.fontSize
    splash.style.textAlign="center"
    document.body.appendChild(splash);
    // Specific image-loading techniques.
    try {
        function setStuff(splash,target){
            // !!magic number alert!! - it just feels... right.
            yPos = target.offsetTop + target.offsetHeight - 20;
            xPos = target.offsetLeft + target.offsetWidth;

            splash.style.left = `${xPos - splash.offsetWidth / 2}px`;
            splash.style.top = `${yPos - splash.offsetHeight}px`;
        }
        if (target.complete && target.naturalWidth > 0) {
            setStuff(splash,target)
            console.log("stuff was set cause it was alr done")
        } else {
            target.addEventListener("load",function(){
                setStuff(splash,target);
                console.log("stuff was set cause load")
            });
        }
    } catch (e) {
        console.log("target isnt an image. This will NEED to be fixed.", e);
        // TODO: implement non-image splashes
    }
    // idk if that'll work good in the end but... eh.
}
