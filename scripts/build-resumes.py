"""Build the portfolio's generic English and Chinese resumes in public/resume/."""

import shutil
import tempfile
from pathlib import Path

from PIL import Image
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing, Rect
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    FrameBreak,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "resume"
OUT.mkdir(parents=True, exist_ok=True)
PORTFOLIO_DIR = Path(r"D:\Projects\Portfolio")

# Register fonts
ARIAL_REG = Path(r"C:\Windows\Fonts\arial.ttf")
ARIAL_BOLD = Path(r"C:\Windows\Fonts\arialbd.ttf")
SIMHEI_PATH = Path(r"C:\Windows\Fonts\simhei.ttf")

if ARIAL_REG.exists() and ARIAL_BOLD.exists():
    pdfmetrics.registerFont(TTFont("ArialMT", str(ARIAL_REG)))
    pdfmetrics.registerFont(TTFont("Arial-BoldMT", str(ARIAL_BOLD)))
    EN_FONT = "ArialMT"
    EN_FONT_BOLD = "Arial-BoldMT"
else:
    EN_FONT = "Helvetica"
    EN_FONT_BOLD = "Helvetica-Bold"

if SIMHEI_PATH.exists():
    pdfmetrics.registerFont(TTFont("SimHei", str(SIMHEI_PATH)))

INK = colors.HexColor("#17242b")
MUTED = colors.HexColor("#52636c")
ACCENT = colors.HexColor("#147f91")
LINE = colors.HexColor("#cbd8dc")


def style(name, size, leading=None, *, bold=False, color=INK, space_after=0, alignment=TA_LEFT):
    return ParagraphStyle(
        name=name,
        fontName=EN_FONT_BOLD if bold else EN_FONT,
        fontSize=size,
        leading=leading or size * 1.28,
        textColor=color,
        alignment=alignment,
        spaceAfter=space_after,
        allowWidows=0,
        allowOrphans=0,
    )


NAME = style("name", 20.0, 22.5, bold=True)
ROLE = style("role", 10.0, 13.0, bold=True, color=ACCENT)
CONTACT = style("contact", 8.95, 11.8, color=MUTED)
SECTION = style("section", 9.4, 11.6, bold=True, color=ACCENT)
ENTRY = style("entry", 9.9, 12.8, bold=True)
DATE = style("date", 9.0, 12.8, bold=True, color=MUTED, alignment=TA_RIGHT)
META = style("meta", 8.75, 11.4, color=MUTED)
BODY = style("body", 9.1, 12.15)
SMALL = style("small", 8.75, 11.6)

# Calibrated compact styles for the 6-project 1-page Technical Game Designer resume
T_NAME = style("t_name", 19.6, 21.8, bold=True)
T_ROLE = style("t_role", 9.8, 12.5, bold=True, color=ACCENT)
T_CONTACT = style("t_contact", 8.8, 11.4, color=MUTED)
T_SECTION = style("t_section", 9.2, 11.3, bold=True, color=ACCENT)
T_ENTRY = style("t_entry", 9.6, 12.1, bold=True)
T_DATE = style("t_date", 8.85, 12.1, bold=True, color=MUTED, alignment=TA_RIGHT)
T_META = style("t_meta", 8.5, 10.8, color=MUTED)
T_BODY = style("t_body", 8.85, 11.55)
T_SMALL = style("t_small", 8.55, 11.05)


def link(label, url, color="#147f91"):
    return f'<link href="{url}" color="{color}"><u>{label}</u></link>'


def header(role, portfolio, reel, *, compact=False):
    s_name = T_NAME if compact else NAME
    s_role = T_ROLE if compact else ROLE
    s_contact = T_CONTACT if compact else CONTACT
    display_portfolio = portfolio.replace("https://", "").rstrip("/")
    return [
        Paragraph("LEFI SHAN", s_name),
        Paragraph("Legal name: Kevin Shan  |  " + role, s_role),
        Spacer(1, 1.5 if compact else 2),
        Paragraph(
            "Los Angeles, CA  |  +1 626 693-4003  |  "
            + link("leficious@gmail.com", "mailto:leficious@gmail.com")
            + "  |  "
            + link("LinkedIn", "https://www.linkedin.com/in/leficious/")
            + "  |  "
            + link("itch.io", "https://leficious.itch.io/")
            + "  |  "
            + link("GitHub", "https://github.com/Leficious"),
            s_contact,
        ),
        Paragraph(
            "Portfolio: "
            + link(display_portfolio, portfolio)
            + "  |  "
            + link("Watch 2026 Reel" if compact else "Watch reel", reel),
            s_contact,
        ),
        Spacer(1, 5.0 if compact else 7),
    ]


