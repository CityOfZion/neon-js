import {execSync} from "child_process";
import {readdirSync, mkdirSync} from "fs";
import {join as joinPath, dirname} from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Output folder relative to this script's directory
const OUTPUT_DIR = "../docs/guides"

// Folders containing guides relative to this script's directory.
const GUIDE_DIRS = ["basic", "advanced"]

function absolutePath(input) {
    return joinPath(__dirname, input)
}

function absoluteOutputDir(dir) {
    return joinPath(__dirname, OUTPUT_DIR, dir);
}

// Ensure that all output dirs are created
GUIDE_DIRS.forEach(dir => mkdirSync(absoluteOutputDir(dir), {recursive: true}));

// Craft the individual commands required to produce each guide
const relativeFileNames = GUIDE_DIRS.map(dirName => readdirSync(absolutePath(dirName)).map(fileName => joinPath(dirName, fileName))).reduce((a1, a2) => a1.concat(a2));
const fileMap = relativeFileNames.map(fileName => {
return {
    inputFile:fileName,
    outputFile: joinPath(OUTPUT_DIR, (fileName.substring(0, fileName.lastIndexOf(".")) + ".md"))
}
})

fileMap.forEach((f) => {
    execSync(`ljs2 ${absolutePath(f.inputFile)} -o ${absolutePath(f.outputFile)}`)
    console.log(`${f.inputFile} -> ${f.outputFile}`)
});
