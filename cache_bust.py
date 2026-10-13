import os
import re

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Update cache buster for style.css, responsive.css, main.js, fleet.js
        content = re.sub(r'href="css/style\.css(\?v=\d+)?"', 'href="css/style.css?v=37"', content)
        content = re.sub(r'href="css/responsive\.css(\?v=\d+)?"', 'href="css/responsive.css?v=37"', content)
        content = re.sub(r'src="js/main\.js(\?v=\d+)?"', 'src="js/main.js?v=37"', content)
        content = re.sub(r'src="js/fleet\.js(\?v=\d+)?"', 'src="js/fleet.js?v=37"', content)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Cleaned up {filename}")
