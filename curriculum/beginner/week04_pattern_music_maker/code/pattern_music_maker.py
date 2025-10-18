"""Pattern Music Maker - Week 4
South African Rhythm Patterns with Raspberry Pi Pico

This program demonstrates pattern recognition and loops by playing
traditional South African rhythm patterns using a buzzer.

Learning Objectives:
- Pattern recognition in music
- Using loops for repetition
- Decomposition of complex rhythms
- Cultural connection to SA musical heritage

Hardware Setup:
- Raspberry Pi Pico
- Passive buzzer connected to GPIO 15
- Ground connection

Ubuntu Connection: Music brings communities together!
"""

from machine import Pin, PWM
from time import sleep

# Setup buzzer on GPIO 15
buzzer = PWM(Pin(15))

# Musical note frequencies (Hz)
NOTES = {
    'C4': 262,
    'D4': 294,
    'E4': 330,
    'F4': 349,
    'G4': 392,
    'A4': 440,
    'B4': 494,
    'C5': 523,
    'REST': 0
}

# Rhythm pattern durations (in seconds)
BEAT_LONG = 0.5    # Quarter note
BEAT_SHORT = 0.25   # Eighth note
BEAT_PAUSE = 0.1    # Rest between notes

def play_note(frequency, duration):
    """Play a single note at given frequency for duration."""
    if frequency > 0:
        buzzer.freq(frequency)
        buzzer.duty_u16(1000)  # Set volume (0-65535)
        sleep(duration)
    else:
        sleep(duration)  # Rest/silence
    
    # Brief pause between notes
    buzzer.duty_u16(0)
    sleep(BEAT_PAUSE)

def play_pattern(pattern, tempo=1.0):
    """Play a rhythm pattern (list of note-duration tuples).
    
    Args:
        pattern: List of (note, duration) tuples
        tempo: Speed multiplier (1.0 = normal, 0.5 = half speed, 2.0 = double speed)
    """
    print("Playing pattern...")
    for note, duration in pattern:
        adjusted_duration = duration * tempo
        play_note(NOTES[note], adjusted_duration)

# ========== TRADITIONAL RHYTHM PATTERNS ==========

# Pattern 1: Gumboot Dance Pattern (4/4 time)
# SLAP-SLAP-tap-SLAP (repeating)
gumboot_pattern = [
    ('C5', BEAT_LONG),   # SLAP
    ('C5', BEAT_LONG),   # SLAP
    ('G4', BEAT_SHORT),  # tap
    ('C5', BEAT_LONG),   # SLAP
]

# Pattern 2: Call and Response (Mbube/Isicathamiya)
# Leader call, then group response
call_pattern = [
    ('E4', BEAT_SHORT),
    ('G4', BEAT_SHORT),
    ('A4', BEAT_SHORT),
    ('C5', BEAT_LONG),
]

response_pattern = [
    ('C5', BEAT_SHORT),
    ('A4', BEAT_SHORT),
    ('G4', BEAT_SHORT),
    ('E4', BEAT_LONG),
]

# Pattern 3: Djembe Drum Pattern (3/4 time)
# BASS-tone-tone rhythm
djembe_pattern = [
    ('C4', BEAT_LONG),   # BASS
    ('F4', BEAT_SHORT),  # tone
    ('F4', BEAT_SHORT),  # tone
    ('C4', BEAT_LONG),   # BASS
    ('G4', BEAT_SHORT),  # slap
    ('G4', BEAT_SHORT),  # slap
]

# Pattern 4: Children's Clapping Game
# Simple repeating pattern for young learners
clapping_pattern = [
    ('G4', BEAT_SHORT),
    ('G4', BEAT_SHORT),
    ('A4', BEAT_SHORT),
    ('A4', BEAT_SHORT),
    ('G4', BEAT_LONG),
]

