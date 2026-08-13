import bpy
import math
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "3d"
OUTPUTS = ROOT / "renders"
ASSETS.mkdir(parents=True, exist_ok=True)
OUTPUTS.mkdir(parents=True, exist_ok=True)

MINT = (0.127, 0.745, 0.665, 1.0)       # #64E0D5 in linear-ish display space
SOFT_MINT = (0.485, 0.905, 0.855, 1.0)  # #B9F4EE
GRAPHITE = (0.011, 0.013, 0.013, 1.0)   # #1B1E1E
DEEP_BLACK = (0.0015, 0.0018, 0.0018, 1.0)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)


def material(name, color, metallic=0.0, roughness=0.35, emission=None, strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = color
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        bsdf.inputs["Emission Color"].default_value = emission
        bsdf.inputs["Emission Strength"].default_value = strength
    return mat


def eye_y(x, width, height, power=0.72):
    ratio = min(abs(x) / width, 1.0)
    return height * max(0.0, 1.0 - ratio ** 2) ** power


def make_band(name, x_start, x_end, upper=True, steps=44):
    xs = [x_start + (x_end - x_start) * i / steps for i in range(steps + 1)]
    sign = 1 if upper else -1
    outer = [(x, sign * eye_y(x, 4.35, 2.15, 0.67), 0.0) for x in xs]
    # The inner and outer contours meet at the eye tips; only their height differs.
    inner = [(x, sign * eye_y(x, 4.35, 1.14, 0.62), 0.0) for x in xs]
    verts = outer + inner
    row = len(xs)
    faces = [(i, i + 1, row + i + 1, row + i) for i in range(row - 1)]
    mesh = bpy.data.meshes.new(name + "Mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    solid = obj.modifiers.new("Depth", "SOLIDIFY")
    solid.thickness = 0.34
    solid.offset = 0.0
    bevel = obj.modifiers.new("Soft bevel", "BEVEL")
    bevel.width = 0.09
    bevel.segments = 5
    obj.data.materials.append(bpy.data.materials["IXA Mint Metal"])
    return obj


def add_iris():
    bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=64, location=(0, 0, 0.24))
    iris = bpy.context.object
    iris.name = "IXA Focus"
    iris.scale = (0.68, 0.68, 0.34)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    iris.data.materials.append(bpy.data.materials["IXA Soft Mint Glow"])
    bevel = iris.modifiers.new("Polish", "BEVEL")
    bevel.width = 0.03
    bevel.segments = 3


def add_backplate():
    bpy.ops.mesh.primitive_cube_add(location=(0, 0, -0.58), scale=(6.4, 4.6, 0.26))
    plate = bpy.context.object
    plate.name = "Graphite Backplate"
    bevel = plate.modifiers.new("Rounded corners", "BEVEL")
    bevel.width = 0.42
    bevel.segments = 10
    plate.data.materials.append(bpy.data.materials["Graphite"])


def add_area(name, location, energy, color, size):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.color = color
    data.shape = "DISK"
    data.size = size
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    return obj


def point_at(obj, target=(0, 0, 0)):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


clear_scene()

mint = material("IXA Mint Metal", MINT, metallic=0.58, roughness=0.2)
glow = material("IXA Soft Mint Glow", SOFT_MINT, metallic=0.08, roughness=0.16,
                emission=SOFT_MINT, strength=1.65)
graphite = material("Graphite", GRAPHITE, metallic=0.15, roughness=0.3)

# Four parts preserve the logo's characteristic vertical breaks.
gap = 0.24
for upper, label in ((True, "Upper"), (False, "Lower")):
    make_band(f"{label} Left", -4.35, -gap, upper)
    make_band(f"{label} Right", gap, 4.35, upper)

add_iris()
add_backplate()

# Camera: restrained perspective makes the extrusion visible without distorting the mark.
bpy.ops.object.camera_add(location=(0.0, 0.0, 18.0))
camera = bpy.context.object
camera.name = "IXA Camera"
camera.data.lens = 58
point_at(camera, (0, 0, -0.05))
bpy.context.scene.camera = camera

key = add_area("Mint Key", (-4.2, 4.0, 7.0), 850, (0.39, 1.0, 0.9), 5.0)
point_at(key)
rim = add_area("White Rim", (4.6, -2.5, 5.0), 650, (1.0, 1.0, 1.0), 4.0)
point_at(rim)
fill = add_area("Soft Fill", (0, 0, 8.0), 420, (0.52, 1.0, 0.94), 3.0)
point_at(fill)

world = bpy.context.scene.world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = DEEP_BLACK
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.06

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE_NEXT"
scene.render.resolution_x = 1800
scene.render.resolution_y = 1350
scene.render.resolution_percentage = 100
scene.render.image_settings.color_mode = "RGB"
scene.render.engine = "BLENDER_EEVEE_NEXT"
scene.render.image_settings.color_mode = "RGB"
scene.render.film_transparent = False
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.film_transparent = False
scene.render.filepath = str(OUTPUTS / "ixa-logo-3d.png")
scene.render.image_settings.color_mode = "RGB"
scene.view_settings.look = "AgX - Medium High Contrast"

scene.render.filepath = str(OUTPUTS / "ixa-logo-3d.png")
bpy.ops.wm.save_as_mainfile(filepath=str(ASSETS / "ixa-logo.blend"))
bpy.ops.export_scene.gltf(
    filepath=str(ASSETS / "ixa-logo.glb"),
    export_format="GLB",
    use_selection=False,
    export_apply=True,
)
bpy.ops.render.render(write_still=True)

print(f"Saved Blender scene: {ASSETS / 'ixa-logo.blend'}")
print(f"Saved web model: {ASSETS / 'ixa-logo.glb'}")
print(f"Saved render: {OUTPUTS / 'ixa-logo-3d.png'}")
