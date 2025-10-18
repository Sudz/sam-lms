#!/usr/bin/env python3
"""
Week 6: My First Algorithm
SAM LMS - Foundation Phase Physical Computing

This program teaches students about algorithms through interactive examples.
Students learn sequencing, decision-making, and problem-solving.

Ubuntu: "I am because we are." Algorithms are stronger when we create them together.
"""

import time

# Multilingual greetings
GREETINGS = {
    "morning": {"en": "Good morning!", "zu": "Sawubona ekuseni!", "af": "Goeiemôre!"},
    "afternoon": {"en": "Good afternoon!", "zu": "Sawubona ntambama!", "af": "Goeie middag!"},
    "evening": {"en": "Good evening!", "zu": "Sawubona kusihlwa!", "af": "Goeie aand!"}
}

def greeting_algorithm():
    """Simple greeting algorithm with time-based decision making."""
    print("\n" + "="*50)
    print("👋 ALGORITHM 1: GREETING HELPER")
    print("="*50)
    
    print("\nThis algorithm helps you greet someone correctly!\n")
    
    # Get time of day from user
    print("What time is it?")
    print("1. Morning (before 12:00)")
    print("2. Afternoon (12:00 - 18:00)")
    print("3. Evening (after 18:00)")
    
    choice = input("\nEnter 1, 2, or 3: ")
    
    # Algorithm steps with IF-THEN logic
    print("\n🤖 ALGORITHM STEPS:")
    print("-" * 40)
    
    if choice == "1":
        time_period = "morning"
        print("Step 1: Time is BEFORE 12:00")
        print("Step 2: Time period = MORNING")
    elif choice == "2":
        time_period = "afternoon"
        print("Step 1: Time is BETWEEN 12:00 and 18:00")
        print("Step 2: Time period = AFTERNOON")
    else:
        time_period = "evening"
        print("Step 1: Time is AFTER 18:00")
        print("Step 2: Time period = EVENING")
    
    print(f"Step 3: Choose greeting for {time_period}")
    print("Step 4: Display greeting in 3 languages")
    print("Step 5: END\n")
    
    # Display multilingual greetings
    greetings = GREETINGS[time_period]
    print("\n🌍 MULTILINGUAL GREETING:")
    print("-" * 40)
    print(f"English: {greetings['en']}")
    print(f"isiZulu: {greetings['zu']}")
    print(f"Afrikaans: {greetings['af']}")

def helping_friend_algorithm():
    """Ubuntu-based helping algorithm."""
    print("\n" + "="*50)
    print("🤝 ALGORITHM 2: UBUNTU FRIEND HELPER")
    print("="*50)
    
    print("\nThis algorithm shows how to help a friend!\n")
    
    # Step 1: Observe
    print("🤖 ALGORITHM STEPS:")
    print("-" * 40)
    print("Step 1: OBSERVE your friend")
    
    friend_status = input("\nDoes your friend look sad or need help? (yes/no): ").lower()
    
    if friend_status == "yes":
        print("Step 2: Friend needs help = TRUE")
        print("Step 3: Ask 'Are you okay? Can I help?'")
        
        wants_help = input("\nDoes your friend say yes? (yes/no): ").lower()
        
        if wants_help == "yes":
            print("Step 4: Friend wants help = TRUE")
            print("Step 5: LISTEN carefully")
            print("Step 6: OFFER help")
            print("\n❤️ You showed Ubuntu by helping your friend!")
        else:
            print("Step 4: Friend wants help = FALSE")
            print("Step 5: Say 'I'm here if you need me'")
            print("\n💛 You showed Ubuntu by being supportive!")
    else:
        print("Step 2: Friend needs help = FALSE")
        print("Step 3: Stay nearby and friendly")
        print("\n💚 You showed Ubuntu by being present!")
    
    print("Step FINAL: END")
    print("\n🌟 Ubuntu Principle: 'I am because we are'")
    print("Caring for our friends makes our community stronger!")

