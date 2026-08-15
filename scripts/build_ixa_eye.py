import bpy
import math
import os
from mathutils import Vector


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BLEND_PATH = os.path.join(ROOT, "assets", "3d", "ixa-logo.blend")
SOURCE_GLB_PATH = os.path.join(ROOT, "assets", "3d", "ixa-logo.glb")
PUBLIC_GLB_PATH = os.path.join(ROOT, "public", "models", "ixa-eye.glb")
PREVIEW_PATH = os.path.join(ROOT, "assets", "3d", "ixa-eye-preview.png")

MINT = (0.1274, 0.7454, 0.6654, 1.0)
SOFT_MINT = (0.4851, 0.9046, 0.8549, 1.0)
GRAPHITE = (0.011, 0.014, 0.014, 1.0)


def material(name, color, metallic=0.0, roughness=0.35, emission=None, emission_strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        bsdf.inputs["Emission Color"].default_value = emission
        bsdf.inputs["Emission Strength"].default_value = emission_strength
    return mat


def cubic(p0, p1, p2, p3, steps=28):
    points = []
    for index in range(steps):
        t = index / (steps - 1)
        u = 1.0 - t
        points.append((
            u ** 3 * p0[0] + 3 * u ** 2 * t * p1[0] + 3 * u * t ** 2 * p2[0] + t ** 3 * p3[0],
            u ** 3 * p0[1] + 3 * u ** 2 * t * p1[1] + 3 * u * t ** 2 * p2[1] + t ** 3 * p3[1],
        ))
    return points


def logo_point(point):
    return ((point[0] - 500.0) / 100.0, (250.0 - point[1]) / 100.0)


def left_logo_polygon():
    points = []
    points += cubic((58, 250), (236, 86), (364, 28), (476, 26))[:-1]
    points += [(476, 104)]
    points += cubic((476, 104), (382, 108), (283, 151), (166, 250))[:-1]
    points += cubic((166, 250), (283, 349), (382, 392), (476, 396))[:-1]
    points += [(476, 474)]
    points += cubic((476, 474), (364, 472), (236, 414), (58, 250))[:-1]
    return [logo_point(point) for point in points]


def curve_prism(name, points, extrude, bevel, cap_material, side_material, z=0.0):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "2D"
    curve.resolution_u = 1
    curve.render_resolution_u = 1
    curve.fill_mode = "BOTH"
    curve.extrude = extrude
    curve.bevel_depth = bevel
    curve.bevel_resolution = 3
    curve.resolution_u = 2

    spline = curve.splines.new("POLY")
    spline.points.add(len(points) - 1)
    for spline_point, point in zip(spline.points, points):
        spline_point.co = (point[0], point[1], 0.0, 1.0)
    spline.use_cyclic_u = True

    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.location.z = z
    obj.data.materials.append(cap_material)
    obj.data.materials.append(side_material)

    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.convert(target="MESH")
    obj = bpy.context.view_layer.objects.active
    for polygon in obj.data.polygons:
        polygon.material_index = 0 if abs(polygon.normal.z) > 0.68 else 1
        polygon.use_smooth = abs(polygon.normal.z) < 0.68
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="BOUNDS")
    obj.select_set(False)
    return obj


def annular_segment(name, angle_start, angle_end, inner_radius, outer_radius, material_front, material_side):
    points = []
    samples = 8
    for index in range(samples):
        angle = math.radians(angle_start + (angle_end - angle_start) * index / (samples - 1))
        points.append((math.cos(angle) * outer_radius, math.sin(angle) * outer_radius))
    for index in reversed(range(samples)):
        angle = math.radians(angle_start + (angle_end - angle_start) * index / (samples - 1))
        points.append((math.cos(angle) * inner_radius, math.sin(angle) * inner_radius))
    return curve_prism(name, points, 0.13, 0.025, material_front, material_side, z=0.035)


def add_hex_cylinder(name, radius, depth, z, mat, bevel_width):
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=radius, depth=depth, location=(0, 0, z), rotation=(0, 0, math.radians(30)))
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    bevel = obj.modifiers.new("Precision bevel", "BEVEL")
    bevel.width = bevel_width
    bevel.segments = 3
    bevel.limit_method = "ANGLE"
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.shade_smooth_by_angle()
    return obj


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE_NEXT"
scene.render.resolution_x = 1200
scene.render.resolution_y = 700
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.film_transparent = False
scene.render.filepath = PREVIEW_PATH
scene.render.image_settings.color_mode = "RGBA"
scene.view_settings.look = "AgX - Medium High Contrast"
scene.world = bpy.data.worlds.new("IXA World")
scene.world.color = (0.001, 0.0015, 0.0015)

