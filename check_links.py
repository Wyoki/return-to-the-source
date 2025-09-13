import os
import re
import urllib.request
from urllib.parse import urljoin, urlparse

def is_external(url):
    return url.startswith('http') or url.startswith('//') or url.startswith('mailto:') or url.startswith('tel:')

def check_link(link, base_dir, html_file):
    if is_external(link):
        if link.startswith('mailto:') or link.startswith('tel:'):
            return f"Good special: {link} in {html_file}"
        try:
            req = urllib.request.Request(link, headers={'User-Agent': 'Mozilla/5.0'})
            urllib.request.urlopen(req, timeout=10)
            return f"Good external: {link} in {html_file}"
        except Exception as e:
            return f"Dead external: {link} in {html_file} ({str(e)})"
    else:
        # internal
        target = link.split('#')[0]  # remove anchor
        if target == '':
            # anchor in same file, assume good
            return f"Good anchor: {link} in {html_file}"
        full_path = os.path.abspath(os.path.join(base_dir, target))
        if os.path.exists(full_path):
            return f"Good internal: {link} in {html_file}"
        else:
            return f"Dead internal: {link} in {html_file}"

# Get all html files
html_files = []
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

# For each html file
for html_file in html_files:
    base_dir = os.path.dirname(html_file)
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        print(f"Error reading {html_file}")
        continue
    # Find all href and src
    links = re.findall(r'(?:href|src)="([^"]*)"', content)
    for link in links:
        if link:
            result = check_link(link, base_dir, html_file)
            print(result)