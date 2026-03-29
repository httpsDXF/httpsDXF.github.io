from django.contrib import admin

from .models import BlogPost, BlogPostMedia, Experiment


class BlogPostMediaInline(admin.TabularInline):
    model = BlogPostMedia
    extra = 0


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "body_format", "published", "created_at")
    list_filter = ("published",)
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "body")
    inlines = [BlogPostMediaInline]


@admin.register(Experiment)
class ExperimentAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "source_format", "created_at")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "description")
