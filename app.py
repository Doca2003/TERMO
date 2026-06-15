import json
import random

palavras=["coisa", "amado", "junho", "basta" "sagaz","termo","negro","mexer","nobre","senso","afeto", "algoz","fazer","plena","assim","sobre"]

with open("palavras.json", "w") as f:
    json.dump(palavras, f)