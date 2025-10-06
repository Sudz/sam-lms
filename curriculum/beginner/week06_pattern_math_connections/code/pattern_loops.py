import time
import board
import neopixel


pixels = neopixel.NeoPixel(board.NEOPIXEL, 10, brightness=0.25)


pattern_unit = [
    (255, 0, 0),
    (0, 0, 0),
    (255, 0, 0),
    (0, 0, 0),
]

repeat_count = 3


def show_unit(unit) -> None:
    for colour in unit:
        pixels.fill(colour)
        time.sleep(0.4)


while True:
    for _ in range(repeat_count):
        show_unit(pattern_unit)
    pixels.fill((0, 0, 0))
    time.sleep(1)
