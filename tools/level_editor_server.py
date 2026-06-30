#!/usr/bin/env python3
import argparse
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LEVELS_FILE = ROOT / "levels.js"


class LevelEditorHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self):
        if self.path.split("?", 1)[0] != "/api/deploy-levels":
            self.send_error(404)
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            body = self.rfile.read(length).decode("utf-8")
            payload = json.loads(body)
            levels = payload.get("levels")
            if not isinstance(levels, list) or not levels:
                raise ValueError("levels must be a non-empty list")

            content = "window.PIG_ESCAPE_LEVELS = "
            content += json.dumps(levels, ensure_ascii=False, indent=2)
            content += ";\n"
            LEVELS_FILE.write_text(content, encoding="utf-8")

            self.send_json({
                "ok": True,
                "levelCount": len(levels),
                "path": str(LEVELS_FILE),
            })
        except Exception as error:
            self.send_json({
                "ok": False,
                "error": str(error),
            }, status=400)

    def send_json(self, payload, status=200):
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def main():
    parser = argparse.ArgumentParser(description="小猪快跑关卡编辑器本地服务")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8033)
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), LevelEditorHandler)
    print(f"Level editor server: http://{args.host}:{args.port}/level-editor.html")
    print(f"Playtest: http://{args.host}:{args.port}/index.html")
    server.serve_forever()


if __name__ == "__main__":
    main()
