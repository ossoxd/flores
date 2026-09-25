"""Regression checks for the actual sprite sheet consumed by Phaser."""

import base64
import io
import re
import unittest
from pathlib import Path

from PIL import Image


ASSET = Path(__file__).resolve().parents[2] / 'public/assets/custom/micky/micky-run-v2.js'


class MickyRunSheetTest(unittest.TestCase):
    def test_rear_of_run_frames_does_not_look_like_a_second_white_muzzle(self):
        source = ASSET.read_text(encoding='utf-8')
        encoded = re.search(r'base64,([A-Za-z0-9+/=]+)', source).group(1)
        sheet = Image.open(io.BytesIO(base64.b64decode(encoded))).convert('RGBA')
        for frame in range(8):
            white_rear_pixels = sum(
                1 for y in range(8, 30) for x in range(24)
                if (lambda pixel: pixel[3] >= 128 and min(pixel[:3]) > 190)(
                    sheet.getpixel((frame * 64 + x, y))
                )
            )
            self.assertEqual(white_rear_pixels, 0, f'frame {frame} has a white tail tip')

    def test_eight_run_poses_keep_a_consistent_body_scale(self):
        source = ASSET.read_text(encoding='utf-8')
        encoded = re.search(r'base64,([A-Za-z0-9+/=]+)', source).group(1)
        sheet = Image.open(io.BytesIO(base64.b64decode(encoded))).convert('RGBA')
        self.assertEqual(sheet.size, (512, 64))
        heights = []
        for frame in range(8):
            cell = sheet.crop((frame * 64, 0, (frame + 1) * 64, 64))
            bounds = cell.getchannel('A').point(lambda alpha: 255 if alpha >= 128 else 0).getbbox()
            self.assertIsNotNone(bounds, f'frame {frame} is empty')
            heights.append(bounds[3] - bounds[1])
        self.assertLessEqual(max(heights) - min(heights), 6, heights)


if __name__ == '__main__':
    unittest.main()
