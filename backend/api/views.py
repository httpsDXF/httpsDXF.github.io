import uuid

from django.conf import settings
from django.core.files.storage import default_storage
from django.core.mail import send_mail
from django.http import JsonResponse
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import BlogCategory, BlogPost, Experiment, HireInquiry, PortfolioCategory, PortfolioProject
from .serializers import (
    BlogCategorySerializer,
    BlogPostSerializer,
    ExperimentSerializer,
    HireInquiryCreateSerializer,
    PortfolioCategorySerializer,
    PortfolioProjectSerializer,
)


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return JsonResponse({"status": "ok"})


def _notify_hire_inquiry(obj: HireInquiry) -> None:
    to = getattr(settings, "CONTACT_NOTIFICATION_EMAIL", "") or ""
    if not to:
        return
    body = (
        f"New hire inquiry\n\n"
        f"Name: {obj.name}\n"
        f"Email: {obj.email}\n"
        f"Phone: {obj.phone or '—'}\n"
        f"Company: {obj.company or '—'}\n\n"
        f"Project:\n{obj.project_description}\n"
    )
    send_mail(
        subject=f"[httpsDXF] Hire inquiry from {obj.name}",
        message=body,
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None) or "noreply@localhost",
        recipient_list=[to],
        fail_silently=True,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def hire_inquiry_create(request):
    """Public: submit name, email, project description, optional phone/company."""
    serializer = HireInquiryCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    obj = serializer.save()
    _notify_hire_inquiry(obj)
    return Response(
        {"detail": "Thanks — your message was received."},
        status=status.HTTP_201_CREATED,
    )


class IsStaffOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class IsStaffUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )


def _blog_media_upload_impl(request):
    """Store image or short video for inline blog body (staff only)."""
    f = request.FILES.get("file")
    if not f:
        return Response({"detail": "No file."}, status=status.HTTP_400_BAD_REQUEST)
    name_lower = f.name.lower()
    ext = ""
    if "." in name_lower:
        ext = "." + name_lower.rsplit(".", 1)[-1]
    allowed = (
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".mp4",
        ".webm",
        ".mov",
    )
    if ext not in allowed:
        return Response(
            {"detail": "Use an image (JPG, PNG, GIF, WebP) or video (MP4, WebM, MOV)."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    safe_name = f"blog/inline/{uuid.uuid4().hex}{ext}"
    path = default_storage.save(safe_name, f)
    url = request.build_absolute_uri(default_storage.url(path))
    return Response({"url": url})


@api_view(["POST"])
@permission_classes([IsStaffUser])
@parser_classes([MultiPartParser, FormParser])
def blog_image_upload(request):
    """Legacy name — same as blog_media_upload."""
    return _blog_media_upload_impl(request)


@api_view(["POST"])
@permission_classes([IsStaffUser])
@parser_classes([MultiPartParser, FormParser])
def blog_media_upload(request):
    """Upload image or video for inline story blocks (staff only)."""
    return _blog_media_upload_impl(request)


class BlogCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = BlogCategorySerializer
    queryset = BlogCategory.objects.all()
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "slug"


class BlogPostViewSet(viewsets.ModelViewSet):
    serializer_class = BlogPostSerializer
    lookup_field = "slug"
    permission_classes = [IsStaffOrReadOnly]

    def get_queryset(self):
        qs = (
            BlogPost.objects.all()
            .order_by("-created_at")
            .prefetch_related("media_items", "categories")
        )
        if self.request.user.is_staff:
            return qs
        return qs.filter(published=True)


class ExperimentViewSet(viewsets.ModelViewSet):
    serializer_class = ExperimentSerializer
    lookup_field = "slug"
    permission_classes = [IsStaffOrReadOnly]

    def get_queryset(self):
        return Experiment.objects.all().order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(
            author=self.request.user if self.request.user.is_authenticated else None
        )


class PortfolioCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioCategorySerializer
    queryset = PortfolioCategory.objects.all()
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "slug"


class PortfolioProjectViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioProjectSerializer
    lookup_field = "slug"
    permission_classes = [IsStaffOrReadOnly]

    def get_queryset(self):
        qs = (
            PortfolioProject.objects.all()
            .order_by("order", "-created_at")
            .prefetch_related("categories")
        )
        if self.request.user.is_staff:
            return qs
        return qs.filter(published=True)