def demonstrate_patterns():
    """Demonstrate all traditional rhythm patterns."""
    print("\n=== SOUTH AFRICAN RHYTHM PATTERNS ===")
    print("Ubuntu: Music connects us!\n")
    
    # 1. Gumboot Dance
    print("1. Gumboot Dance Pattern (Mining Workers)")
    print("   Pattern: SLAP-SLAP-tap-SLAP")
    for i in range(4):  # Repeat 4 times
        print(f"   Repetition {i+1}...")
        play_pattern(gumboot_pattern)
        sleep(0.5)
    
    sleep(1.5)
    
    # 2. Call and Response
    print("\n2. Mbube/Isicathamiya Call and Response")
    for i in range(3):  # 3 call-response cycles
        print(f"   Call {i+1}...")
        play_pattern(call_pattern, tempo=0.8)
        sleep(0.3)
        print(f"   Response {i+1}...")
        play_pattern(response_pattern, tempo=0.8)
        sleep(0.5)
    
    sleep(1.5)
    
    # 3. Djembe Drum
    print("\n3. Djembe Drum Pattern")
    print("   Pattern: BASS-tone-tone-BASS-slap-slap")
    for i in range(3):  # Repeat 3 times
        print(f"   Repetition {i+1}...")
        play_pattern(djembe_pattern)
        sleep(0.3)
    
    sleep(1.5)
    
    # 4. Children's Clapping Game
    print("\n4. Children's Clapping Game")
    print("   Simple pattern for Foundation Phase learners")
    for i in range(4):  # Repeat 4 times
        print(f"   Repetition {i+1}...")
        play_pattern(clapping_pattern, tempo=1.2)
        sleep(0.2)
    
    print("\n=== DEMONSTRATION COMPLETE ===")
    print("Computational Thinking Concepts:")
    print("- Pattern Recognition: Found repeating elements")
    print("- Loops: Used 'for' to repeat patterns")
    print("- Abstraction: Represented music as code")
    print("- Decomposition: Broke complex rhythms into simple beats")

def create_custom_pattern():
    """Interactive mode - learners can experiment with their own patterns.
    
    This is a simplified version for demonstration.
    In classroom use, add more interactive features!
    """
    print("\n=== CREATE YOUR OWN PATTERN ===")
    print("Playing example custom pattern...\n")
    
    # Example custom pattern combining elements
    custom_pattern = [
        ('C4', BEAT_LONG),
        ('G4', BEAT_SHORT),
        ('G4', BEAT_SHORT),
        ('A4', BEAT_SHORT),
        ('C5', BEAT_LONG),
        ('REST', BEAT_SHORT),
        ('C5', BEAT_SHORT),
        ('A4', BEAT_SHORT),
        ('G4', BEAT_LONG),
    ]
    
    for i in range(2):
        print(f"Playing your pattern... (repetition {i+1})")
        play_pattern(custom_pattern)
        sleep(0.5)
    
    print("\nWell done! You've created a unique rhythm!")
    print("Try changing the notes and durations to make your own pattern.")

# ========== MAIN PROGRAM ==========

def main():
    """Main program - demonstrate traditional patterns then allow exploration."""
    print("\n" + "="*50)
    print("PATTERN MUSIC MAKER - Week 4")
    print("South African Rhythm Patterns")
    print("="*50)
    
    try:
        # Startup sound
        play_note(NOTES['C4'], 0.1)
        play_note(NOTES['G4'], 0.1)
        play_note(NOTES['C5'], 0.2)
        sleep(1)
        
        # Demonstrate traditional patterns
        demonstrate_patterns()
        
        sleep(2)
        
        # Custom pattern exploration
        create_custom_pattern()
        
        sleep(1)
        
        # Closing sound
        play_note(NOTES['C5'], 0.1)
        play_note(NOTES['G4'], 0.1)
        play_note(NOTES['C4'], 0.2)
        
        print("\n" + "="*50)
        print("Thank you for exploring SA musical patterns!")
        print("Ubuntu: I am because we are!")
        print("="*50 + "\n")
        
    except KeyboardInterrupt:
        print("\nProgram stopped by user.")
    finally:
        # Clean up - turn off buzzer
        buzzer.duty_u16(0)
        buzzer.deinit()

# Run the program
if __name__ == "__main__":
    main()

# ========== EXTENSION ACTIVITIES ==========
# Teachers and learners can extend this code:
#
# 1. Add more traditional patterns from your community
# 2. Connect buttons to play different patterns interactively
# 3. Create a "pattern memory game" - play pattern, learner repeats
# 4. Combine multiple buzzers for harmony
# 5. Add LED patterns that sync with the music
# 6. Research and code authentic traditional rhythms from elders
# 7. Create a "rhythm composer" with user input
#
# Remember: Music is a universal language that connects us!
# Ubuntu ngumuntu ngabantu - I am because we are!
