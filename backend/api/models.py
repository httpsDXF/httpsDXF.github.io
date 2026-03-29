from django.conf import settings
from django.db import models


class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    description = models.TextField(blank=True)
    body = models.TextField(help_text="Markdown or HTML from the editor")
    body_format = models.CharField(
        max_length=16,
        default="markdown",
        help_text="'markdown' for legacy posts, 'html' for TipTap editor output.",
    )
    cover_image = models.ImageField(
        upload_to="blog/covers/",
        blank=True,
        null=True,
    )
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title


class BlogPostMedia(models.Model):
    class MediaKind(models.TextChoices):
        IMAGE = "image", "Image"
        VIDEO = "video", "Video"

    post = models.ForeignKey(
        BlogPost,
        on_delete=models.CASCADE,
        related_name="media_items",
    )
    file = models.FileField(upload_to="blog/media/")
    kind = models.CharField(max_length=10, choices=MediaKind.choices)
    caption = models.CharField(max_length=300, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self) -> str:
        return f"{self.post_id}:{self.kind}"


def detect_media_kind(filename: str) -> str:
    n = filename.lower()
    if n.endswith((".mp4", ".webm", ".mov", ".m4v", ".ogv")):
        return BlogPostMedia.MediaKind.VIDEO
    return BlogPostMedia.MediaKind.IMAGE


class Experiment(models.Model):
    class SourceFormat(models.TextChoices):
        GLB = "glb", "glTF / GLB"
        GLTF = "gltf", "glTF (JSON)"
        STL = "stl", "STL"
        OBJ = "obj", "OBJ"
        OTHER = "other", "Other / unknown"

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    description = models.TextField(blank=True)
    preview_image = models.ImageField(
        upload_to="experiments/previews/",
        blank=True,
        null=True,
        help_text="Thumbnail for experiment cards (screenshot or render).",
    )
    model_file = models.FileField(upload_to="experiments/models/")
    source_format = models.CharField(
        max_length=16,
        choices=SourceFormat.choices,
        default=SourceFormat.GLB,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="experiments",
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title
