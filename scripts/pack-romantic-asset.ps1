param(
  [Parameter(Mandatory=$true)][string]$InputFile,
  [Parameter(Mandatory=$true)][int]$Width,
  [int]$Height = 0,
  [int]$Top = 0,
  [int]$Bottom = 0
)

# Asset import only: trim transparent padding and sample on the game's pixel grid.
# Emit the PNG in memory so it can be stored in a portable JS asset module.
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing.Common,System.Drawing.Primitives,System.Private.Windows.GdiPlus,System.Private.Windows.Core -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
public static class RomanticAssetPacker {
  public static string Pack(string input, int width, int height, int top, int bottom) {
    using (var source = new Bitmap(input)) {
      if (bottom == 0) bottom = source.Height;
      int left = source.Width, right = -1, first = bottom, last = -1;
      for (int y = top; y < bottom; y++) for (int x = 0; x < source.Width; x++) {
        if (source.GetPixel(x, y).A < 128) continue;
        left = Math.Min(left, x); right = Math.Max(right, x);
        first = Math.Min(first, y); last = Math.Max(last, y);
      }
      if (right < left) throw new Exception("The asset contains no opaque pixels.");
      int sw = right - left + 1, sh = last - first + 1;
      if (height == 0) height = Math.Max(1, (int)Math.Round((double)sh / sw * width));
      using (var output = new Bitmap(width, height, PixelFormat.Format32bppArgb)) {
        using (var graphics = Graphics.FromImage(output)) {
          graphics.InterpolationMode = InterpolationMode.NearestNeighbor;
          graphics.PixelOffsetMode = PixelOffsetMode.Half;
          graphics.CompositingMode = CompositingMode.SourceCopy;
          graphics.DrawImage(source, new Rectangle(0, 0, width, height),
            new Rectangle(left, first, sw, sh), GraphicsUnit.Pixel);
        }
        using (var bytes = new MemoryStream()) {
          output.Save(bytes, ImageFormat.Png);
          return Convert.ToBase64String(bytes.ToArray());
        }
      }
    }
  }
}
'@
[RomanticAssetPacker]::Pack($InputFile, $Width, $Height, $Top, $Bottom)
