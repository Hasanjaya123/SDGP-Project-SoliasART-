import threading

from ar_model import ARModel

#Initialise the ARModel class
model = ARModel()
#To create the 3d canvas (width, height,dapth)
model.create_canvas(78.7402,59.05,1.5)
#creating uv mappoing for canvas (do not need any argumats)
model.create_uv_mapping()
#export as .glb file (give the image url and the name of the glb file)
model.export_glb("jungle.jpg","test.glb")
#Unncessary, but to show the 3d model in a window (do not need any arguments)
model.show()

mode2 = ARModel()
mode2.create_canvas(88.7402,79.05,2)
mode2.create_uv_mapping()
mode2.export_glb("portrait.jpg","test2.glb")
mode2.show()