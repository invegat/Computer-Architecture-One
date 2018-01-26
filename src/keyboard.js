const keyboardInterrupt = 2;
const keyAddress = 0xf7;
class Keyboard {
    constructor() {
        var stdin = process.stdin;

        // without this, we would only get streams once enter is pressed
        stdin.setRawMode( true );

        // resume stdin in the parent process (node aapp won't quit all by itself
        // unless an error or process.exit() happens)
        stdin.resume();

        // i don't want binary, do you?
        stdin.setEncoding( 'utf8' );

        // on any data into stdin
        stdin.on( 'data', ( key ) => {
            // ctrl-c ( end of text )
            if ( key === '\u0003' ) {
                process.exit();
            }
            this.handleKey(key);
        });
    }

    ConnectToCPU(cpu) {
        this.cpu = cpu;
    }

    handleKey(key) {
        //console.log("keyboard: " + key);
        this.cpu.poke(keyAddress, key.charCodeAt(0));
        this.cpu.raiseInterrupt(keyboardInterrupt);
    }
}

module.exports = Keyboard