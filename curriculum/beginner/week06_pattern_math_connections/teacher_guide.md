# Week 06 Teacher Guide — Pattern Maths & Coding

## Overview
- **CT Pillars:** Abstraction, algorithm design
- **CAPS Links:** Mathematics (repeating patterns, number sense), Languages (descriptive writing)
- **Duration:** 2 × 35-minute sessions
- **Summary:** Learners convert beadwork patterns into simple code loops, write descriptions using mathematical vocabulary, and explore how algorithms repeat instructions.

## Learning Objectives
1. Represent a repeating colour pattern as a sequence of instructions.
2. Use loops (for range) or functions to automate repeating patterns in CircuitPython.
3. Explain the rule of the pattern using mathematics vocabulary (AB, ABB, etc.).
4. Reflect on how algorithms help repeat tasks accurately.

## Materials
- Circuit Playground Express with `pattern_loops.py`
- Whiteboard markers for loop notation
- Sentence stems for describing pattern rules
- Comparison chart: manual vs looped code snippets

## Session Flow
### Session 1: From Pattern to Rule
1. **Hook (5 min):** Show two light patterns; ask which is easier to describe.
2. **Mini-Lesson (10 min):** Introduce concept of loops using body percussion.
3. **Small Group Practice (15 min):** Learners label pattern unit and write rule (“Repeat red, black twice”).
4. **Share (5 min):** Volunteers read rules aloud.

### Session 2: Code the Loop
1. **Review (5 min):** Compare manual vs loop code on projector.
2. **Coding Workshop (20 min):** Learners edit template to include their pattern unit and repetition count.
3. **Gallery Walk (7 min):** Observe other patterns; identify rule posted nearby.
4. **Exit Ticket (3 min):** “My algorithm helps by…” sentence strip.

## Differentiation
- Provide pre-filled loop with blanks for colour tuples.
- Offer challenge to nest two loops (e.g., alternating between two units).

## Troubleshooting
- Ensure indentation remains consistent.
- If loop never ends, add `time.sleep` and `clear` function.

## Assessment
- Collect pattern rule sentences.
- Quick oral check: “What would happen if we change the repeat number?”

## Resources
- Code template: `code/pattern_loops.py`
- Pattern rule stems: `assets/pattern_rule_cards.pdf`
- Manual vs loop comparison: `assets/algorithm_compare.png`
