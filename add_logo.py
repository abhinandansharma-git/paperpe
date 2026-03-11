"""Add PaperPe logo watermark to social post images"""
from PIL import Image
import os

# Paths
logo_path = "public/logo.png"
screenshots_dir = "public/screenshots"
output_dir = "public/screenshots/branded"

# Create output directory
os.makedirs(output_dir, exist_ok=True)

# Load logo
logo = Image.open(logo_path).convert("RGBA")

# Resize logo to ~15% of image width
def add_watermark(image_path, output_path, logo, position="bottom-right", padding=20, opacity=0.9):
    """Add logo watermark to image"""
    img = Image.open(image_path).convert("RGBA")
    
    # Resize logo proportionally (15% of image width)
    logo_width = int(img.width * 0.15)
    logo_ratio = logo.height / logo.width
    logo_height = int(logo_width * logo_ratio)
    logo_resized = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
    
    # Apply opacity
    if opacity < 1:
        alpha = logo_resized.split()[3]
        alpha = alpha.point(lambda p: int(p * opacity))
        logo_resized.putalpha(alpha)
    
    # Calculate position
    if position == "bottom-right":
        x = img.width - logo_width - padding
        y = img.height - logo_height - padding
    elif position == "bottom-left":
        x = padding
        y = img.height - logo_height - padding
    elif position == "top-right":
        x = img.width - logo_width - padding
        y = padding
    else:  # top-left
        x = padding
        y = padding
    
    # Paste logo
    img.paste(logo_resized, (x, y), logo_resized)
    
    # Convert to RGB for JPEG
    if output_path.lower().endswith('.jpg') or output_path.lower().endswith('.jpeg'):
        img = img.convert('RGB')
    
    img.save(output_path, quality=95)
    print(f"Created: {output_path}")

# Process all screenshots
screenshots = [f for f in os.listdir(screenshots_dir) if f.endswith(('.jpg', '.jpeg', '.png')) and not f.startswith('.')]

for screenshot in screenshots:
    input_path = os.path.join(screenshots_dir, screenshot)
    output_path = os.path.join(output_dir, f"branded_{screenshot}")
    add_watermark(input_path, output_path, logo)

print(f"\nDone! Branded images in: {output_dir}")
