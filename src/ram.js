/**
 * RAM access
 */
const TOS = 0xF7;
class RAM {
    constructor(size) {
        this.mem = new Array(size);
        this.mem.fill(0);
        this.sp = TOS;
    }
	setTOP(i) {
        this.TOP = i;
    }    
    push(value) {
        if (this.sp > this.TOP - 1) throw "push at TOP"
        this.mem[this.sp--] = value
    }
    pop() {
        if (this.sp === TOS) throw "pop sp at TOS"
        return this.mem[++this.sp] 
    }
    /**
     * Write (store) MDR value at address MAR
     */
    write(MAR, MDR) {
        // !!! IMPLEMENT ME
        // write the value in the MDR to the address MAR
        // console.log(`MAR: ${MAR}  MDR: ${MDR.toString(2)}`);
        this.mem[MAR] = MDR
    }

    /**
     * Read (load) MDR value from address MAR
     * 
     * @returns MDR
     */
    read(MAR) {
        return this.mem[MAR]
        // !!! IMPLEMENT ME
        // Read the value in address MAR and return it
    }
}

module.exports = RAM;