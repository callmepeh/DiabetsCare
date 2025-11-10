import tkinter as tk
from backend.controllers.app_controller import App
from frontend.views.screens.glycemia_screen import GlycemiaScreen

def main():
    root = tk.Tk()
    root.title("Teste - Tela de Glicemia")

    app_controller = App()
    tela = GlycemiaScreen(root, app_controller)
    tela.pack(expand=True, fill="both")

    root.mainloop()

if __name__ == "__main__":
    main()
