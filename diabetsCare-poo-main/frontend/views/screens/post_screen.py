import tkinter as tk
from tkinter import ttk, messagebox
import sys
import os

# Adiciona o diretório raiz ao path para imports
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.path.insert(0, root_dir)

from frontend.utils.threading_helper import AsyncOperation

class PostScreen(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller
        # Simula um gradiente com uma cor de fundo clara
        self.configure(bg="#E0F2F7") 

        # Frame principal para centralizar o conteúdo e aplicar o fundo azul claro
        main_frame = tk.Frame(self, bg="#E0F2F7")
        main_frame.pack(expand=True, fill="both")

        # Card de postagem com fundo branco e bordas arredondadas (simuladas com highlight)
        # Tkinter não suporta bordas arredondadas nativamente, então usaremos um truque visual
        post_card = tk.Frame(main_frame, bg="white", bd=0, relief="flat", 
                             highlightbackground="#CCCCCC", highlightthickness=1)
        post_card.pack(padx=50, pady=50, ipadx=20, ipady=20)

        # Campo de texto para a postagem
        self.post_text = tk.Text(post_card, height=10, width=60, font=("Arial", 14), 
                                 relief="flat", bd=0, wrap="word", padx=10, pady=10)
        self.post_text.insert("1.0", "No que está pensando?")
        self.post_text.config(fg="grey")
        self.post_text.bind("<FocusIn>", self._clear_placeholder)
        self.post_text.bind("<FocusOut>", self._add_placeholder)
        self.post_text.pack(padx=10, pady=10)

        # Linha divisória
        separator = ttk.Separator(post_card, orient="horizontal")
        separator.pack(fill="x", padx=10, pady=10)

        # Frame para os botões
        button_frame = tk.Frame(post_card, bg="white")
        button_frame.pack(pady=10)

        # Botão Cancelar
        cancel_button = tk.Button(button_frame, text="Cancelar", command=self._cancel_post, 
                                 bg="#EA4335", fg="white", font=("Arial", 12, "bold"), 
                                 relief="flat", padx=25, pady=12, bd=0)
        cancel_button.pack(side="left", padx=10)

        # Botão Postar
        post_button = tk.Button(button_frame, text="Postar", command=self._submit_post, 
                               bg="#34A853", fg="white", font=("Arial", 12, "bold"), 
                               relief="flat", padx=25, pady=12, bd=0)
        post_button.pack(side="left", padx=10)

    def _clear_placeholder(self, event):
        if self.post_text.get("1.0", "end-1c").strip() == "No que está pensando?".strip():
            self.post_text.delete("1.0", "end")
            self.post_text.config(fg="black")

    def _add_placeholder(self, event):
        if not self.post_text.get("1.0", "end-1c").strip():
            self.post_text.insert("1.0", "No que está pensando?")
            self.post_text.config(fg="grey")

    def _submit_post(self):
        """Inicia o processo de submissão de post"""
        content = self.post_text.get("1.0", "end-1c").strip()
        if content and content != "No que está pensando?".strip():
            # Limpa o campo imediatamente para melhor UX
            self.post_text.delete("1.0", "end")
            self.post_text.insert("1.0", "No que está pensando?")
            self.post_text.config(fg="grey")
            
            # Usa o helper de threading para executar a operação de forma assíncrona
            usuario = getattr(self.controller, "usuario_logado", "Usuário Padrão")
            async_op = AsyncOperation(self)
            async_op.executar(
                operacao=lambda: self.controller.service.adicionarPost(content, usuario),
                on_success=self._on_save_success,
                on_error=self._on_save_error
            )
        else:
            messagebox.showwarning("Aviso", "O post não pode estar vazio!")

    def _on_save_success(self, resultado=None):
        """Callback chamado quando o post é salvo com sucesso"""
        messagebox.showinfo("Sucesso", "Post publicado com sucesso!")
        self.controller.show_frame("FeedScreen")

    def _on_save_error(self, error):
        """Callback chamado quando ocorre erro ao salvar o post"""
        messagebox.showerror("Erro", f"Falha ao publicar post: {str(error)}")

    def _cancel_post(self):
        self.post_text.delete("1.0", "end")
        self.post_text.insert("1.0", "No que está pensando?")
        self.post_text.config(fg="grey")
        self.controller.show_frame("FeedScreen")
