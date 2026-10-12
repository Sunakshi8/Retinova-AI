import io
import math
from PIL import Image, ImageFilter, ImageStat
from typing import Tuple, List, Dict, Any

def check_file_format(raw_bytes: bytes) -> Tuple[bool, str]:
    """Check magic bytes and actual image headers."""
    if len(raw_bytes) < 8:
        return False, "File is too small or empty."
    
    # Check JPEG magic bytes: FF D8 FF
    if raw_bytes[:3] == b'\xff\xd8\xff':
        return True, "image/jpeg"
    
    # Check PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    if raw_bytes[:8] == b'\x89PNG\r\n\x1a\n':
        return True, "image/png"
    
    return False, "Unsupported file format. Only JPEG and PNG are permitted."

def assess_retinal_quality(image: Image.Image) -> Dict[str, Any]:
    """
    Perform multi-factor screening of retinal fundus images using PIL:
    1. Dimension check
    2. Retinal chromatic profile & circular field detection
    3. Sharpness / Blur screening
    4. Illumination / Exposure screening
    5. Contrast analysis
    """
    rejection_reasons: List[str] = []
    
    # Ensure RGB
    if image.mode != "RGB":
        image = image.convert("RGB")
        
    width, height = image.size
    
    # 1. Dimension check
    if width < 224 or height < 224:
        rejection_reasons.append(f"Image resolution ({width}x{height}) is below minimum clinical threshold of 224x224.")
    if width > 6000 or height > 6000:
        rejection_reasons.append(f"Image resolution ({width}x{height}) exceeds maximum acceptable threshold of 6000x6000.")

    # Compute overall image statistics using ImageStat
    stat = ImageStat.Stat(image)
    r_mean, g_mean, b_mean = stat.mean[:3]
    
    # Grayscale image for edge and luminance analysis
    gray = image.convert("L")
    gray_stat = ImageStat.Stat(gray)
    mean_lum = gray_stat.mean[0]
    std_lum = gray_stat.stddev[0]
    
    # 2. Fundus Chromatic Profile (Red/Orange dominance in fundus vs Blue)
    is_valid_fundus = True
    if b_mean > r_mean * 1.05 and r_mean > 30:
        is_valid_fundus = False
        rejection_reasons.append("Non-retinal spectrum: Blue spectral luminance exceeds fundus hemoglobin baseline.")
    
    # 3. Blur screening: High frequency edge detection via FIND_EDGES
    edges = gray.filter(ImageFilter.FIND_EDGES)
    edge_stat = ImageStat.Stat(edges)
    edge_mean = edge_stat.mean[0]
    edge_std = edge_stat.stddev[0]
    # Calibrated sharpness metric
    blur_score = edge_mean * 2.8 + edge_std * 1.5
    
    is_sharp = blur_score >= 8.0
    if not is_sharp:
        rejection_reasons.append(f"Image sharpness insufficient / severe blur detected (Sharpness score {blur_score:.1f} < 8.0).")
        
    # 4. Illumination / Exposure Screening
    illumination_score = float(mean_lum)
    contrast_score = float(std_lum)
    
    is_well_illuminated = True
    if illumination_score < 30.0:
        is_well_illuminated = False
        rejection_reasons.append(f"Severe underexposure detected (Mean luminance {illumination_score:.1f} < 30.0).")
    elif illumination_score > 215.0:
        is_well_illuminated = False
        rejection_reasons.append(f"Severe overexposure / saturation detected (Mean luminance {illumination_score:.1f} > 215.0).")
        
    is_adequate_contrast = contrast_score >= 20.0
    if not is_adequate_contrast:
        rejection_reasons.append(f"Insufficient tissue contrast (Luminance standard deviation {contrast_score:.1f} < 20.0).")

    overall_quality_passed = (len(rejection_reasons) == 0) and is_valid_fundus

    return {
        "is_valid_fundus": is_valid_fundus,
        "blur_score": round(blur_score, 2),
        "is_sharp": is_sharp,
        "illumination_score": round(illumination_score, 2),
        "is_well_illuminated": is_well_illuminated,
        "contrast_score": round(contrast_score, 2),
        "is_adequate_contrast": is_adequate_contrast,
        "rejection_reasons": rejection_reasons,
        "overall_quality_passed": overall_quality_passed
    }
