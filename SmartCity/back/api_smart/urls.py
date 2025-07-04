from django.urls import path
from .views import (
    SensorListCreateAPIView,
    SensorDetailAPIView,
    HistoricoListCreateAPIView,
    HistoricoDetailAPIView,
    AmbientesListCreateAPIView,
    AmbientesDetailAPIView,
    RegisterAPIView,
    AmbientesSearchAPIView,
    SensoresSearchAPIView,
    HistoricoSearchAPIView,
    listar_historico,
    listar_sensores,
    listar_ambientes,
    exportar_sensores_excel
)

urlpatterns = [
    path('sensores/', listar_sensores),
    path('sens', SensorListCreateAPIView.as_view()),
    path('sensores/<int:pk>', SensorDetailAPIView.as_view()),
    path('sensores/search/', SensoresSearchAPIView.as_view()),

    path('historicos/', listar_historico),
    path('hist', HistoricoListCreateAPIView.as_view()),
    path('hist/<int:pk>', HistoricoDetailAPIView.as_view()),
    path('historico/search/', HistoricoSearchAPIView.as_view()),

    path('ambientes/', listar_ambientes),
    path('ambi', AmbientesListCreateAPIView.as_view()),
    path('ambi/<int:pk>', AmbientesDetailAPIView.as_view()),
    path('ambientes/search/', AmbientesSearchAPIView.as_view()),

    path('exportar-sensores/', exportar_sensores_excel, name='exportar-sensores'),
    path('api/register/', RegisterAPIView.as_view(), name='register'),
]