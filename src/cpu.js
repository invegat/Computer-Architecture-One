/**
 * LS-8 v2.0 emulator skeleton code
 */

const fs = require('fs');

// Instructions
// high to bits have arg count 0-3
const HLT =  0b00011011; // Halt CPU
const LDI =  0b10000100;
const MUL =  0b10000101;
const PRN =  0b01000110;
const CALL = 0b01000111;
const RTN =  0b00001000;
const PUSH = 0b01001010;
const POP =  0b00001011;

const SP = 7;
const TOS = 0xF7;
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
        this.reg[SP] = TOS;
        this.tc = 0; // for debugging only
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
        bt[PUSH] = this.PUSH;
        bt[POP] = this.POP;
        
        // LDI
        // MUL
        // PRN

        this.branchTable = bt;
	}
	setTOP(i) {
        this.TOP = i;
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
        // console.log(`PC  ${this.inr.PC}:  IR:  ${this.inr.IR  ?  this.inr.IR.toString(2) : 'error'}`);
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
        this.tc++;
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
    PUSH(reg) {
        // console.log(`PUSHing ${this.reg[reg]} to ${this.reg[SP]}`);
        if (this.reg[SP] < this.TOP + 1) throw "push at TOP";
        this.ram.write((this.reg[SP])--,this.reg[reg]);
       //  console.log(this.ram.read(this.reg[SP]+1))   
       //  console.log(`SP: ${this.reg[SP]}`);
    }
    POP() {
        const rv =  this.ram.read(++(this.reg[SP]));
        // console.log(`POPing from ${this.reg[SP]}`);
        return rv;
    }
    CALL(address) {
        // console.log(`Call to ${address}`);
        this.reg[3] = this.inr.PC;
        this.PUSH(3);
        this.inr.PC = address;
        // console.log(`calling ${this.ram.read(address).toString(2)} CALL length  ${((CALL & 0b11000000) >> 6)}`)
    }
    RTN() {
        this.inr.PC = this.POP();
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
    PUSH,
    POP,
    CALL,
    RTN,
}
