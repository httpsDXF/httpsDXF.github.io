from django.contrib import admin

from .models import (
    BlogCategory,
    BlogPost,
    BlogPostMedia,
    Experiment,
    HireInquiry,
    PortfolioCategory,
    PortfolioProject,
)


class BlogPostMediaInline(admin.TabularInline):
    model = BlogPostMedia
    extra = 0


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "order")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "slug")
    ordering = ("order", "name")


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "body_format", "published", "created_at")
    list_filter = ("published", "categories")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "body")
    filter_horizontal = ("categories",)
    inlines = [BlogPostMediaInline]


@admin.register(PortfolioCategory)
class PortfolioCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "order")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "slug")
    ordering = ("order", "name")


@admin.register(PortfolioProject)
class PortfolioProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "published", "order", "created_at")
    list_filter = ("published",)
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "description")
    filter_horizontal = ("categories",)


@admin.register(HireInquiry)
class HireInquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "company", "created_at")
    list_filter = ("created_at",)
    search_fields = ("name", "email", "company", "project_description")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)


@admin.register(Experiment)
class ExperimentAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "source_format", "created_at")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "description")
