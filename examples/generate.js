import {execSync} from "child_process";
import {readdirSync, mkdirSync} from "fs";
import {join as joinPath, dirname} from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Output folder relative to this script's directory
const OUTPUT_DIR = "../docs/guides"

// The `src` directory will contain all the guides
const SRC_DIR = "src"

function absolutePath(input) {
    return joinPath(__dirname, input)
}

function absoluteOutputDir(dir) {
    return joinPath(__dirname, OUTPUT_DIR, dir);
}

// returns a list of files in the folder relative to the root dir
function listAllFiles(rootDir) {
    const items = readdirSync(rootDir,  { withFileTypes: true })
    return items.map(i => i.isDirectory() ? listAllFiles(joinPath(rootDir, i.name)).map(fp => joinPath(i.name, fp)) : [i.name]).reduce((a,b) => a.concat(b), [])
}

function transformInputFile(inputFile) {
    return {
        inputFile: joinPath(SRC_DIR, inputFile),
        outputFile: joinPath(OUTPUT_DIR, (inputFile.substring(0, inputFile.lastIndexOf(".")) + ".md"))
    }
}

const files = listAllFiles(SRC_DIR).map(transformInputFile)
console.log(files)
files.forEach((f) => {
    execSync(`ljs2 ${absolutePath(f.inputFile)} -o ${absolutePath(f.outputFile)}`)
    console.log(`${f.inputFile} -> ${f.outputFile}`)
});