def section(title, *, compact=False, width=525):
    s_sec = T_SECTION if compact else SECTION
    line = Table([[Paragraph(title.upper(), s_sec), ""]], colWidths=[310, width - 310])
    line.setStyle(
        TableStyle(
            [
                ("LINEBELOW", (0, 0), (-1, -1), 0.65, LINE),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.6 if compact else 2.0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return [line, Spacer(1, 3.2 if compact else 4.5)]


def project(title_html, subtitle, year, bullets, *, compact=False, width=525):
    s_entry = T_ENTRY if compact else ENTRY
    s_date = T_DATE if compact else DATE
    s_meta = T_META if compact else META
    s_body = T_BODY if compact else BODY
    date_w = 65 if compact else 80
    heading = Table(
        [[Paragraph(title_html, s_entry), Paragraph(year, s_date)]],
        colWidths=[width - date_w, date_w],
    )
    heading.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    block = [heading, Paragraph(subtitle, s_meta), Spacer(1, 0.8 if compact else 1.0)]
    for bullet in bullets:
        block.append(Paragraph("&#8226;  " + bullet, s_body))
        block.append(Spacer(1, 1.0 if compact else 1.5))
    block.append(Spacer(1, 2.8 if compact else 4.0))
    return KeepTogether(block)


def education(*, compact=False):
    s_small = T_SMALL if compact else SMALL
    return [
        Paragraph(
            f'<font name="{EN_FONT_BOLD}">University of Southern California</font>  |  M.S., Game Design and Development  |  Expected May 2028',
            s_small,
        ),
        Paragraph(
            f'<font name="{EN_FONT_BOLD}">Gnomon School of Visual Effects</font>  |  B.F.A., Digital Production - Games (Featured in Student Reel)  |  June 2025',
            s_small,
        ),
        Spacer(1, 3.8 if compact else 5),
    ]


def safe_copy_or_replace(src: Path, dst: Path):
    try:
        shutil.copy2(src, dst)
        return dst
    except PermissionError:
        alt = dst.with_name(dst.stem + "_updated.pdf")
        shutil.copy2(src, alt)
        print(f"Note: {dst.name} is open in another app; wrote {alt.name} instead.")
        return alt


def pdf(path, story, *, compact=False):
    tmp_path = path.with_name(path.stem + ".tmp.pdf")
    lr_margin = (0.54 if compact else 0.60) * inch
    top_margin = (0.38 if compact else 0.46) * inch
    bot_margin = (0.36 if compact else 0.44) * inch
    doc = BaseDocTemplate(
        str(tmp_path),
        pagesize=letter,
        leftMargin=lr_margin,
        rightMargin=lr_margin,
        topMargin=top_margin,
        bottomMargin=bot_margin,
        title=path.stem.replace("_", " "),
        author="Lefi Shan (Kevin Shan)",
    )
    frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        doc.height,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    doc.addPageTemplates(PageTemplate(id="resume", frames=frame))
    doc.build(story)
    safe_copy_or_replace(tmp_path, path)
    if PORTFOLIO_DIR.exists():
        safe_copy_or_replace(tmp_path, PORTFOLIO_DIR / path.name)
    tmp_path.unlink(missing_ok=True)


def technical_resume():
    w = int(letter[0] - 2 * 0.54 * inch)  # 534 pt
    story = header(
        "GAME, LEVEL & TECHNICAL DESIGNER  (LEVEL · COMBAT 3C · SYSTEMS)",
        "https://leficious.com/",
        "https://youtu.be/hphiglctUCw",
        compact=True,
    )
    story += [
        Paragraph(
            "Game, level, and technical designer building spatial puzzle architecture, combat 3C, and gameplay systems in Unity 6 and Unreal Engine 5, backed by Maya 3D modeling/rigging, environment production, and Python pipeline tooling.",
            T_BODY,
        ),
        Spacer(1, 5.5),
    ]
    story += section("Selected technical & level design projects", compact=True, width=w)
    story.append(
        project(
            link("Still Life", "https://leficious.com/projects/still-life")
            + "  |  "
            + link("Play on itch.io", "https://leficious.itch.io/still-life")
            + "  |  "
            + link("Trailer", "https://youtu.be/4zkp4cTV8LU")
            + "  |  "
            + link("GDD", "https://leficious.com/projects/still-life/Still_Life_GDD.pdf")
            + "  |  "
            + link("1-Page Pitch", "https://leficious.com/projects/still-life/Still_Life_1Page_Pitch.pdf"),
            "Solo Unity 6 prototype  |  Multi-floor puzzle & level design, C# companion AI, Maya rigging, and HLSL shaders",
            "2026",
            [
                "Architected a 200m, 5-room surrealist puzzle facility—anchored by a 3-story, 4-stage counterweight atrium requiring 100% allocation of a 235 kg animal pool across elevators, gap bridges, optical focus lenses, and gates—conditioning player habits for a wordless finale reversal.",
                "Engineered a 5-state C# Desk Lamp companion AI on an 18-joint Maya rig (procedural walk, flashbang flee, shivering, petting recovery), paired with zero-HUD tri-color floor conduit shaders, cold-vent/crusher gates, and HLSL printmaking post-processing (200+ FPS).",
            ],
            compact=True,
            width=w,
        )
    )
    story.append(
        project(
            link("An Echo Has No Shape", "https://leficious.com/projects/an-echo-has-no-shape")
            + "  |  "
            + link("Play on itch.io", "https://leficious.itch.io/an-echo-has-no-shape")
            + "  |  "
            + link("Trailer", "https://youtu.be/AAVAfjhv6IA")
            + "  |  "
            + link(
                "5-Page GDD",
                "https://leficious.com/projects/an-echo-has-no-shape/An_Echo_Has_No_Shape_GDD.pdf",
            ),
            "Solo 4-week Unity 6 prototype  |  Single-verb C# regional rulesets, level design, and 4-scale sightless wayfinding",
            "2026",
            [
                "Built a continuous 550m × 550m sightless acoustic labyrinth around a single echolocation input (Press E) connecting a central hub and three regional puzzles with zero HUD markers, minimaps, or loading screens, guided by a 4-scale non-UI wayfinding hierarchy.",
                "Scripted three regional C# rulesets that recontextualize the single ping without new controls—Siren phantom ice decoys, sequential 3-wing city loops, and 3.0s silence gates—adding a wave-clash cue after playtests showed E-spamming so players discover the pause rule.",
            ],
            compact=True,
            width=w,
        )
    )
    story.append(
        project(
            link("Fallen Valkyrie", "https://leficious.com/projects/fallen-valkyrie"),
            "Solo 10-week UE5 prototype  |  Combat 3C state machines, directional hit reactions, and multi-phase StateTree Boss AI",
            "2025",
            [
                "Designed a playable boss stage around unarmed, spear, and bow combat, weapon-dependent lock-on targeting (sphere trace vs. over-the-shoulder aim camera), delayed-regen stamina/mana pacing, and dot-product directional hit reactions.",
                "Implemented layered upper/lower-body Animation Blueprints, Anim Notify socket collision windows, Motion Warping, Kawaii Physics secondary motion, and reusable StateTree tasks with a mid-fight invulnerable aerial phase.",
            ],
            compact=True,
            width=w,
        )
    )
    story.append(
        project(
            link("Starshore", "https://leficious.com/projects/starshore"),
            "Solo 15-week UE5 prototype  |  Dual-mode locomotion 3C, GAS combat, and box-garden exploration",
            "2025",
            [
                "Built ground and high-speed flight locomotion, dash cancels, and a 5-hit combo; double-tap forward blends into flight and release or interruption transitions smoothly back to ground movement.",
                "Designed passive spell targeting within a 750-unit, 45-degree camera cone; connected GAS abilities (Attributes, Effects, Tags), physics-impulse loot, inventory, and dynamic grid vendors into one playable loop.",
            ],
            compact=True,
            width=w,
        )
    )
    story.append(
        project(
            link(
                "Grid-Based Tactical RPG Template",
                "https://leficious.com/gallery?entry=grid-based-tactical-rpg-template",
            ),
            "Solo UE5 systems prototype  |  Blueprint and UMG level-authoring tools",
            "2026",
            [
                "Implemented a snappable tactical grid, A* pathfinding, Dijkstra movement ranges, and path-cost previews alongside a UMG grid-authoring and passability debugging tool with reusable data-driven unit, class, and Animation Blueprint templates.",
            ],
            compact=True,
            width=w,
        )
    )
    story += section("Additional 3D production, technical art & pipeline work", compact=True, width=w)
    story.append(
        project(
            link("Stylize Normals Toolkit v3.0", "https://github.com/Leficious/MayaStylizedNormalsToolkit")
            + " & "
            + link("3D Environment / Rigging Pipeline", "https://leficious.com/gallery"),
            "Autodesk Maya, Python, Maya API, Unreal Engine 5, Houdini  |  Open-source tool, environment lighting, and rigging/animation",
            "2025-26",
            [
                "Developed an open-source multi-target Maya toolkit for generating, transferring, previewing, and repairing custom foliage/vertex normals; built stylized UE5 environments (Sacred Forest, Water Blossoms with RVT terrain & Houdini snow) and Maya IK/FK character rigs & animations.",
            ],
            compact=True,
            width=w,
        )
    )
    story += section("Education", compact=True, width=w)
    story += education(compact=True)
    story += section("Tools and skills", compact=True, width=w)
    story += [
        Paragraph(
            f'<font name="{EN_FONT_BOLD}">Level, Gameplay & Combat Design:</font> Unity 6 (C#, URP), Unreal Engine 5 (Blueprints, GAS, StateTree, Enhanced Input, UMG), multi-floor puzzle & box-garden layout, 3C & combat feel, non-UI spatial wayfinding, iterative playtesting, data-driven systems',
            T_SMALL,
        ),
        Spacer(1, 1.2),
        Paragraph(
            f'<font name="{EN_FONT_BOLD}">3D Production, Animation & Code:</font> Maya (3D modeling, IK/FK rigging, keyframe animation, Maya API), Animation Blueprints, Motion Warping, Anim Notifies, C#, Python, C++, HLSL/URP shaders, ZBrush, Substance 3D, Houdini, SpeedTree, Gaea, Niagara VFX, Git, Perforce',
            T_SMALL,
        ),
        Spacer(1, 1.2),
        Paragraph(
            f'<font name="{EN_FONT_BOLD}">AI-Assisted Workflows:</font> Antigravity, Codex (code & rapid engine prototyping); Stable Diffusion (ComfyUI, Automatic1111), chaiNNer (image generation & upscaling); Meshy AI (3D mesh generation), Suno (music), ElevenLabs (SFX & voice)',
            T_SMALL,
        ),
    ]
    out_path = OUT / "Leficious_Technical_Game_Designer_Resume.pdf"
    pdf(out_path, story, compact=True)
    print(f"Built: {out_path} ({out_path.stat().st_size} bytes)")


def environment_resume():
    story = header(
        "3D ENVIRONMENT & TECHNICAL ARTIST",
        "https://leficious.com/gallery",
        "https://www.youtube.com/watch?v=t5MchABcd3c",
    )
    story += [
        Paragraph(
            "Stylized 3D environments built through blockout, modeling, procedural materials, foliage, vista lighting, and realtime scene assembly in Unreal Engine 5, supported by Python/Maya API tooling.",
            BODY,
        ),
        Spacer(1, 8),
    ]
    story += section("Selected environment work")
    story.append(
        project(
            link("Sacred Forest", "https://leficious.com/projects/sacred-forest"),
            "Solo realtime scene  |  Unreal Engine 5, Maya, ZBrush, Substance 3D  |  Original concept by En Moroldo",
            "2026",
            [
                "Built the scene from greybox blockout, modular low-poly assets, and a sculpted shrine through procedural stone and bark materials, foliage atlases, warm-vs-cool vista lighting, Niagara VFX, and final UE5 assembly.",
                "Used Runtime Virtual Textures (RVT) to blend foliage and terrain seamlessly; automated custom vertex-normal transfers in Maya for consistent stylized lighting across trees, bushes, and grass.",
            ],
        )
    )
    story.append(
        project(
            link("Water Blossoms", "https://leficious.com/gallery?entry=water-blossoms"),
            "Environment & procedural snow  |  Unreal Engine 5, Houdini, SpeedTree, Gaea, Substance  |  Character by Idafaber",
            "2026",
            [
                "Modeled and textured the central bridge landmark; generated procedural snow accumulation in Houdini, terrain in Gaea, and stylized cherry-blossom foliage in SpeedTree with realtime UE5 lighting.",
            ],
        )
    )
    story.append(
        project(
            link("Alien Landscape", "https://leficious.com/gallery?entry=alien-landscape"),
            "Environment modeling and procedural assembly  |  Maya, Houdini, Redshift",
            "2025",
            [
                "Modeled modular environment assets, procedurally scattered and instanced them in Houdini, and completed look development and atmospheric lighting in Redshift.",
            ],
        )
    )
    story.append(
        project(
            link("Stylized Classroom - Illustration Match", "https://leficious.com/gallery?entry=stylized-classroom"),
            "3D environment implementation  |  Maya, Substance 3D Painter, V-Ray  |  Illustration by ArseniXC",
            "2024",
            [
                "Translated a 2D illustration into a 3D architectural scene from greybox blockout to final render, matching its perspective composition, stylized materials, and directional sun/bounce lighting.",
            ],
        )
    )
    story += section("Related technical art & pipeline tools")
    story.append(
        project(
            link("Stylize Normals Toolkit v3.0", "https://github.com/Leficious/MayaStylizedNormalsToolkit"),
            "Maya, Python, Maya API  |  Open-source foliage and vertex-normal toolkit",
            "2025-26",
            [
                "Developed a multi-target Maya toolkit for ovoid projection, custom proxy mesh transfer, directional normal blending, live viewport preview/comparison, and batch normal repair with one-step undo.",
            ],
        )
    )
    story += section("Education")
    story += education()
    story += section("Tools and production")
    story += [
        Paragraph(
            f'<font name="{EN_FONT_BOLD}">Environment & 3D:</font> Unreal Engine 5 (RVT, Foliage, Niagara), Maya, ZBrush, Substance 3D Painter & Designer, Houdini, SpeedTree, Gaea',
            SMALL,
        ),
        Spacer(1, 1.5),
        Paragraph(
            f'<font name="{EN_FONT_BOLD}">Rendering & Technical Art:</font> V-Ray, Redshift, Python, Maya API, MEL, HLSL/URP shaders, procedural materials, foliage cards, UVs, high-to-low poly baking, Photoshop',
            SMALL,
        ),
        Spacer(1, 1.5),
        Paragraph(
            f'<font name="{EN_FONT_BOLD}">AI-Assisted Workflows:</font> Stable Diffusion (ComfyUI, Automatic1111), chaiNNer (texture/image upscaling), Meshy AI (rapid 3D mesh blockouts), Antigravity, Codex',
            SMALL,
        ),
    ]
    out_path = OUT / "Leficious_3D_Environment_Artist_Resume.pdf"
    pdf(out_path, story)
    print(f"Built: {out_path} ({out_path.stat().st_size} bytes)")


# ==================== GENERIC CHINESE 2-PAGE VISUAL RESUME ====================
PAGE_W, PAGE_H = A4  # 595.27 x 841.89 pt
DARK_BG = colors.HexColor("#101b21")
CARD_BG = colors.HexColor("#f3f7f8")
CARD_BORDER = colors.HexColor("#cfe0e3")
CN_INK = colors.HexColor("#18242b")
CN_MUTED = colors.HexColor("#586973")
TEAL = colors.HexColor("#148578")
TEAL_BRIGHT = colors.HexColor("#2fd4c0")
CN_LINE = colors.HexColor("#d3dde0")
WHITE = colors.HexColor("#ffffff")
HEADER_MUTED = colors.HexColor("#b6c7ce")

PORTRAIT_WEBP = ROOT / "public" / "about" / "lefi-shan-portrait.webp"
PHOTO_OPT_PATH = Path(tempfile.gettempdir()) / "lefi_shan_cn_resume_portrait.jpg"


def ensure_opt_photo():
    if PORTRAIT_WEBP.exists():
        im = Image.open(PORTRAIT_WEBP).convert("RGBA")
        w, h = im.size
        s = min(w, h)
        im = im.crop(((w - s) // 2, 0, (w + s) // 2, s))
        bg = Image.new("RGB", im.size, (16, 27, 33))
        bg.paste(im, mask=im.split()[3])
        bg = bg.resize((360, 360), Image.Resampling.LANCZOS)
        bg.save(PHOTO_OPT_PATH, "JPEG", quality=92, optimize=True)
    return PHOTO_OPT_PATH


def cstyle(name, size, leading=None, *, color=CN_INK, align=TA_LEFT, space_after=0):
    return ParagraphStyle(
        name=name,
        fontName="SimHei",
        fontSize=size,
        leading=leading or size * 1.38,
        textColor=color,
        alignment=align,
        spaceAfter=space_after,
        wordWrap="CJK",
    )


S_SEC_CN = cstyle("sec_cn", 11.0, 14.0, color=CN_INK)
S_SEC_EN = cstyle("sec_en", 7.0, 14.0, color=CN_MUTED, align=TA_RIGHT)
S_BODY = cstyle("cn_body", 7.95, 11.35, color=CN_INK)
S_SMALL = cstyle("cn_small", 7.6, 10.85, color=CN_INK)
S_MUTED = cstyle("cn_muted", 7.45, 10.6, color=CN_MUTED)
S_SUBHEAD = cstyle("cn_subhead", 8.2, 11.4, color=TEAL)
S_PROJ_TITLE = cstyle("proj_title", 9.1, 12.1, color=CN_INK)
S_PROJ_TAG = cstyle("proj_tag", 6.85, 12.1, color=TEAL, align=TA_RIGHT)
S_TABLE_HEAD = cstyle("th", 7.6, 10.5, color=CN_MUTED)
S_TABLE_GAME = cstyle("tg", 8.0, 11.2, color=CN_INK)
S_TABLE_TIME = cstyle("tt", 7.6, 11.0, color=TEAL)
S_TABLE_DESC = cstyle("td", 7.55, 10.9, color=CN_INK)


def cn_section_header(cn_title, en_title, width, spacing_after=4.0):
    t = Table(
        [[Paragraph(cn_title, S_SEC_CN), Paragraph(en_title.upper(), S_SEC_EN)]],
        colWidths=[width * 0.62, width * 0.38],
    )
    t.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2.3),
                ("LINEBELOW", (0, 0), (-1, 0), 1.1, TEAL),
            ]
        )
    )
    return [t, Spacer(1, spacing_after)]


def green_dot_bullet(text, width, bottom_pad=1.6):
    dot = Drawing(6, 9)
    dot.add(Rect(0, 2.2, 4.2, 4.2, fillColor=TEAL, strokeColor=None, rx=1, ry=1))
    t = Table([[dot, Paragraph(text, S_BODY)]], colWidths=[9, width - 9])
    t.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), bottom_pad),
            ]
        )
    )
    return t


