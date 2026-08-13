# IXA 3D Logo

This folder contains the Blender generator for the IXA focus mark.

Run it with:

```bash
blender --background --python blender/create_ixa_logo.py
```

It creates:

- `assets/3d/ixa-logo.blend` — editable Blender scene
- `assets/3d/ixa-logo.glb` — compressed web-ready model
- `renders/ixa-logo-3d.png` — presentation render

The geometry is recreated directly from the supplied eye mark and uses the IXA palette: Mint `#64E0D5`, Soft Mint `#B9F4EE`, Graphite `#1B1E1E`, and Deep Black `#050606`.
