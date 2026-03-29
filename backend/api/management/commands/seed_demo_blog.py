"""Create demo blog posts (same slugs as frontend placeholders). Run: python manage.py seed_demo_blog"""

from django.core.management.base import BaseCommand

from api.models import BlogCategory, BlogPost

DEMO = [
    {
        "slug": "welcome-notes",
        "title": "Welcome — building in public",
        "description": (
            "A short hello and how this space will grow: engineering notes, "
            "experiments, and STEAM threads."
        ),
        "body": (
            "<p>This post was seeded with <code>seed_demo_blog</code>. "
            "Edit or delete from the dashboard.</p>"
        ),
        "body_format": "html",
        "published": True,
        "category_slugs": ["notes"],
    },
    {
        "slug": "mechatronics-sketch",
        "title": "Mechatronics sketch — torque and timing",
        "description": (
            "Scribbles from a weekend actuator test: gearing assumptions, safety margins, "
            "and what broke first."
        ),
        "body": "<p>Seeded demo content. Replace with your article from the dashboard.</p>",
        "body_format": "html",
        "published": True,
        "category_slugs": ["engineering"],
    },
    {
        "slug": "visual-identity-sprint",
        "title": "Brand sprint — type, grid, and motion",
        "description": (
            "A one-week pass at hierarchy, spacing, and motion rules for a personal studio site."
        ),
        "body": "<p>Seeded demo content. Replace with your case study from the dashboard.</p>",
        "body_format": "html",
        "published": True,
        "category_slugs": ["studio"],
    },
]

CATEGORY_SEEDS = [
    ("Notes", "notes", 0),
    ("Engineering", "engineering", 1),
    ("Studio", "studio", 2),
    ("Process", "process", 3),
]


class Command(BaseCommand):
    help = "Create or update demo blog posts (idempotent by slug)."

    def handle(self, *args, **options):
        categories_by_slug = {}
        for name, slug, order in CATEGORY_SEEDS:
            cat, _ = BlogCategory.objects.update_or_create(
                slug=slug,
                defaults={"name": name, "order": order},
            )
            categories_by_slug[slug] = cat

        for row in DEMO:
            slug = row["slug"]
            cat_slugs = row.get("category_slugs") or []
            defaults = {
                k: v
                for k, v in row.items()
                if k not in ("slug", "category_slugs")
            }
            obj, created = BlogPost.objects.update_or_create(
                slug=slug, defaults=defaults
            )
            if cat_slugs:
                cats = [
                    categories_by_slug[s]
                    for s in cat_slugs
                    if s in categories_by_slug
                ]
                obj.categories.set(cats)
            self.stdout.write(
                self.style.SUCCESS(
                    f"{'Created' if created else 'Updated'}: {obj.slug} — {obj.title}"
                )
            )
