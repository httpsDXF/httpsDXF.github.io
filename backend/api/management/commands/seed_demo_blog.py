"""Create demo blog posts (same slugs as frontend placeholders). Run: python manage.py seed_demo_blog"""

from django.core.management.base import BaseCommand

from api.models import BlogPost

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
    },
]


class Command(BaseCommand):
    help = "Create or update demo blog posts (idempotent by slug)."

    def handle(self, *args, **options):
        for row in DEMO:
            slug = row["slug"]
            defaults = {k: v for k, v in row.items() if k != "slug"}
            obj, created = BlogPost.objects.update_or_create(
                slug=slug, defaults=defaults
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f"{'Created' if created else 'Updated'}: {obj.slug} — {obj.title}"
                )
            )
