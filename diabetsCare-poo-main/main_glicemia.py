import tkinter as tk
from backend.controllers.app_controller import App
from frontend.views.screens.glycemia_screen import GlycemiaScreen
from frontend.views.screens.historico_screen import HistoricoScreen

class MainApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Diabetes Care - Teste")
        self.geometry("900x600")

        # Controlador backend
        self.controller = App()

        # Container de telas
        self.frames = {}
        container = tk.Frame(self)
        container.pack(expand=True, fill="both")

        # Instancia telas
        for F in (GlycemiaScreen, HistoricoScreen):
            frame = F(container, self.controller)
            self.frames[F.__name__] = frame
            frame.grid(row=0, column=0, sticky="nsew")

        # Mostra tela inicial
        self.show_frame("GlycemiaScreen")

    def show_frame(self, frame_name):
        frame = self.frames[frame_name]
        if frame_name == "HistoricoScreen":
            frame.atualizar_dados()
        frame.tkraise()

if __name__ == "__main__":
    app = MainApp()
    app.mainloop()
