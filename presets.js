const presetDefault = {
    // Gonna create this default for me later i guess?
    // Make the user provide their own splashes.
    color: "#ffff55",
    font: "Arial",
    rotation: -45,
    border: "none",
    fontSize: "x-large",
    animation: {
        movement: [
            { transform: "scale(1) rotate(-45deg)" },
            { transform: "scale(1.25) rotate(-45deg)" },
            { transform: "scale(1) rotate(-45deg)" },
        ],
        timing: {
            duration: 3000,
            iterations: Infinity,
            fill: "forwards",
        },
    },
    moveInterval: 250,
};
const presetEmpty = {
    splashes: [""],
    color: "",
    font: "",
    rotation: 0,
    border: "",
    fontSize: "",
    animation: "", // No animation
    moveInterval: "", // No movement
};
export { presetDefault, presetEmpty };