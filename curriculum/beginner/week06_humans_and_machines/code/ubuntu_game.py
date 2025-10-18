"""Ubuntu Community Helper Game - Week 6
Interactive Human-Machine Collaboration

This program demonstrates human-computer interaction through an interactive
game where humans and machines work together following Ubuntu values.

Learning Objectives:
- Understanding input (buttons) and output (LEDs, sounds)
- Event-driven programming (responding to user actions)
- Creating interactive, user-friendly interfaces
- Connecting technology to Ubuntu values of community service

Hardware Setup:
- Raspberry Pi Pico
- 3 Push buttons (GPIO 16, 17, 18) - for choosing actions
- 3 LEDs (GPIO 19, 20, 21) - for feedback (green, yellow, red)
- Buzzer (GPIO 15) - for audio feedback
- Ground and resistors as needed

Ubuntu Connection: Technology serves the community!
"""

from machine import Pin, PWM
import time

# ========== HARDWARE SETUP ==========

# Input buttons
button_help = Pin(16, Pin.IN, Pin.PULL_DOWN)  # Help neighbor
button_share = Pin(17, Pin.IN, Pin.PULL_DOWN)  # Share resources
button_teach = Pin(18, Pin.IN, Pin.PULL_DOWN)  # Teach others

# Output LEDs
led_good = Pin(19, Pin.OUT)    # Green - good choice
led_ok = Pin(20, Pin.OUT)      # Yellow - okay choice
led_wait = Pin(21, Pin.OUT)    # Red - wait/thinking

# Output buzzer
buzzer = PWM(Pin(15))

# ========== GAME DATA ==========

ubuntu_score = 0

scenarios = [
    {
        'description': 'Gogo needs help carrying water',
        'help': {'points': 10, 'message': 'You helped! Ubuntu spirit!'},
        'share': {'points': 5, 'message': 'You offered supplies. Good!'},
        'teach': {'points': 3, 'message': 'Teaching is good, but direct help better here.'}
    },
    {
        'description': 'Children want to learn coding',
        'help': {'points': 5, 'message': 'Helping is good!'},
        'share': {'points': 7, 'message': 'Sharing knowledge matters!'},
        'teach': {'points': 10, 'message': 'Teaching empowers! Ubuntu!'}  
    },
    {
        'description': 'Community garden needs tools',
        'help': {'points': 7, 'message': 'Your help makes difference!'},
        'share': {'points': 10, 'message': 'Sharing tools strengthens community!'},
        'teach': {'points': 5, 'message': 'Teaching is good, but sharing tools needed now.'}
    }
]

# ========== SOUND FUNCTIONS ==========

def play_tone(frequency, duration):
    """Play a tone at given frequency for duration."""
    if frequency > 0:
        buzzer.freq(frequency)
        buzzer.duty_u16(1000)
        time.sleep(duration)
    buzzer.duty_u16(0)

def sound_startup():
    """Welcoming startup sound."""
    play_tone(523, 0.1)  # C
    play_tone(659, 0.1)  # E
    play_tone(784, 0.15) # G

def sound_success():
    """Happy success sound."""
    play_tone(784, 0.1)
    play_tone(1047, 0.15)

def sound_thinking():
    """Machine thinking sound."""
    play_tone(440, 0.05)
    play_tone(494, 0.05)

# ========== LED FEEDBACK ==========

def flash_led(led, times=3):
    """Flash an LED multiple times."""
    for _ in range(times):
        led.on()
        time.sleep(0.1)
        led.off()
        time.sleep(0.1)

def show_thinking():
    """Show machine is processing."""
    led_wait.on()
    sound_thinking()
    time.sleep(0.5)
    led_wait.off()

def show_result(points):
    """Display result based on points earned."""
    if points >= 8:
        flash_led(led_good, 4)
        sound_success()
    elif points >= 5:
        flash_led(led_ok, 3)
        play_tone(659, 0.15)
    else:
        flash_led(led_wait, 2)
        play_tone(392, 0.15)

# ========== GAME FUNCTIONS ==========

def display_scenario(scenario_num, scenario):
    """Display scenario to user."""
    print(f"\n{'='*50}")
    print(f"SCENARIO {scenario_num}: {scenario['description']}")
    print("='*50)")
    print("\nWhat will you do?")
    print("  [Button 1] HELP directly")
    print("  [Button 2] SHARE resources")
    print("  [Button 3] TEACH skills")
    print("\nMake your choice...")

