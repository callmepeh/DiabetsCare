import tkinter as tk
from tkinter import ttk
import sys
import os

# Adiciona o diretório raiz ao path para imports
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.path.insert(0, root_dir)

from frontend.utils.threading_helper import AsyncOperation


class FeedScreen(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller
        self.configure(bg="#F0F2F5") # Cor de fundo para o feed

        # Frame para os botões de navegação no topo
        nav_frame = tk.Frame(self, bg="#F0F2F5")
        nav_frame.pack(pady=10, fill="x")

        post_button = tk.Button(nav_frame, text="Criar Post", command=lambda: controller.show_frame("PostScreen"),
                                bg="#4285F4", fg="white", font=("Arial", 10, "bold"), relief="flat", padx=10, pady=5)
        post_button.pack(side="left", padx=10)

        glycemia_button = tk.Button(nav_frame, text="Registrar Glicemia", command=lambda: controller.show_frame("GlycemiaScreen"),
                                    bg="#34A853", fg="white", font=("Arial", 10, "bold"), relief="flat", padx=10, pady=5)
        glycemia_button.pack(side="left", padx=10)
        
        dashboard_button = tk.Button(nav_frame, text="Dashboard", command=lambda: controller.show_frame("DashboardScreen"),
                                    bg="#FF9800", fg="white", font=("Arial", 10, "bold"), relief="flat", padx=10, pady=5)
        dashboard_button.pack(side="left", padx=10)
        
        user_button = tk.Button(nav_frame, text="Meu Perfil", command=lambda: controller.show_frame("UserDataScreen"),
                               bg="#9C27B0", fg="white", font=("Arial", 10, "bold"), relief="flat", padx=10, pady=5)
        user_button.pack(side="left", padx=10)

        # Canvas e Scrollbar para a lista de posts
        self.canvas = tk.Canvas(self, bg="#F0F2F5", highlightthickness=0)
        self.scrollbar = ttk.Scrollbar(self, orient="vertical", command=self.canvas.yview)
        self.scrollable_frame = tk.Frame(self.canvas, bg="#F0F2F5")

        # Criar a janela dentro do canvas para o frame rolável
        self.canvas_window = self.canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")

        # Configurar o canvas para usar a barra de rolagem
        self.canvas.configure(yscrollcommand=self.scrollbar.set)

        # Empacotar o canvas e a barra de rolagem
        self.canvas.pack(side="left", fill="both", expand=True, padx=(20,0))
        self.scrollbar.pack(side="right", fill="y", padx=(0,20))

        # Bind para ajustar a largura da janela interna do canvas quando o canvas for redimensionado
        self.canvas.bind("<Configure>", self._on_canvas_resize)
        # Bind para atualizar o scrollregion quando o conteúdo do frame rolável mudar
        # Este bind é crucial para que a barra de rolagem saiba o tamanho total do conteúdo
        self.scrollable_frame.bind("<Configure>", self._on_frame_configure)

        # Inicializa o feed (pode estar vazio no início)
        # A chamada inicial aqui garante que o feed seja populado se houver posts ao iniciar
        # e que o scrollregion seja calculado uma primeira vez.
        # A leitura será feita com threading para não bloquear a GUI
        self.update_feed()

    def _on_canvas_resize(self, event):
        # Ajusta a largura da janela interna do canvas para preencher o canvas
        # Isso é importante para que o scrollable_frame se expanda horizontalmente
        self.canvas.itemconfig(self.canvas_window, width=event.width)

    def _on_frame_configure(self, event):
        # Atualiza o scrollregion do canvas para o tamanho total do scrollable_frame
        # Isso permite que a barra de rolagem funcione corretamente
        self.canvas.configure(scrollregion=self.canvas.bbox("all"))

    def update_feed(self, posts=None):
        """Atualiza o feed com os posts. Se posts=None, carrega de forma assíncrona"""
        if posts is None:
            # Usa o helper de threading para carregar posts de forma assíncrona
            async_op = AsyncOperation(self)
            async_op.executar(
                operacao=lambda: self.controller.service.getPost(),
                on_success=self._render_posts,
                on_error=self._on_load_error
            )
        else:
            # Se posts foram fornecidos, atualiza diretamente
            self._render_posts(posts)

    def _render_posts(self, posts):
        """Renderiza os posts na tela (deve ser chamado no thread principal)"""
        # Limpa o feed antigo
        for widget in self.scrollable_frame.winfo_children():
            widget.destroy()

        # Adiciona os posts ao feed
        for post in posts:
            # Simula um card com bordas arredondadas e sombra
            post_card = tk.Frame(self.scrollable_frame, bg="white", bd=0, relief="flat", 
                                 highlightbackground="#CCCCCC", highlightthickness=1)
            post_card.pack(fill="x", pady=10, padx=20, ipadx=10, ipady=10)

            user_label = tk.Label(post_card, text=post["user"], font=("Arial", 14, "bold"), bg="white", fg="#1a73e8")
            user_label.pack(anchor="w", pady=(0, 5))

            content_label = tk.Label(post_card, text=post["content"], font=("Arial", 12), bg="white", 
                                    wraplength=500, justify="left", anchor="w") # Valor fixo para wraplength
            content_label.pack(fill="x", expand=True)
        
        # Força a atualização das dimensões dos widgets para que o scrollregion seja calculado corretamente
        self.scrollable_frame.update_idletasks()
        # Garante que o scrollregion seja atualizado após todos os posts serem adicionados
        self.canvas.config(scrollregion=self.canvas.bbox("all"))

    def _on_load_error(self, error):
        """Callback chamado quando ocorre erro ao carregar os posts"""
        # Limpa o feed em caso de erro
        for widget in self.scrollable_frame.winfo_children():
            widget.destroy()
        
        # Mostra mensagem de erro
        error_label = tk.Label(self.scrollable_frame, 
                              text=f"Erro ao carregar posts: {str(error)}", 
                              font=("Arial", 12), 
                              bg="#F0F2F5", 
                              fg="#ea4335")
        error_label.pack(pady=20)
