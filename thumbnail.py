from tkinter import *
from tkinter import ttk
from PIL import Image, ImageTk

#img2 = Image.open("./characters/Yu Narukami.png")

class Window:
    def __init__(self, tk):
        self.tk = tk
        self.tk.title("P4PC Thumbnail Generator")
        self.tabControl = ttk.Notebook(self.tk)
        self.tab1 = ttk.Frame(self.tabControl)
        self.tab2 = ttk.Frame(self.tabControl)
        self.tabControl.add(self.tab1, text="Match Info")
        self.tabControl.add(self.tab2, text="Commentary")
        self.tabControl.grid(row=0, column=0)
        self.image = None 
    
    def setupTab1(self):
        img = Image.open("./characters/Yukiko Amagi.png")

        img1 = ImageTk.PhotoImage(img)
        self.panel1 = Label(self.tab1, image = img1)
        self.panel1.grid(row=1, column = 0)

    def mainloop(self):
        self.tk.mainloop()

window = Window(Tk())
window.setupTab1()
window.mainloop()


