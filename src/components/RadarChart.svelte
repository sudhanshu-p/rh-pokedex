<script>
    import { onMount } from "svelte";

    // Props with default values
    export let data = [
        { name: "Speed", value: 80 },
        { name: "Power", value: 65 },
        { name: "Range", value: 90 },
        { name: "Durability", value: 75 },
        { name: "Accuracy", value: 85 },
        { name: "Weight", value: 50 },
    ];

    export let size = 300;
    export let maxValue = 100;
    export let colors = {
        shape: "rgba(54, 162, 235, 0.2)",
        line: "rgba(54, 162, 235, 1)",
        point: "rgba(54, 162, 235, 1)",
        text: "#333",
        grid: "#ddd",
    };

    let hoveredPoint = null;
    let tooltip = { visible: false, x: 0, y: 0, value: 0, name: "" };

    $: center = size / 2;
    $: radius = (size / 2) * 0.8;
    $: points = calculatePoints(data, center, radius, maxValue);

    function calculatePoints(data, center, radius, maxValue) {
        const totalPoints = data.length;
        return data.map((item, i) => {
            const angle = (Math.PI * 2 * i) / totalPoints - Math.PI / 2;
            const normalizedValue = item.value / maxValue;
            const distance = radius * normalizedValue;

            return {
                x: center + distance * Math.cos(angle),
                y: center + distance * Math.sin(angle),
                labelX: center + (radius + 20) * Math.cos(angle),
                labelY: center + (radius + 20) * Math.sin(angle),
                value: item.value,
                name: item.name,
                index: i,
            };
        });
    }

    function generateAxisPoints() {
        const totalAxes = data.length;
        const axes = [];

        for (let i = 0; i < totalAxes; i++) {
            const angle = (Math.PI * 2 * i) / totalAxes - Math.PI / 2;
            axes.push({
                x: center + radius * Math.cos(angle),
                y: center + radius * Math.sin(angle),
            });
        }

        return axes;
    }

    function generateGridLines() {
        const levels = 5;
        const axes = generateAxisPoints();
        const gridLines = [];

        for (let level = 1; level <= levels; level++) {
            const gridLevel = [];
            const levelRadius = (radius * level) / levels;

            for (let i = 0; i < axes.length; i++) {
                const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
                gridLevel.push({
                    x: center + levelRadius * Math.cos(angle),
                    y: center + levelRadius * Math.sin(angle),
                });
            }

            gridLines.push(gridLevel);
        }

        return gridLines;
    }

    function handleMouseOver(index) {
        hoveredPoint = index;
        const point = points[index];
        tooltip = {
            visible: true,
            x: point.x,
            y: point.y - 10,
            value: point.value,
            name: point.name,
        };
    }

    function handleMouseOut() {
        hoveredPoint = null;
        tooltip.visible = false;
    }

    // Generate SVG polygon points string
    $: polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");
</script>

<div
    class="radar-container"
    style="width: {size}px; height: {size}px; position: relative;"
>
    <svg width={size*1.3} height={size}>
        <!-- Grid circles and axis lines -->
        {#each generateGridLines() as gridLevel}
            <polygon
                points={gridLevel.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke={colors.grid}
                stroke-width="1"
            />
        {/each}

        <!-- Axes -->
        {#each generateAxisPoints() as point, i}
            <line
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke={colors.grid}
                stroke-width="1"
            />
        {/each}

        <!-- Data shape -->
        <polygon
            points={polygonPoints}
            fill={colors.shape}
            stroke={colors.line}
            stroke-width="2"
        />

        <!-- Data points -->
        {#each points as point, i}
            <circle
                cx={point.x}
                cy={point.y}
                r={hoveredPoint === i ? 6 : 4}
                fill={colors.point}
                on:mouseover={() => handleMouseOver(i)}
                on:mouseout={handleMouseOut}
            />
        {/each}

        <!-- Labels -->
        {#each points as point}
            <text
                x={point.labelX}
                y={point.labelY}
                fill={colors.text}
                font-size="15"
                text-anchor={point.labelX > center
                    ? "start"
                    : point.labelX < center
                      ? "end"
                      : "middle"}
                dominant-baseline={point.labelY > center ? "hanging" : "auto"}
            >
                {point.name}
            </text>
        {/each}
    </svg>

    <!-- Tooltip -->
    {#if tooltip.visible}
        <div class="tooltip" style="left: {tooltip.x}px; top: {tooltip.y}px;">
            <strong>{tooltip.name}:</strong>
            {tooltip.value}
        </div>
    {/if}
</div>

<style>
    .radar-container {
        margin: 0 auto;
    }

    .tooltip {
        position: absolute;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        pointer-events: none;
        white-space: nowrap;
    }
</style>
