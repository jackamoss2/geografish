# Generated by Django 4.1.3 on 2022-12-07 22:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0008_alter_geospatialdata_title'),
    ]

    operations = [
        migrations.CreateModel(
            name='DataDisplaySettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('renderer', models.JSONField(blank=True, null=True)),
                ('linked_data', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='dataDisplaySetting', to='map.geospatialdata')),
                ('linked_map', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='dataDisplaySetting', to='map.map')),
            ],
        ),
    ]