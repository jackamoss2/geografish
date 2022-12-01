from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from .models import Map
import string, random

# Create your views here.
def home(request):
    return render(request, 'home.html')

def create_map(request):
    chars = string.ascii_letters + string.digits
    code = ''.join([chars[random.randint(0, len(chars)-1)] for _ in range(16)])
    map = Map(title='untitled',url_code=code,author=request.user)
    map.save()
    url = 'http://localhost:8000/map/' + code
    return HttpResponseRedirect(url)

def view_map(request, url_code):
    map = get_object_or_404(Map.objects.filter(url_code=url_code))
    context = {'map':map}
    return render(request, 'map_view.html', context)

