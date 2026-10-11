import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def start():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}/index.html"
        print("=" * 65)
        print("  LAB VIRTUAL IPA: PETUALANGAN PENGUKURAN (KELAS VII SMP)")
        print("=" * 65)
        print(f"  Server berjalan pada: {url}")
        print("  Membuka browser otomatis...")
        print("  Tekan Ctrl + C di terminal ini untuk menghentikan server.")
        print("=" * 65)
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer dihentikan.")
            sys.exit(0)

if __name__ == "__main__":
    start()
