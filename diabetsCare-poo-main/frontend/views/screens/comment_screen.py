import tkinter as tk
from tkinter import ttk

class CommentScreen(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Comentar")
        self.geometry("1400x1500")
        self.configure(bg="#142124")

        self._create_main_frame()
        self._create_header()
        self._create_content()

    def _create_main_frame(self):
        self.main_frame = tk.Frame(self, bg="#FFFFFF", bd=0, relief="flat")
        self.main_frame.place(relx=0.5, rely=0.5, anchor="center", width=1400, height=750)

    def _create_header(self):
        self.header_frame = tk.Frame(self.main_frame, bg="#1A73EB", height=150)
        self.header_frame.pack(fill="x", side="top")
        self.header_frame.pack_propagate(False)

        self.canvas = tk.Canvas(self.header_frame, width=300, height=200, bg="#1A73EB", highlightthickness=0)
        self.canvas.place(relx=1.0, rely=0, anchor="ne")
        self.canvas.create_oval(100, -100, 400, 200, fill="#FFFFFF", outline="")
        self.canvas.create_oval(180, -50, 450, 150, fill="#1A73EB", outline="")

    def _create_content(self):
        self.content_frame = tk.Frame(self.main_frame, bg="#FFFFFF")
        self.content_frame.pack(fill="both", expand=True, padx=40, pady=30)
        self.content_frame.columnconfigure(0, weight=1)

        self.user_label = tk.Label(
            self.content_frame,
            text="Nome do usuário",
            font=("Arial", 25, "bold"),
            bg="#FFFFFF",
            fg="#1A73EB"
        )
        self.user_label.grid(row=0, column=0, sticky="w", pady=(0, 5))

        self.user_entry = tk.Entry(
            self.content_frame,
            font=("Arial", 14),
            bg="#F5F5F5",
            bd=0,
            relief="flat",
            highlightthickness=0
        )
        self.user_entry.insert(0, "Bio")
        self.user_entry.grid(row=1, column=0, sticky="w", pady=(0, 15), ipadx=140, ipady=140)

        self.post_button = tk.Button(
            self.content_frame,
            text="Postar",
            font=("Arial", 14, "bold"),
            bg="#1A73EB",
            fg="#FFFFFF",
            relief="flat",
            bd=0,
            padx=60,
            pady=10,
            command=self._post_comment
        )
        self.post_button.grid(row=2, column=0, sticky="w", pady=(15, 0))

    def _post_comment(self):
        comment_text = self.user_entry.get()
        print("Comentário postado:", comment_text)
        self.user_entry.delete(0, tk.END)
        self.user_entry.insert(0, "Bio")


if __name__ == "__main__":
    app = CommentScreen()
    app.mainloop()
