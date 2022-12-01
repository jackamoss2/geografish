from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from map.models import Map, GeospatialData
from apis.serializers import MapSerializer, GeospatialDataSerializer

# class ListMap(generics.ListCreateAPIView):
#     queryset = models.Map.objects.all()
#     serializer_class = MapSerializer

# class DetailMap(generics.RetrieveUpdateDestroyAPIView):
#     queryset = models.Map.objects.all()
#     serializer_class = MapSerializer

@api_view(['GET', 'POST'])
def map_list(request):
    if request.method == 'GET':
        maps = Map.objects.all()
        serializer = MapSerializer(maps, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = MapSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)        

@api_view(['GET', 'PUT', 'DELETE'])
def map_detail(request, pk):
    try:
        map = Map.objects.get(pk=pk)
    except Map.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = MapSerializer(map)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = MapSerializer(map, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        map.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def data_list(request):
    if request.method == 'GET':
        map_id = request.GET.get("map_id")
        if map_id:
            geospatial_data = GeospatialData.objects.filter(maps__id=map_id)
            serializer = GeospatialDataSerializer(geospatial_data, many=True)
            return Response(serializer.data)

    elif request.method == 'POST':
        # print(request.data)
        serializer = GeospatialDataSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            # print(serializer.id)
            # map = get_object_or_404(Map.objects.filter(id=request.data['mapID']))
            # serializer.maps.add(map)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)        
    
    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def data_detail(request, pk):
    try:
        geospatial_data = GeospatialData.objects.get(pk=pk)
    except Map.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = GeospatialDataSerializer(geospatial_data)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = GeospatialDataSerializer(geospatial_data, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        geospatial_data.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)