def pattern_algorithm():
    """Simple repeating pattern algorithm."""
    print("\n" + "="*50)
    print("🔁 ALGORITHM 3: PATTERN MAKER")
    print("="*50)
    
    print("\nThis algorithm creates repeating patterns!\n")
    
    # Get pattern details
    symbol = input("Choose a symbol (* or # or ♥): ")
    repeats = int(input("How many times to repeat? (1-10): "))
    
    print("\n🤖 ALGORITHM STEPS:")
    print("-" * 40)
    print("Step 1: GET symbol from user")
    print(f"        Symbol = {symbol}")
    print("Step 2: GET number of repeats")
    print(f"        Repeats = {repeats}")
    print("Step 3: SET counter = 0")
    print(f"Step 4: WHILE counter < {repeats}:")
    print("           PRINT symbol")
    print("           ADD 1 to counter")
    print("           REPEAT")
    print("Step 5: END")
    
    # Execute the pattern
    print("\n🎨 YOUR PATTERN:")
    print("-" * 40)
    for i in range(repeats):
        print(f"{i+1}. {symbol}")
        time.sleep(0.3)
    
    print("\n✓ Pattern complete!")

def sequence_algorithm():
    """Demonstrate proper sequencing in algorithms."""
    print("\n" + "="*50)
    print("📋 ALGORITHM 4: MAKING TEA (SEQUENCE)")
    print("="*50)
    
    print("\nThis shows why ORDER matters in algorithms!\n")
    
    # Correct sequence
    print("✅ CORRECT SEQUENCE:")
    print("-" * 40)
    steps = [
        "1. Boil water",
        "2. Put teabag in cup",
        "3. Pour hot water into cup",
        "4. Wait for tea to brew",
        "5. Remove teabag",
        "6. Add milk and sugar (optional)",
        "7. Stir",
        "8. Enjoy your tea!"
    ]
    
    for step in steps:
        print(step)
        time.sleep(0.5)
    
    print("\n✓ Perfect tea!")
    
    # Wrong sequence example
    print("\n\n❌ WRONG SEQUENCE (What happens?)")
    print("-" * 40)
    wrong_steps = [
        "1. Put teabag in cup",
        "2. Add milk",
        "3. Pour hot water",
        "4. Oops! Milk is too hot and might spill!"
    ]
    
    for step in wrong_steps:
        print(step)
        time.sleep(0.5)
    
    print("\n💡 LESSON: The ORDER of steps matters!")
    print("This is called SEQUENCING in algorithms.")

def main():
    """Main program with menu."""
    print("\n" + "*"*60)
    print("🌍 WEEK 6: MY FIRST ALGORITHM 🌍")
    print("SAM LMS - Foundation Phase Computing")
    print("Ubuntu: Algorithms are stronger when we create them together!")
    print("*"*60)
    
    while True:
        print("\n" + "="*50)
        print("CHOOSE AN ALGORITHM TO RUN:")
        print("="*50)
        print("1. Greeting Helper (Decision Making)")
        print("2. Ubuntu Friend Helper (IF-THEN Logic)")
        print("3. Pattern Maker (LOOPS)")
        print("4. Making Tea (SEQUENCING)")
        print("5. Exit")
        
        choice = input("\nEnter your choice (1-5): ")
        
        if choice == "1":
            greeting_algorithm()
        elif choice == "2":
            helping_friend_algorithm()
        elif choice == "3":
            pattern_algorithm()
        elif choice == "4":
            sequence_algorithm()
        elif choice == "5":
            print("\n" + "*"*60)
            print("🌟 THANK YOU FOR LEARNING ALGORITHMS! 🌟")
            print("\nRemember:")
            print("• Algorithms are step-by-step instructions")
            print("• ORDER matters (sequencing)")
            print("• We use IF-THEN for decisions")
            print("• We use LOOPS for repetition")
            print("\nUbuntu: 'I am because we are'")
            print("Our algorithms help our community!")
            print("*"*60)
            break
        else:
            print("\n⚠️ Invalid choice. Please enter 1-5.")

if __name__ == "__main__":
    main()

"""
Learning Objectives:
- Sequencing: Steps must be in the correct order
- Decision Making: Using IF-THEN-ELSE logic
- Loops: Repeating actions multiple times
- Pattern Recognition: Identifying repeating structures
- Ubuntu Values: Algorithms that help our community

CAPS Connections:
- Mathematics: Logical reasoning, patterns, sequences
- Languages: Following instructions, procedural text
- Life Skills: Problem-solving, helping others

Differentiation:
- Emerging: Run programs, follow along, answer simple questions
- Advancing: Modify code, create own algorithms, add new features
"""
