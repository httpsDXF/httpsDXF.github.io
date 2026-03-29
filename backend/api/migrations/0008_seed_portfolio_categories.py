from django.db import migrations


def seed_categories(apps, schema_editor):
    PC = apps.get_model("api", "PortfolioCategory")
    defaults = [
        ("Mechatronics", "mechatronics", 0),
        ("Brand", "brand", 1),
        ("Photography", "photography", 2),
    ]
    for name, slug, order in defaults:
        PC.objects.get_or_create(
            slug=slug,
            defaults={"name": name, "order": order},
        )


def unseed(apps, schema_editor):
    PC = apps.get_model("api", "PortfolioCategory")
    PC.objects.filter(slug__in=("mechatronics", "brand", "photography")).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0007_portfolio_models"),
    ]

    operations = [
        migrations.RunPython(seed_categories, unseed),
    ]
