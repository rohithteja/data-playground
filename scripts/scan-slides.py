"""Inventory course decks and optionally extract each slide into a review file."""
import argparse
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET
from zipfile import ZipFile


def pptx_pages(path):
    with ZipFile(path) as archive:
        names = [name for name in archive.namelist()
                 if re.fullmatch(r"ppt/slides/slide\d+\.xml", name)]
        names.sort(key=lambda name: int(re.search(r"(\d+)\.xml$", name)[1]))
        return ["\n".join(element.text for element in ET.fromstring(archive.read(name)).iter()
                          if element.tag == "{http://schemas.openxmlformats.org/drawingml/2006/main}t"
                          and element.text) for name in names]


def read_pages(path):
    if path.suffix.lower() == ".pptx":
        return pptx_pages(path)
    from pypdf import PdfReader
    return [page.extract_text() or "" for page in PdfReader(path).pages]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", type=Path,
                        default=Path(__file__).resolve().parents[2])
    parser.add_argument("--output", type=Path, help="Write one text file per deck here")
    args = parser.parse_args()
    paths = sorted(path for path in args.root.rglob("*")
                   if path.suffix.lower() in {".pdf", ".pptx"}
                   and any(part.lower() == "slides" for part in path.relative_to(args.root).parts[:-1]))
    if args.output:
        args.output.mkdir(parents=True, exist_ok=True)
    inventory = []
    for path in paths:
        relative = path.relative_to(args.root)
        try:
            pages = read_pages(path)
        except Exception as error:
            inventory.append({"file": str(relative), "error": str(error)})
            continue
        inventory.append({"file": str(relative), "pages": len(pages),
                          "pagesWithoutText": [i for i, page in enumerate(pages, 1) if not page.strip()]})
        if args.output:
            target = args.output / relative.with_suffix(".txt")
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text("\n\n".join(f"=== {i} ===\n{page}" for i, page in enumerate(pages, 1)),
                              encoding="utf-8")
    print(json.dumps(inventory, ensure_ascii=False, indent=2))
    return int(any("error" in item for item in inventory))


if __name__ == "__main__":
    raise SystemExit(main())
