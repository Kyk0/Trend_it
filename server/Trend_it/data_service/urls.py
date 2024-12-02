from django.urls import path
from .views import RandomNeighborView

urlpatterns = [
    path("fetch-data/", RandomNeighborView.as_view(), name="fetch_data"),
]