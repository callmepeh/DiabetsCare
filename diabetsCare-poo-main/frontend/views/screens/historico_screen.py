import tkinter as tk
from tkinter import ttk, messagebox

class HistoricoScreen(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller
        self.configure(bg="#E0F2F7")

        tk.Label(self, text="📜 Histórico Completo", bg="#E0F2F7",
                 font=("Arial", 20, "bold")).pack(pady=20)

        notebook = ttk.Notebook(self)
        notebook.pack(expand=True, fill="both", padx=40, pady=10)

        self.posts_tab = tk.Frame(notebook, bg="white")
        notebook.add(self.posts_tab, text="Posts")

        self.glicemias_tab = tk.Frame(notebook, bg="white")
        notebook.add(self.glicemias_tab, text="Glicemias")

        tk.Button(self, text="Voltar", bg="#EA4335", fg="white",
                  font=("Arial", 12, "bold"), relief="flat", padx=20, pady=10,
                  command=lambda: controller.show_frame("GlycemiaScreen")).pack(pady=20)

    def atualizar_dados(self):
        """Carrega histórico de posts e glicemias do App"""
        # Limpa abas
        for w in self.posts_tab.winfo_children():
            w.destroy()
        for w in self.glicemias_tab.winfo_children():
            w.destroy()

        # --- Posts ---
        posts = self.controller.get_historico_posts()
        if posts:
            for post in reversed(posts):
                tk.Label(self.posts_tab,
                         text=f"• {post.get('content', 'Sem conteúdo')}",
                         bg="white", fg="#202124", font=("Arial", 12),
                         anchor="w", justify="left", wraplength=700).pack(anchor="w", pady=5)
        else:
            tk.Label(self.posts_tab, text="Nenhum post encontrado.",
                     bg="white", fg="gray").pack(pady=10)

        # --- Glicemias ---
        glicemias = self.controller.get_historico_glicemia()
        if glicemias:
            for g in reversed(glicemias):
                # Se CSV estiver no formato "valor" + "observacoes"
                valor = g.get("valor", "—")
                observacoes = g.get("observacoes", "—")
                data = g.get("data", "—")
                hora = g.get("hora", "—")

                texto = f"{data} {hora} | {valor}\nObservações: {observacoes}"

                tk.Label(self.glicemias_tab,
                         text=texto, bg="white", fg="#202124",
                         font=("Arial", 12), anchor="w", justify="left",
                         wraplength=700).pack(anchor="w", pady=10)
        else:
            tk.Label(self.glicemias_tab, text="Nenhum registro de glicemia encontrado.",
                     bg="white", fg="gray").pack(pady=10)
