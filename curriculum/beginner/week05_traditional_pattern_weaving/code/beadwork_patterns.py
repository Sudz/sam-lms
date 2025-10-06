import time
import board
import neopixel


pixels = neopixel.NeoPixel(board.NEOPIXEL, 10, brightness=0.3, auto_write=False)


ZULU_PATTERNS = [
    [(255, 0, 0), (0, 0, 0)] * 5,
    [(0, 255, 0), (255, 255, 0)] * 5,
    [(255, 0, 0), (255, 255, 255), (0, 0, 0), (255, 255, 255), (255, 0, 0)] * 2,
]

NDEBELE_PATTERNS = [
    [(0, 0, 255), (255, 255, 0)] * 5,
    [(255, 0, 0), (0, 0, 255), (255, 255, 255), (0, 0, 255), (255, 0, 0)] * 2,
]

ALL_PATTERNS = ZULU_PATTERNS + NDEBELE_PATTERNS


def show_pattern(pattern, pause=0.5) -> None:
    for index, colour in enumerate(pattern[:10]):
        pixels[index] = colour
    pixels.show()
    time.sleep(pause)


def clear_pixels() -> None:
    pixels.fill((0, 0, 0))
    pixels.show()


pattern_index = 0

while True:
    show_pattern(ALL_PATTERNS[pattern_index])
    time.sleep(1)
    clear_pixels()
    time.sleep(0.5)
    pattern_index = (pattern_index + 1) % len(ALL_PATTERNS)