def project_block(title_html, tag_text, bullets, width, title_ratio=0.72, space_after=3.4):
    hdr = Table(
        [[Paragraph(title_html, S_PROJ_TITLE), Paragraph(tag_text, S_PROJ_TAG)]],
        colWidths=[width * title_ratio, width * (1.0 - title_ratio)],
    )
    hdr.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
            ]
        )
    )
    items = [hdr]
    for b in bullets:
        items.append(green_dot_bullet(b, width))
    items.append(Spacer(1, space_after))
    return KeepTogether(items)


def card_box(title, body_lines, width, vpad=3.8):
    inner = [Paragraph(f'<font color="#148578">{title}</font>', S_SUBHEAD), Spacer(1, 1.4)]
    for line in body_lines:
        inner.append(Paragraph(line, S_SMALL))
        inner.append(Spacer(1, 0.9))
    t = Table([[inner]], colWidths=[width])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), CARD_BG),
                ("BOX", (0, 0), (-1, -1), 0.7, CARD_BORDER),
                ("LEFTPADDING", (0, 0), (-1, -1), 6.5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6.5),
                ("TOPPADDING", (0, 0), (-1, -1), vpad),
                ("BOTTOMPADDING", (0, 0), (-1, -1), vpad),
            ]
        )
    )
    return t


