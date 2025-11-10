"""
Arquivo principal para executar o aplicativo DiabetsCare
"""
from frontend.controllers.app import App


if __name__ == "__main__":
    app = App()
    app.mainloop()
