import trimesh
import numpy as np
from PIL import Image
import uuid

class ARModel:
    
    width: int
    height: int
    depth: int
    canvas: trimesh.base.Trimesh
    
    def __init__(self):
        pass
        
    def create_canvas(self, width_inches:int , height__inches:int, depth__inches:int):
        
        INCHES_TO_METER = 0.0254
        
        self.width = width_inches * INCHES_TO_METER
        self.height = height__inches * INCHES_TO_METER
        self.depth = depth__inches * INCHES_TO_METER
        
        self.canvas = trimesh.creation.box(extents=[self.width,self.height,self.depth])
        
    def create_uv_mapping(self):
        
        self.canvas.unmerge_vertices()
        
        uv_values = np.zeros((len(self.canvas.vertices), 2))
        
        
        for face_index, face_vertices in enumerate(self.canvas.faces):
            face_direction = self.canvas.face_normals[face_index]
            
            if np.allclose(face_direction, [0,0,1]):
                
                for vertex_index in face_vertices:
                    x = self.canvas.vertices[vertex_index][0]
                    y = self.canvas.vertices[vertex_index][1]
                    
                    u = (x/self.width) + 0.5
                    v = (y/self.height) + 0.5
                    
                    uv_values[vertex_index] = [u,v]
            
            else:
                for vertex_index in face_vertices:
                    uv_values[vertex_index] = [0.01, 0.01]
                    
        self.canvas.visual.uv = uv_values
        
    def export_glb(self, image_path, glb_name):
        
        img = Image.open(image_path)
        material = trimesh.visual.material.SimpleMaterial(image=img)
        self.canvas.visual.material = material
        
        scene = trimesh.Scene(self.canvas)
        scene.export(glb_name, file_type='glb')
    
    def show(self):
        
        scene1 = trimesh.load("test.glb")
        scene1.show()
        

        
        
    