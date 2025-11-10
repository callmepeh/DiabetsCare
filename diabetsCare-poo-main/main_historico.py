import tkinter as tk
from frontend.views.screens.historico_screen import HistoricoScreen
import csv, os

# Mock do controller
class ControllerMock:
    def get_historico_posts(self):
        return [{"content": "Post de teste"}]

    def get_historico_glicemia(self):
        # Ler CSV diretamente
        arquivo = os.path.join("data", "glicemia.csv")
        registros = []
        if os.path.exists(arquivo):
            with open(arquivo, newline="", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                registros = list(reader)
        return registros

def main():
    root = tk.Tk()
    root.title("Histórico de Glicemias")
    root.geometry("900x600")

    controller_mock = ControllerMock()
    tela = HistoricoScreen(root, controller_mock)
    tela.pack(expand=True, fill="both")
    tela.atualizar_dados()

    root.mainloop()

if __name__ == "__main__":
    main()
