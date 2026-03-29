import json

from rest_framework import serializers

from .models import (
    BlogCategory,
    BlogPost,
    BlogPostMedia,
    Experiment,
    HireInquiry,
    PortfolioCategory,
    PortfolioProject,
    detect_media_kind,
)


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


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ["id", "name", "slug", "order"]


class BlogPostSerializer(serializers.ModelSerializer):
    media = BlogPostMediaSerializer(many=True, read_only=True, source="media_items")
    cover_image_url = serializers.SerializerMethodField()
    cover_image = serializers.ImageField(required=False, allow_null=True)
    categories = serializers.SerializerMethodField()
    category_slugs = serializers.CharField(required=False, allow_blank=True, write_only=True)

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
            "categories",
            "category_slugs",
            "media",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "cover_image_url",
            "media",
            "categories",
        ]

    @staticmethod
    def _parse_category_slugs(raw):
        if raw is None:
            return None
        if isinstance(raw, list):
            return [str(s).strip() for s in raw if str(s).strip()]
        if isinstance(raw, str):
            raw = raw.strip()
            if not raw:
                return []
            if raw.startswith("["):
                try:
                    data = json.loads(raw)
                    return [str(s).strip() for s in data if str(s).strip()]
                except json.JSONDecodeError:
                    return []
            return [s.strip() for s in raw.split(",") if s.strip()]
        return []

    def get_categories(self, obj: BlogPost) -> list[dict[str, str]]:
        return [
            {"slug": c.slug, "name": c.name}
            for c in obj.categories.all().order_by("order", "name")
        ]

    def get_cover_image_url(self, obj: BlogPost) -> str | None:
        if not obj.cover_image:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.cover_image.url)
        return obj.cover_image.url

    def create(self, validated_data):
        request = self.context.get("request")
        raw_slugs = validated_data.pop("category_slugs", None)
        post = BlogPost.objects.create(**validated_data)
        self._attach_media_files(post, request)
        slugs = self._parse_category_slugs(raw_slugs)
        if slugs is not None:
            post.categories.set(BlogCategory.objects.filter(slug__in=slugs))
        return post

    def update(self, instance, validated_data):
        request = self.context.get("request")
        raw_slugs = validated_data.pop("category_slugs", None)
        post = super().update(instance, validated_data)
        if request and request.FILES.getlist("media"):
            instance.media_items.all().delete()
            self._attach_media_files(post, request)
        if raw_slugs is not None:
            slugs = self._parse_category_slugs(raw_slugs)
            if slugs is not None:
                post.categories.set(BlogCategory.objects.filter(slug__in=slugs))
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


class PortfolioCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioCategory
        fields = ["id", "name", "slug", "order"]


class PortfolioProjectSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    cover_image = serializers.ImageField(required=False, allow_null=True)
    categories = serializers.SerializerMethodField(read_only=True)
    category_slugs = serializers.CharField(required=False, allow_blank=True, write_only=True)
    case_study = serializers.JSONField(required=False, default=list)

    class Meta:
        model = PortfolioProject
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "meta",
            "published",
            "order",
            "cover_image",
            "cover_image_url",
            "categories",
            "category_slugs",
            "case_study",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "cover_image_url",
            "categories",
        ]

    @staticmethod
    def _parse_category_slugs(raw):
        if raw is None:
            return None
        if isinstance(raw, list):
            return [str(s).strip() for s in raw if str(s).strip()]
        if isinstance(raw, str):
            raw = raw.strip()
            if not raw:
                return []
            if raw.startswith("["):
                try:
                    data = json.loads(raw)
                    return [str(s).strip() for s in data if str(s).strip()]
                except json.JSONDecodeError:
                    return []
            return [s.strip() for s in raw.split(",") if s.strip()]
        return []

    def get_categories(self, obj: PortfolioProject) -> list[dict[str, str]]:
        return [
            {"slug": c.slug, "name": c.name}
            for c in obj.categories.all().order_by("order", "name")
        ]

    def get_cover_image_url(self, obj: PortfolioProject) -> str | None:
        if not obj.cover_image:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.cover_image.url)
        return obj.cover_image.url

    def validate_case_study(self, value):
        if isinstance(value, str):
            if not (value or "").strip():
                return []
            try:
                return json.loads(value)
            except json.JSONDecodeError as e:
                raise serializers.ValidationError("Invalid JSON in case_study.") from e
        return value if value is not None else []

    def create(self, validated_data):
        raw_slugs = validated_data.pop("category_slugs", None)
        proj = PortfolioProject.objects.create(**validated_data)
        slugs = self._parse_category_slugs(raw_slugs)
        if slugs is not None:
            proj.categories.set(
                PortfolioCategory.objects.filter(slug__in=slugs),
            )
        return proj

    def update(self, instance, validated_data):
        raw_slugs = validated_data.pop("category_slugs", None)
        proj = super().update(instance, validated_data)
        if raw_slugs is not None:
            slugs = self._parse_category_slugs(raw_slugs)
            if slugs is not None:
                proj.categories.set(
                    PortfolioCategory.objects.filter(slug__in=slugs),
                )
        return proj

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop("cover_image", None)
        return ret


class HireInquiryCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    email = serializers.EmailField()
    phone = serializers.CharField(
        max_length=40, allow_blank=True, required=False, default=""
    )
    company = serializers.CharField(
        max_length=120, allow_blank=True, required=False, default=""
    )
    project_description = serializers.CharField(min_length=20, max_length=8000)
    website = serializers.CharField(required=False, allow_blank=True, default="")

    def validate_website(self, value):
        if value and str(value).strip():
            raise serializers.ValidationError("Invalid submission.")
        return value

    def create(self, validated_data):
        validated_data.pop("website", None)
        return HireInquiry.objects.create(**validated_data)
