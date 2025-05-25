// World Data Configuration
const WORLDS_DATA = {
    1: {
        name: "Joy Island",
        theme: "tropical",
        color: "#FFD700",
        backgroundColor: "#87CEEB",
        levels: [
            { id: 1, name: "Sunny Beach", x: 150, y: 400, unlocked: true },
            { id: 2, name: "Palm Grove", x: 350, y: 300, unlocked: false },
            { id: 3, name: "Coral Reef", x: 550, y: 350, unlocked: false },
            { id: 4, name: "Sunset Peak", x: 750, y: 250, unlocked: false }
        ],
        paths: [
            { from: 0, to: 1, points: [{x: 150, y: 400}, {x: 250, y: 350}, {x: 350, y: 300}] },
            { from: 1, to: 2, points: [{x: 350, y: 300}, {x: 450, y: 325}, {x: 550, y: 350}] },
            { from: 2, to: 3, points: [{x: 550, y: 350}, {x: 650, y: 300}, {x: 750, y: 250}] }
        ]
    },
    2: {
        name: "Sadness Valley",
        theme: "rainy",
        color: "#4169E1",
        backgroundColor: "#708090",
        levels: [
            { id: 1, name: "Misty Meadow", x: 200, y: 350, unlocked: true },
            { id: 2, name: "Weeping Willows", x: 400, y: 400, unlocked: false },
            { id: 3, name: "Thunder Canyon", x: 600, y: 300, unlocked: false },
            { id: 4, name: "Storm Summit", x: 800, y: 200, unlocked: false }
        ],
        paths: [
            { from: 0, to: 1, points: [{x: 200, y: 350}, {x: 300, y: 375}, {x: 400, y: 400}] },
            { from: 1, to: 2, points: [{x: 400, y: 400}, {x: 500, y: 350}, {x: 600, y: 300}] },
            { from: 2, to: 3, points: [{x: 600, y: 300}, {x: 700, y: 250}, {x: 800, y: 200}] }
        ]
    },
    3: {
        name: "Anger Volcano",
        theme: "volcanic",
        color: "#FF4500",
        backgroundColor: "#8B0000",
        levels: [
            { id: 1, name: "Lava Fields", x: 180, y: 420, unlocked: true },
            { id: 2, name: "Fire Caves", x: 380, y: 380, unlocked: false },
            { id: 3, name: "Molten River", x: 580, y: 320, unlocked: false },
            { id: 4, name: "Crater Core", x: 780, y: 280, unlocked: false }
        ],
        paths: [
            { from: 0, to: 1, points: [{x: 180, y: 420}, {x: 280, y: 400}, {x: 380, y: 380}] },
            { from: 1, to: 2, points: [{x: 380, y: 380}, {x: 480, y: 350}, {x: 580, y: 320}] },
            { from: 2, to: 3, points: [{x: 580, y: 320}, {x: 680, y: 300}, {x: 780, y: 280}] }
        ]
    },
    4: {
        name: "Fear Forest",
        theme: "spooky",
        color: "#9370DB",
        backgroundColor: "#2F4F4F",
        levels: [
            { id: 1, name: "Whispering Woods", x: 160, y: 380, unlocked: true },
            { id: 2, name: "Shadow Swamp", x: 360, y: 350, unlocked: false },
            { id: 3, name: "Haunted Hollow", x: 560, y: 400, unlocked: false },
            { id: 4, name: "Nightmare Peak", x: 760, y: 320, unlocked: false }
        ],
        paths: [
            { from: 0, to: 1, points: [{x: 160, y: 380}, {x: 260, y: 365}, {x: 360, y: 350}] },
            { from: 1, to: 2, points: [{x: 360, y: 350}, {x: 460, y: 375}, {x: 560, y: 400}] },
            { from: 2, to: 3, points: [{x: 560, y: 400}, {x: 660, y: 360}, {x: 760, y: 320}] }
        ]
    },
    5: {
        name: "Disgust Swamp",
        theme: "swamp",
        color: "#9ACD32",
        backgroundColor: "#556B2F",
        levels: [
            { id: 1, name: "Slimy Shores", x: 170, y: 400, unlocked: true },
            { id: 2, name: "Mucky Marsh", x: 370, y: 360, unlocked: false },
            { id: 3, name: "Toxic Pools", x: 570, y: 380, unlocked: false },
            { id: 4, name: "Putrid Peak", x: 770, y: 300, unlocked: false }
        ],
        paths: [
            { from: 0, to: 1, points: [{x: 170, y: 400}, {x: 270, y: 380}, {x: 370, y: 360}] },
            { from: 1, to: 2, points: [{x: 370, y: 360}, {x: 470, y: 370}, {x: 570, y: 380}] },
            { from: 2, to: 3, points: [{x: 570, y: 380}, {x: 670, y: 340}, {x: 770, y: 300}] }
        ]
    },
    6: {
        name: "Surprise Springs",
        theme: "bouncy",
        color: "#FF69B4",
        backgroundColor: "#FFB6C1",
        levels: [
            { id: 1, name: "Bouncy Bluffs", x: 190, y: 390, unlocked: true },
            { id: 2, name: "Spring Valley", x: 390, y: 340, unlocked: false },
            { id: 3, name: "Shock Cliffs", x: 590, y: 370, unlocked: false },
            { id: 4, name: "Wonder Heights", x: 790, y: 290, unlocked: false }
        ],
        paths: [
            { from: 0, to: 1, points: [{x: 190, y: 390}, {x: 290, y: 365}, {x: 390, y: 340}] },
            { from: 1, to: 2, points: [{x: 390, y: 340}, {x: 490, y: 355}, {x: 590, y: 370}] },
            { from: 2, to: 3, points: [{x: 590, y: 370}, {x: 690, y: 330}, {x: 790, y: 290}] }
        ]
    },
    7: {
        name: "Anxiety Maze",
        theme: "maze",
        color: "#DDA0DD",
        backgroundColor: "#D8BFD8",
        levels: [
            { id: 1, name: "Worry Entrance", x: 140, y: 410, unlocked: true },
            { id: 2, name: "Stress Corridors", x: 340, y: 380, unlocked: false },
            { id: 3, name: "Panic Plaza", x: 540, y: 350, unlocked: false },
            { id: 4, name: "Calm Center", x: 740, y: 320, unlocked: false }
        ],
        paths: [
            { from: 0, to: 1, points: [{x: 140, y: 410}, {x: 240, y: 395}, {x: 340, y: 380}] },
            { from: 1, to: 2, points: [{x: 340, y: 380}, {x: 440, y: 365}, {x: 540, y: 350}] },
            { from: 2, to: 3, points: [{x: 540, y: 350}, {x: 640, y: 335}, {x: 740, y: 320}] }
        ]
    },
    8: {
        name: "Ennui Emptiness",
        theme: "void",
        color: "#A9A9A9",
        backgroundColor: "#696969",
        levels: [
            { id: 1, name: "Blank Plains", x: 200, y: 400, unlocked: true },
            { id: 2, name: "Empty Echo", x: 400, y: 350, unlocked: false },
            { id: 3, name: "Void Valley", x: 600, y: 380, unlocked: false },
            { id: 4, name: "Nothing Peak", x: 800, y: 300, unlocked: false }
        ],
        paths: [
            { from: 0, to: 1, points: [{x: 200, y: 400}, {x: 300, y: 375}, {x: 400, y: 350}] },
            { from: 1, to: 2, points: [{x: 400, y: 350}, {x: 500, y: 365}, {x: 600, y: 380}] },
            { from: 2, to: 3, points: [{x: 600, y: 380}, {x: 700, y: 340}, {x: 800, y: 300}] }
        ]
    }
};

// Make worlds data globally available
window.WORLDS_DATA = WORLDS_DATA;