#!/usr/bin/env python3
"""
Week 5: Mapping Our School
SAM LMS - Foundation Phase Physical Computing

This program helps students create digital maps of their school using
sensor measurements and coordinate systems. It demonstrates abstraction,
pattern recognition, and spatial awareness.

Ubuntu Connection: "Our school is our shared home. Understanding and
caring for all its spaces strengthens our community and sense of belonging."

Hardware Requirements:
- Raspberry Pi Pico (optional - can run on regular Python)
- Ultrasonic distance sensor HC-SR04 (optional)
- Paper and pencils for initial sketches
"""

import time
try:
    import machine  # For Raspberry Pi Pico
    PICO_AVAILABLE = True
except ImportError:
    PICO_AVAILABLE = False
    print("Running in simulation mode (no Pico hardware)")

# School spaces with multilingual names
SCHOOL_SPACES = {
    "classroom": {"en": "Classroom", "zu": "Igumbi Lokufunda", "af": "Klaskamer", "symbol": "□"},
    "office": {"en": "Office", "zu": "Ihhovisi", "af": "Kantoor", "symbol": "▣"},
    "playground": {"en": "Playground", "zu": "Indawo Yokudlala", "af": "Speelterrein", "symbol": "○"},
    "library": {"en": "Library", "zu": "Umtapo Wezincwadi", "af": "Biblioteek", "symbol": "◊"},
    "entrance": {"en": "Entrance", "zu": "Umnyango", "af": "Ingang", "symbol": "△"}
}

class SchoolMapper:
    """Simple school mapping system using coordinates and measurements."""
    
    def __init__(self):
        self.map_data = []
        self.grid_size = 10  # 10x10 grid
        
    def add_space(self, name, x, y, space_type):
        """Add a space to the school map."""
        space_info = SCHOOL_SPACES.get(space_type, SCHOOL_SPACES["classroom"])
        
        self.map_data.append({
            "name": name,
            "x": x,
            "y": y,
            "type": space_type,
            "symbol": space_info["symbol"],
            "multilingual": space_info
        })
        
        print(f"\n✓ Added: {name}")
        print(f"  Location: ({x}, {y})")
        print(f"  Type: {space_info['en']} | {space_info['zu']} | {space_info['af']}")
        print(f"  Symbol: {space_info['symbol']}")
    
    def display_map(self):
        """Display the school map in ASCII format."""
        print("\n" + "="*50)
        print("🏫 SCHOOL MAP - IBALAZWE LESIKOLE - SKOOLKAART 🏫")
        print("="*50)
        
        # Create empty grid
        grid = [[" " for _ in range(self.grid_size)] for _ in range(self.grid_size)]
        
        # Place spaces on grid
        for space in self.map_data:
            x, y = space["x"], space["y"]
            if 0 <= x < self.grid_size and 0 <= y < self.grid_size:
                grid[y][x] = space["symbol"]
        
        # Display grid with coordinates
        print("\n  ", end="")
        for x in range(self.grid_size):
            print(f"{x} ", end="")
        print()
        
        for y in range(self.grid_size):
            print(f"{y} ", end="")
            for x in range(self.grid_size):
                print(f"{grid[y][x]} ", end="")
            print()
        
        # Display legend
        print("\n" + "-"*50)
        print("LEGEND - UMFANEKISO - LEGENDE:")
        print("-"*50)
        displayed_types = set()
        for space in self.map_data:
            space_type = space["type"]
            if space_type not in displayed_types:
                ml = space["multilingual"]
                print(f"{space['symbol']} = {ml['en']} | {ml['zu']} | {ml['af']}")
                displayed_types.add(space_type)
        
        # Display list of spaces
        print("\n" + "-"*50)
        print("SPACES IN OUR SCHOOL:")
        print("-"*50)
        for i, space in enumerate(self.map_data, 1):
            print(f"{i}. {space['name']} at ({space['x']}, {space['y']})")
    
    def measure_distance(self, space1_idx, space2_idx):
        """Calculate simple distance between two spaces."""
        if space1_idx >= len(self.map_data) or space2_idx >= len(self.map_data):
            print("Invalid space numbers!")
            return
        
        space1 = self.map_data[space1_idx]
        space2 = self.map_data[space2_idx]
        
        # Manhattan distance (grid-based)
        distance = abs(space1["x"] - space2["x"]) + abs(space1["y"] - space2["y"])
        
        print(f"\n📍 Distance from {space1['name']} to {space2['name']}:")
        print(f"   {distance} grid units")
        print(f"   Pattern: Move {abs(space1['x'] - space2['x'])} steps horizontally")
        print(f"           Move {abs(space1['y'] - space2['y'])} steps vertically")

