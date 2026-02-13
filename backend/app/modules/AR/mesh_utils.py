import trimesh
import numpy as np
from PIL import Image

def create_poster_mesh(image: Image.Image):
    # 3d model to match image aspect ratio
    width, height = image.size
    aspect_ratio = width / height

    mesh_h = 1.0
    mesh_w = aspect_ratio * mesh_h

    # Center at (0,0,0)
    # Order: Bottom-Left, Bottom-Right, Top-Right, Top-Left
    vertices = np.array([
        [-mesh_w / 2, -mesh_h / 2, 0],  # Bottom-Left
        [ mesh_w / 2, -mesh_h / 2, 0],  # Bottom-Right
        [ mesh_w / 2,  mesh_h / 2, 0],  # Top-Right
        [-mesh_w / 2,  mesh_h / 2, 0],  # Top-Left
    ])

    faces = np.array([
        [0, 1, 2], # First triangle
        [0, 2, 3], # Second triangle
    ])

    uv_coords = np.array([
        [0, 0],  # Bottom-Left
        [1, 0],  # Bottom-Right
        [1, 1],  # Top-Right
        [0, 1],  # Top-Left
    ])

    # create a material using the image
    material = trimesh.visual.texture.SimpleMaterial(image=image)

    # create texture visual
    mesh = trimesh.Trimesh(vertices=vertices, faces=faces)

    # Explicitly set the texture visual with UVs and material
    mesh.visual = trimesh.visual.texture.TextureVisuals(uv=uv_coords, image=image, material=material)

    return mesh