def draw_cn_page1_bg(canvas, doc):
    canvas.saveState()
    banner_h = 128
    canvas.setFillColor(DARK_BG)
    canvas.rect(0, PAGE_H - banner_h, PAGE_W, banner_h, fill=1, stroke=0)

    canvas.setFont("SimHei", 23)
    canvas.setFillColor(WHITE)
    canvas.drawString(30, PAGE_H - 38, "单凯飞")
    canvas.setFont("SimHei", 11.5)
    canvas.setFillColor(TEAL_BRIGHT)
    canvas.drawString(108, PAGE_H - 37, "KEVIN (LEFI) SHAN")

    canvas.setFont("SimHei", 10.5)
    canvas.setFillColor(TEAL_BRIGHT)
    canvas.drawString(30, PAGE_H - 57, "游戏与关卡策划 · 战斗策划 · 3C与技术设计（Unity 6 / UE5 / Maya）")

    rows = [
        ("联系方式", "+1 626 693-4003  |  leficious@gmail.com  |  微信 LeficiousTepes"),
        ("作品与署名", "leficious.com/zh(国内直连) | 2026实机混剪 | 中文:单凯飞 / 法定名:Kevin Shan / 署名:Lefi Shan"),
        ("身份与到岗", "2028届硕士（2028.05毕业） · 加拿大籍 · 现居洛杉矶 · 可赴国内线下实习或全职工作"),
        ("求职方向", "关卡策划  |  战斗策划  |  3C与技术游戏设计  |  玩法系统策划  |  技术动画与3D制作"),
    ]
    y = PAGE_H - 76
    for label, val in rows:
        canvas.setFont("SimHei", 8.0)
        canvas.setFillColor(TEAL_BRIGHT)
        canvas.drawString(30, y, label)
        canvas.setFillColor(HEADER_MUTED)
        canvas.drawString(80, y, val)
        y -= 13.0

    canvas.linkURL("https://leficious.com/zh", (80, PAGE_H - 93, 198, PAGE_H - 80), relative=0)
    canvas.linkURL("https://youtu.be/hphiglctUCw", (204, PAGE_H - 93, 260, PAGE_H - 80), relative=0)

    photo_path = ensure_opt_photo()
    if photo_path.exists():
        photo_size = 92
        px = PAGE_W - 30 - photo_size
        py = PAGE_H - banner_h + (banner_h - photo_size) / 2
        canvas.setStrokeColor(TEAL_BRIGHT)
        canvas.setLineWidth(1.2)
        canvas.rect(px - 2, py - 2, photo_size + 4, photo_size + 4, fill=0, stroke=1)
        canvas.drawImage(str(photo_path), px, py, width=photo_size, height=photo_size, preserveAspectRatio=True)

    canvas.setStrokeColor(CN_LINE)
    canvas.setLineWidth(0.6)
    canvas.line(30, 28, PAGE_W - 30, 28)
    canvas.setFont("SimHei", 7.5)
    canvas.setFillColor(CN_MUTED)
    canvas.drawString(30, 16, "单凯飞 KEVIN (LEFI) SHAN  ·  关卡策划 / 战斗策划 / 技术游戏设计  ·  leficious.com/zh")
    canvas.drawRightString(PAGE_W - 30, 16, "01 / 02")
    canvas.restoreState()


