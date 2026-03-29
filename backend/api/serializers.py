from rest_framework import serializers

from .models import BlogPost, BlogPostMedia, Experiment, detect_media_kind


class BlogPostMediaSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = BlogPostMedia
        fields = ["id", "url", "kind", "caption", "order"]

    def get_url(self, obj: BlogPostMedia) -> str:
        request = self.context.get("request")
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        if obj.file:
            return obj.file.url
        return ""


class BlogPostSerializer(serializers.ModelSerializer):
    media = BlogPostMediaSerializer(many=True, read_only=True, source="media_items")
    cover_image_url = serializers.SerializerMethodField()
    cover_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = BlogPost
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "body",
            "body_format",
            "published",
            "cover_image",
            "cover_image_url",
            "media",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "cover_image_url", "media"]

    def get_cover_image_url(self, obj: BlogPost) -> str | None:
        if not obj.cover_image:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.cover_image.url)
        return obj.cover_image.url

    def create(self, validated_data):
        request = self.context.get("request")
        post = BlogPost.objects.create(**validated_data)
        self._attach_media_files(post, request)
        return post

    def update(self, instance, validated_data):
        request = self.context.get("request")
        post = super().update(instance, validated_data)
        if request and request.FILES.getlist("media"):
            instance.media_items.all().delete()
            self._attach_media_files(post, request)
        return post

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop("cover_image", None)
        return ret

    def _attach_media_files(self, post: BlogPost, request):
        if not request:
            return
        for i, f in enumerate(request.FILES.getlist("media")):
            kind = detect_media_kind(f.name)
            BlogPostMedia.objects.create(
                post=post,
                file=f,
                kind=kind,
                order=i,
            )


class ExperimentSerializer(serializers.ModelSerializer):
    model_url = serializers.SerializerMethodField()
    preview_image_url = serializers.SerializerMethodField()
    preview_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Experiment
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "preview_image",
            "preview_image_url",
            "model_file",
            "model_url",
            "source_format",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "model_url",
            "preview_image_url",
        ]

    def get_preview_image_url(self, obj: Experiment) -> str | None:
        if not obj.preview_image:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.preview_image.url)
        return obj.preview_image.url

    def get_model_url(self, obj: Experiment) -> str:
        request = self.context.get("request")
        if obj.model_file and request:
            return request.build_absolute_uri(obj.model_file.url)
        if obj.model_file:
            return obj.model_file.url
        return ""

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop("preview_image", None)
        ret.pop("model_file", None)
        return ret
