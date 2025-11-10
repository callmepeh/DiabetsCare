import tkinter as tk
from tkinter import font, messagebox
from PIL import Image, ImageTk
import os
import sys

# Adiciona o diretório raiz ao path para imports
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.path.insert(0, root_dir)

class SignupScreen(tk.Frame):
    """Tela de cadastro do aplicativo"""
    
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller
        self.configure(bg="white")
        
        # Configurar grid principal
        self.grid_columnconfigure(0, weight=1, uniform="col")
        self.grid_columnconfigure(1, weight=1, uniform="col")
        self.grid_rowconfigure(0, weight=1)
        
        # Frames principais
        self.left_frame = tk.Frame(self, bg="white")
        self.left_frame.grid(row=0, column=0, sticky="nsew")
        
        self.right_frame = tk.Frame(self, bg="#1E90FF")
        self.right_frame.grid(row=0, column=1, sticky="nsew")
        
        self._criar_painel_esquerdo()
        self._criar_painel_direito()
    
    def _criar_painel_esquerdo(self):
        """Cria o painel esquerdo com formulário de cadastro"""
        container_left = tk.Frame(self.left_frame, bg="white")
        container_left.place(relx=0.5, rely=0.5, anchor="center")
        
        # Título
        tk.Label(container_left, text="Cadastre-se", font=("Arial", 36, "bold"),
                fg="#1E90FF", bg="white").pack(pady=(0, 10))
        
        tk.Label(container_left, text="Adicione os detalhes da sua conta",
                font=("Arial", 14), fg="gray", bg="white").pack(pady=(0, 20))
        
        # Usuário
        tk.Label(container_left, text="Nome de usuário", font=("Arial", 12),
                fg="gray", bg="white").pack(anchor="w")
        self.username_entry = tk.Entry(container_left, width=40, font=("Arial", 14),
                                      bd=0, relief="flat", highlightbackground="#E0E0E0", highlightthickness=1)
        self.username_entry.pack(pady=(0, 15), ipady=8)
        
        # Senha
        tk.Label(container_left, text="Senha", font=("Arial", 12),
                fg="gray", bg="white").pack(anchor="w")
        self.password_entry = tk.Entry(container_left, width=40, font=("Arial", 14), show="*",
                                      bd=0, relief="flat", highlightbackground="#E0E0E0", highlightthickness=1)
        self.password_entry.pack(pady=(0, 20), ipady=8)
        
        # Tipo de usuário
        self.tipo_var = tk.StringVar(value="Comum")
        frame_tipo = tk.Frame(container_left, bg="white")
        frame_tipo.pack(pady=10)
        
        tk.Radiobutton(frame_tipo, text="Comum", variable=self.tipo_var, value="Comum",
                      bg="white", font=("Arial", 10)).grid(row=0, column=0, padx=30)
        tk.Radiobutton(frame_tipo, text="Profissional", variable=self.tipo_var, value="Profissional",
                      bg="white", font=("Arial", 10)).grid(row=0, column=1, padx=30)
        
        # Botão Cadastrar
        tk.Button(container_left, text="Cadastre-se", font=("Arial", 16, "bold"),
                 bg="#1E90FF", fg="white", bd=0, relief="flat",
                 command=self._fazer_cadastro).pack(pady=15, ipadx=20, ipady=10)
        
        # Login
        frame_login = tk.Frame(container_left, bg="white")
        frame_login.pack(pady=10)
        
        tk.Label(frame_login, text="Já possui uma conta?", font=("Arial", 12),
                fg="gray", bg="white").grid(row=0, column=0, padx=5)
        tk.Button(frame_login, text="Login", font=("Arial", 12, "bold"),
                 bg="#1E90FF", fg="white", bd=0, relief="flat",
                 command=self._ir_para_login).grid(row=0, column=1, padx=5)
    
    def _criar_painel_direito(self):
        """Cria o painel direito com informações e imagens decorativas"""
        container_right = tk.Frame(self.right_frame, bg="#1E90FF")
        container_right.place(relx=0.5, rely=0.5, anchor="center")
        
        # Carregar imagens decorativas
        signup_dir = os.path.join(os.path.dirname(__file__), "signup_screen")
        self.images = []
        
        try:
            # Imagens decorativas
            if os.path.exists(os.path.join(signup_dir, "Vector1.png")):
                bg1 = Image.open(os.path.join(signup_dir, "Vector1.png"))
                bg1 = bg1.resize((180, 180), Image.Resampling.LANCZOS)
                self.bg1_photo = ImageTk.PhotoImage(bg1)
                lbl_bg1 = tk.Label(self.right_frame, image=self.bg1_photo, bg="#1E90FF", border=0)
                lbl_bg1.place(x=300, y=10)
                self.images.append(self.bg1_photo)
            
            if os.path.exists(os.path.join(signup_dir, "Vector2.png")):
                bg2 = Image.open(os.path.join(signup_dir, "Vector2.png"))
                bg2 = bg2.resize((180, 180), Image.Resampling.LANCZOS)
                self.bg2_photo = ImageTk.PhotoImage(bg2)
                lbl_bg2 = tk.Label(self.right_frame, image=self.bg2_photo, bg="#1E90FF", border=0)
                lbl_bg2.place(x=-50, y=90)
                self.images.append(self.bg2_photo)
            
            if os.path.exists(os.path.join(signup_dir, "Vector3.png")):
                bg3 = Image.open(os.path.join(signup_dir, "Vector3.png"))
                bg3 = bg3.resize((180, 180), Image.Resampling.LANCZOS)
                self.bg3_photo = ImageTk.PhotoImage(bg3)
                lbl_bg3 = tk.Label(self.right_frame, image=self.bg3_photo, bg="#1E90FF", border=0)
                lbl_bg3.place(x=10, y=400)
                self.images.append(self.bg3_photo)
            
            # Ícone central
            if os.path.exists(os.path.join(signup_dir, "report (1) 2.png")):
                icon = Image.open(os.path.join(signup_dir, "report (1) 2.png"))
                icon = icon.resize((300, 300), Image.Resampling.LANCZOS)
                self.icon_photo = ImageTk.PhotoImage(icon)
                lbl_icon = tk.Label(container_right, image=self.icon_photo, bg="#1E90FF", border=0)
                lbl_icon.pack(pady=20)
                self.images.append(self.icon_photo)
        except Exception as e:
            print(f"Erro ao carregar imagens: {e}")
        
        # Texto de boas-vindas
        title_font = font.Font(family="Arial", size=24, weight="bold")
        subtitle_font = font.Font(family="Arial", size=40, weight="bold")
        
        tk.Label(container_right, text="Bem-Vindo ao", bg="#1E90FF", fg="white", font=title_font).pack()
        tk.Label(container_right, text="DiabetesCare", bg="#1E90FF", fg="white", font=subtitle_font).pack()
        tk.Label(container_right, text="Faça o login para acessar sua conta ou cadastre-se",
                bg="#1E90FF", fg="white", font=("Arial", 14)).pack(pady=10)
    
    def _fazer_cadastro(self):
        """Processa o cadastro e navega para o feed"""
        username = self.username_entry.get().strip()
        password = self.password_entry.get().strip()
        tipo = self.tipo_var.get()
        
        if not username or not password:
            messagebox.showwarning("Aviso", "Por favor, preencha todos os campos!")
            return
        
        # Por enquanto, aceita qualquer cadastro (pode ser implementada validação real depois)
        # TODO: Implementar validação real de cadastro
        messagebox.showinfo("Sucesso", f"Conta criada com sucesso! Bem-vindo, {username}!")
        self.controller.usuario_logado = username
        self.controller.show_frame("FeedScreen")
    
    def _ir_para_login(self):
        """Navega para a tela de login"""
        self.controller.show_frame("LoginScreen")