def draw_cn_page2_bg(canvas, doc):
    canvas.saveState()
    banner_h = 44
    canvas.setFillColor(DARK_BG)
    canvas.rect(0, PAGE_H - banner_h, PAGE_W, banner_h, fill=1, stroke=0)

    canvas.setFont("SimHei", 13.0)
    canvas.setFillColor(WHITE)
    canvas.drawString(30, PAGE_H - 27, "关卡与战斗反拆 · 核心游戏经历 · 3D制作与技术美术背景")
    canvas.setFont("SimHei", 7.6)
    canvas.setFillColor(TEAL_BRIGHT)
    canvas.drawRightString(PAGE_W - 30, PAGE_H - 26, "DECONSTRUCTION · GAME HISTORY · 3D & TECH ART")

    canvas.setStrokeColor(CN_LINE)
    canvas.setLineWidth(0.6)
    canvas.line(30, 28, PAGE_W - 30, 28)
    canvas.setFont("SimHei", 7.5)
    canvas.setFillColor(CN_MUTED)
    canvas.drawString(30, 16, "单凯飞 KEVIN (LEFI) SHAN  ·  关卡策划 / 战斗策划 / 技术游戏设计  ·  leficious.com/zh")
    canvas.drawRightString(PAGE_W - 30, 16, "02 / 02")
    canvas.restoreState()


