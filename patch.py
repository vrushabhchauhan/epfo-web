import os
import re

def patch_landing_page():
    path = 'ek-epfo/src/pages/LandingPage.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<a href="#main-content"' not in content:
        content = content.replace('<div className="landing-layout">', '<div className="landing-layout">\n      <a href="#main-content" className="skip-to-content-link" style={{ position: \"absolute\", left: \"-9999px\", zIndex: 999, padding: \"1rem\", background: \"#000\", color: \"#fff\" }}>Skip to main content</a>')
        content = content.replace('<section className="landing-hero" aria-labelledby="hero-title">', '<main id="main-content"><section className="landing-hero" aria-labelledby="hero-title">')
        content = content.replace('</footer>\n    </div>', '</footer>\n    </main>\n    </div>')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Patched LandingPage")

patch_landing_page()
