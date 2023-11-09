/* -------------------------------------------- */
/*  Draw Methods                                */
/* -------------------------------------------- */

/**
 * A render function to render text that may have linebreaks in it and handling dark mode.
 *
 * Splits by linebreak and renders each part as a new line one on top of the other, left aligned.
 *
 * The group of text is vertically centre aligned with the node
 *
 * @param context {CanvasRenderingContext2D} The rendering context
 * @param data {import("sigma/types").PartialButFor<import("sigma/types").NodeDisplayData,  "x" | "y" | "size" | "label" | "color">} The data for the node
 * @param settings {import("sigma/settings.d.ts").Settings} The settings for sigmajs
 * @param darkMode Whether darkmode is enabled
 */
export const drawLabel = (context, data, settings, darkMode) => {
    if (!data.label) return;

    const size = settings.labelSize,
        font = settings.labelFont,
        weight = settings.labelWeight;

    context.fillStyle = darkMode ? "white" : "black"
    context.font = `${weight} ${size}px ${font}`;

    const labels = data.label.split("\n");

    for (let i = 0; i < labels.length; i++){
        const label = labels[i];
        const offset = size * i - (labels.length / 2 - 0.5) * (size);
        context.fillText(label, data.x + data.size + 3, data.y + size / 3 + offset);
    }
};

/**
 * A render function to render hovered nodes with multiline labels and dark mode handling.
 * @param {CanvasRenderingContext2D} context The rendering context
 * @param {import("sigma/types").PartialButFor<import("sigma/types").NodeDisplayData, "x"|"y"|"size"|"label"|"color">} data The data for the node
 * @param {import("sigma/settings.d.ts").Settings} settings The settings for sigmajs
 * @param {boolean} darkMode Whether dark mode is enabled
 */
export const drawHover = (context, data, settings, darkMode) => {
    const size = settings.labelSize,
        font = settings.labelFont,
        weight = settings.labelWeight;

    context.font = `${weight} ${size}px ${font}`;

    // Then we draw the label background
    context.fillStyle = darkMode ? "#333" : "white";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 8;
    context.shadowColor = darkMode ? "#CCC" : "#222";

    const PADDING = 2;

    if (data.label) {
        const dimensions = measureText(context, data.label),
            boxWidth = Math.round(dimensions.width + 5),
            boxHeight = Math.round(size * dimensions.height + 2 * PADDING),
            radius = Math.max(data.size, size / 2) + PADDING;

        const angleRadian = Math.asin(boxHeight / 2 / radius);
        const xDeltaCoord = Math.sqrt(Math.abs(Math.pow(radius, 2) - Math.pow(boxHeight / 2, 2)));

        context.beginPath();
        context.moveTo(data.x + xDeltaCoord, data.y + boxHeight / 2);
        context.lineTo(data.x + radius + boxWidth, data.y + boxHeight / 2);
        context.lineTo(data.x + radius + boxWidth, data.y - boxHeight / 2);
        context.lineTo(data.x + xDeltaCoord, data.y - boxHeight / 2);
        context.arc(data.x, data.y, radius, angleRadian, -angleRadian);
        context.closePath();
        context.fill();

        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 0;

        // And finally we draw the label
        drawLabel(context, data, settings, darkMode);
    } else {
        context.beginPath();
        context.arc(data.x, data.y, data.size + PADDING, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }
};

/* -------------------------------------------- */
/*  Util                                        */
/* -------------------------------------------- */

/**
 * Measure the width and height of the text
 * @param context {CanvasRenderingContext2D} The rendering context
 * @param text {String} The text to measure
 * @returns {{"width": Number, "height": Number}} The width and height of the text, where width is in pixels and
 *                                                height is the number of lines
 */
function measureText(context, text) {
    const lines = text.split("\n");
    return {
        width: Math.max(...lines.map((line) => context.measureText(line).width)),
        height: lines.length
    };
}
