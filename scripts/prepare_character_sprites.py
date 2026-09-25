from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

from PIL import Image
from PIL import ImageFilter


def color_distance_squared(left: tuple[int, ...], right: tuple[int, ...]) -> int:
    return sum((left[index] - right[index]) ** 2 for index in range(3))


def remove_smooth_backdrop(
    source: Path,
    destination: Path,
    columns: int,
    rows: int,
    threshold: int = 15,
) -> None:
    image = Image.open(source).convert("RGBA")
    if image.width % columns or image.height % rows:
        raise ValueError(f"{source.name} does not divide into {columns}x{rows}")

    cell_width = image.width // columns
    cell_height = image.height // rows
    pixels = image.load()
    threshold_squared = threshold * threshold

    for row in range(rows):
        for column in range(columns):
            origin_x = column * cell_width
            origin_y = row * cell_height
            background = bytearray(cell_width * cell_height)
            queue: deque[tuple[int, int]] = deque()

            def add_seed(x: int, y: int) -> None:
                index = y * cell_width + x
                if background[index]:
                    return
                background[index] = 1
                queue.append((x, y))

            for x in range(cell_width):
                add_seed(x, 0)
                add_seed(x, cell_height - 1)
            for y in range(1, cell_height - 1):
                add_seed(0, y)
                add_seed(cell_width - 1, y)

            while queue:
                current_x, current_y = queue.popleft()
                current = pixels[origin_x + current_x, origin_y + current_y]
                for next_x, next_y in (
                    (current_x - 1, current_y),
                    (current_x + 1, current_y),
                    (current_x, current_y - 1),
                    (current_x, current_y + 1),
                ):
                    if not (0 <= next_x < cell_width and 0 <= next_y < cell_height):
                        continue
                    index = next_y * cell_width + next_x
                    if background[index]:
                        continue
                    following = pixels[origin_x + next_x, origin_y + next_y]
                    if following[3] == 0 or color_distance_squared(current, following) <= threshold_squared:
                        background[index] = 1
                        queue.append((next_x, next_y))

            for y in range(cell_height):
                for x in range(cell_width):
                    if background[y * cell_width + x]:
                        red, green, blue, _alpha = pixels[origin_x + x, origin_y + y]
                        pixels[origin_x + x, origin_y + y] = red, green, blue, 0

    image.save(destination)


def resize_nearest(source: Path, destination: Path, size: tuple[int, int]) -> None:
    image = Image.open(source).convert("RGBA")
    image.resize(size, Image.Resampling.NEAREST).save(destination)


def largest_component_bounds(alpha: Image.Image) -> tuple[int, int, int, int]:
    width, height = alpha.size
    values = alpha.load()
    visited = bytearray(width * height)
    largest: list[tuple[int, int]] = []

    for start_y in range(height):
        for start_x in range(width):
            start_index = start_y * width + start_x
            if visited[start_index] or values[start_x, start_y] <= 16:
                continue
            visited[start_index] = 1
            queue = deque([(start_x, start_y)])
            component: list[tuple[int, int]] = []
            while queue:
                x, y = queue.popleft()
                component.append((x, y))
                for next_x, next_y in (
                    (x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1),
                    (x - 1, y - 1), (x + 1, y - 1), (x - 1, y + 1), (x + 1, y + 1),
                ):
                    if not (0 <= next_x < width and 0 <= next_y < height):
                        continue
                    index = next_y * width + next_x
                    if visited[index] or values[next_x, next_y] <= 16:
                        continue
                    visited[index] = 1
                    queue.append((next_x, next_y))
            if len(component) > len(largest):
                largest = component

    if not largest:
        raise ValueError("Unable to find a sprite component")
    xs = [point[0] for point in largest]
    ys = [point[1] for point in largest]
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def normalize_grid(
    source: Path,
    destination: Path,
    columns: int,
    rows: int,
    cell_size: int = 256,
) -> None:
    image = Image.open(source).convert("RGBA")
    output = Image.new("RGBA", (columns * cell_size, rows * cell_size), (0, 0, 0, 0))

    for row in range(rows):
        for column in range(columns):
            source_box = (
                round(column * image.width / columns),
                round(row * image.height / rows),
                round((column + 1) * image.width / columns),
                round((row + 1) * image.height / rows),
            )
            cell = image.crop(source_box)
            bounds = largest_component_bounds(cell.getchannel("A"))
            sprite = cell.crop(bounds)
            scale = min(216 / sprite.width, 226 / sprite.height)
            target_size = (
                max(1, round(sprite.width * scale)),
                max(1, round(sprite.height * scale)),
            )
            sprite = sprite.resize(target_size, Image.Resampling.NEAREST)
            target_x = column * cell_size + (cell_size - target_size[0]) // 2
            target_y = row * cell_size + cell_size - target_size[1] - 14
            output.alpha_composite(sprite, (target_x, target_y))

    output.save(destination)


