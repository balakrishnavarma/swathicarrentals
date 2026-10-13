import os
import re

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Update cache buster for main.js and fleet.js
        content = re.sub(r'src="js/main\.js(\?v=\d+)?"', 'src="js/main.js?v=35"', content)
        content = re.sub(r'src="js/fleet\.js(\?v=\d+)?"', 'src="js/fleet.js?v=35"', content)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Cleaned up {filename}")
