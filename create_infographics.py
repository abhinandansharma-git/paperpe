"""Create PaperPe branded infographics for social media"""
from PIL import Image, ImageDraw, ImageFont
import os

# Output directory
output_dir = "public/infographics"
os.makedirs(output_dir, exist_ok=True)

# Colors (from PaperPe brand)
DARK_BROWN = "#2D1F1A"
GOLD = "#C4A35A"
CREAM = "#F5F0E8"
ACCENT_GREEN = "#4CAF50"
ACCENT_RED = "#E53935"

# Dimensions (Instagram/Twitter friendly)
WIDTH = 1080
HEIGHT = 1080

def get_font(size, bold=False):
    """Get a font - fallback to default if custom not available"""
    try:
        if bold:
            return ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", size)
        return ImageFont.truetype("C:/Windows/Fonts/arial.ttf", size)
    except:
        return ImageFont.load_default()

def add_logo(img, position="bottom-right", size=150):
    """Add PaperPe logo to image"""
    logo = Image.open("public/logo.png").convert("RGBA")
    logo = logo.resize((size, int(size * logo.height / logo.width)), Image.Resampling.LANCZOS)
    
    if position == "bottom-right":
        x = img.width - logo.width - 40
        y = img.height - logo.height - 40
    elif position == "top-right":
        x = img.width - logo.width - 40
        y = 40
    elif position == "center-bottom":
        x = (img.width - logo.width) // 2
        y = img.height - logo.height - 60
    else:
        x, y = 40, 40
    
    img.paste(logo, (x, y), logo)
    return img

