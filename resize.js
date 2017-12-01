let sharp = require("sharp");
let fs = require("fs");
let utils = require("util");
let path = require("path");

function grab(flag) {
    var index = process.argv.indexOf(flag);
    return (index === -1) ? null : process.argv[index + 1];
}

function grabOption(option) {
    var index = process.argv.indexOf(option);
    return (index === -1) ? null : process.argv[index];
}

let element = grab("--element"); // nav_bar, tool_bar, tab_bar
let width = grab("--width");
let height = grab("--height");
let attribute = grab("--attribute"); //circle, square, tall, wide
let type = grab("--type"); // regular, compact
let imageLocation = grab("--image");

let min = grabOption("--min"); // Resize according to minimum sizes
let max = grabOption("--max"); // Resize according to maximum sizes
let defaultSize = "--min";
let defaultAttribute = "square";
let defaultTabType = "regular";


let elements = ["nav_bar", "tab_bar", "tool_bar"];
let attributes = ["square", "circle", "tall", "wide"];
let types = ["regular", "compact"];

// Default minimum sizes provided by Apple
let minimumSizes = {
    "nav_bar": [25, 50, 75],
    "tool_bar": [25, 50, 75]
}
// Default maximum sizes provided by Apple
let maximumSizes = {
    "nav_bar": [28, 56, 83],
    "tool_bar": [28, 56, 83]
}

let regularTabSizes = {
    "circle": [25, 50, 75],
    "square": [23, 46, 69],
    "wide": [31, 62, 93],
    "tall": [28, 56, 84]
}

let compactTabSizes = {
    "circle": [18, 36, 54],
    "square": [17, 34, 51],
    "wide": [23, 46, 69],
    "tall": [20, 40, 60]
}

let image = null;

function isValidData() {
    if (element == null) {
        console.log(`--element argument is missing`);
        return false;
    } else if (!elements.includes(element)) {
        console.log(`Invalid element value\nUse any of these [${elements}]`);
        return false;
    } else if (width != null && isNaN(parseInt(width))) {
        console.log(`Invalid width`);
        return false;
    } else if (height != null && isNaN(parseInt(height))) {
        console.log(`Invalid height`);
        return false;
    } else if (element == "tab_bar") {
        if (attribute == null) {
            attribute = defaultAttribute;
        } else if (!attributes.includes(attribute)) {
            console.log(`Invalid --attribute value\nUse any of these [${attributes}]`);
            return false;
        }
        if (type == null) {
            type = defaultTabType;
        } else if (!types.includes(type)) {
            console.log(`Invalid --type value\nUse any of these [${types}]`);
            return false;
        }
    }
    if (width == null && height == null) {
        if (max != null && utils.isString(max)) {
            defaultSize = max;
        }
    }
    if (imageLocation == null) {
        console.log(`--image argument is missing`);
        return false;
    }
    return true;
}

function getSize() {
    if (width != null && height == null) {
        let w = parseInt(width);
        return [w, w * 2, w * 3];
    } else if (width == null && height != null) {
        let h = parseHeight(height);
        return [h, h * 2, h * 3];
    } else if (element == "nav_bar") {
        if (defaultSize == "--min") {
            return minimumSizes["nav_bar"];
        } else {
            return maximumSizes["nav_bar"];
        }
    } else if (element == "tool_bar") {
        if (defaultSize == "--min") {
            return minimumSizes["tool_bar"];
        } else {
            return maximumSizes["tool_bar"];
        }
    } else if (element == "tab_bar") {
        let map = regularTabSizes;
        if (type == "compact") {
            map = compactTabSizes;
        }
        return map[attribute];
    }
}

function resizeImage(buffer, width, height, savePath, fileName) {
    let filePath = `${savePath}${fileName}`;    
    sharp(buffer)
        .resize(width, height)
        .toFile(filePath)
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        })
}



function createContentFile(images, path) {
    var object = {
        "images": images,
        "info": {
            "author": "xcode",
            "version": 1
        }
    }
    var json = JSON.stringify(object);
    fs.writeFileSync(`${path}/Contents.json`, json, 'utf8');
}

function main() {
    if (isValidData()) {
        if (!fs.existsSync(imageLocation)) {
            console.log(`${imageLocation} no such file or directory.`);
            return;
        }
        let buffer = fs.readFileSync(imageLocation);
        let fileInfo = path.parse(imageLocation);
        if (fileInfo == null) {
            console.log("Error while getting image information");
            return;
        }
        // Save path
        let dirPath = `${fileInfo.dir}/${fileInfo.name}.imageset`;
        while (fs.existsSync(dirPath)) {
            dirPath += "_copy";
        }

        fs.mkdirSync(dirPath);
        let size = getSize();
        console.log(`Sizes: ${size}`);
        let contentFileImages = [];
        for (let i = 0; i < size.length; i++) {
            let filename = i == 0 ? fileInfo.name : `${fileInfo.name}_${i + 1}x`;
            filename = `${filename}${fileInfo.ext}`;
            resizeImage(buffer, size[i], size[i], `${dirPath}/`, filename);

            let dictionary = {};
            dictionary["filename"] = filename;
            dictionary["idiom"] = "universal";
            dictionary["scale"] = `${i + 1}x`;
            contentFileImages.push(dictionary);
        }

        createContentFile(contentFileImages, dirPath);
    }
}

main();