def chinese_resume():
    left_w = 172
    gap = 18
    right_w = PAGE_W - 60 - left_w - gap

    p1_top = PAGE_H - 140
    p1_bottom = 36
    p1_h = p1_top - p1_bottom
    f1_left = Frame(30, p1_bottom, left_w, p1_h, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0, id="p1_left")
    f1_right = Frame(30 + left_w + gap, p1_bottom, right_w, p1_h, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0, id="p1_right")

    p2_left_w = 310
    p2_right_w = PAGE_W - 60 - p2_left_w - gap
    p2_top = PAGE_H - 54
    p2_bottom = 34
    p2_h = p2_top - p2_bottom
    f2_left = Frame(30, p2_bottom, p2_left_w, p2_h, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0, id="p2_left")
    f2_right = Frame(30 + p2_left_w + gap, p2_bottom, p2_right_w, p2_h, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0, id="p2_right")

    out_path = OUT / "Kevin_Shan_CN_Game_Resume.pdf"
    doc = BaseDocTemplate(
        str(out_path),
        pagesize=A4,
        title="单凯飞 Kevin (Lefi) Shan - 游戏开发简历（关卡策划 · 战斗策划 · 技术设计）",
        author="单凯飞 / Kevin (Lefi) Shan",
    )
    doc.addPageTemplates(
        [
            PageTemplate(id="Page1", frames=[f1_left, f1_right], onPage=draw_cn_page1_bg),
            PageTemplate(id="Page2", frames=[f2_left, f2_right], onPage=draw_cn_page2_bg),
        ]
    )

    story = []

    # ==================== PAGE 1 LEFT ====================
    story += cn_section_header("个人概况", "PROFILE", left_w)
    story.append(
        Paragraph(
            "专注于将空间关卡设计（多层立体配重解谜、四尺度无 UI 导引、无台词机制叙事与试玩迭代）与实时动作战斗机制（角色/敌人 3C 状态机、受击表现与镜头索敌）在 Unity 6 与 UE5 中落地为可玩原型。兼具 USC 游戏设计训练与 Gnomon 3D 场景、Maya 绑定和动画功底，能用白盒、参数与原型高效协同程序、动画、TA 与美术。",
            S_BODY,
        )
    )
    story.append(Spacer(1, 5.5))

    story += cn_section_header("核心能力", "CORE SKILLS", left_w)
    skills = [
        (
            "关卡与箱庭设计",
            "Unity 6 (URP / C#)、UE5 白盒搭建、多层立体配重与门锁架构、零 HUD 动线引导、单一动词与习惯反转机制递进、试玩迭代、A* / Dijkstra 战棋网格寻路、建筑级关卡平面图与 GDD",
        ),
        (
            "战斗机制与 3C 表现",
            "UE5 Animation Blueprint、状态机、Blend Space、上下半身分层混合、Anim Notify 骨骼判定窗、点积方向受击反馈、StateTree 多阶段 Boss AI、GAS 技能框架、越肩/圆锥索敌镜头",
        ),
        (
            "程序思维与管线工具",
            "C#、Python、UE5 Blueprint、C++、HLSL / URP 着色器、Maya API、MEL、UMG 关卡编辑器开发、数据驱动（Data Table）、Git、Perforce",
        ),
        (
            "3D 制作、绑定与视听功底",
            "精通 Autodesk Maya（建模/IK-FK绑定/动画）、ZBrush、Substance 3D、Yeti、SpeedTree、Gaea、Houdini、Niagara VFX；具备手绘透视与分镜构图基础",
        ),
        (
            "AI 全流程辅助研发",
            "Antigravity、Codex（代码与引擎原型验证）；Stable Diffusion (ComfyUI / Automatic1111)、chaiNNer（图像生成与超分）；Meshy AI（3D 网格白盒）、Suno（配乐）、ElevenLabs（SFX 音效与语音）",
        ),
    ]
    for title, desc in skills:
        story.append(Paragraph(title, S_SUBHEAD))
        story.append(Paragraph(desc, S_MUTED))
        story.append(Spacer(1, 3.4))

    story.append(Spacer(1, 1.5))
    story += cn_section_header("教育经历", "EDUCATION", left_w)
    story.append(Paragraph("南加州大学 (USC)  <font color='#148578'>预计 2028.05</font>", S_BODY))
    story.append(Paragraph("电影艺术学院 · 游戏设计与开发硕士 (M.S.)", S_MUTED))
    story.append(Spacer(1, 3.2))
    story.append(Paragraph("Gnomon 视觉特效学院  <font color='#148578'>2025.06</font>", S_BODY))
    story.append(Paragraph("数字制作（游戏）美术学士 (B.F.A.)；作品入选校方学生作品集 (Student Reel)", S_MUTED))
    story.append(Spacer(1, 5.5))

    story += cn_section_header("跨学科优势", "HYBRID EDGE", left_w)
    story.append(
        green_dot_bullet(
            "懂 3D 制作与程序的关卡策划：精通 Maya 建模绑定与 Unity 6 / UE5 实现，能独立完成多层建筑平面图、白盒验证、视线引导（Vista）与着色器视觉反馈。",
            left_w,
        )
    )
    story.append(
        green_dot_bullet(
            "懂绑定与律动的战斗策划：亲手做过角色骨骼绑定、跑酷动画及竞技花样滑冰/舞蹈，能精准拆解重心转移、前后摇缓冲、判定帧与受击镜头反馈。",
            left_w,
        )
    )

    story.append(FrameBreak())

    # ==================== PAGE 1 RIGHT ====================
    story += cn_section_header("重点可玩原型（关卡 · 战斗 · 3D与工具）", "SELECTED PROJECTS", right_w)

    story.append(
        project_block(
            link("静物 Still Life", "https://leficious.com/zh/projects/still-life", "#148578")
            + "｜"
            + link("[中文GDD]", "https://leficious.com/projects/still-life/Still_Life_GDD_ZH.pdf", "#148578")
            + " "
            + link("[英文GDD]", "https://leficious.com/projects/still-life/Still_Life_GDD.pdf", "#148578")
            + " "
            + link("[试玩]", "https://leficious.itch.io/still-life", "#148578"),
            "UNITY 6 · MAYA · C# · 2026",
            [
                "三层立体满额配重与无台词反转：独立完成纵深 200m 的五厅超现实解谜展馆；核心 2 号房采用三层立体大厅与四阶段 235 kg 满额配重推进（每解锁新动物均须将已解锁总重 100% 同步分配于升降梯、4.2m 断口桥梁、聚光灯座与门锁，0 kg 剩余），3 号房以“取走即断电”冷风踏板与冲压机齿轮卡塞反转常规逻辑，借操作习惯铺垫终局粉碎机的无台词叙事反转。",
                "五状态伙伴 AI、Maya 绑定与零 HUD 导流线：在 Maya 中自制台灯 18 骨骼硬件绑定并由 C# 程序化驱动，实现受惊逃跑、角落发抖、抚摸回暖、跳跃跟随与遇险停步五态 AI；配合聚光定身宝箱怪、三色地面导流线着色器与 HLSL 版画后处理（静态网格合并保持 200+ FPS）。",
            ],
            right_w,
            title_ratio=0.67,
        )
    )

    story.append(
        project_block(
            link("回声无形 An Echo Has No Shape", "https://leficious.com/zh/projects/an-echo-has-no-shape", "#148578")
            + "｜"
            + link("[中文GDD]", "https://leficious.com/projects/an-echo-has-no-shape/An_Echo_Has_No_Shape_GDD_ZH.pdf", "#148578")
            + " "
            + link("[英文GDD]", "https://leficious.com/projects/an-echo-has-no-shape/An_Echo_Has_No_Shape_GDD.pdf", "#148578")
            + " "
            + link("[试玩]", "https://leficious.itch.io/an-echo-has-no-shape", "#148578"),
            "UNITY 6 · C# · 2026",
            [
                "单一动词与三区域关卡递进：4 周独立搭建 550m×550m 无视觉声学盆地（零 HUD、零小地图、零加载）；全程锁定单一按键（按 E 释放回声），通过改变区域回应规则推进解谜：冰川之海（塞壬干扰波隐藏实冰并伪造诱饵冰）、遗忘之城（三翼街区顺序唤醒闭环）、幻影之森（唯有静默停顿 3.0s 才会让路的活体迷宫）。",
                "四尺度无 UI 寻路与试玩迭代：构建宏观天际光柱、中观双层体积雾/分轨配乐、微观声学流光与贴身常驻剪影四级导引；针对试玩中玩家高频连按 E 错过静默机制的问题，加入声波对撞与树墙闭合反馈，引导玩家自然领悟停顿解法。",
            ],
            right_w,
            title_ratio=0.77,
        )
    )

    story.append(
        project_block(
            link("Fallen Valkyrie", "https://leficious.com/zh/projects/fallen-valkyrie", "#148578")
            + "｜3C动作战斗机制与多阶段 Boss 战原型",
            "UNREAL ENGINE 5 · 2025",
            [
                "武器差异化 3C 与方向受击判定：10 周独立完成可玩 Boss 关卡；构建空手/长枪/弓箭三态移动状态机与上下半身分层混合，长枪球形检测锁敌、弓箭切换越肩自由瞄准；武器碰撞仅在 Anim Notify 窗口激活，结合短距射线与 Forward/Right 点积触发多向受击或击倒打断，配合 2.0s 延迟回耐节奏与 Kawaii Physics 次级惯性。",
                "锁场流程与多阶段 StateTree Boss AI：以触发器与事件计数控制关卡推进；用可复用 StateTree Task 按距离与权重调度近战、突进与法术，二阶段血量阈值强制触发升空无敌与弹幕压场。",
            ],
            right_w,
            title_ratio=0.74,
        )
    )

    story.append(
        project_block(
            link("Starshore", "https://leficious.com/zh/projects/starshore", "#148578")
            + "｜双态高速移动 3C、GAS 战斗与箱庭探索原型",
            "UNREAL ENGINE 5 · 2025",
            [
                "双态移动 3C 与 GAS 探索闭环：15 周独立开发二次元动作角色控制器，支持双击前进无缝切入高速飞行、闪避取消与五段连击，设计 750u / 45° 镜头圆锥被动法术索敌；基于 GAS（Attribute / Effect / Tag）解耦技能冷却与反馈，并用 Data Table 串联稀有度物理掉落、模块化背包与动态网格商店。",
            ],
            right_w,
        )
    )

    story.append(
        project_block(
            link("战棋网格模板", "https://leficious.com/zh/gallery?entry=grid-based-tactical-rpg-template", "#148578")
            + " & "
            + link("Stylize Normals Toolkit", "https://github.com/Leficious/MayaStylizedNormalsToolkit", "#148578")
            + "｜关卡与3D工具",
            "UE5 · MAYA · PYTHON",
            [
                "UE5 战棋关卡编辑器：实现吸附式战术网格、A* 寻路、Dijkstra 移动范围与路径耗时预览，开发 UMG 网格生成与通行调试工具，配套可复用兵种数据结构与动画蓝图模板。",
                "Maya 开源法线工具与实时环境：独立完成《Sacred Forest》风格化场景（Maya/ZBrush/Substance/UE5 RVT），用 Python + Maya API 开发法线工具集 v3.0，支持多物体法线传递、实时预览对比与单步撤销。",
            ],
            right_w,
            title_ratio=0.75,
        )
    )

    story.append(
        card_box(
            "核心可交付内容  DELIVERABLES",
            [
                "可玩 Unity 6 / UE5 原型 Demo  ·  建筑级多层关卡平面图与白盒  ·  Maya 骨骼绑定与战斗状态机  ·  完整中英文 GDD  ·  Python / UMG 工具与 2026 实机混剪（见 leficious.com/zh）",
            ],
            right_w,
            vpad=3.4,
        )
    )

    story.append(NextPageTemplate("Page2"))
    story.append(PageBreak())

    # ==================== PAGE 2 LEFT ====================
    story += cn_section_header("核心游戏经历（深度精选）", "SELECTED GAME MASTERY", p2_left_w)

    game_rows = [
        [
            Paragraph("游戏名称", S_TABLE_HEAD),
            Paragraph("投入 / 核心成就", S_TABLE_HEAD),
            Paragraph("关卡空间 / 战斗 3C / 系统拆解关注点", S_TABLE_HEAD),
        ],
        [
            Paragraph("明日方舟：终末地\nArknights: Endfield", S_TABLE_GAME),
            Paragraph("250+ 小时\n满级深度体验\n箱庭与小队3C研究", S_TABLE_TIME),
            Paragraph(
                "重点研究 3D 小队同屏实时战斗的 3C 操控切换、连携技释放窗口与敌人破韧/失衡节奏，以及箱庭区域高低差滑索动线、视觉地标引导与自动化基建空间的融合。",
                S_TABLE_DESC,
            ),
        ],
        [
            Paragraph("绝区零\nZenless Zone Zero", S_TABLE_GAME),
            Paragraph("500+ 小时\n绳网 60 级（满级）\n高频动作重点反拆", S_TABLE_TIME),
            Paragraph(
                "深入反拆夸张形变关键帧、顿帧（Hit-stop）、招架支援/连携技的镜头推拉与打断窗口（Cancel Window），以及高对比 UI/VFX 如何强化动作节奏与波次引导。",
                S_TABLE_DESC,
            ),
        ],
        [
            Paragraph("Epic Seven\n第七史诗", S_TABLE_GAME),
            Paragraph("3000+ 小时\nRTA 王者 (Emperor)\n竞技场全球前30 ×2", S_TABLE_TIME),
            Paragraph(
                "全球前三公会 Parabellum 1 负责人；深入拆解行动条（CR）配速区间、伤害乘区公式、BP 博弈与公会战防守阵容解法，编写多篇量化机制指南。",
                S_TABLE_DESC,
            ),
        ],
        [
            Paragraph("火焰之纹章系列\nFire Emblem", S_TABLE_GAME),
            Paragraph("1000+ 小时\n多部正作高难通关\n风花雪月角色Mod", S_TABLE_TIME),
            Paragraph(
                "深入研究《暗夜王国 (Conquest)》网格关卡的地形阻断、敌方威胁范围重叠与回合限制设计，并独立制作发布《风花雪月 (Three Houses)》可玩角色 Mod。",
                S_TABLE_DESC,
            ),
        ],
        [
            Paragraph("崩坏：星穹铁道\n& 原神", S_TABLE_GAME),
            Paragraph("星铁 1000+h / TL70\n原神 200+h / AR57", S_TABLE_TIME),
            Paragraph(
                "研究《星铁》角色动作剪影、镜头演出与立体箱庭解谜动线；分析《原神》开放世界移动耐力循环、元素交互与地标视线引导（Vista）。",
                S_TABLE_DESC,
            ),
        ],
        [
            Paragraph("宝可梦系列 &\n东方 Project 6/7/8", S_TABLE_GAME),
            Paragraph("宝可梦 500+h (Nuzlocke)\n东方 200+ 小时", S_TABLE_TIME),
            Paragraph(
                "研究高难 Nuzlocke 限制规则下的资源容错与成长曲线，以及弹幕游戏中高密度投射物的色彩对比、判定点信息可读性与难度阶梯。",
                S_TABLE_DESC,
            ),
        ],
    ]

    gt = Table(game_rows, colWidths=[76, 74, p2_left_w - 150])
    gt.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), CARD_BG),
                ("LINEBELOW", (0, 0), (-1, 0), 0.8, TEAL),
                ("LINEBELOW", (0, 1), (-1, -1), 0.4, CN_LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 3.5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 3.5),
                ("TOPPADDING", (0, 0), (-1, -1), 3.8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3.8),
            ]
        )
    )
    story.append(gt)
    story.append(Spacer(1, 7.5))

    story += cn_section_header("3D 制作、技术动画与 VFX 功底", "3D PRODUCTION & TECH ART", p2_left_w)

    story.append(
        project_block(
            link("Tenebria｜角色绑定与发卡", "https://leficious.com/zh/gallery?entry=tenebria", "#148578")
            + " & "
            + link("角色跑酷动画练习", "https://leficious.com/zh/gallery?entry=parkour-animation", "#148578"),
            "MAYA · ZBRUSH · YETI",
            [
                "独立完成游戏角色建模、拓扑、贴图、骨骼控制器（IK/FK）绑定与蒙皮权重，在 Yeti 中搭建节点网络程序化生成发卡；完成跑酷、体操与坐姿角色动画练习，深入理解运动规律与重心。",
            ],
            p2_left_w,
            title_ratio=0.72,
            space_after=3.5,
        )
    )

    story.append(
        project_block(
            link("魔方爆裂 VFX", "https://leficious.com/zh/gallery?entry=rubiks-cube-vfx", "#148578")
            + " & "
            + link("追踪弹体 VFX", "https://leficious.com/zh/gallery?entry=targeted-projectile-vfx", "#148578")
            + " & "
            + link("MEL 发条平台", "https://leficious.com/zh/gallery?entry=clockwork-platform", "#148578"),
            "UE5 NIAGARA · MEL",
            [
                "结合自制 Maya 魔方绑定、分层 Niagara 粒子与蓝图时序控制实现实时战斗爆发与追踪弹体特效；用 MEL 脚本完整驱动机械发条平台的齿轮联动与程序化动画。",
            ],
            p2_left_w,
            title_ratio=0.74,
            space_after=3.5,
        )
    )

    story.append(
        project_block(
            link("Sacred Forest", "https://leficious.com/zh/projects/sacred-forest", "#148578")
            + " & "
            + link("Water Blossoms", "https://leficious.com/zh/gallery?entry=water-blossoms", "#148578")
            + " & "
            + link("手绘透视/分镜", "https://leficious.com/zh/gallery?entry=architectural-sketches", "#148578"),
            "UE5 · HOUDINI · 手绘",
            [
                "使用 UE5 RVT、SpeedTree、Gaea 与 Houdini 完成实时场景构建、程序化散布及从白盒到成品的冷暖光影地标引导（Vista）；具备扎实铅笔透视手绘、悬浮岛概念及电影分镜景别/构图拆解功底。",
            ],
            p2_left_w,
            title_ratio=0.74,
            space_after=3.5,
        )
    )

    story.append(
        project_block(
            link("Fire Emblem: Three Houses 可玩角色改版 Mod", "https://gamebanana.com/mods/525896", "#148578"),
            "GAMEBANANA · 2024",
            [
                "独立制作并在 GameBanana 公开发布《火焰之纹章：风花雪月》可玩角色替换与配置 Mod（Playable Sothis）。",
            ],
            p2_left_w,
            title_ratio=0.74,
            space_after=2.0,
        )
    )

    story.append(FrameBreak())

    # ==================== PAGE 2 RIGHT ====================
    story += cn_section_header("关卡与战斗专项反拆", "DECONSTRUCTION", p2_right_w)

    story.append(
        card_box(
            "① 《终末地》箱庭动线与《绝区零》战斗反拆",
            [
                "· 箱庭探索与小队战斗协同：《终末地》通过高低差地形、滑索网络与工业地标建立清晰空间回路，并在同屏小队战斗中以破韧/失衡条与连携触发窗串联多角色策略与动作爽感。",
                "· 输入缓存与帧级受击反馈：《绝区零》将招式拆分为前摇、判定帧、派生窗与后摇恢复帧，配合输入缓存、闪避/支援高打断优先级、顿帧（Hit-stop）与镜头 FOV 阻尼回弹，兼顾高速手感与场面可读性。",
            ],
            p2_right_w,
            vpad=3.6,
        )
    )
    story.append(Spacer(1, 3.8))

    story.append(
        card_box(
            "② 身体律动向战斗动作需求的转化",
            [
                "· 竞技花样滑冰与芭蕾/拉丁舞训练让我对重心转移、角动量、预备缓冲与跟随恢复高度敏感；在《Fallen Valkyrie》与《Starshore》中将其转化为起步/急停 Blend Space、上下半身分层槽、Kawaii Physics 次级惯性及点积方向受击判定。",
            ],
            p2_right_w,
            vpad=3.6,
        )
    )
    story.append(Spacer(1, 3.8))

    story.append(
        card_box(
            "③ 零 HUD 空间引导、配重闭环与试玩迭代",
            [
                "· 在《静物》《回声无形》与《火焰之纹章》实践中，坚持用“空间拓扑、地面导流线与操作习惯”替代文字说教：以 100% 满额配重锁死跳关漏洞，用常驻剪影与错误操作的即时状态反馈引导直觉探索，并通过试玩持续打磨关卡可读性。",
            ],
            p2_right_w,
            vpad=3.6,
        )
    )
    story.append(Spacer(1, 5.5))

    story += cn_section_header("社区与团队领导力", "LEADERSHIP", p2_right_w)
    story.append(Paragraph("Parabellum 1｜Epic Seven 全球前三公会负责人", S_PROJ_TITLE))
    story.append(Spacer(1, 1.8))
    story.append(
        green_dot_bullet(
            "搭建 Excel 出勤、胜率与资源效率看板，统筹 Parabellum 1/2/3 三家分团（~90 名成员）阵容调配与招新。",
            p2_right_w,
        )
    )
    story.append(
        green_dot_bullet(
            "管理约 500 人 Discord 社区，组织团战语音复盘与对手侦察，编写速度区间、伤害乘区与战斗机制计算指南。",
            p2_right_w,
        )
    )
    story.append(Spacer(1, 5.0))

    story += cn_section_header("音乐背景与工作方式", "INTERESTS & STYLE", p2_right_w)
    story.append(
        Paragraph(
            "<font color='#148578'>音乐与节奏：</font>学习钢琴与大提琴约 15 年，曾于纽约 Carnegie Hall 演出并担任 Vancouver Youth Symphony 与 Vanstrings 首席大提琴；对动作节拍、音画帧同步与关卡情绪起伏有敏锐直觉。",
            S_SMALL,
        )
    )
    story.append(Spacer(1, 2.2))
    story.append(
        Paragraph(
            "<font color='#148578'>工作方式：</font>习惯先在引擎中做出可玩白盒与 3C 原型，再结合试玩反馈与帧级动画表现持续打磨；重视提前交付与跨工种沟通。",
            S_SMALL,
        )
    )
    story.append(Spacer(1, 5.5))

    story += cn_section_header("作品链接与直达二维码", "PORTFOLIO LINKS", p2_right_w)

    links_data = [
        [Paragraph("作品集主站（国内直连）", S_MUTED), Paragraph(link("leficious.com/zh", "https://leficious.com/zh", "#148578"), S_SMALL)],
        [Paragraph("2026 游戏设计实机混剪", S_MUTED), Paragraph(link("youtu.be/hphiglctUCw", "https://youtu.be/hphiglctUCw", "#148578"), S_SMALL)],
        [
            Paragraph("《静物》完整 GDD", S_MUTED),
            Paragraph(
                link("中文PDF", "https://leficious.com/projects/still-life/Still_Life_GDD_ZH.pdf", "#148578")
                + " / "
                + link("英文PDF", "https://leficious.com/projects/still-life/Still_Life_GDD.pdf", "#148578")
                + " / "
                + link("一页提案", "https://leficious.com/projects/still-life/Still_Life_1Page_Pitch_ZH.pdf", "#148578"),
                S_SMALL,
            ),
        ],
        [
            Paragraph("《回声无形》完整 GDD", S_MUTED),
            Paragraph(
                link("中文5页PDF", "https://leficious.com/projects/an-echo-has-no-shape/An_Echo_Has_No_Shape_GDD_ZH.pdf", "#148578")
                + " / "
                + link("英文5页PDF", "https://leficious.com/projects/an-echo-has-no-shape/An_Echo_Has_No_Shape_GDD.pdf", "#148578"),
                S_SMALL,
            ),
        ],
        [Paragraph("独立游戏试玩 (itch.io)", S_MUTED), Paragraph(link("leficious.itch.io", "https://leficious.itch.io/", "#148578"), S_SMALL)],
        [Paragraph("GitHub 法线工具", S_MUTED), Paragraph(link("MayaStylizedNormalsToolkit", "https://github.com/Leficious/MayaStylizedNormalsToolkit", "#148578"), S_SMALL)],
    ]
    lt = Table(links_data, colWidths=[84, p2_right_w - 84])
    lt.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 1.3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.3),
                ("LINEBELOW", (0, 0), (-1, -1), 0.3, CN_LINE),
            ]
        )
    )
    story.append(lt)
    story.append(Spacer(1, 4.5))

    qr_widget = qr.QrCodeWidget("https://leficious.com/zh")
    bounds = qr_widget.getBounds()
    qw = bounds[2] - bounds[0]
    qh = bounds[3] - bounds[1]
    qr_size = 54
    d_qr = Drawing(qr_size, qr_size, transform=[qr_size / qw, 0, 0, qr_size / qh, 0, 0])
    d_qr.add(qr_widget)

    qr_desc = [
        Paragraph("<font color='#148578'>扫码直达中文作品集（国内无需VPN）</font>", S_SUBHEAD),
        Spacer(1, 1.8),
        Paragraph("含 2026 实机混剪、《静物》《回声无形》平面图与中英文 GDD、3C 状态机及开源工具源码。", S_MUTED),
    ]
    qr_table = Table([[d_qr, qr_desc]], colWidths=[62, p2_right_w - 62])
    qr_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("BACKGROUND", (0, 0), (-1, -1), CARD_BG),
                ("BOX", (0, 0), (-1, -1), 0.6, CARD_BORDER),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.append(qr_table)

    doc.build(story)
    if PORTFOLIO_DIR.exists():
        safe_copy_or_replace(out_path, PORTFOLIO_DIR / "Kevin_Shan_CN_Game_Resume.pdf")
    print(f"Built: {out_path} ({out_path.stat().st_size} bytes)")


if __name__ == "__main__":
    technical_resume()
    environment_resume()
    chinese_resume()
