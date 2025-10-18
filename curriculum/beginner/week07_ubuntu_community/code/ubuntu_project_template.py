#!/usr/bin/env python3
"""
Week 7: Ubuntu Community Project Template
SAM LMS - Foundation Phase Physical Computing

This template provides a starting point for Ubuntu community projects.
Students can adapt this code to create solutions that benefit their school community.

Ubuntu: "I am because we are."
"""

import time

# Project Configuration
PROJECT_NAME = "Ubuntu Community Helper"
PROJECT_VERSION = "1.0"

class UbuntuCommunityProject:
    """
    Base class for Ubuntu community projects.
    Emphasizes collaboration, community benefit, and Ubuntu values.
    """
    
    def __init__(self, project_name, team_members):
        self.project_name = project_name
        self.team_members = team_members
        self.start_time = time.time()
    
    def display_welcome(self):
        """Display project welcome message with Ubuntu values."""
        print("\n" + "="*60)
        print(f"🌍 {self.project_name.upper()} 🌍")
        print("A Project by:", ", ".join(self.team_members))
        print("="*60)
        print("\n🌟 Ubuntu: 'I am because we are'")
        print("This project strengthens our community!\n")
    
    def check_community_need(self, need_description):
        """Identify and validate community need."""
        print("\n🔍 COMMUNITY NEED IDENTIFIED:")
        print("-" * 50)
        print(need_description)
        print("-" * 50)
        
        response = input("\nDoes this benefit our community? (yes/no): ").lower()
        if response == "yes":
            print("✅ Great! Let's work together to solve this!")
            return True
        else:
            print("⚠️ Let's reconsider our project focus.")
            return False
    
    def display_ubuntu_values(self):
        """Show how the project embodies Ubuntu values."""
        print("\n\n" + "="*60)
        print("🌱 UBUNTU VALUES IN THIS PROJECT:")
        print("="*60)
        
        values = [
            ("Caring for Others", "Our project helps people in our community"),
            ("Working Together", "Every team member contributes their skills"),
            ("Mutual Support", "We help each other learn and grow"),
            ("Shared Benefit", "Everyone in our school gains from this project"),
            ("Cultural Pride", "We honor our heritage and diversity")
        ]
        
        for i, (value, description) in enumerate(values, 1):
            print(f"\n{i}. {value}:")
            print(f"   {description}")
        
        print("\n" + "="*60)
    
    def run_project_simulation(self):
        """Simple project simulation showing teamwork."""
        print("\n\n" + "="*60)
        print("👥 PROJECT TEAMWORK SIMULATION")
        print("="*60)
        
        tasks = [
            "Planning the project together",
            "Building the prototype",
            "Testing with community members",
            "Gathering feedback",
            "Making improvements",
            "Preparing the presentation"
        ]
        
        print("\nOur team is working through these steps:\n")
        
        for i, task in enumerate(tasks, 1):
            print(f"{i}. {task}...", end=" ")
            time.sleep(0.8)
            print("✓ Complete!")
        
        print("\n✅ All tasks completed through teamwork!")
        print("🌟 Ubuntu made us stronger together!")
    
    def display_project_summary(self):
        """Show project completion summary."""
        elapsed_time = int(time.time() - self.start_time)
        
        print("\n\n" + "="*60)
        print("🎉 PROJECT SUMMARY")
        print("="*60)
        print(f"Project Name: {self.project_name}")
        print(f"Team: {', '.join(self.team_members)}")
        print(f"Time spent: {elapsed_time} seconds")
        print("\nWhat we learned:")
        print("• Ubuntu values strengthen our community")
        print("• Technology can solve real problems")
        print("• Working together makes us all better")
        print("• Everyone's contribution matters")
        print("\n🌟 'I am because we are' - Thank you for making")
        print("   our school community stronger!")
        print("="*60 + "\n")

