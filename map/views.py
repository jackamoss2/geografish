from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from .models import Map
from django.apps import apps
import string, random

# Create your views here.
def home(request):
    return render(request, 'home.html')

def create_map(request):
    request_path = request.META.get('HTTP_HOST')
    chars = string.ascii_letters + string.digits
    code = ''.join([chars[random.randint(0, len(chars)-1)] for _ in range(16)])
    if request.user.is_authenticated:
        map = Map(title='untitled',url_code=code,author=request.user)
        map.save()
        url = f'http://{request_path}/map/' + code
        print(f'url: {url}')
    else: # todo: allow anonymous user to create temp map, nothing is saved
        url = 'http://localhost:8000/users/login/'
    return HttpResponseRedirect(url)
    

def view_map(request, url_code):
    map = get_object_or_404(Map.objects.filter(url_code=url_code))
    context = {'map':map}
    return render(request, 'map_view.html', context)

def about(request):
    return render(request, 'about.html')

def contact(request):
    return render(request, 'contact.html')

def instructions(request):
    return render(request, 'instructions.html')