mint_metal = material("IXA Mint Metal", MINT, metallic=0.62, roughness=0.2, emission=MINT, emission_strength=0.32)
graphite_metal = material("Graphite Edge", GRAPHITE, metallic=0.82, roughness=0.19)
iris_light = material("Hex Core Light", SOFT_MINT, metallic=0.28, roughness=0.12, emission=MINT, emission_strength=3.4)
iris_frame = material("Hex Frame", GRAPHITE, metallic=0.9, roughness=0.13)

left_points = left_logo_polygon()
right_points = [(-point[0], point[1]) for point in left_points]
left_wing = curve_prism("Wing_Left", left_points, 0.14, 0.045, mint_metal, graphite_metal)
right_wing = curve_prism("Wing_Right", right_points, 0.14, 0.045, mint_metal, graphite_metal)

iris_segments = []
for segment_index in range(6):
    center_angle = 30 + segment_index * 60
    iris_segments.append(annular_segment(
        f"Iris_Segment_{segment_index + 1:02d}",
        center_angle - 25,
        center_angle + 25,
        0.62,
        0.82,
        mint_metal,
        graphite_metal,
    ))

pupil_frame = add_hex_cylinder("Pupil_Frame", 0.62, 0.34, 0.06, iris_frame, 0.035)
pupil_core = add_hex_cylinder("Pupil_Core", 0.47, 0.46, 0.105, iris_light, 0.045)

hero_parts = [left_wing, right_wing, pupil_frame, pupil_core, *iris_segments]
for part in hero_parts:
    part["ixa_part"] = True
    part["home_x"] = part.location.x
    part["home_y"] = part.location.y
    part["home_z"] = part.location.z

# Camera and restrained studio lighting for the Blender preview.
bpy.ops.object.camera_add(location=(0, 0, 12.5))
camera = bpy.context.object
camera.name = "Preview_Camera"
camera.data.type = "ORTHO"
camera.data.ortho_scale = 10.8
look_at(camera, (0, 0, 0))
scene.camera = camera

bpy.ops.object.light_add(type="AREA", location=(-3.5, 4.0, 6.5))
key = bpy.context.object
key.name = "Mint_Key"
key.data.energy = 780
key.data.shape = "DISK"
key.data.size = 5.0
key.data.color = (0.30, 1.0, 0.9)
look_at(key, (0, 0, 0))

bpy.ops.object.light_add(type="AREA", location=(4.5, -2.5, 4.5))
rim = bpy.context.object
rim.name = "Soft_Rim"
rim.data.energy = 520
rim.data.size = 4.0
rim.data.color = (0.75, 1.0, 0.96)
look_at(rim, (0, 0, 0))

bpy.ops.object.light_add(type="POINT", location=(0, 0, 3.4))
center_light = bpy.context.object
center_light.name = "Core_Glow"
center_light.data.energy = 180
center_light.data.color = (0.39, 0.88, 0.83)
center_light.data.shadow_soft_size = 1.6

os.makedirs(os.path.dirname(BLEND_PATH), exist_ok=True)
os.makedirs(os.path.dirname(PUBLIC_GLB_PATH), exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
bpy.ops.render.render(write_still=True)

bpy.ops.object.select_all(action="DESELECT")
for part in hero_parts:
    part.select_set(True)
bpy.context.view_layer.objects.active = pupil_core
bpy.ops.export_scene.gltf(
    filepath=SOURCE_GLB_PATH,
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    export_materials="EXPORT",
    export_cameras=False,
    export_lights=False,
)

with open(SOURCE_GLB_PATH, "rb") as source_file:
    model_bytes = source_file.read()
with open(PUBLIC_GLB_PATH, "wb") as public_file:
    public_file.write(model_bytes)

print(f"Saved Blender source: {BLEND_PATH}")
print(f"Saved web model: {PUBLIC_GLB_PATH}")
print(f"Saved preview: {PREVIEW_PATH}")
