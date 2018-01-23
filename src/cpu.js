/**
 * LS-8 v2.0 emulator skeleton code
 */

const fs = require('fs');

// Instructions
// high to bits have arg count 0-3
const HLT = 0b00011011; // Halt CPU
const LDI = 0b10000100;
const MUL = 0b10000101;
const PRN =  0b01000110;
const CALL = 0b01000111;
const RTN = 0b00001000;

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers
        // Special-purpose registers
        this.inr = {}
        this.inr.PC = 0; // Program Counter
        this.inr.IR = 0; // Instruction Register
        this.inr.MAR = 0; // Memory Address Register, holds the memory address we're reading or writing
        this.inr.MDR = 0; // Memory Data Register, holds the value to write or the value just read

        
		this.setupBranchTable();
    }
    read() {
        this.inr.MDR = this.ram.read(this.inr.MAR);
    }
    readPcInc() {
        this.inr.MAR = this.inr.PC;
        this.read();
        this.inr.PC++;
        return this.inr.MDR;
    }
	/**
	 * Sets up the branch table
	 */
	setupBranchTable() {
		let bt = {};

        bt[HLT] = this.HLT;
        // !!! IMPLEMENT ME
        bt[LDI] = this.LDI;
        bt[MUL] = this.MUL;
        bt[PRN] = this.PRN;  
        bt[CALL] = this.CALL;
        bt[RTN] = this.RTN;
        
        // LDI
        // MUL
        // PRN

        this.branchTable = bt;
	}
	setTOP(i) {
        this.ram.setTOP(i);
    } 
    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        const _this = this;

        this.clock = setInterval(() => {
            _this.tick();
        }, 1);
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU functionality
     * 
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        // console.log(`op: ${op} regA: ${regA} regB: ${regB}`)
        switch (op) {
            case 'MUL':
                this.reg[regA] = this.reg[regA] * this.reg[regB];
                break;
             case 'LDI':
                this.reg[regA] = regB;
                break;
        }
    }

    /**{
     * Advances the CPU one cycle
     */
    tick() {
        // !!! IMPLEMENT ME

        // Load the instruction register from the current PC
        this.inr.MAR = this.inr.PC;
        this.read();
        this.inr.IR  = this.inr.MDR;
        // Debugging output0000110
        // console.log(`PC  ${this.inr.PC}:  IR:  ${this.inr.IR  ?  this.inr.IR.toString(2) : 'shit'}`);
        this.inr.PC++;
        // Based on the value in the Instruction Register, jump to the
        // appropriate hander in the branchTable
        const handler = this.branchTable[this.inr.IR];
        if (handler === undefined) {
            console.log(`undefined handler HLT  ${this.inr.IR.toString(2)}`);
            this.HLT.call(this)
            return
        }
        const argCount = (this.inr.IR & 0b11000000) >> 6;
        let arg1, arg2, arg3;
        if (argCount >= 1) arg1 = this.readPcInc(); 
        if (argCount >= 2) arg2 = this.readPcInc(); 
        if (argCount === 3) arg3 = this.readPcInc(); 
        // console.log(`args ${argCount}: ${arg1}  ${arg2} `)

        // Check that the handler is defined, halt if not (invalid
        // instruction)
 
        // We need to use call() so we can set the "this" value inside
        // the handler (otherwise it will be undefined in the handler)

        handler.call(this, arg1, arg2, arg3);
    }

    // INSTRUCTION HANDLER CODE: // !!! IMPLEMENT ME
    /**
     * HLT
     */
    HLT() {
        // !!! IMPLEMENT ME
        this.stopClock.call(this)
    }

    /**
     * LDI R,I
     */
    LDI(R,I) {
        this.alu('LDI',R, I)
        // !!! IMPLEMENT ME
    }

    /**
     * MUL R,L
     */
    MUL(regA, regB) {
        // !!! IMPLEMENT ME
        this.alu('MUL', regA, regB)
    }
    CALL(address) {
        // console.log(`Call to ${address}`);
        this.ram.push(this.inr.PC);
        this.inr.PC = address;
    }
    RTN() {
        this.inr.PC = this.ram.pop();
        // console.log(`RTN to ${this.inr.PC}`);
    }

    /**
     * PRN R
     */
    PRN(R) {
        // !!! IMPLEMENT ME
        // console.log(`PNR==> R: ${R}  ${this.reg[R]}  <==`)
        console.log(this.reg[R]);
    }
}

module.exports = {
    CPU,
    HLT,
    MUL,
    LDI,
    PRN,
    CALL,
    RTN,
}
