# Generated by Django 4.1.3 on 2022-12-06 19:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0005_alter_map_author_alter_map_url_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='geospatialdata',
            name='data_hash',
            field=models.CharField(default=0, max_length=64),
            preserve_default=False,
        ),
    ]