def example_project_1_multilingual_greeter():
    """Example: Multilingual greeting station for school entrance."""
    print("\n" + "="*60)
    print("👋 EXAMPLE PROJECT 1: MULTILINGUAL GREETER")
    print("="*60)
    print("\nThis project welcomes visitors in multiple languages!")
    print("It celebrates our linguistic diversity and Ubuntu hospitality.\n")
    
    greetings = {
        "English": "Welcome to our school!",
        "isiZulu": "Siyakwamukela esikoleni sethu!",
        "isiXhosa": "Wamkelekile esikolweni sethu!",
        "Afrikaans": "Welkom by ons skool!",
        "Sepedi": "Re a go amogela sekolong sa rena!"
    }
    
    print("🌍 GREETINGS IN MULTIPLE LANGUAGES:")
    print("-" * 50)
    for language, greeting in greetings.items():
        print(f"{language:12} | {greeting}")
        time.sleep(0.5)
    
    print("\n✅ This project shows Ubuntu by making everyone feel welcome!")

def example_project_2_community_helper_alert():
    """Example: Alert system for students who need help."""
    print("\n" + "="*60)
    print("🆘 EXAMPLE PROJECT 2: COMMUNITY HELPER ALERT")
    print("="*60)
    print("\nThis project helps students get support when they need it!")
    print("It embodies Ubuntu by creating a culture of mutual support.\n")
    
    print("💡 HOW IT WORKS:")
    print("-" * 50)
    
    steps = [
        "1. Student presses help button",
        "2. LED light activates",
        "3. Teacher or peer sees the signal",
        "4. Helper comes to assist",
        "5. Problem solved together!"
    ]
    
    for step in steps:
        print(step)
        time.sleep(0.6)
    
    print("\n✅ This project shows Ubuntu by helping each other!")
    print("   No one is alone when we care for our community.")

def main():
    """Main program demonstrating Ubuntu community project concepts."""
    print("\n" + "*"*60)
    print("🌍 WEEK 7: UBUNTU COMMUNITY PROJECT TEMPLATE 🌍")
    print("SAM LMS - Foundation Phase Computing")
    print("*"*60)
    
    # Create sample project
    team = ["Thandi", "Sipho", "Lerato", "Jabu"]
    project = UbuntuCommunityProject(PROJECT_NAME, team)
    
    # Display welcome
    project.display_welcome()
    
    # Check community need
    need = """Our school needs a way to help students feel welcome and supported.
Many learners feel shy or don't know who to ask for help.
We can use technology to create a friendly, supportive environment."""
    
    if project.check_community_need(need):
        # Show Ubuntu values
        project.display_ubuntu_values()
        
        # Run project simulation
        project.run_project_simulation()
        
        # Show examples
        print("\n\n" + "="*60)
        print("💡 PROJECT EXAMPLES FOR INSPIRATION")
        print("="*60)
        
        input("\nPress Enter to see Example 1...")
        example_project_1_multilingual_greeter()
        
        input("\nPress Enter to see Example 2...")
        example_project_2_community_helper_alert()
        
        # Display summary
        project.display_project_summary()
        
        # Final message
        print("\n" + "*"*60)
        print("YOUR TURN!")
        print("*"*60)
        print("\nNow it's time to create YOUR Ubuntu community project!")
        print("\nRemember:")
        print("• Focus on helping your community")
        print("• Work together as a team")
        print("• Use Ubuntu values as your guide")
        print("• Make everyone feel included")
        print("• Celebrate your success together!")
        print("\n🌟 'I am because we are' - Go make a difference!")
        print("*"*60 + "\n")

if __name__ == "__main__":
    main()

"""
Adaptation Guide for Teachers:

1. Hardware Integration:
   - Add sensor reading code (temperature, distance, motion, etc.)
   - Add output code (LEDs, displays, speakers, etc.)
   - Connect physical buttons or switches

2. Project Customization:
   - Modify greetings for your school's languages
   - Add specific community needs from your context
   - Include local cultural elements

3. Assessment Opportunities:
   - Team collaboration and roles
   - Problem-solving process
   - Ubuntu values demonstration
   - Technical implementation
   - Community benefit and feedback

4. Extension Ideas:
   - Connect to actual school systems
   - Create permanent installations
   - Design user training materials
   - Present at school assemblies
   - Share with other schools

Remember: The best Ubuntu projects come from listening to your
community and working together to create real solutions!
"""
