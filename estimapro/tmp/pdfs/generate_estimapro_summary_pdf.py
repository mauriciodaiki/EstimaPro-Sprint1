from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

OUT_PATH = "output/pdf/estimapro_app_summary.pdf"

PAGE_W, PAGE_H = LETTER
MARGIN_X = 54
TOP = PAGE_H - 50
BOTTOM = 48

TITLE_COLOR = HexColor("#0f172a")
HEADER_COLOR = HexColor("#1d4ed8")
TEXT_COLOR = HexColor("#111827")
MUTED_COLOR = HexColor("#374151")

c = canvas.Canvas(OUT_PATH, pagesize=LETTER)


def draw_heading(text, y):
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(HEADER_COLOR)
    c.drawString(MARGIN_X, y, text)
    return y - 16


def draw_lines(lines, y, font="Helvetica", size=10, leading=13, color=TEXT_COLOR):
    c.setFont(font, size)
    c.setFillColor(color)
    for line in lines:
        c.drawString(MARGIN_X + 6, y, line)
        y -= leading
    return y


def draw_bullets(lines, y, size=10, leading=13):
    c.setFont("Helvetica", size)
    c.setFillColor(TEXT_COLOR)
    for line in lines:
        c.drawString(MARGIN_X + 6, y, u"- " + line)
        y -= leading
    return y


y = TOP

c.setFont("Helvetica-Bold", 17)
c.setFillColor(TITLE_COLOR)
c.drawString(MARGIN_X, y, "EstimaPro App Summary")

y -= 18
c.setFont("Helvetica", 9)
c.setFillColor(MUTED_COLOR)
c.drawString(MARGIN_X, y, "Source basis: repository evidence from /src, package.json, and README.md only.")

y -= 20
y = draw_heading("What It Is", y)
y = draw_lines([
    "EstimaPro is a single-page Vue 3 + Vite web app for creating and managing project cost",
    "estimations. It uses Firebase Authentication and Firestore for user access and data persistence.",
], y)

y -= 6
y = draw_heading("Who It Is For", y)
y = draw_lines([
    "Primary persona: Spanish-speaking freelancers or small teams who need per-user estimation tracking",
    "with quick create/edit/delete workflows and basic filtering.",
], y)

y -= 6
y = draw_heading("What It Does", y)
y = draw_bullets([
    "Registers and logs in users with Firebase Auth (email/password).",
    "Protects routes: guest-only login/register and auth-only dashboard.",
    "Creates, updates, lists, and deletes estimations stored in Firestore.",
    "Scopes records by authenticated userId when loading dashboard data.",
    "Validates estimation form fields (required text, numeric amount > 0).",
    "Filters estimations by client/project text and min/max amount range.",
    "Formats amounts as MXN currency and shows Spanish success/error feedback.",
], y)

y -= 6
y = draw_heading("How It Works (Architecture)", y)
y = draw_bullets([
    "UI Layer: Vue SFC views (Login, Register, Dashboard) + form/table components.",
    "Routing Layer: vue-router with beforeEach guard that waits for auth initialization.",
    "Auth Layer: useAuth composable wrapping Firebase Auth login/register/logout state.",
    "Data Layer: estimationsService performs Firestore CRUD on 'estimations' collection.",
    "Data Flow: User action -> component handler -> useAuth/service call -> Firebase -> UI refresh.",
    "Not found in repo: backend API service outside Firebase, queueing, analytics pipeline, tests.",
], y)

y -= 6
y = draw_heading("How To Run (Minimal)", y)
y = draw_bullets([
    "Install deps: npm install",
    "Start dev server: npm run dev",
    "Open the local URL printed by Vite (typically http://localhost:5173).",
    "Build production bundle: npm run build",
    "Preview build: npm run preview",
    "Not found in repo: explicit Node version requirement and .env-based Firebase setup.",
], y)

if y < BOTTOM:
    raise RuntimeError(f"Layout overflow detected; final y={y} below bottom={BOTTOM}")

c.showPage()
c.save()
print(OUT_PATH)