def visible_color_bounds(image: Image.Image) -> tuple[int, int, int, int]:
    mask = Image.new("L", image.size, 0)
    source = image.load()
    target = mask.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, alpha = source[x, y]
            if alpha > 16 and (red > 92 or green > 64 or blue > 68):
                target[x, y] = 255
    bounds = mask.getbbox()
    if bounds is None:
        raise ValueError("Unable to locate the visible sprite colors")
    return bounds


def mask_run_with_reference(
    source: Path,
    walk_reference: Path,
    destination: Path,
) -> None:
    run = Image.open(source).convert("RGBA")
    if run.size != (1536, 1024):
        raise ValueError("The run source must be a 1536x1024 6x4 sheet")

    reference = Image.open(walk_reference).convert("RGBA")
    if reference.width % 3 or reference.height % 4:
        raise ValueError("The walk reference must divide into a 3x4 sheet")
    reference = reference.resize((768, 1024), Image.Resampling.NEAREST)
    output = Image.new("RGBA", run.size, (0, 0, 0, 0))

    for row in range(4):
        for column in range(6):
            box = (column * 256, row * 256, (column + 1) * 256, (row + 1) * 256)
            cell = run.crop(box)
            reference_column = column % 3
            reference_cell = reference.crop(
                (reference_column * 256, row * 256, (reference_column + 1) * 256, (row + 1) * 256)
            )
            reference_mask = reference_cell.getchannel("A").point(lambda value: 255 if value > 16 else 0)
            reference_mask = reference_mask.filter(ImageFilter.MaxFilter(17))

            source_bounds = visible_color_bounds(cell)
            reference_bounds = reference_mask.getbbox()
            if reference_bounds is None:
                raise ValueError(f"Empty reference frame at {reference_column},{row}")
            source_center_x = (source_bounds[0] + source_bounds[2]) // 2
            reference_center_x = (reference_bounds[0] + reference_bounds[2]) // 2
            shift_x = source_center_x - reference_center_x
            shift_y = source_bounds[3] - reference_bounds[3]
            aligned_mask = Image.new("L", (256, 256), 0)
            aligned_mask.paste(reference_mask, (shift_x, shift_y))

            original_alpha = cell.getchannel("A")
            final_alpha = Image.new("L", (256, 256), 0)
            final_pixels = final_alpha.load()
            original_pixels = original_alpha.load()
            mask_pixels = aligned_mask.load()
            for y in range(256):
                for x in range(256):
                    if mask_pixels[x, y]:
                        final_pixels[x, y] = original_pixels[x, y]
            cell.putalpha(final_alpha)
            output.alpha_composite(cell, (column * 256, row * 256))

    output.save(destination)


def validate(path: Path, columns: int, rows: int) -> str:
    image = Image.open(path).convert("RGBA")
    if image.width % columns or image.height % rows:
        raise ValueError(f"{path.name} has a non-uniform grid")
    if image.getpixel((0, 0))[3] != 0:
        raise ValueError(f"{path.name} lacks transparent outer padding")

    cell_width = image.width // columns
    cell_height = image.height // rows
    for row in range(rows):
        for column in range(columns):
            alpha = image.getchannel("A").crop(
                (
                    column * cell_width,
                    row * cell_height,
                    (column + 1) * cell_width,
                    (row + 1) * cell_height,
                )
            )
            bounds = alpha.getbbox()
            if bounds is None:
                raise ValueError(f"{path.name} has an empty frame at {column},{row}")
            if bounds[0] == 0 or bounds[1] == 0 or bounds[2] == cell_width or bounds[3] == cell_height:
                raise ValueError(f"{path.name} has a frame touching its cell edge at {column},{row}")

    return f"{path.name}: {image.width}x{image.height}, grid {columns}x{rows}, alpha OK"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--run-source", type=Path, required=True)
    parser.add_argument("--idle-source", type=Path, required=True)
    parser.add_argument("--jump-source", type=Path, required=True)
    parser.add_argument("--walk-reference", type=Path, required=True)
    parser.add_argument("--output-directory", type=Path, required=True)
    args = parser.parse_args()

    args.output_directory.mkdir(parents=True, exist_ok=True)
    run_output = args.output_directory / "girlfriend-run.png"
    run_masked = args.output_directory / "girlfriend-run-masked.png"
    idle_output = args.output_directory / "girlfriend-idle.png"
    jump_output = args.output_directory / "girlfriend-jump.png"

    mask_run_with_reference(args.run_source, args.walk_reference, run_masked)
    normalize_grid(run_masked, run_output, 6, 4)
    run_masked.unlink(missing_ok=True)
    normalize_grid(args.idle_source, idle_output, 4, 4)
    normalize_grid(args.jump_source, jump_output, 3, 4)

    print(validate(run_output, 6, 4))
    print(validate(idle_output, 4, 4))
    print(validate(jump_output, 3, 4))


if __name__ == "__main__":
    main()
