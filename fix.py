
file_path = r'c:\Users\Vrushabh\Downloads\EPFO Web\ek-epfo\src\pages\LandingPage.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

lines[205] = '      <style>{\n'
lines[210] = '      }</style>\n'

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('Done!')