def demo_mapping():
    """Demonstrate school mapping with sample data."""
    print("\n" + "*"*60)
    print("🌍 WEEK 5: MAPPING OUR SCHOOL 🌍")
    print("Ubuntu: Our school is our shared home")
    print("*"*60)
    
    mapper = SchoolMapper()
    
    print("\n📋 Let's map our school together!")
    print("We'll start with a few key spaces...\n")
    
    # Add sample spaces
    time.sleep(0.5)
    mapper.add_space("Grade R Classroom", 2, 2, "classroom")
    time.sleep(0.5)
    mapper.add_space("Principal's Office", 7, 2, "office")
    time.sleep(0.5)
    mapper.add_space("Main Playground", 5, 7, "playground")
    time.sleep(0.5)
    mapper.add_space("School Library", 2, 5, "library")
    time.sleep(0.5)
    mapper.add_space("Main Entrance", 5, 1, "entrance")
    
    # Display the complete map
    time.sleep(1)
    mapper.display_map()
    
    # Show distance calculation
    time.sleep(1)
    print("\n" + "="*50)
    print("COMPUTATIONAL THINKING: PATTERN RECOGNITION")
    print("="*50)
    mapper.measure_distance(0, 3)  # From classroom to library
    
    # Ubuntu reflection
    print("\n" + "="*50)
    print("🌟 UBUNTU REFLECTION:")
    print("="*50)
    print("Every space in our school has a purpose.")
    print("Every space connects us as a community.")
    print("When we understand our school, we understand our Ubuntu.")
    print("\n'I am because we are' - Our school is our shared home.")
    print("="*50)

def interactive_mode():
    """Allow students to create their own map interactively."""
    print("\n🏭 INTERACTIVE SCHOOL MAPPING MODE 🏭")
    print("Create your own school map!\n")
    
    mapper = SchoolMapper()
    
    while True:
        print("\nWhat would you like to do?")
        print("1. Add a space to the map")
        print("2. Display the current map")
        print("3. Measure distance between spaces")
        print("4. Exit")
        
        choice = input("\nEnter choice (1-4): ").strip()
        
        if choice == "1":
            name = input("Space name: ")
            x = int(input("X coordinate (0-9): "))
            y = int(input("Y coordinate (0-9): "))
            print("\nSpace types:")
            for i, (key, value) in enumerate(SCHOOL_SPACES.items(), 1):
                print(f"{i}. {value['en']} ({key})")
            space_type = input("Enter space type: ").strip().lower()
            mapper.add_space(name, x, y, space_type)
        
        elif choice == "2":
            mapper.display_map()
        
        elif choice == "3":
            if len(mapper.map_data) < 2:
                print("Add at least 2 spaces first!")
            else:
                mapper.display_map()
                idx1 = int(input("First space number: ")) - 1
                idx2 = int(input("Second space number: ")) - 1
                mapper.measure_distance(idx1, idx2)
        
        elif choice == "4":
            print("\n🌟 Thank you for mapping our school!")
            print("Ubuntu: Understanding our spaces brings us together.")
            break

if __name__ == "__main__":
    # Run demo first
    demo_mapping()
    
    # Then offer interactive mode
    print("\n" + "*"*60)
    response = input("\nWould you like to create your own map? (yes/no): ").strip().lower()
    if response in ["yes", "y"]:
        interactive_mode()
    else:
        print("\n🌟 Ubuntu: Our school connects us all! 🌟")

"""
CAPS Connections:
- Mathematics: Coordinates, measurement, distance
- Life Skills: Spatial awareness, community understanding
- Languages: Multilingual vocabulary (isiZulu, English, Afrikaans)

Computational Thinking:
- Abstraction: Representing real spaces with symbols and coordinates
- Pattern Recognition: Identifying spatial relationships
- Decomposition: Breaking down school into individual spaces
- Data Representation: Using grids and coordinates

Differentiation:
- Emerging: Focus on 3-4 main spaces with teacher support
- Advancing: Add more spaces, calculate multiple distances, create digital versions
"""
