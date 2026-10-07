"""Build the two English, role-specific resumes linked from the portfolio."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "resume"
OUT.mkdir(parents=True, exist_ok=True)

INK = colors.HexColor("#17242b")
MUTED = colors.HexColor("#52636c")
ACCENT = colors.HexColor("#147f91")
LINE = colors.HexColor("#cbd8dc")


def style(name, size, leading=None, *, bold=False, color=INK, space_after=0, alignment=TA_LEFT):
    return ParagraphStyle(
        name=name,
        fontName="Helvetica-Bold" if bold else "Helvetica",
        fontSize=size,
        leading=leading or size * 1.31,
        textColor=color,
        alignment=alignment,
        spaceAfter=space_after,
        allowWidows=0,
        allowOrphans=0,
    )


NAME = style("name", 21, 24, bold=True)
ROLE = style("role", 10.8, 14.5, bold=True, color=ACCENT)
CONTACT = style("contact", 9.6, 13, color=MUTED)
SECTION = style("section", 10.1, 13, bold=True, color=ACCENT)
ENTRY = style("entry", 10.8, 14.5, bold=True)
DATE = style("date", 9.8, 14.5, bold=True, color=MUTED, alignment=TA_RIGHT)
META = style("meta", 9.6, 13, color=MUTED)
BODY = style("body", 10.2, 14.6)
SMALL = style("small", 9.7, 13.5)


def link(label, url):
    return f'<link href="{url}" color="#147f91"><u>{label}</u></link>'


def header(role, portfolio, reel):
    return [
        Paragraph("LEFI SHAN", NAME),
        Paragraph("Legal name: Kevin Shan  |  " + role, ROLE),
        Spacer(1, 5),
        Paragraph(
            "Los Angeles, CA  |  +1 626 693-4003  |  "
            + link("leficious@gmail.com", "mailto:leficious@gmail.com")
            + "  |  "
            + link("LinkedIn", "https://www.linkedin.com/in/leficious/"),
            CONTACT,
        ),
        Paragraph(
            "Portfolio: " + link(portfolio.replace("https://", ""), portfolio)
            + "  |  " + link("Watch reel", reel),
            CONTACT,
        ),
        Spacer(1, 14),
    ]


def section(title):
    line = Table([[Paragraph(title.upper(), SECTION), ""]], colWidths=[260, 259])
    line.setStyle(
        TableStyle(
            [
                ("LINEBELOW", (0, 0), (-1, -1), 0.65, LINE),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return [line, Spacer(1, 9)]


def project(title, subtitle, year, url, bullets):
    heading = Table(
        [[Paragraph(link(title, url), ENTRY), Paragraph(year, DATE)]],
        colWidths=[430, 89],
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
    block = [heading, Paragraph(subtitle, META), Spacer(1, 2)]
    for bullet in bullets:
        block.append(Paragraph("&#8226;  " + bullet, BODY))
        block.append(Spacer(1, 3))
    block.append(Spacer(1, 8))
    return KeepTogether(block)


def education(*, gnomon_reel=False):
    lines = [
        Paragraph("<b>University of Southern California</b>  |  M.S., Game Design and Development  |  Expected 2028", SMALL),
        Paragraph("<b>Gnomon School of Visual Effects</b>  |  B.F.A., Digital Production - Games  |  2025", SMALL),
    ]
    if gnomon_reel:
        lines.append(Paragraph("Work selected for Gnomon's student reel.", SMALL))
    lines.append(Spacer(1, 4))
    return lines


def pdf(path, story):
    doc = BaseDocTemplate(
        str(path),
        pagesize=letter,
        leftMargin=0.64 * inch,
        rightMargin=0.64 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
        title=path.stem.replace("_", " "),
        author="Lefi Shan",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates(PageTemplate(id="resume", frames=frame))
    doc.build(story)


def technical_resume():
    story = header("TECHNICAL GAME DESIGNER", "https://leficious.com/", "https://www.youtube.com/watch?v=rVIavxdutJE")
    story += [
        Paragraph(
            "Combat and gameplay systems prototypes in Unreal Engine 5, with an emphasis on animation timing, enemy behavior, and playable encounter flow.",
            BODY,
        ),
        Spacer(1, 11),
    ]
    story += section("Selected technical design projects")
    story.append(
        project(
            "Fallen Valkyrie",
            "Solo 10-week UE5 prototype  |  Third-party character, environment, and source animation assets",
            "2025",
            "https://leficious.com/projects/fallen-valkyrie",
            [
                "Designed a playable boss stage around spear and bow combat, lock-on targeting, resources, and directional hit reactions; progression gates and phase changes shape its pacing.",
                "Implemented weapon-specific animation states, Anim Notify attack windows, Motion Warping, and reusable StateTree tasks; a mid-fight aerial phase adds projectile and summon pressure.",
            ],
        )
    )
    story.append(
        project(
            "Grid-Based Tactical RPG Template",
            "Solo UE5 systems prototype  |  Blueprint and UMG tools",
            "2026",
            "https://leficious.com/gallery?entry=grid-based-tactical-rpg-template",
            [
                "Implemented a snappable grid, A* pathfinding, Dijkstra movement ranges, and path previews so movement costs are visible before a move is committed.",
                "Built a UMG grid-authoring and debugging tool with reusable data and Animation Blueprint templates for units, classes, equipment, and attributes.",
            ],
        )
    )
    story.append(
        project(
            "Starshore",
            "Solo 15-week UE5 prototype  |  Third-party character and environment assets",
            "2025",
            "https://leficious.com/projects/starshore",
            [
                "Built standard and flight locomotion, dash movement, and a five-hit combo; double-tap forward enters flight and release or interruption returns to standard movement.",
                "Designed passive spell targeting to hold a target within 750 units and a 45-degree camera cone; connected GAS abilities, loot, inventory, and vendors into one playable loop.",
            ],
        )
    )
    story += section("Additional technical work")
    story.append(
        project(
            "Stylize Normals Toolkit",
            "Python and Maya API  |  Open-source tool",
            "2025-26",
            "https://github.com/Leficious/MayaStylizedNormalsToolkit",
            [
                "Developed a multi-object Maya workflow for generating, transferring, previewing, inspecting, and repairing custom vertex normals, with live comparison and one-step undo.",
            ],
        )
    )
    story += section("Education")
    story += education()
    story += section("Tools and skills")
    story += [
        Paragraph("<b>Gameplay:</b> Unreal Engine 5, Blueprints, GAS, StateTree, Behavior Trees, Enhanced Input, UMG, data-driven systems", SMALL),
        Paragraph("<b>Animation and code:</b> Animation Blueprints, state machines, Motion Warping, Anim Notifies, retargeting, Python, C++, C#, Unity, Git, Perforce", SMALL),
    ]
    pdf(OUT / "Leficious_Technical_Game_Designer_Resume.pdf", story)


def environment_resume():
    story = header("3D ENVIRONMENT ARTIST", "https://leficious.com/gallery", "https://www.youtube.com/watch?v=t5MchABcd3c")
    story += [
        Paragraph(
            "Stylized 3D environments built through modeling, materials, foliage, lighting, and realtime scene assembly in Unreal Engine.",
            BODY,
        ),
        Spacer(1, 11),
    ]
    story += section("Selected environment work")
    story.append(
        project(
            "Sacred Forest",
            "Solo realtime scene  |  Unreal Engine 5, Maya, ZBrush, Substance  |  Original concept by En Moroldo",
            "2026",
            "https://leficious.com/projects/sacred-forest",
            [
                "Built the scene from modular low-poly assets and a sculpted, baked shrine through procedural stone and bark materials, foliage, lighting, VFX, and final Unreal assembly.",
                "Used an atlas for foliage and Runtime Virtual Textures to blend plants with terrain; automated vertex-normal transfers in Maya for consistent stylized lighting across assets.",
            ],
        )
    )
    story.append(
        project(
            "Water Blossoms",
            "Environment contribution  |  Unreal Engine, SpeedTree, Gaea, Substance  |  Character by Idafaber",
            "2026",
            "https://leficious.com/gallery?entry=water-blossoms",
            [
                "Modeled and textured the bridge; developed the surrounding scene through set dressing, lighting, landscape work, and procedurally generated SpeedTree vegetation.",
            ],
        )
    )
    story.append(
        project(
            "Alien Landscape",
            "Environment modeling and procedural assembly  |  Maya, Houdini, Redshift",
            "2025",
            "https://leficious.com/gallery?entry=alien-landscape",
            [
                "Modeled the scene's individual assets, procedurally instanced them in Houdini, and completed look development and rendering in Redshift.",
            ],
        )
    )
    story.append(
        project(
            "Stylized Classroom - Illustration Match",
            "3D environment implementation  |  Maya, Substance 3D Painter, V-Ray  |  Illustration by ArseniXC",
            "2024",
            "https://leficious.com/gallery?entry=stylized-classroom",
            [
                "Translated an existing illustration into a 3D scene, matching its composition, stylized materials, and lighting in the final render.",
            ],
        )
    )
    story += section("Related technical art")
    story.append(
        project(
            "Stylize Normals Toolkit",
            "Maya, Python, Maya API  |  Open-source foliage and vertex-normal tool",
            "2025-26",
            "https://github.com/Leficious/MayaStylizedNormalsToolkit",
            [
                "Expanded the foliage-normal workflow into a reusable toolkit with generated direction, transfer, preview, comparison, and batch repair controls.",
            ],
        )
    )
    story += section("Education")
    story += education(gnomon_reel=True)
    story += section("Tools and production")
    story += [
        Paragraph("<b>Environment:</b> Unreal Engine 5, Maya, ZBrush, Substance 3D Painter and Designer, SpeedTree, Gaea, Houdini", SMALL),
        Paragraph("<b>Rendering and technical art:</b> V-Ray, Redshift, Photoshop, Python, Maya API, procedural materials, foliage, UVs and baking", SMALL),
    ]
    pdf(OUT / "Leficious_3D_Environment_Artist_Resume.pdf", story)


if __name__ == "__main__":
    technical_resume()
    environment_resume()
