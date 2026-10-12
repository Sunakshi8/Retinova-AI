import os
import math
import random
from PIL import Image, ImageDraw, ImageFilter
from typing import List, Dict

def create_synthetic_fundus(stage: int, size: int = 512, is_poor_quality: bool = False) -> Image.Image:
    """
    Generate an authentic synthetic retinal fundus photograph using PIL:
    - Retinal background with chromatic illumination
    - Optic disc with physiological cup
    - Temporal vascular arches (Superior & Inferior arcades)
    - Macula with foveal avascular zone
    - Stage-specific lesions (Microaneurysms, hemorrhages, exudates, neovascularization)
    """
    # Create black canvas
    img = Image.new("RGB", (size, size), (0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    radius = int(size * 0.44)
    
    # 1. Retinal disc base with soft radial gradient
    # Draw concentric filled circles for smooth radial gradient
    steps = 40
    for s in range(steps, 0, -1):
        cur_r = int(radius * (s / steps))
        factor = s / steps
        r_col = int(220 - factor * 45)
        g_col = int(100 - factor * 30)
        b_col = int(35 - factor * 20)
        draw.ellipse(
            [center - cur_r, center - cur_r, center + cur_r, center + cur_r],
            fill=(r_col, g_col, b_col)
        )
    
    # 2. Optic Disc (Nasal side)
    disc_x = int(center - size * 0.18)
    disc_y = center
    disc_r = int(size * 0.075)
    
    draw.ellipse(
        [disc_x - disc_r, disc_y - disc_r, disc_x + disc_r, disc_y + disc_r],
        fill=(255, 218, 140)
    )
    # Physiological cup
    draw.ellipse(
        [disc_x - int(disc_r * 0.45), disc_y - int(disc_r * 0.45), disc_x + int(disc_r * 0.45), disc_y + int(disc_r * 0.45)],
        fill=(255, 242, 195)
    )
    
    # 3. Macula & Fovea (Temporal side)
    macula_x = int(center + size * 0.16)
    macula_y = center
    macula_r = int(size * 0.08)
    draw.ellipse(
        [macula_x - macula_r, macula_y - macula_r, macula_x + macula_r, macula_y + macula_r],
        fill=(145, 50, 20)
    )
    # Fovea centralis
    draw.ellipse(
        [macula_x - int(size * 0.02), macula_y - int(size * 0.02), macula_x + int(size * 0.02), macula_y + int(size * 0.02)],
        fill=(95, 30, 10)
    )
    
    # 4. Vascular Arcade (Superior & Inferior arches)
    draw.arc(
        [disc_x - 30, disc_y - int(size * 0.35), int(center + size * 0.38), disc_y + 20],
        start=190, end=350, fill=(115, 18, 12), width=int(size * 0.012)
    )
    draw.arc(
        [disc_x - 30, disc_y - 20, int(center + size * 0.38), disc_y + int(size * 0.35)],
        start=10, end=170, fill=(115, 18, 12), width=int(size * 0.012)
    )
    for dy in [-40, -20, 20, 40]:
        draw.line([disc_x, disc_y, disc_x + 60, disc_y + dy], fill=(125, 20, 15), width=int(size * 0.008))
        
    # 5. Pathological Lesions depending on Diabetic Retinopathy Grade
    rnd = random.Random(42 + stage)
    
    if stage == 1:
        # Mild NPDR: Isolated microaneurysms
        for _ in range(12):
            lx = rnd.randint(macula_x - 80, macula_x + 90)
            ly = rnd.randint(macula_y - 80, macula_y + 80)
            draw.ellipse([lx - 3, ly - 3, lx + 3, ly + 3], fill=(120, 10, 10))
            
    elif stage == 2:
        # Moderate NPDR: Blot hemorrhages and Hard Exudates
        for _ in range(20):
            lx = rnd.randint(center - 110, center + 140)
            ly = rnd.randint(center - 110, center + 110)
            rad = rnd.randint(4, 9)
            draw.ellipse([lx - rad, ly - rad, lx + rad, ly + rad], fill=(110, 8, 8))
        for _ in range(26):
            ex = rnd.randint(macula_x - 65, macula_x + 65)
            ey = rnd.randint(macula_y - 65, macula_y + 65)
            draw.ellipse([ex - 3, ey - 3, ex + 3, ey + 3], fill=(252, 246, 175))
            
    elif stage == 3:
        # Severe NPDR: 4-quadrant flame/blot hemorrhages, venous beading, cotton wool spots
        for _ in range(45):
            lx = rnd.randint(center - int(radius * 0.75), center + int(radius * 0.75))
            ly = rnd.randint(center - int(radius * 0.75), center + int(radius * 0.75))
            rad = rnd.randint(5, 14)
            draw.ellipse([lx - rad, ly - rad, lx + rad, ly + rad], fill=(105, 5, 5))
        for _ in range(6):
            cx = rnd.randint(center - 70, center + 70)
            cy = rnd.randint(center - 90, center + 90)
            draw.ellipse([cx - 12, cy - 8, cx + 12, cy + 8], fill=(240, 240, 240))
            
    elif stage == 4:
        # Proliferative DR: Neovascularization at disc (NVD) & vitreal proliferation
        for _ in range(50):
            lx = rnd.randint(center - int(radius * 0.8), center + int(radius * 0.8))
            ly = rnd.randint(center - int(radius * 0.8), center + int(radius * 0.8))
            rad = rnd.randint(6, 16)
            draw.ellipse([lx - rad, ly - rad, lx + rad, ly + rad], fill=(95, 0, 0))
        for _ in range(20):
            nx = disc_x + rnd.randint(-40, 40)
            ny = disc_y + rnd.randint(-40, 40)
            draw.line([disc_x, disc_y, nx, ny], fill=(185, 25, 20), width=3)
            
    # Apply soft anatomical blur
    img = img.filter(ImageFilter.GaussianBlur(radius=1.2))
    
    # If poor quality: inject severe blur + underexposure
    if is_poor_quality:
        img = img.filter(ImageFilter.GaussianBlur(radius=8.5))
        # Dim image significantly
        dimmed = Image.new("RGB", (size, size), (0, 0, 0))
        img = Image.blend(img, dimmed, 0.72)

    return img

def generate_and_save_samples(output_dirs: List[str]):
    """Generate all 6 sample images and write to backend and frontend public folders."""
    samples_meta = [
        {"id": "sample-0", "name": "Normal Retinal Fundus (Grade 0)", "stage": 0, "filename": "sample_0_no_dr.png", "poor": False, "desc": "Healthy fundus with distinct optic disc and sharp foveal reflex."},
        {"id": "sample-1", "name": "Mild NPDR (Grade 1)", "stage": 1, "filename": "sample_1_mild_dr.png", "poor": False, "desc": "Earliest detectable stage exhibiting microaneurysms in temporal parafovea."},
        {"id": "sample-2", "name": "Moderate NPDR (Grade 2)", "stage": 2, "filename": "sample_2_moderate_dr.png", "poor": False, "desc": "Clinically significant macular exudates and intraretinal blot hemorrhages."},
        {"id": "sample-3", "name": "Severe NPDR (Grade 3)", "stage": 3, "filename": "sample_3_severe_dr.png", "poor": False, "desc": "Extensive 4-quadrant hemorrhages and cotton-wool ischemia spots (4-2-1 rule)."},
        {"id": "sample-4", "name": "Proliferative DR (Grade 4)", "stage": 4, "filename": "sample_4_proliferative_dr.png", "poor": False, "desc": "High-risk neovascularization of the optic disc (NVD) with vitreous traction."},
        {"id": "sample-5", "name": "Suboptimal Quality (Rejected)", "stage": 0, "filename": "sample_5_poor_quality.png", "poor": True, "desc": "Motion-blurred & underexposed fundus triggering automated screening rejection."}
    ]
    
    for folder in output_dirs:
        os.makedirs(folder, exist_ok=True)
        
    for item in samples_meta:
        fundus_img = create_synthetic_fundus(item["stage"], size=512, is_poor_quality=item["poor"])
        for folder in output_dirs:
            path = os.path.join(folder, item["filename"])
            fundus_img.save(path, format="PNG")
            
    print("Generated 6 synthetic clinical sample images successfully.")
    return samples_meta

if __name__ == "__main__":
    generate_and_save_samples([
        r"C:\Users\USER\.gemini\antigravity\scratch\retinova-ai\backend\samples",
        r"C:\Users\USER\.gemini\antigravity\scratch\retinova-ai\frontend\public\samples"
    ])
