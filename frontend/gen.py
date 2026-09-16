
import colorsys

def hex_to_hsl(hex_color):
    hex_color = hex_color.lstrip("#")
    rgb = tuple(int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))
    return colorsys.rgb_to_hls(*rgb)

def hsl_to_hex(h, l, s):
    rgb = colorsys.hls_to_rgb(h, l, s)
    return "#%02x%02x%02x" % tuple(max(0, min(255, int(round(c * 255)))) for c in rgb)

def generate_scale(base_hex):
    h, l_base, s = hex_to_hsl(base_hex)
    levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
    scale = {}
    for level in levels:
        if level == 500:
            l = l_base
            s_mod = s
        elif level < 500:
            t = (500 - level) / 450.0 
            t = t ** 0.8
            l = l_base + t * (0.97 - l_base)
            s_mod = max(0.1, s - t * 0.4)
        else:
            t = (level - 500) / 400.0
            t = t ** 0.8
            l = l_base - t * (l_base - 0.10)
            s_mod = min(1, s + t * 0.2)
        scale[level] = hsl_to_hex(h, l, s_mod)
    return scale

for name, hex_code in [("primary", "#4F318B"), ("secondary", "#2D2D96"), ("info", "#2C3459")]:
    scale = generate_scale(hex_code)
    print(f"=== {name.upper()} ===")
    for k, v in scale.items():
        print(f"  --primitive-{name}-{k}: {v.upper()};")
    print("style-guide:")
    for k, v in scale.items():
        print(f"      {{ level: \x22{k}\x22, hex: \x22{v.upper()}\x22 }},")

