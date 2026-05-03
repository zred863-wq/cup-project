# Cup Pattern Images — 杯子图案资源

## How to replace cup pattern images

To change a cup pattern, simply **replace the PNG file** with your own image.
Keep the same filename so the app picks it up automatically.

| File | Cup Type (中文) | Cup Type (English) |
|------|-----------------|--------------------|
| `cup1.png` | 经典款 | Classic |
| `cup2.png` | 花卉款 | Floral |
| `cup3.png` | 动物款 | Animal |
| `cup4.png` | 抽象款 | Abstract |
| `cup5.png` | 简约款 | Minimal |

## Guidelines

- **Format:** PNG (recommended, supports transparency)
- **Resolution:** 512×256 or larger (will be scaled to fit the 3D cup texture)
- **Aspect ratio:** ~2:1 works best for wrapping around the cup

## Adding new cup types

1. Add the new image to this folder (e.g. `cup6.png`)
2. Add a new entry in `CUP_TYPES` inside `js/app.js`
3. The app will automatically pick it up

## Notes

- Images are loaded at runtime — no build step needed
- To temporarily hide a cup type, comment out its entry in `CUP_TYPES`
- Pattern images are composited onto the cup surface with 35% opacity
