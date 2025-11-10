import tkinter as tk
import sys
import os

# Adiciona o diretório raiz ao path para imports
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, root_dir)

# Imports do frontend (views)
from frontend.views.screens.login_screen import LoginScreen
from frontend.views.screens.signup_screen import SignupScreen
from frontend.views.screens.post_screen import PostScreen
from frontend.views.screens.feed_screen import FeedScreen
from frontend.views.screens.glycemia_screen import GlycemiaScreen
from frontend.views.screens.dashboard_screen import DashboardScreen
from frontend.views.screens.user_data_screen import UserDataScreen
from frontend.views.screens.historico_screen import HistoricoScreen

# Imports do backend (services)
from backend.services.diabetes_service import Servico_Diabets_Care, RepositorioGlicemia
from data.file_repository import FileRepository  

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.usuario_logado = None  # Armazena o usuário atualmente logado
        self.title("Aplicativo de Posts e Glicemia")
        screen_width = self.winfo_screenwidth()
        screen_height = self.winfo_screenheight()
        self.geometry(f"{screen_width}x{screen_height}")
        self.configure(bg="#F0F2F5")  # Cor de fundo geral da aplicação

        # Container para os frames
        container = tk.Frame(self)
        container.pack(side="top", fill="both", expand=True)
        container.grid_rowconfigure(0, weight=1)
        container.grid_columnconfigure(0, weight=1)

        self.frames = {}

        # Inicialização do Backend (Service)
        # Nota: O repositório ainda está em memória, mas a estrutura permite
        # fácil migração para FileRepository quando implementado
        repo_post = FileRepository(posts_file='data/posts.json')
        repo_glicemia = RepositorioGlicemia()
        self.DiabetsCareService = Servico_Diabets_Care(repo_post, repo_glicemia)
        self.service = self.DiabetsCareService  # Alias para compatibilidade com nova arquitetura

        # Adiciona as telas
        for F in (LoginScreen, SignupScreen, FeedScreen, PostScreen, GlycemiaScreen, 
                  DashboardScreen, UserDataScreen,HistoricoScreen):
            page_name = F.__name__
            frame = F(parent=container, controller=self)
            self.frames[page_name] = frame
            frame.grid(row=0, column=0, sticky="nsew")

        # Começa na tela de login
        self.show_frame("LoginScreen") 
    
    def set_usuario_logado(self, nome_usuario):
        self.usuario_logado = nome_usuario

    def show_frame(self, page_name):
        """Mostra um frame para a página dada"""
        frame = self.frames[page_name]
        if page_name == "FeedScreen":
            # A atualização do feed será feita com threading na própria tela
            # para não bloquear a GUI durante a leitura de dados
            frame.update_feed()
        elif page_name == "HistoricoScreen":
                frame.atualizar_dados()  
        frame.tkraise()

    def adicionar_post(self, conteudo):
        try:
            self.DiabetsCareService.adicionarPost(conteudo, autor=self.usuario_logado or "Usuário Padrão")
        except Exception as e:
            print(f"Erro ao adicionar post: {e}")

    def adicionar_glicemia(self, dados_glicemia):
        try:
            self.DiabetsCareService.adicionarGlicemia(dados_glicemia, usuario=self.usuario_logado or "Usuário Padrão")
        except Exception as e:
            print(f"Erro ao adicionar glicemia: {e}")

if __name__ == "__main__":
    app = App()
    app.mainloop()
