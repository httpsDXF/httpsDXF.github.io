from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

router = DefaultRouter()
router.register(r"blog/categories", views.BlogCategoryViewSet, basename="blogcategory")
router.register(r"blog/posts", views.BlogPostViewSet, basename="blogpost")
router.register(r"portfolio/categories", views.PortfolioCategoryViewSet, basename="portfoliocategory")
router.register(r"portfolio/projects", views.PortfolioProjectViewSet, basename="portfolioproject")
router.register(r"experiments", views.ExperimentViewSet, basename="experiment")

urlpatterns = [
    path("health/", views.health, name="health"),
    path("contact/hire/", views.hire_inquiry_create, name="hire_inquiry_create"),
    path("blog/images/", views.blog_image_upload, name="blog_image_upload"),
    path("blog/media/", views.blog_media_upload, name="blog_media_upload"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include(router.urls)),
]
