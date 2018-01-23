const fs = require('fs');
const RAM = require('./ram');
const {CPU, HLT, LDI, MUL, PRN, CALL, RTN } = require('./cpu');

// console.log('constants',HLT,LDI,MUL,PRN)
const iL = [
]
iL[HLT & 0x3F] = HLT;
iL[LDI & 0x3F] = LDI;
iL[MUL & 0x3F] = MUL;
iL[PRN & 0x3F] = PRN;
iL[CALL & 0x3F] = CALL;
iL[RTN & 0x3F] = RTN;

// console.log(`iL: ${iL}  il[HLT]: ${iL[0b00011011].toString(2)}  iL[LDI]: ${iL[4].toString(2)}`) 
/**
 * Process a loaded file
 */
function processFile(content, cpu, onComplete) {

    // Pointer to the memory address in the CPU that we're
    // loading a value into:
    let curAddr = 0;
    
    // Split the lines of the content up by newline
    const lines = content.split('\n');
    // console.log(`lines.length: ${lines.length}`);

    // Loop through each line of machine code
    let state = 0
    for (let line of lines) {

        // !!! IMPLEMENT ME
        const commentIndex = line.indexOf('#');
        if (commentIndex >= 0) line = line.substring(0,commentIndex);
        line = line.trim()
        // Strip comments
        if (line.length < 8) continue  
        let i  = parseInt(line.substring(0,8),2);
        // console.log(`raw i: ${i.toString(2)}`);
        if (!state) {
            i = iL[i];
            state = ((i & 0xC0) >> 6) + 1;
            // console.log(i & 0xC0);
            // console.log(`state: ${state}  line: ${line} iL i: ${i ? i.toString(2) : 'not working'}`);
        }


       // console.log(`iL: ${iL}  line: ${line} i: ${line.length.toString(2)}`);
        // Remove whitespace from either end of the line

        // Ignore empty lines

        // Convert from binary string to numeric value

        // Store in the CPU with the .poke() function
        cpu.poke(curAddr,i)
        // And on to the next one
        curAddr++;
        state--;
    }
    cpu.setTOP(curAddr)
    onComplete(cpu);
}

/**
 * Load the instructions into the CPU from stdin
 */
function loadFileFromStdin(cpu, onComplete) {
    let content = '';

    // Read everything from standard input, stolen from:
    // https://stackoverflow.com/questions/13410960/how-to-read-an-entire-text-stream-in-node-js
    process.stdin.resume();
    process.stdin.on('data', function(buf) { content += buf.toString(); });
    process.stdin.on('end', () => { processFile(content, cpu, onComplete); });
}

/**
 * Load the instructions into the CPU from a file
 */
function loadFile(filename, cpu, onComplete) {
    const content = fs.readFileSync(filename, 'utf-8');
    processFile(content, cpu, onComplete);
}

/**
 * On File Loaded
 * 
 * CPU is set up, start it running
 */
function onFileLoaded(cpu) {
    cpu.startClock();
}

/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);

// Get remaining command line arguments
const argv = process.argv.slice(2);
// console.log(`argv: ${argv}`);
// Check arguments
if (argv.length === 0) {
    // Read from stdin
    loadFileFromStdin(cpu, onFileLoaded);
} else if (argv.length == 1) {
   //  console.log(`loadFile ${argv[0]}`)
    // Read from file
    loadFile(argv[0], cpu, onFileLoaded);
} else {
    console.error('usage: ls8 [machinecodefile]');
    process.exit(1);
}
