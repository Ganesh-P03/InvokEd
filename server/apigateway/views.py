from django.shortcuts import render
from .models import  LoginInfo,Subject
from .serializers import  LoginInfoSerializer,SubjectSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# views for Subject
# url/subject
@api_view(['GET', 'POST'])
def subject_list(request):
    """
    GET  /subjects/  -> List all subjects
    POST /subjects/  -> Create a new subject/subjects
    """
    if request.method == 'GET':
        subjects = Subject.objects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if isinstance(request.data, list):
            serializer = SubjectSerializer(data=request.data, many=True)
        else:
            serializer = SubjectSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def subject_detail(request, SubjectID):
    """
    GET    /subjects/<id>/  -> Retrieve a specific subject
    PUT    /subjects/<id>/  -> Update a subject
    DELETE /subjects/<id>/  -> Delete a subject
    """
    try:
        subject = Subject.objects.get(SubjectID=SubjectID)
    except Subject.DoesNotExist:
        return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SubjectSerializer(subject)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = SubjectSerializer(subject, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        subject.delete()
        return Response({'message': 'Subject deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
