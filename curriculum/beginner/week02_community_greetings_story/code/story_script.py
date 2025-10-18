#!/usr/bin/env python3
"""
Community Greetings Story Script
Week 02 - Beginner Curriculum
SAM LMS Physical Computing Programme

This script demonstrates storytelling with multilingual greetings
using South African languages. It can be adapted for:
- Text-to-speech output
- LED/light displays with greetings
- Button-triggered story sequences
- Raspberry Pi Pico physical computing projects

Cultural Connection: Ubuntu philosophy - "I am because we are"
Computational Thinking: Decomposition, Sequencing, Pattern Recognition
"""

import time

# Story data structure (Decomposition)
story_scenes = [
    {
        "scene_number": 1,
        "character": "Thabo",
        "location": "Walking to community center",
        "greeting": "Sawubona, Gogo!",
        "language": "isiZulu",
        "translation": "Hello, Grandmother!",
        "response": "Yebo, Thabo! Unjani?",
        "response_translation": "Yes, Thabo! How are you?"
    },
    {
        "scene_number": 2,
        "character": "Lebo",
        "location": "Playing outside",
        "greeting": "Dumela, Lebo!",
        "language": "Sepedi",
        "translation": "Hello, Lebo!",
        "response": "Dumela! O kae?",
        "response_translation": "Hello! Where are you going?"
    },
    {
        "scene_number": 3,
        "character": "Mr. Botha",
        "location": "The shop corner",
        "greeting": "Goeie môre, Meneer Botha!",
        "language": "Afrikaans",
        "translation": "Good morning, Mr. Botha!",
        "response": "Goeie môre, kinders!",
        "response_translation": "Good morning, children!"
    },
    {
        "scene_number": 4,
        "character": "Ms. Khumalo",
        "location": "Community center",
        "greeting": "Molweni, Ms. Khumalo!",
        "language": "isiXhosa",
        "translation": "Hello, Ms. Khumalo!",
        "response": "Molweni, children!",
        "response_translation": "Hello, children!"
    }
]

def display_scene(scene):
    """
    Display a story scene with greeting and response.
    Pattern Recognition: Each scene follows the same structure.
    """
    print(f"\n{'='*60}")
    print(f"Scene {scene['scene_number']}: Meeting {scene['character']}")
    print(f"Location: {scene['location']}")
    print(f"{'='*60}")
    
    # Greeting
    print(f"\n👋 Greeting: {scene['greeting']}")
    print(f"   Language: {scene['language']}")
    print(f"   Translation: {scene['translation']}")
    
    time.sleep(1)  # Pause for effect
    
    # Response
    print(f"\n💬 Response: {scene['response']}")
    print(f"   Translation: {scene['response_translation']}")
    
    time.sleep(1)

def play_story():
    """
    Play the complete story using sequencing.
    Sequencing: Scenes happen in order.
    """
    print("\n" + "*" * 60)
    print("   THE MORNING WALK - A Community Greetings Story")
    print("   Demonstrating Ubuntu: 'I am because we are'")
    print("*" * 60)
    
    # Sequence through all scenes
    for scene in story_scenes:
        display_scene(scene)
    
    # Story conclusion
    print("\n" + "=" * 60)
    print("THE END")
    print("=" * 60)
    print("\n🌟 By greeting everyone with respect, we build community!")
    print("🌍 Ubuntu: I am because we are.\n")

def display_languages_used():
    """
    Show all languages used in the story.
    Abstraction: Extract key information.
    """
    print("\n📚 Languages featured in this story:")
    languages = set(scene['language'] for scene in story_scenes)
    for lang in sorted(languages):
        print(f"   • {lang}")
    print()

def interactive_mode():
    """
    Allow user to navigate scenes interactively.
    Could be adapted for button presses on Raspberry Pi Pico.
    """
    print("\n" + "*" * 60)
    print("   INTERACTIVE STORY MODE")
    print("*" * 60)
    
    for scene in story_scenes:
        input(f"\nPress ENTER to see Scene {scene['scene_number']}...")
        display_scene(scene)
    
    print("\n🎉 Story complete!\n")

# Main program
if __name__ == "__main__":
    print("\n" + "#" * 60)
    print("#  Community Greetings Story Script")
    print("#  SAM LMS Week 02 - Beginner Curriculum")
    print("#" * 60)
    
    # Display languages first
    display_languages_used()
    
    # Ask user for mode
    print("Choose a mode:")
    print("1. Auto-play story (with pauses)")
    print("2. Interactive mode (press ENTER between scenes)")
    
    choice = input("\nEnter 1 or 2: ")
    
    if choice == "2":
        interactive_mode()
    else:
        play_story()
    
    print("\n💡 Computational Thinking Concepts Used:")
    print("   • Decomposition: Story broken into scenes")
    print("   • Sequencing: Scenes play in order")
    print("   • Pattern Recognition: Each scene follows same structure")
    print("   • Abstraction: Story data separated from display logic")
    print("\n🌈 This script celebrates South African multilingualism!\n")