def wait_for_choice():
    """Wait for user to press a button.
    
    This demonstrates EVENT-DRIVEN PROGRAMMING:
    The machine waits and responds to human actions.
    
    Returns:
        str: 'help', 'share', or 'teach'
    """
    print("Waiting for your choice...")
    
    while True:
        if button_help.value() == 1:
            time.sleep(0.2)  # Debounce
            return 'help'
        elif button_share.value() == 1:
            time.sleep(0.2)
            return 'share'
        elif button_teach.value() == 1:
            time.sleep(0.2)
            return 'teach'
        time.sleep(0.05)

def process_choice(choice, scenario):
    """Process the user's choice and give feedback.
    
    This demonstrates INPUT-PROCESS-OUTPUT:
    - INPUT: User pressed button
    - PROCESS: Determine result based on scenario
    - OUTPUT: LED feedback, sound, score update
    
    Args:
        choice: 'help', 'share', or 'teach'
        scenario: Dictionary with scenario data
        
    Returns:
        int: Points earned
    """
    global ubuntu_score
    
    # Show machine is thinking
    print("\n🤔 Machine is processing your choice...")
    show_thinking()
    
    # Get result
    result = scenario[choice]
    points = result['points']
    message = result['message']
    
    # Update score
    ubuntu_score += points
    
    # Display result
    print(f"\n✨ {message}")
    print(f"🌟 Points earned: {points}")
    print(f"💯 Total Ubuntu Score: {ubuntu_score}")
    
    # Visual and audio feedback
    show_result(points)
    
    return points

def run_game():
    """Main game loop."""
    global ubuntu_score
    
    print("\n" + "*"*60)
    print("UBUNTU COMMUNITY HELPER GAME")
    print("Humans and Machines Working Together")
    print("*"*60)
    print("\n🌍 Ubuntu ngumuntu ngabantu - I am because we are")
    print("\nHelp your community by making good choices!")
    
    # Startup animation
    sound_startup()
    flash_led(led_good, 2)
    flash_led(led_ok, 2)
    flash_led(led_wait, 2)
    
    time.sleep(2)
    
    # Play through scenarios
    for i, scenario in enumerate(scenarios, 1):
        display_scenario(i, scenario)
        
        # Wait for human input (INPUT)
        choice = wait_for_choice()
        print(f"\nYou chose: {choice.upper()}")
        
        # Process and respond (PROCESS + OUTPUT)
        process_choice(choice, scenario)
        
        time.sleep(2)
    
    # Game complete
    print("\n" + "="*60)
    print("GAME COMPLETE!")
    print("="*60)
    print(f"\n🌟 Final Ubuntu Score: {ubuntu_score}/30 points")
    
    # Final feedback based on total score
    if ubuntu_score >= 25:
        print("\n⭐⭐⭐ UBUNTU CHAMPION! ⭐⭐⭐")
        print("You showed excellent community spirit!")
        flash_led(led_good, 5)
        for _ in range(3):
            sound_success()
            time.sleep(0.1)
    elif ubuntu_score >= 18:
        print("\n✨ UBUNTU HELPER! ✨")
        print("You made good choices for the community!")
        flash_led(led_ok, 4)
        sound_success()
    else:
        print("\n🌱 UBUNTU LEARNER")
        print("Keep practicing Ubuntu values!")
        flash_led(led_wait, 3)
    
    print("\n📚 COMPUTATIONAL THINKING CONCEPTS:")
    print("   • INPUT: You pressed buttons to make choices")
    print("   • PROCESS: Machine analyzed your choices")
    print("   • OUTPUT: Machine gave feedback with LEDs and sounds")
    print("   • EVENT-DRIVEN: Program waited for and responded to your actions")
    
    print("\n🌍 UBUNTU VALUES:")
    print("   Humans and machines work best when they work TOGETHER")
    print("   Technology should SERVE the community")
    print("   We are STRONGER when we help each other")
    print("   Ubuntu ngumuntu ngabantu - I am because we are!")
    print("\n" + "*"*60 + "\n")

# ========== MAIN PROGRAM ==========

try:
    run_game()
except KeyboardInterrupt:
    print("\n\nGame stopped by user.")
    print("Thank you for playing!")
finally:
    # Clean up - turn everything off
    led_good.off()
    led_ok.off()
    led_wait.off()
    buzzer.duty_u16(0)
    buzzer.deinit()

# ========== EXTENSION IDEAS ==========
# Teachers and learners can extend this:
# 1. Add more scenarios from your community
# 2. Create difficulty levels (easy/medium/hard)
# 3. Add timer for quick decision-making
# 4. Include display showing score in real-time
# 5. Create multiplayer mode (taking turns)
# 6. Add sound effects in local languages
# 7. Design custom scenarios about local issues
# 8. Create accessibility modes (larger buttons, audio prompts)
#
# Remember: Ubuntu ngumuntu ngabantu!
# Technology serves humanity when we work together! 🌍🤝
