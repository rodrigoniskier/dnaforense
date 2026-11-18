from runpy import run_path
from pathlib import Path
run_path(str(Path(__file__).with_name('test_viewport.py')))
