# mult.ls8.m7.asm

LDI R0, INT0
LDI R1, 0xF8  # INT0
ST R1,R0
LDI R0,8
LDI R1,9
MUL R0,R1
LDI R3,MultBy3 
CALL R3
PRN R0
NOP
NOP
NOP
NOP
NOP
NOP
NOP
NOP
NOP
NOP
NOP
NOP
NOP
NOP
NOP
HLT
MultBy3:
LDI R2,3
MUL R0,R2
RET
INT0: 
LDI R0, HelloINT
LDI R1,12
LDI R2,PrintStr      ; address of PrintStr
CALL R2 
IRET
; Subroutine: PrintStr
; R0 the address of the string
; R1 the number of bytes to print

PrintStr:

	LDI R2,0            ; SAVE 0 into R2 for later CMP

PrintStrLoop:

	CMP R1,R2           ; Compare R1 to 0 (in R2)
	LDI R3,PrintStrEnd  ; Jump to end if we're done
	JEQ R3         

	LD R3,R0            ; Load R3 from address in R0
	PRA R3              ; Print character

	INC R0              ; Increment pointer to next character
	DEC R1              ; Decrement number of characters

	LDI R3,PrintStrLoop ; Keep processing
	JMP R3

PrintStrEnd:

	RET                 ; Return to caller

HelloINT:
TEXT:
ds Hello, INT!
db 0x0a             ; newline