def create_why_paper_trade():
    """Infographic: Why Paper Trade?"""
    img = Image.new('RGB', (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(img)
    
    # Header
    draw.rectangle([0, 0, WIDTH, 200], fill=DARK_BROWN)
    title_font = get_font(60, bold=True)
    draw.text((WIDTH//2, 100), "Why Paper Trade?", font=title_font, fill=CREAM, anchor="mm")
    
    # Benefits
    benefits = [
        ("Zero Risk", "Practice without losing real money"),
        ("Learn Fast", "Master strategies before going live"),
        ("Build Confidence", "Know what works for YOU"),
        ("Track Progress", "See your improvement over time"),
    ]
    
    y_start = 280
    for i, (title, desc) in enumerate(benefits):
        y = y_start + i * 170
        # Number circle
        draw.ellipse([80, y-30, 140, y+30], fill=GOLD)
        num_font = get_font(36, bold=True)
        draw.text((110, y), str(i+1), font=num_font, fill=DARK_BROWN, anchor="mm")
        
        # Text
        title_font = get_font(40, bold=True)
        desc_font = get_font(28)
        draw.text((180, y-20), title, font=title_font, fill=DARK_BROWN)
        draw.text((180, y+25), desc, font=desc_font, fill="#666666")
    
    # Footer
    draw.rectangle([0, HEIGHT-120, WIDTH, HEIGHT], fill=GOLD)
    footer_font = get_font(32, bold=True)
    draw.text((WIDTH//2, HEIGHT-60), "Start Free at paperpe.in", font=footer_font, fill=DARK_BROWN, anchor="mm")
    
    img = add_logo(img, "top-right", 120)
    img.save(f"{output_dir}/why-paper-trade.png", quality=95)
    print("Created: why-paper-trade.png")

def create_aria_features():
    """Infographic: ARIA Supreme Features"""
    img = Image.new('RGB', (WIDTH, HEIGHT), DARK_BROWN)
    draw = ImageDraw.Draw(img)
    
    # Header
    title_font = get_font(56, bold=True)
    draw.text((WIDTH//2, 80), "ARIA SUPREME", font=title_font, fill=GOLD, anchor="mm")
    
    subtitle_font = get_font(32)
    draw.text((WIDTH//2, 140), "One Indicator. Complete Picture.", font=subtitle_font, fill=CREAM, anchor="mm")
    
    # Features grid
    features = [
        "Signal Strength (0-100)",
        "Auto Support/Resistance", 
        "Market Regime Detection",
        "Smart Money Flow",
        "VIX-Based Fear Reading",
        "Trend + Momentum"
    ]
    
    y_start = 250
    for i, feature in enumerate(features):
        y = y_start + i * 110
        # Checkmark
        draw.text((100, y), ">>", font=get_font(36, bold=True), fill=ACCENT_GREEN, anchor="lm")
        # Feature text
        draw.text((180, y), feature, font=get_font(38), fill=CREAM, anchor="lm")
    
    # Price box
    draw.rectangle([200, 880, 880, 1000], fill=GOLD)
    price_font = get_font(48, bold=True)
    draw.text((540, 920), "Rs 2,999", font=price_font, fill=DARK_BROWN, anchor="mm")
    strike_font = get_font(28)
    draw.text((540, 970), "50% OFF - Limited Time", font=strike_font, fill=DARK_BROWN, anchor="mm")
    
    img = add_logo(img, "bottom-right", 100)
    img.save(f"{output_dir}/aria-features.png", quality=95)
    print("Created: aria-features.png")

def create_nse_mcx():
    """Infographic: NSE + MCX Support"""
    img = Image.new('RGB', (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(img)
    
    # Header
    draw.rectangle([0, 0, WIDTH, 180], fill=DARK_BROWN)
    title_font = get_font(52, bold=True)
    draw.text((WIDTH//2, 90), "Trade Everything", font=title_font, fill=GOLD, anchor="mm")
    
    # NSE Section
    draw.rectangle([60, 240, 520, 700], fill="#E8F5E9", outline=ACCENT_GREEN, width=3)
    draw.text((290, 290), "NSE F&O", font=get_font(40, bold=True), fill=DARK_BROWN, anchor="mm")
    
    nse_items = ["NIFTY", "BANKNIFTY", "FINNIFTY", "Stocks"]
    for i, item in enumerate(nse_items):
        draw.text((290, 380 + i*70), item, font=get_font(32), fill="#333333", anchor="mm")
    
    # MCX Section  
    draw.rectangle([560, 240, 1020, 700], fill="#FFF3E0", outline="#FF9800", width=3)
    draw.text((790, 290), "MCX", font=get_font(40, bold=True), fill=DARK_BROWN, anchor="mm")
    
    mcx_items = ["Crude Oil", "Gold", "Silver", "Natural Gas"]
    for i, item in enumerate(mcx_items):
        draw.text((790, 380 + i*70), item, font=get_font(32), fill="#333333", anchor="mm")
    
    # Bottom text
    draw.text((WIDTH//2, 800), "India's First Complete", font=get_font(36), fill=DARK_BROWN, anchor="mm")
    draw.text((WIDTH//2, 860), "Paper Trading Platform", font=get_font(44, bold=True), fill=DARK_BROWN, anchor="mm")
    
    # Footer
    draw.rectangle([0, HEIGHT-100, WIDTH, HEIGHT], fill=GOLD)
    draw.text((WIDTH//2, HEIGHT-50), "paperpe.in", font=get_font(36, bold=True), fill=DARK_BROWN, anchor="mm")
    
    img = add_logo(img, "top-right", 100)
    img.save(f"{output_dir}/nse-mcx-support.png", quality=95)
    print("Created: nse-mcx-support.png")

def create_trading_tip():
    """Infographic: Trading Tip"""
    img = Image.new('RGB', (WIDTH, HEIGHT), DARK_BROWN)
    draw = ImageDraw.Draw(img)
    
    # Accent bar
    draw.rectangle([0, 0, 20, HEIGHT], fill=GOLD)
    
    # Header
    draw.text((80, 80), "TRADING TIP", font=get_font(28), fill=GOLD)
    
    # Main quote
    quote = "Score below 40?\nDON'T TRADE."
    draw.text((WIDTH//2, 400), quote, font=get_font(72, bold=True), fill=CREAM, anchor="mm", align="center")
    
    # Explanation
    explanation = "Most losses happen when\nsignal is weak but you enter anyway."
    draw.text((WIDTH//2, 600), explanation, font=get_font(32), fill="#AAAAAA", anchor="mm", align="center")
    
    # CTA
    draw.rectangle([250, 850, 830, 950], fill=GOLD)
    draw.text((540, 900), "See live scores at paperpe.in", font=get_font(28, bold=True), fill=DARK_BROWN, anchor="mm")
    
    img = add_logo(img, "bottom-right", 100)
    img.save(f"{output_dir}/trading-tip.png", quality=95)
    print("Created: trading-tip.png")

def create_start_free():
    """Infographic: Start Free CTA"""
    img = Image.new('RGB', (WIDTH, HEIGHT), GOLD)
    draw = ImageDraw.Draw(img)
    
    # Main text
    draw.text((WIDTH//2, 300), "START", font=get_font(120, bold=True), fill=DARK_BROWN, anchor="mm")
    draw.text((WIDTH//2, 450), "PAPER TRADING", font=get_font(64, bold=True), fill=DARK_BROWN, anchor="mm")
    draw.text((WIDTH//2, 550), "TODAY", font=get_font(120, bold=True), fill=DARK_BROWN, anchor="mm")
    
    # Free badge
    draw.ellipse([420, 680, 660, 850], fill=DARK_BROWN)
    draw.text((540, 765), "FREE", font=get_font(56, bold=True), fill=GOLD, anchor="mm")
    
    # URL
    draw.text((WIDTH//2, 950), "paperpe.in", font=get_font(48, bold=True), fill=DARK_BROWN, anchor="mm")
    
    img = add_logo(img, "top-right", 120)
    img.save(f"{output_dir}/start-free.png", quality=95)
    print("Created: start-free.png")

# Generate all infographics
if __name__ == "__main__":
    print("Creating PaperPe infographics...\n")
    create_why_paper_trade()
    create_aria_features()
    create_nse_mcx()
    create_trading_tip()
    create_start_free()
    print(f"\nDone! Infographics saved to: {output_dir}/")
